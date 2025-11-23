import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../config/firebase";

/**
 * FirestoreService - Service for handling all Firestore operations
 * Follows Single Responsibility Principle and provides clean abstraction
 *
 * Design Principles Applied:
 * - Single Responsibility: Each function has one clear purpose
 * - Defensive Programming: Always return safe defaults, never throw on empty collections
 * - Memory Filtering: Avoid Firestore index requirements by filtering in memory
 * - Null Safety: Check for undefined/null fields before accessing
 */

// Collection names - centralized for easy maintenance
const COLLECTIONS = {
  USERS: "users",
  MENTORSHIPS: "mentorships",
  SESSIONS: "sessions",
  ACTIVITIES: "activities",
  GOALS: "goals",
  TEAMS: "teams",
  PROJECTS: "projects",
  PROJECT_HISTORY: "project_history",
  NOTIFICATIONS: "notifications",
  MATERIALS: "materials",
};

/**
 * UTILITY FUNCTIONS - Following DRY principle
 */

/**
 * Safely get all documents from a collection
 * Returns empty array if collection doesn't exist or is empty
 */
const safeGetCollection = async (collectionName) => {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    return [];
  }
};

/**
 * Sort documents by timestamp field
 */
const sortByTimestamp = (docs, field = "createdAt", descending = true) => {
  return docs.sort((a, b) => {
    const dateA = a[field]?.toMillis?.() || 0;
    const dateB = b[field]?.toMillis?.() || 0;
    return descending ? dateB - dateA : dateA - dateB;
  });
};

/**
 * USER OPERATIONS
 */

export const createUserProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const data = {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      onboardingCompleted: userData.onboardingCompleted || false,
    };

    await setDoc(userRef, data);
    return data;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw new Error("Error creating user profile");
  }
};

export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { uid, ...userSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

/**
 * Get all users from Firestore
 */
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, COLLECTIONS.USERS);
    const querySnapshot = await getDocs(usersRef);

    return querySnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting all users:", error);
    return [];
  }
};

export const updateUserProfile = async (uid, updates) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const data = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(userRef, data);
    return data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Error updating profile");
  }
};

export const completeOnboarding = async (uid, onboardingData) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const data = {
      ...onboardingData,
      onboardingCompleted: true,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(userRef, data);
    return data;
  } catch (error) {
    console.error("Error completing onboarding:", error);
    throw new Error("Error completing onboarding");
  }
};

/**
 * MENTOR/MENTEE QUERIES
 */

export const getMentors = async (filters = {}) => {
  try {
    // Get all users and filter in memory to avoid index issues
    const users = await safeGetCollection(COLLECTIONS.USERS);

    let mentors = users.filter((user) => user.userType === "mentor");

    // Apply technology filters if provided
    if (filters.technologies && filters.technologies.length > 0) {
      mentors = mentors.filter((mentor) => {
        const mentorTechs = mentor.technologies || [];
        return filters.technologies.some((tech) =>
          mentorTechs.some((mt) => (mt.name || mt) === tech)
        );
      });
    }

    // Rename id to uid for consistency
    return mentors.map(({ id, ...rest }) => ({ uid: id, ...rest }));
  } catch (error) {
    console.error("Error getting mentors:", error);
    return [];
  }
};

export const getMentees = async () => {
  try {
    // Get all users and filter in memory
    const users = await safeGetCollection(COLLECTIONS.USERS);
    const mentees = users.filter((user) => user.userType === "mentee");

    // Rename id to uid for consistency
    return mentees.map(({ id, ...rest }) => ({ uid: id, ...rest }));
  } catch (error) {
    console.error("Error getting mentees:", error);
    return [];
  }
};

/**
 * Get mentors with advanced filters and pagination support
 * Returns mentors that match the specified filters
 *
 * @param {Object} options - Filter and pagination options
 * @param {Array} options.technologies - Array of technology names to filter by
 * @param {Array} options.excludeIds - Array of mentor IDs to exclude from results
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.pageSize - Number of items per page
 * @param {string} options.searchQuery - Search query for name/bio
 * @param {string} options.sortBy - Sort field (rating, experience, name)
 * @param {string} options.sortOrder - Sort order (asc, desc)
 * @returns {Object} { mentors: Array, totalCount: number, totalPages: number, currentPage: number }
 */
export const getMentorsWithPagination = async (options = {}) => {
  try {
    const {
      technologies = [],
      excludeIds = [],
      page = 1,
      pageSize = 10,
      searchQuery = "",
      sortBy = "displayName",
      sortOrder = "asc",
    } = options;

    // Get all users and filter in memory
    const users = await safeGetCollection(COLLECTIONS.USERS);
    let mentors = users.filter((user) => user.userType === "mentor");

    // Exclude specific IDs (e.g., already recommended mentors)
    if (excludeIds.length > 0) {
      mentors = mentors.filter((mentor) => !excludeIds.includes(mentor.id));
    }

    // Apply technology filters
    if (technologies.length > 0) {
      mentors = mentors.filter((mentor) => {
        const mentorTechs = mentor.technologies || [];
        return technologies.some((tech) =>
          mentorTechs.some((mt) => {
            const techName = typeof mt === "string" ? mt : mt.name;
            return techName?.toLowerCase() === tech.toLowerCase();
          })
        );
      });
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      mentors = mentors.filter(
        (mentor) =>
          mentor.displayName?.toLowerCase().includes(lowerQuery) ||
          mentor.bio?.toLowerCase().includes(lowerQuery) ||
          mentor.role?.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort mentors
    mentors.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "rating":
          aVal = a.rating || 0;
          bVal = b.rating || 0;
          break;
        case "experience":
          aVal = a.yearsExperience || 0;
          bVal = b.yearsExperience || 0;
          break;
        case "displayName":
        default:
          aVal = (a.displayName || "").toLowerCase();
          bVal = (b.displayName || "").toLowerCase();
          break;
      }

      if (sortOrder === "desc") {
        return aVal < bVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });

    // Calculate pagination
    const totalCount = mentors.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Get page of results
    const paginatedMentors = mentors.slice(startIndex, endIndex);

    // Rename id to uid for consistency
    const formattedMentors = paginatedMentors.map(({ id, ...rest }) => ({
      uid: id,
      ...rest,
    }));

    return {
      mentors: formattedMentors,
      totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  } catch (error) {
    console.error("Error getting mentors with pagination:", error);
    return {
      mentors: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }
};

/**
 * MENTORSHIP OPERATIONS
 */

export const createMentorship = async (mentorshipData) => {
  try {
    const data = sanitizeForFirestore({
      ...mentorshipData,
      status: "active",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const docRef = await addDoc(collection(db, COLLECTIONS.MENTORSHIPS), data);

    // If mentorship is associated with a project, add mentor to project
    if (data.projectId && data.mentorId) {
      try {
        await addProjectMentor(data.projectId, data.mentorId);
      } catch (err) {
        console.warn("Could not add mentor to project:", err);
      }
    }

    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating mentorship:", error);
    throw new Error("Error creating mentorship");
  }
};

/**
 * Get user's mentorships
 * For mentors: only returns mentorships where they are the ASSIGNED mentor (not just invited)
 * For mentees: returns all their mentorships
 */
export const getUserMentorships = async (uid) => {
  try {
    // Query mentorships where user is the ASSIGNED mentor (mentorId field)
    const mentorQuery = query(
      collection(db, COLLECTIONS.MENTORSHIPS),
      where("mentorId", "==", uid)
    );
    const mentorSnapshot = await getDocs(mentorQuery);
    const mentorMentorships = mentorSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      role: "mentor",
    }));

    // Query mentorships where user is a mentee
    const menteeQuery = query(
      collection(db, COLLECTIONS.MENTORSHIPS),
      where("menteeId", "==", uid)
    );
    const menteeSnapshot = await getDocs(menteeQuery);
    const menteeMentorships = menteeSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      role: "mentee",
    }));

    // Combine and sort
    const allMentorships = [...mentorMentorships, ...menteeMentorships];
    return sortByTimestamp(allMentorships, "createdAt", true);
  } catch (error) {
    console.error("Error getting user mentorships:", error);
    return [];
  }
};

/**
 * SESSION OPERATIONS
 */

export const createSession = async (sessionData) => {
  try {
    const data = sanitizeForFirestore({
      ...sessionData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const docRef = await addDoc(collection(db, COLLECTIONS.SESSIONS), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating session:", error);
    throw new Error("Error creating session");
  }
};

export const getSessionsByMentorship = async (mentorshipId) => {
  try {
    const sessionsQuery = query(
      collection(db, COLLECTIONS.SESSIONS),
      where("mentorshipId", "==", mentorshipId)
    );
    const snapshot = await getDocs(sessionsQuery);

    const sessions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by date (most recent first)
    return sortByTimestamp(sessions, "createdAt", true);
  } catch (error) {
    console.error("Error getting sessions by mentorship:", error);
    return [];
  }
};

export const getUpcomingSessions = async (uid, limitCount = 10) => {
  try {
    // Query sessions where user is a participant
    const sessionsQuery = query(
      collection(db, COLLECTIONS.SESSIONS),
      where("participantIds", "array-contains", uid)
    );
    const snapshot = await getDocs(sessionsQuery);

    // Filter by valid statuses in memory
    const upcomingSessions = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((session) =>
        ["scheduled", "pending_acceptance", "confirmed"].includes(
          session.status
        )
      );

    // Sort by scheduled date (ascending) and limit
    const sorted = sortByTimestamp(upcomingSessions, "scheduledDate", false);
    return sorted.slice(0, limitCount);
  } catch (error) {
    console.error("Error getting upcoming sessions:", error);
    return [];
  }
};

/**
 * ACTIVITY OPERATIONS
 */

export const getRecentActivities = async (limitCount = 10) => {
  try {
    const activities = await safeGetCollection(COLLECTIONS.ACTIVITIES);
    const sorted = sortByTimestamp(activities, "createdAt", true);
    return sorted.slice(0, limitCount);
  } catch (error) {
    console.error("Error getting recent activities:", error);
    return [];
  }
};

export const createActivity = async (activityData) => {
  try {
    const data = sanitizeForFirestore({
      ...activityData,
      createdAt: Timestamp.now(),
    });

    const docRef = await addDoc(collection(db, COLLECTIONS.ACTIVITIES), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating activity:", error);
    throw new Error("Error creating activity");
  }
};

/**
 * SMART SUGGESTIONS (AI-powered matching)
 */

export const getSmartSuggestions = async (uid) => {
  try {
    const userProfile = await getUserProfile(uid);
    if (!userProfile) return [];

    // Get opposite user type
    const targetType = userProfile.userType === "mentor" ? "mentee" : "mentor";

    const allUsers = await safeGetCollection(COLLECTIONS.USERS);
    let suggestions = allUsers.filter((user) => user.userType === targetType);

    // If user has technologies, prioritize matches
    if (userProfile.technologies && userProfile.technologies.length > 0) {
      const userTechNames = userProfile.technologies.map((t) => t.name || t);

      // Score each suggestion by technology overlap
      suggestions = suggestions.map((suggestion) => {
        const suggestionTechs = suggestion.technologies || [];
        const suggestionTechNames = suggestionTechs.map((t) => t.name || t);
        const overlap = userTechNames.filter((tech) =>
          suggestionTechNames.includes(tech)
        ).length;
        return { ...suggestion, _matchScore: overlap };
      });

      // Sort by match score
      suggestions.sort((a, b) => (b._matchScore || 0) - (a._matchScore || 0));
    }

    // Rename id to uid and remove internal fields
    return suggestions.slice(0, 5).map(({ id, ...rest }) => {
      // Remove _matchScore from the object
      const { _matchScore, ...cleanRest } = rest;
      return { uid: id, ...cleanRest };
    });
  } catch (error) {
    console.error("Error getting smart suggestions:", error);
    return [];
  }
};

/**
 * MENTORSHIP EXTENDED OPERATIONS
 */

export const createMentorshipWithDetails = async (mentorshipData) => {
  try {
    const data = sanitizeForFirestore({
      ...mentorshipData,
      status: mentorshipData.status || "pending_mentor",
      progress: 0,
      sessionsCompleted: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const docRef = await addDoc(collection(db, COLLECTIONS.MENTORSHIPS), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating mentorship with details:", error);
    throw new Error("Error creating mentorship");
  }
};

export const updateMentorshipStatus = async (
  mentorshipId,
  status,
  additionalData = {}
) => {
  try {
    const mentorshipRef = doc(db, COLLECTIONS.MENTORSHIPS, mentorshipId);
    const data = {
      status,
      ...additionalData,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(mentorshipRef, data);
    return data;
  } catch (error) {
    console.error("Error updating mentorship status:", error);
    throw new Error("Error updating mentorship");
  }
};

export const getMentorshipById = async (mentorshipId) => {
  try {
    const mentorshipRef = doc(db, COLLECTIONS.MENTORSHIPS, mentorshipId);
    const mentorshipSnap = await getDoc(mentorshipRef);

    if (mentorshipSnap.exists()) {
      return { id: mentorshipSnap.id, ...mentorshipSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting mentorship by id:", error);
    return null;
  }
};

export const getPMMentorships = async (pmId) => {
  try {
    // Query mentorships where user is a project manager
    const pmQuery = query(
      collection(db, COLLECTIONS.MENTORSHIPS),
      where("projectManagerId", "==", pmId)
    );
    const snapshot = await getDocs(pmQuery);

    const pmMentorships = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return sortByTimestamp(pmMentorships, "createdAt", true);
  } catch (error) {
    console.error("Error getting PM mentorships:", error);
    return [];
  }
};

/**
 * MEETING/SESSION MANAGEMENT
 */

export const createKickoffMeeting = async (meetingData) => {
  try {
    const data = sanitizeForFirestore({
      ...meetingData,
      type: "kickoff",
      status: "pending_acceptance",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const docRef = await addDoc(collection(db, COLLECTIONS.SESSIONS), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating kickoff meeting:", error);
    throw new Error("Error creating kickoff meeting");
  }
};

export const updateMeetingStatus = async (
  meetingId,
  status,
  additionalData = {}
) => {
  try {
    const meetingRef = doc(db, COLLECTIONS.SESSIONS, meetingId);
    const data = {
      status,
      ...additionalData,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(meetingRef, data);
    return data;
  } catch (error) {
    console.error("Error updating meeting status:", error);
    throw new Error("Error updating meeting");
  }
};

export const getMeetingsByUser = async (userId) => {
  try {
    // Query sessions where user is a participant
    const sessionsQuery = query(
      collection(db, COLLECTIONS.SESSIONS),
      where("participantIds", "array-contains", userId)
    );
    const snapshot = await getDocs(sessionsQuery);

    const userMeetings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return sortByTimestamp(userMeetings, "scheduledDate", false);
  } catch (error) {
    console.error("Error getting meetings by user:", error);
    return [];
  }
};

/**
 * INVITATION MANAGEMENT
 */

/**
 * Helper: Remove undefined values from object (Firestore doesn't accept undefined)
 * Converts undefined to null or removes the field
 */
const sanitizeForFirestore = (obj) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

export const createMentorshipInvitation = async (invitationData) => {
  try {
    const data = sanitizeForFirestore({
      ...invitationData,
      status: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const docRef = await addDoc(collection(db, "mentorship_invitations"), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating mentorship invitation:", error);
    throw new Error("Error creating invitation");
  }
};

export const getInvitationsForMentor = async (mentorId) => {
  try {
    // Query invitations for this mentor with pending status
    const invitationsQuery = query(
      collection(db, "mentorship_invitations"),
      where("mentorId", "==", mentorId),
      where("status", "==", "pending")
    );
    const snapshot = await getDocs(invitationsQuery);

    const mentorInvitations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return sortByTimestamp(mentorInvitations, "createdAt", true);
  } catch (error) {
    console.error("Error getting invitations for mentor:", error);
    return [];
  }
};

/**
 * Update invitation status and assign mentor to mentorship if accepted
 * This is the key function that transitions a mentorship from pending to active
 * When a mentor accepts, all other pending invitations are automatically declined
 */
export const updateInvitationStatus = async (
  invitationId,
  status,
  mentorData = null
) => {
  try {
    const invitationRef = doc(db, "mentorship_invitations", invitationId);

    // First get the invitation to know which mentorship it belongs to
    const invitationSnap = await getDoc(invitationRef);
    if (!invitationSnap.exists()) {
      throw new Error("Invitation not found");
    }

    const invitation = invitationSnap.data();

    // Update invitation status
    const invitationData = {
      status,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(invitationRef, invitationData);

    // If accepted, assign mentor to the mentorship and decline other invitations
    if (status === "accepted" && invitation.mentorshipId) {
      const mentorshipRef = doc(
        db,
        COLLECTIONS.MENTORSHIPS,
        invitation.mentorshipId
      );
      const mentorshipData = {
        mentorId: invitation.mentorId,
        mentorName: invitation.mentorName || mentorData?.displayName,
        mentorAvatar: invitation.mentorAvatar || mentorData?.photoURL,
        status: "active", // Change from 'pending' to 'active'
        acceptedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await updateDoc(mentorshipRef, mentorshipData);

      console.log("✅ Mentor assigned to mentorship:", invitation.mentorshipId);

      // Decline all other pending invitations for this mentorship
      const otherInvitationsQuery = query(
        collection(db, "mentorship_invitations"),
        where("mentorshipId", "==", invitation.mentorshipId),
        where("status", "==", "pending")
      );
      const otherInvitationsSnapshot = await getDocs(otherInvitationsQuery);

      const declinePromises = otherInvitationsSnapshot.docs
        .filter((doc) => doc.id !== invitationId) // Don't decline the one being accepted
        .map((doc) =>
          updateDoc(doc.ref, {
            status: "auto_declined",
            updatedAt: Timestamp.now(),
            declinedReason: "Another mentor was selected",
          })
        );

      await Promise.all(declinePromises);

      console.log(
        `✅ Auto-declined ${declinePromises.length} other pending invitations`
      );
    }

    return invitationData;
  } catch (error) {
    console.error("Error updating invitation status:", error);
    throw new Error("Error updating invitation");
  }
};

export const getInvitationsForMentorship = async (mentorshipId) => {
  try {
    // Query invitations for this mentorship
    const invitationsQuery = query(
      collection(db, "mentorship_invitations"),
      where("mentorshipId", "==", mentorshipId)
    );
    const snapshot = await getDocs(invitationsQuery);

    const mentorshipInvitations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return sortByTimestamp(mentorshipInvitations, "createdAt", true);
  } catch (error) {
    // Silently handle permission errors - return empty array
    console.warn(
      "⚠️ Could not fetch invitations (may be permissions issue):",
      error.code
    );
    return [];
  }
};

/**
 * JOIN REQUESTS
 */

export const createJoinRequest = async (requestData) => {
  try {
    const data = sanitizeForFirestore({
      ...requestData,
      status: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const docRef = await addDoc(
      collection(db, "mentorship_join_requests"),
      data
    );
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating join request:", error);
    throw new Error("Error creating join request");
  }
};

export const getJoinRequestsForMentorship = async (mentorshipId) => {
  try {
    // Query join requests for this mentorship with pending status
    const requestsQuery = query(
      collection(db, "mentorship_join_requests"),
      where("mentorshipId", "==", mentorshipId),
      where("status", "==", "pending")
    );
    const snapshot = await getDocs(requestsQuery);

    const mentorshipRequests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return sortByTimestamp(mentorshipRequests, "createdAt", true);
  } catch (error) {
    console.error("Error getting join requests for mentorship:", error);
    return [];
  }
};

export const updateJoinRequestStatus = async (
  requestId,
  status,
  mentorData = null
) => {
  try {
    const requestRef = doc(db, "mentorship_join_requests", requestId);

    // First get the join request to know which mentorship it belongs to
    const requestSnap = await getDoc(requestRef);
    if (!requestSnap.exists()) {
      throw new Error("Join request not found");
    }

    const joinRequest = requestSnap.data();

    // Update join request status
    const requestData = {
      status,
      updatedAt: Timestamp.now(),
    };
    await updateDoc(requestRef, requestData);

    // If accepted, assign mentor to the mentorship and decline other requests
    if (
      status === "accepted" &&
      joinRequest.mentorshipId &&
      joinRequest.mentorId
    ) {
      const mentorshipRef = doc(
        db,
        COLLECTIONS.MENTORSHIPS,
        joinRequest.mentorshipId
      );

      // Get mentor profile if not provided
      let mentorProfile = mentorData;
      if (!mentorProfile) {
        mentorProfile = await getUserProfile(joinRequest.mentorId);
      }

      const mentorshipData = {
        mentorId: joinRequest.mentorId,
        mentorName: mentorProfile?.displayName || joinRequest.mentorName,
        mentorAvatar: mentorProfile?.photoURL || joinRequest.mentorAvatar,
        status: "active", // Change from 'pending' to 'active'
        acceptedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await updateDoc(mentorshipRef, mentorshipData);

      console.log(
        "✅ Mentor assigned to mentorship via join request:",
        joinRequest.mentorshipId
      );

      // Decline all other pending join requests for this mentorship
      const otherRequestsQuery = query(
        collection(db, "mentorship_join_requests"),
        where("mentorshipId", "==", joinRequest.mentorshipId),
        where("status", "==", "pending")
      );
      const otherRequestsSnapshot = await getDocs(otherRequestsQuery);

      const declinePromises = otherRequestsSnapshot.docs
        .filter((doc) => doc.id !== requestId) // Don't decline the one being accepted
        .map((doc) =>
          updateDoc(doc.ref, {
            status: "auto_declined",
            updatedAt: Timestamp.now(),
            declinedReason: "Another mentor was selected",
          })
        );

      await Promise.all(declinePromises);

      console.log(
        `✅ Auto-declined ${declinePromises.length} other pending join requests`
      );

      // Also decline any pending invitations for this mentorship
      const invitationsQuery = query(
        collection(db, "mentorship_invitations"),
        where("mentorshipId", "==", joinRequest.mentorshipId),
        where("status", "==", "pending")
      );
      const invitationsSnapshot = await getDocs(invitationsQuery);

      const declineInvitationsPromises = invitationsSnapshot.docs.map((doc) =>
        updateDoc(doc.ref, {
          status: "auto_declined",
          updatedAt: Timestamp.now(),
          declinedReason: "Mentorship filled by join request",
        })
      );

      await Promise.all(declineInvitationsPromises);

      console.log(
        `✅ Auto-declined ${declineInvitationsPromises.length} pending invitations`
      );
    }

    return requestData;
  } catch (error) {
    console.error("Error updating join request status:", error);
    throw new Error("Error updating join request");
  }
};

/**
 * Get all available mentors
 * Returns all users with userType 'mentor'
 * Uses memory filtering to avoid index requirements
 */
export const getAllMentors = async () => {
  try {
    // Get all users and filter in memory (same pattern as getMentors)
    const users = await safeGetCollection(COLLECTIONS.USERS);

    // Filter for mentors only
    const mentors = users.filter((user) => user.userType === "mentor");

    // Map id to uid for consistency
    return mentors.map(({ id, ...rest }) => ({ uid: id, ...rest }));
  } catch (error) {
    console.error("Error getting all mentors:", error);
    return [];
  }
};

/**
 * Invite a mentor to a mentorship
 * Creates an invitation document that the mentor can accept/decline
 */
export const inviteMentorToMentorship = async (
  mentorshipId,
  mentorId,
  message = ""
) => {
  try {
    // Get mentorship data
    const mentorshipRef = doc(db, COLLECTIONS.MENTORSHIPS, mentorshipId);
    const mentorshipSnap = await getDoc(mentorshipRef);

    if (!mentorshipSnap.exists()) {
      throw new Error("Mentorship not found");
    }

    const mentorship = mentorshipSnap.data();

    // Check if already has a mentor
    if (mentorship.mentorId) {
      throw new Error("Mentorship already has a mentor assigned");
    }

    // Check if already invited
    const invitationsRef = collection(db, "mentorship_invitations");
    const existingQuery = query(
      invitationsRef,
      where("mentorshipId", "==", mentorshipId),
      where("mentorId", "==", mentorId)
    );
    const existingSnap = await getDocs(existingQuery);

    if (!existingSnap.empty) {
      // Check if there's a pending invitation
      const pending = existingSnap.docs.find(
        (doc) => doc.data().status === "pending"
      );
      if (pending) {
        throw new Error(
          "Mentor already has a pending invitation for this mentorship"
        );
      }
    }

    // Create invitation
    const invitationData = {
      mentorshipId,
      mentorId,
      menteeId: mentorship.menteeId,
      projectManagerId: mentorship.projectManagerId,
      message,
      status: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const invitationRef = await addDoc(invitationsRef, invitationData);

    return {
      id: invitationRef.id,
      ...invitationData,
    };
  } catch (error) {
    console.error("Error inviting mentor to mentorship:", error);
    throw error;
  }
};

/**
 * GOALS OPERATIONS
 */

/**
 * Create a new goal for a mentorship
 * @param {Object} goalData - Goal data (name, description, current, target, variant, unit, mentorshipId)
 * @returns {Promise<Object>} Created goal with ID
 */
export const createGoal = async (goalData) => {
  try {
    const data = sanitizeForFirestore({
      ...goalData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const docRef = await addDoc(collection(db, COLLECTIONS.GOALS), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating goal:", error);
    throw new Error("Error creating goal");
  }
};

/**
 * Get all goals for a specific mentorship
 * @param {string} mentorshipId - The mentorship ID
 * @returns {Promise<Array>} Array of goals
 */
export const getGoalsByMentorship = async (mentorshipId) => {
  try {
    const goalsQuery = query(
      collection(db, COLLECTIONS.GOALS),
      where("mentorshipId", "==", mentorshipId)
    );
    const snapshot = await getDocs(goalsQuery);

    const goals = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return sortByTimestamp(goals, "createdAt", false);
  } catch (error) {
    console.error("Error getting goals:", error);
    return [];
  }
};

/**
 * Update a goal
 * @param {string} goalId - The goal ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated data
 */
export const updateGoal = async (goalId, updates) => {
  try {
    const goalRef = doc(db, COLLECTIONS.GOALS, goalId);
    const data = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(goalRef, data);
    return data;
  } catch (error) {
    console.error("Error updating goal:", error);
    throw new Error("Error updating goal");
  }
};

/**
 * Delete a goal
 * @param {string} goalId - The goal ID
 * @returns {Promise<void>}
 */
export const deleteGoal = async (goalId) => {
  try {
    const goalRef = doc(db, COLLECTIONS.GOALS, goalId);
    await updateDoc(goalRef, {
      deleted: true,
      deletedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error deleting goal:", error);
    throw new Error("Error deleting goal");
  }
};

/**
 * TEAMS OPERATIONS
 */

/**
 * Create a new team
 * Teams can only be composed by PMs (admins)
 */
export const createTeam = async (teamData) => {
  try {
    const data = sanitizeForFirestore({
      ...teamData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const docRef = await addDoc(collection(db, COLLECTIONS.TEAMS), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating team:", error);
    throw new Error("Error creating team");
  }
};

/**
 * Get all teams
 */
export const getTeams = async () => {
  try {
    const teams = await safeGetCollection(COLLECTIONS.TEAMS);
    return sortByTimestamp(teams, "createdAt", true);
  } catch (error) {
    console.error("Error getting teams:", error);
    return [];
  }
};

/**
 * Get team by ID
 */
export const getTeamById = async (teamId) => {
  try {
    const teamRef = doc(db, COLLECTIONS.TEAMS, teamId);
    const teamSnap = await getDoc(teamRef);

    if (teamSnap.exists()) {
      return { id: teamSnap.id, ...teamSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting team by id:", error);
    return null;
  }
};

/**
 * Update team
 */
export const updateTeam = async (teamId, updates) => {
  try {
    const teamRef = doc(db, COLLECTIONS.TEAMS, teamId);
    const data = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(teamRef, data);
    return data;
  } catch (error) {
    console.error("Error updating team:", error);
    throw new Error("Error updating team");
  }
};

/**
 * Delete team (soft delete)
 */
export const deleteTeam = async (teamId) => {
  try {
    const teamRef = doc(db, COLLECTIONS.TEAMS, teamId);
    await updateDoc(teamRef, {
      deleted: true,
      deletedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error deleting team:", error);
    throw new Error("Error deleting team");
  }
};

/**
 * Get teams where user is a member
 */
export const getTeamsByMember = async (userId) => {
  try {
    const teams = await safeGetCollection(COLLECTIONS.TEAMS);
    const userTeams = teams.filter(
      (team) => team.members && team.members.includes(userId) && !team.deleted
    );
    return sortByTimestamp(userTeams, "createdAt", true);
  } catch (error) {
    console.error("Error getting teams by member:", error);
    return [];
  }
};

/**
 * Add member to team
 */
export const addTeamMember = async (teamId, userId) => {
  try {
    const team = await getTeamById(teamId);
    if (!team) throw new Error("Team not found");

    const members = team.members || [];
    if (members.includes(userId)) {
      throw new Error("User is already a member of this team");
    }

    members.push(userId);
    await updateTeam(teamId, { members });

    return { success: true };
  } catch (error) {
    console.error("Error adding team member:", error);
    throw error;
  }
};

/**
 * Remove member from team
 */
export const removeTeamMember = async (teamId, userId) => {
  try {
    const team = await getTeamById(teamId);
    if (!team) throw new Error("Team not found");

    const members = team.members || [];
    const updatedMembers = members.filter((id) => id !== userId);

    await updateTeam(teamId, { members: updatedMembers });

    return { success: true };
  } catch (error) {
    console.error("Error removing team member:", error);
    throw error;
  }
};

/**
 * PROJECTS OPERATIONS
 */

/**
 * Create a new project
 * Projects can have mentees and mentors
 * Projects can be associated with teams or individual PMs
 */
export const createProject = async (projectData) => {
  try {
    const data = sanitizeForFirestore({
      ...projectData,
      mentees: projectData.mentees || [],
      mentors: projectData.mentors || [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("Error creating project");
  }
};

/**
 * Get all projects
 */
export const getProjects = async () => {
  try {
    const projects = await safeGetCollection(COLLECTIONS.PROJECTS);
    return sortByTimestamp(
      projects.filter((p) => !p.deleted),
      "createdAt",
      true
    );
  } catch (error) {
    console.error("Error getting projects:", error);
    return [];
  }
};

/**
 * Get project by ID
 */
export const getProjectById = async (projectId) => {
  try {
    const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
    const projectSnap = await getDoc(projectRef);

    if (projectSnap.exists()) {
      return { id: projectSnap.id, ...projectSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting project by id:", error);
    return null;
  }
};

/**
 * Update project
 */
export const updateProject = async (projectId, updates) => {
  try {
    const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
    const data = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(projectRef, data);
    return data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw new Error("Error updating project");
  }
};

/**
 * Delete project (soft delete)
 */
export const deleteProject = async (projectId) => {
  try {
    const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
    await updateDoc(projectRef, {
      deleted: true,
      deletedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error("Error deleting project");
  }
};

/**
 * Get projects by team
 */
export const getProjectsByTeam = async (teamId) => {
  try {
    const projectsQuery = query(
      collection(db, COLLECTIONS.PROJECTS),
      where("teamId", "==", teamId)
    );
    const snapshot = await getDocs(projectsQuery);

    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return sortByTimestamp(
      projects.filter((p) => !p.deleted),
      "createdAt",
      true
    );
  } catch (error) {
    console.error("Error getting projects by team:", error);
    return [];
  }
};

/**
 * Get projects by PM
 */
export const getProjectsByPM = async (pmId) => {
  try {
    const projects = await safeGetCollection(COLLECTIONS.PROJECTS);
    const pmProjects = projects.filter(
      (project) =>
        project.pmIds && project.pmIds.includes(pmId) && !project.deleted
    );
    return sortByTimestamp(pmProjects, "createdAt", true);
  } catch (error) {
    console.error("Error getting projects by PM:", error);
    return [];
  }
};

/**
 * Add mentee to project
 */
export const addProjectMentee = async (projectId, menteeId) => {
  try {
    const project = await getProjectById(projectId);
    if (!project) throw new Error("Project not found");

    const mentees = project.mentees || [];
    if (mentees.includes(menteeId)) {
      throw new Error("Mentee is already in this project");
    }

    mentees.push(menteeId);
    await updateProject(projectId, { mentees });

    return { success: true };
  } catch (error) {
    console.error("Error adding mentee to project:", error);
    throw error;
  }
};

/**
 * Remove mentee from project
 */
export const removeProjectMentee = async (projectId, menteeId) => {
  try {
    const project = await getProjectById(projectId);
    if (!project) throw new Error("Project not found");

    const mentees = project.mentees || [];
    const updatedMentees = mentees.filter((id) => id !== menteeId);

    await updateProject(projectId, { mentees: updatedMentees });

    return { success: true };
  } catch (error) {
    console.error("Error removing mentee from project:", error);
    throw error;
  }
};

/**
 * Add mentor to project (temporary)
 * Also creates history entry and notification
 */
export const addProjectMentor = async (projectId, mentorId) => {
  try {
    const project = await getProjectById(projectId);
    if (!project) throw new Error("Project not found");

    const mentors = project.mentors || [];
    if (mentors.includes(mentorId)) {
      throw new Error("Mentor is already in this project");
    }

    mentors.push(mentorId);
    await updateProject(projectId, { mentors });

    // Get mentor details for history and notification
    const mentorProfile = await getUserProfile(mentorId);

    // Create history entry
    await addDoc(collection(db, COLLECTIONS.PROJECT_HISTORY), {
      projectId,
      action: "mentor_added",
      mentorId,
      mentorName: mentorProfile?.displayName || "Unknown",
      mentorEmail: mentorProfile?.email || "",
      timestamp: Timestamp.now(),
      projectName: project.name,
    });

    // Create notification for mentor
    await createNotification({
      userId: mentorId,
      type: "mentor_assigned",
      title: "Added to Project",
      message: `You have been added as a mentor to the project "${project.name}"`,
      projectId,
      projectName: project.name,
      read: false,
    });

    // Create notifications for project PMs
    if (project.pmIds && project.pmIds.length > 0) {
      for (const pmId of project.pmIds) {
        await createNotification({
          userId: pmId,
          type: "mentor_assigned",
          title: "Mentor Added to Project",
          message: `${mentorProfile?.displayName || "A mentor"} was added to "${
            project.name
          }"`,
          projectId,
          projectName: project.name,
          mentorId,
          mentorName: mentorProfile?.displayName,
          read: false,
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding mentor to project:", error);
    throw error;
  }
};

/**
 * Remove mentor from project
 * Also creates history entry and notification
 */
export const removeProjectMentor = async (projectId, mentorId) => {
  try {
    const project = await getProjectById(projectId);
    if (!project) throw new Error("Project not found");

    const mentors = project.mentors || [];
    const updatedMentors = mentors.filter((id) => id !== mentorId);

    await updateProject(projectId, { mentors: updatedMentors });

    // Get mentor details for history and notification
    const mentorProfile = await getUserProfile(mentorId);

    // Create history entry
    await addDoc(collection(db, COLLECTIONS.PROJECT_HISTORY), {
      projectId,
      action: "mentor_removed",
      mentorId,
      mentorName: mentorProfile?.displayName || "Unknown",
      mentorEmail: mentorProfile?.email || "",
      timestamp: Timestamp.now(),
      projectName: project.name,
    });

    // Create notification for mentor
    await createNotification({
      userId: mentorId,
      type: "mentor_removed",
      title: "Removed from Project",
      message: `You have been removed from the project "${project.name}"`,
      projectId,
      projectName: project.name,
      read: false,
    });

    // Create notifications for project PMs
    if (project.pmIds && project.pmIds.length > 0) {
      for (const pmId of project.pmIds) {
        await createNotification({
          userId: pmId,
          type: "mentor_removed",
          title: "Mentor Removed from Project",
          message: `${
            mentorProfile?.displayName || "A mentor"
          } was removed from "${project.name}"`,
          projectId,
          projectName: project.name,
          mentorId,
          mentorName: mentorProfile?.displayName,
          read: false,
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error removing mentor from project:", error);
    throw error;
  }
};

/**
 * Add project to team
 */
export const addProjectToTeam = async (projectId, teamId) => {
  try {
    await updateProject(projectId, { teamId });
    return { success: true };
  } catch (error) {
    console.error("Error adding project to team:", error);
    throw error;
  }
};

/**
 * Remove project from team
 */
export const removeProjectFromTeam = async (projectId) => {
  try {
    await updateProject(projectId, { teamId: null });
    return { success: true };
  } catch (error) {
    console.error("Error removing project from team:", error);
    throw error;
  }
};

/**
 * NOTIFICATIONS OPERATIONS
 */

/**
 * Create a notification
 */
export const createNotification = async (notificationData) => {
  try {
    const data = sanitizeForFirestore({
      ...notificationData,
      createdAt: Timestamp.now(),
      read: notificationData.read || false,
    });

    const docRef = await addDoc(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      data
    );
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Error creating notification");
  }
};

/**
 * Get notifications for a user
 */
export const getUserNotifications = async (userId, limitCount = 50) => {
  try {
    const notificationsQuery = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(notificationsQuery);

    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const sorted = sortByTimestamp(notifications, "createdAt", true);
    return sorted.slice(0, limitCount);
  } catch (error) {
    console.error("Error getting user notifications:", error);
    return [];
  }
};

/**
 * Get unread notifications count for a user
 */
export const getUnreadNotificationsCount = async (userId) => {
  try {
    const notificationsQuery = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where("userId", "==", userId),
      where("read", "==", false)
    );
    const snapshot = await getDocs(notificationsQuery);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting unread notifications count:", error);
    return 0;
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
    await updateDoc(notificationRef, {
      read: true,
      readAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw new Error("Error marking notification as read");
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const notificationsQuery = query(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      where("userId", "==", userId),
      where("read", "==", false)
    );
    const snapshot = await getDocs(notificationsQuery);

    const updatePromises = snapshot.docs.map((doc) =>
      updateDoc(doc.ref, {
        read: true,
        readAt: Timestamp.now(),
      })
    );

    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw new Error("Error marking all notifications as read");
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId) => {
  try {
    const notificationRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
    await updateDoc(notificationRef, {
      deleted: true,
      deletedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw new Error("Error deleting notification");
  }
};

/**
 * PROJECT HISTORY OPERATIONS
 */

/**
 * Get project history
 */
export const getProjectHistory = async (projectId) => {
  try {
    const historyQuery = query(
      collection(db, COLLECTIONS.PROJECT_HISTORY),
      where("projectId", "==", projectId)
    );
    const snapshot = await getDocs(historyQuery);

    const history = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return sortByTimestamp(history, "timestamp", true);
  } catch (error) {
    console.error("Error getting project history:", error);
    return [];
  }
};

/**
 * Get all mentors that have been in a project (from history)
 */
export const getProjectMentorHistory = async (projectId) => {
  try {
    const historyQuery = query(
      collection(db, COLLECTIONS.PROJECT_HISTORY),
      where("projectId", "==", projectId)
    );
    const snapshot = await getDocs(historyQuery);

    const mentorActions = snapshot.docs
      .map((doc) => doc.data())
      .filter(
        (entry) =>
          entry.action === "mentor_added" || entry.action === "mentor_removed"
      );

    // Group by mentor
    const mentorMap = new Map();

    for (const action of mentorActions) {
      if (!mentorMap.has(action.mentorId)) {
        mentorMap.set(action.mentorId, {
          mentorId: action.mentorId,
          mentorName: action.mentorName,
          mentorEmail: action.mentorEmail,
          addedAt: null,
          removedAt: null,
          isActive: false,
        });
      }

      const entry = mentorMap.get(action.mentorId);
      if (action.action === "mentor_added") {
        entry.addedAt = action.timestamp;
      } else if (action.action === "mentor_removed") {
        entry.removedAt = action.timestamp;
      }
    }

    // Convert to array and determine if still active
    const history = Array.from(mentorMap.values()).map((entry) => ({
      ...entry,
      isActive: entry.addedAt && !entry.removedAt,
    }));

    return history.sort((a, b) => {
      const dateA = a.addedAt?.toMillis?.() || 0;
      const dateB = b.addedAt?.toMillis?.() || 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error getting project mentor history:", error);
    return [];
  }
};

/**
 * ANALYTICS OPERATIONS
 */

/**
 * Get analytics for teams
 */
export const getTeamsAnalytics = async () => {
  try {
    const teams = await getTeams();
    const projects = await getProjects();

    const analytics = {
      totalTeams: teams.length,
      totalMembers: teams.reduce(
        (sum, team) => sum + (team.members?.length || 0),
        0
      ),
      averageMembersPerTeam:
        teams.length > 0
          ? (
              teams.reduce(
                (sum, team) => sum + (team.members?.length || 0),
                0
              ) / teams.length
            ).toFixed(1)
          : 0,
      teamsWithProjects: teams.filter((team) =>
        projects.some((project) => project.teamId === team.id)
      ).length,
      teamsList: teams.map((team) => ({
        id: team.id,
        name: team.name,
        membersCount: team.members?.length || 0,
        projectsCount: projects.filter((p) => p.teamId === team.id).length,
      })),
    };

    return analytics;
  } catch (error) {
    console.error("Error getting teams analytics:", error);
    return null;
  }
};

/**
 * Get analytics for projects
 */
export const getProjectsAnalytics = async () => {
  try {
    const projects = await getProjects();
    const allHistory = await Promise.all(
      projects.map((project) => getProjectHistory(project.id))
    );

    const analytics = {
      totalProjects: projects.length,
      totalMentees: projects.reduce(
        (sum, project) => sum + (project.mentees?.length || 0),
        0
      ),
      totalActiveMentors: projects.reduce(
        (sum, project) => sum + (project.mentors?.length || 0),
        0
      ),
      averageMenteesPerProject:
        projects.length > 0
          ? (
              projects.reduce(
                (sum, project) => sum + (project.mentees?.length || 0),
                0
              ) / projects.length
            ).toFixed(1)
          : 0,
      projectsWithTeams: projects.filter((p) => p.teamId).length,
      projectsWithoutTeams: projects.filter((p) => !p.teamId).length,
      projectsList: projects.map((project) => ({
        id: project.id,
        name: project.name,
        menteesCount: project.mentees?.length || 0,
        mentorsCount: project.mentors?.length || 0,
        hasTeam: !!project.teamId,
      })),
    };

    return analytics;
  } catch (error) {
    console.error("Error getting projects analytics:", error);
    return null;
  }
};

/**
 * Get combined dashboard analytics
 */
export const getDashboardAnalytics = async (userId) => {
  try {
    const [teamsAnalytics, projectsAnalytics, userTeams, userProjects] =
      await Promise.all([
        getTeamsAnalytics(),
        getProjectsAnalytics(),
        getTeamsByMember(userId),
        getProjectsByPM(userId),
      ]);

    return {
      teams: teamsAnalytics,
      projects: projectsAnalytics,
      userStats: {
        myTeams: userTeams.length,
        myProjects: userProjects.length,
        myMentees: userProjects.reduce(
          (sum, project) => sum + (project.mentees?.length || 0),
          0
        ),
        myActiveMentors: userProjects.reduce(
          (sum, project) => sum + (project.mentors?.length || 0),
          0
        ),
      },
    };
  } catch (error) {
    console.error("Error getting dashboard analytics:", error);
    return null;
  }
};

/**
 * MENTORSHIP-PROJECT INTEGRATION
 */

/**
 * Get mentorships for a project
 */
export const getMentorshipsByProject = async (projectId) => {
  try {
    const mentorshipsQuery = query(
      collection(db, COLLECTIONS.MENTORSHIPS),
      where("projectId", "==", projectId)
    );
    const snapshot = await getDocs(mentorshipsQuery);

    const mentorships = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return sortByTimestamp(mentorships, "createdAt", true);
  } catch (error) {
    console.error("Error getting mentorships by project:", error);
    return [];
  }
};

/**
 * Associate a mentorship with a project
 */
export const linkMentorshipToProject = async (mentorshipId, projectId) => {
  try {
    const mentorshipRef = doc(db, COLLECTIONS.MENTORSHIPS, mentorshipId);
    await updateDoc(mentorshipRef, {
      projectId,
      updatedAt: Timestamp.now(),
    });

    // Get mentorship data to add mentor to project
    const mentorshipSnap = await getDoc(mentorshipRef);
    if (mentorshipSnap.exists()) {
      const mentorship = mentorshipSnap.data();
      if (mentorship.mentorId) {
        try {
          await addProjectMentor(projectId, mentorship.mentorId);
        } catch (err) {
          console.warn("Mentor may already be in project:", err);
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error linking mentorship to project:", error);
    throw error;
  }
};

/**
 * MATERIALS OPERATIONS
 */

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} mentorshipId - The mentorship ID
 * @returns {Promise<string>} Download URL
 */
export const uploadMaterialFile = async (file, mentorshipId) => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `mentorships/${mentorshipId}/materials/${timestamp}_${sanitizedFileName}`;

    // Create storage reference
    const storageRef = ref(storage, filePath);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      path: filePath,
      size: file.size,
      mimeType: file.type,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Error uploading file");
  }
};

/**
 * Create a new material for a mentorship
 * @param {Object} materialData - Material data
 * @returns {Promise<Object>} Created material with ID
 */
export const createMaterial = async (materialData) => {
  try {
    const data = sanitizeForFirestore({
      ...materialData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      downloads: 0,
    });

    const docRef = await addDoc(collection(db, COLLECTIONS.MATERIALS), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating material:", error);
    throw new Error("Error creating material");
  }
};

/**
 * Get all materials for a specific mentorship
 * @param {string} mentorshipId - The mentorship ID
 * @returns {Promise<Array>} Array of materials
 */
export const getMaterialsByMentorship = async (mentorshipId) => {
  try {
    const materialsQuery = query(
      collection(db, COLLECTIONS.MATERIALS),
      where("mentorshipId", "==", mentorshipId)
    );
    const snapshot = await getDocs(materialsQuery);

    const materials = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter out deleted materials and sort by creation date
    const activeMaterials = materials.filter((m) => !m.deleted);
    return sortByTimestamp(activeMaterials, "createdAt", true);
  } catch (error) {
    console.error("Error getting materials:", error);
    return [];
  }
};

// Get all materials from all mentorships of a user (for mentee dashboard)
export const getMaterialsForMentee = async (userId) => {
  try {
    // First, get all mentorships where user is mentee
    const mentorships = await getUserMentorships(userId);
    
    if (mentorships.length === 0) {
      return [];
    }

    // Get mentorship IDs
    const mentorshipIds = mentorships.map(m => m.id);

    // Fetch materials for all mentorships
    const materialsPromises = mentorshipIds.map(id => getMaterialsByMentorship(id));
    const materialsArrays = await Promise.all(materialsPromises);

    // Flatten and combine all materials
    const allMaterials = materialsArrays.flat();

    // Sort by creation date (newest first)
    return sortByTimestamp(allMaterials, "createdAt", true);
  } catch (error) {
    console.error("Error getting materials for mentee:", error);
    return [];
  }
};

/**
 * Delete a material (soft delete)
 * @param {string} materialId - The material ID
 * @returns {Promise<void>}
 */
export const deleteMaterial = async (materialId) => {
  try {
    const materialRef = doc(db, COLLECTIONS.MATERIALS, materialId);
    await updateDoc(materialRef, {
      deleted: true,
      deletedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error deleting material:", error);
    throw new Error("Error deleting material");
  }
};

/**
 * Delete a file from Firebase Storage
 * @param {string} filePath - The storage path of the file
 * @returns {Promise<void>}
 */
export const deleteMaterialFile = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file from storage:", error);
    // Don't throw error if file doesn't exist
    if (error.code !== "storage/object-not-found") {
      throw new Error("Error deleting file");
    }
  }
};

/**
 * Increment download count for a material
 * @param {string} materialId - The material ID
 * @returns {Promise<void>}
 */
export const incrementMaterialDownloads = async (materialId) => {
  try {
    const materialRef = doc(db, COLLECTIONS.MATERIALS, materialId);
    const materialSnap = await getDoc(materialRef);

    if (materialSnap.exists()) {
      const currentDownloads = materialSnap.data().downloads || 0;
      await updateDoc(materialRef, {
        downloads: currentDownloads + 1,
      });
    }
  } catch (error) {
    console.error("Error incrementing downloads:", error);
    // Don't throw error for this non-critical operation
  }
};

export { COLLECTIONS };
