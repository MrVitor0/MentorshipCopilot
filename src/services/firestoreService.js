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
  addDoc
} from 'firebase/firestore'
import { db } from '../config/firebase'

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
  USERS: 'users',
  MENTORSHIPS: 'mentorships',
  SESSIONS: 'sessions',
  ACTIVITIES: 'activities'
}

/**
 * UTILITY FUNCTIONS - Following DRY principle
 */

/**
 * Safely get all documents from a collection
 * Returns empty array if collection doesn't exist or is empty
 */
const safeGetCollection = async (collectionName) => {
  try {
    const collectionRef = collection(db, collectionName)
    const snapshot = await getDocs(collectionRef)
    
    if (snapshot.empty) {
      return []
    }
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error)
    return []
  }
}

/**
 * Sort documents by timestamp field
 */
const sortByTimestamp = (docs, field = 'createdAt', descending = true) => {
  return docs.sort((a, b) => {
    const dateA = a[field]?.toMillis?.() || 0
    const dateB = b[field]?.toMillis?.() || 0
    return descending ? dateB - dateA : dateA - dateB
  })
}

/**
 * USER OPERATIONS
 */

export const createUserProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid)
    const data = {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      onboardingCompleted: userData.onboardingCompleted || false
    }
    
    await setDoc(userRef, data)
    return data
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw new Error('Error creating user profile')
  }
}

export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      return { uid, ...userSnap.data() }
    }
    return null
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

export const updateUserProfile = async (uid, updates) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid)
    const data = {
      ...updates,
      updatedAt: Timestamp.now()
    }
    
    await updateDoc(userRef, data)
    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw new Error('Error updating profile')
  }
}

export const completeOnboarding = async (uid, onboardingData) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid)
    const data = {
      ...onboardingData,
      onboardingCompleted: true,
      updatedAt: Timestamp.now()
    }
    
    await updateDoc(userRef, data)
    return data
  } catch (error) {
    console.error('Error completing onboarding:', error)
    throw new Error('Error completing onboarding')
  }
}

/**
 * MENTOR/MENTEE QUERIES
 */

export const getMentors = async (filters = {}) => {
  try {
    // Get all users and filter in memory to avoid index issues
    const users = await safeGetCollection(COLLECTIONS.USERS)
    
    let mentors = users.filter(user => user.userType === 'mentor')
    
    // Apply technology filters if provided
    if (filters.technologies && filters.technologies.length > 0) {
      mentors = mentors.filter(mentor => {
        const mentorTechs = mentor.technologies || []
        return filters.technologies.some(tech => 
          mentorTechs.some(mt => (mt.name || mt) === tech)
        )
      })
    }
    
    // Rename id to uid for consistency
    return mentors.map(({ id, ...rest }) => ({ uid: id, ...rest }))
  } catch (error) {
    console.error('Error getting mentors:', error)
    return []
  }
}

export const getMentees = async () => {
  try {
    // Get all users and filter in memory
    const users = await safeGetCollection(COLLECTIONS.USERS)
    const mentees = users.filter(user => user.userType === 'mentee')
    
    // Rename id to uid for consistency
    return mentees.map(({ id, ...rest }) => ({ uid: id, ...rest }))
  } catch (error) {
    console.error('Error getting mentees:', error)
    return []
  }
}

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
      searchQuery = '',
      sortBy = 'displayName',
      sortOrder = 'asc'
    } = options

    // Get all users and filter in memory
    const users = await safeGetCollection(COLLECTIONS.USERS)
    let mentors = users.filter(user => user.userType === 'mentor')
    
    // Exclude specific IDs (e.g., already recommended mentors)
    if (excludeIds.length > 0) {
      mentors = mentors.filter(mentor => !excludeIds.includes(mentor.id))
    }
    
    // Apply technology filters
    if (technologies.length > 0) {
      mentors = mentors.filter(mentor => {
        const mentorTechs = mentor.technologies || []
        return technologies.some(tech => 
          mentorTechs.some(mt => {
            const techName = typeof mt === 'string' ? mt : mt.name
            return techName?.toLowerCase() === tech.toLowerCase()
          })
        )
      })
    }
    
    // Apply search query filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase()
      mentors = mentors.filter(mentor => 
        mentor.displayName?.toLowerCase().includes(lowerQuery) ||
        mentor.bio?.toLowerCase().includes(lowerQuery) ||
        mentor.role?.toLowerCase().includes(lowerQuery)
      )
    }
    
    // Sort mentors
    mentors.sort((a, b) => {
      let aVal, bVal
      
      switch (sortBy) {
        case 'rating':
          aVal = a.rating || 0
          bVal = b.rating || 0
          break
        case 'experience':
          aVal = a.yearsExperience || 0
          bVal = b.yearsExperience || 0
          break
        case 'displayName':
        default:
          aVal = (a.displayName || '').toLowerCase()
          bVal = (b.displayName || '').toLowerCase()
          break
      }
      
      if (sortOrder === 'desc') {
        return aVal < bVal ? 1 : -1
      }
      return aVal > bVal ? 1 : -1
    })
    
    // Calculate pagination
    const totalCount = mentors.length
    const totalPages = Math.ceil(totalCount / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    
    // Get page of results
    const paginatedMentors = mentors.slice(startIndex, endIndex)
    
    // Rename id to uid for consistency
    const formattedMentors = paginatedMentors.map(({ id, ...rest }) => ({ 
      uid: id, 
      ...rest 
    }))
    
    return {
      mentors: formattedMentors,
      totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  } catch (error) {
    console.error('Error getting mentors with pagination:', error)
    return {
      mentors: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false
    }
  }
}

/**
 * MENTORSHIP OPERATIONS
 */

export const createMentorship = async (mentorshipData) => {
  try {
    const data = {
      ...mentorshipData,
      status: 'active',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    const docRef = await addDoc(collection(db, COLLECTIONS.MENTORSHIPS), data)
    return { id: docRef.id, ...data }
  } catch (error) {
    console.error('Error creating mentorship:', error)
    throw new Error('Error creating mentorship')
  }
}

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
      where('mentorId', '==', uid)
    )
    const mentorSnapshot = await getDocs(mentorQuery)
    const mentorMentorships = mentorSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      role: 'mentor'
    }))

    // Query mentorships where user is a mentee
    const menteeQuery = query(
      collection(db, COLLECTIONS.MENTORSHIPS),
      where('menteeId', '==', uid)
    )
    const menteeSnapshot = await getDocs(menteeQuery)
    const menteeMentorships = menteeSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      role: 'mentee'
    }))

    // Combine and sort
    const allMentorships = [...mentorMentorships, ...menteeMentorships]
    return sortByTimestamp(allMentorships, 'createdAt', true)
  } catch (error) {
    console.error('Error getting user mentorships:', error)
    return []
  }
}

/**
 * SESSION OPERATIONS
 */

export const createSession = async (sessionData) => {
  try {
    const data = {
      ...sessionData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    const docRef = await addDoc(collection(db, COLLECTIONS.SESSIONS), data)
    return { id: docRef.id, ...data }
  } catch (error) {
    console.error('Error creating session:', error)
    throw new Error('Error creating session')
  }
}

export const getUpcomingSessions = async (uid, limitCount = 10) => {
  try {
    // Query sessions where user is a participant
    const sessionsQuery = query(
      collection(db, COLLECTIONS.SESSIONS),
      where('participantIds', 'array-contains', uid)
    )
    const snapshot = await getDocs(sessionsQuery)
    
    // Filter by valid statuses in memory
    const upcomingSessions = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(session => 
        ['scheduled', 'pending_acceptance', 'confirmed'].includes(session.status)
      )
    
    // Sort by scheduled date (ascending) and limit
    const sorted = sortByTimestamp(upcomingSessions, 'scheduledDate', false)
    return sorted.slice(0, limitCount)
  } catch (error) {
    console.error('Error getting upcoming sessions:', error)
    return []
  }
}

/**
 * ACTIVITY OPERATIONS
 */

export const getRecentActivities = async (limitCount = 10) => {
  try {
    const activities = await safeGetCollection(COLLECTIONS.ACTIVITIES)
    const sorted = sortByTimestamp(activities, 'createdAt', true)
    return sorted.slice(0, limitCount)
  } catch (error) {
    console.error('Error getting recent activities:', error)
    return []
  }
}

export const createActivity = async (activityData) => {
  try {
    const data = {
      ...activityData,
      createdAt: Timestamp.now()
    }
    
    const docRef = await addDoc(collection(db, COLLECTIONS.ACTIVITIES), data)
    return { id: docRef.id, ...data }
  } catch (error) {
    console.error('Error creating activity:', error)
    throw new Error('Error creating activity')
  }
}

/**
 * SMART SUGGESTIONS (AI-powered matching)
 */

export const getSmartSuggestions = async (uid) => {
  try {
    const userProfile = await getUserProfile(uid)
    if (!userProfile) return []

    // Get opposite user type
    const targetType = userProfile.userType === 'mentor' ? 'mentee' : 'mentor'
    
    const allUsers = await safeGetCollection(COLLECTIONS.USERS)
    let suggestions = allUsers.filter(user => user.userType === targetType)
    
    // If user has technologies, prioritize matches
    if (userProfile.technologies && userProfile.technologies.length > 0) {
      const userTechNames = userProfile.technologies.map(t => t.name || t)
      
      // Score each suggestion by technology overlap
      suggestions = suggestions.map(suggestion => {
        const suggestionTechs = suggestion.technologies || []
        const suggestionTechNames = suggestionTechs.map(t => t.name || t)
        const overlap = userTechNames.filter(tech => suggestionTechNames.includes(tech)).length
        return { ...suggestion, _matchScore: overlap }
      })
      
      // Sort by match score
      suggestions.sort((a, b) => (b._matchScore || 0) - (a._matchScore || 0))
    }
    
    // Rename id to uid and remove internal fields
    return suggestions.slice(0, 5).map(({ id, ...rest }) => {
      // Remove _matchScore from the object
      const { _matchScore, ...cleanRest } = rest
      return { uid: id, ...cleanRest }
    })
  } catch (error) {
    console.error('Error getting smart suggestions:', error)
    return []
  }
}

/**
 * MENTORSHIP EXTENDED OPERATIONS
 */

export const createMentorshipWithDetails = async (mentorshipData) => {
  try {
    const data = {
      ...mentorshipData,
      status: mentorshipData.status || 'pending_mentor',
      progress: 0,
      sessionsCompleted: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    const docRef = await addDoc(collection(db, COLLECTIONS.MENTORSHIPS), data)
    return { id: docRef.id, ...data }
  } catch (error) {
    console.error('Error creating mentorship with details:', error)
    throw new Error('Error creating mentorship')
  }
}

export const updateMentorshipStatus = async (mentorshipId, status, additionalData = {}) => {
  try {
    const mentorshipRef = doc(db, COLLECTIONS.MENTORSHIPS, mentorshipId)
    const data = {
      status,
      ...additionalData,
      updatedAt: Timestamp.now()
    }
    
    await updateDoc(mentorshipRef, data)
    return data
  } catch (error) {
    console.error('Error updating mentorship status:', error)
    throw new Error('Error updating mentorship')
  }
}

export const getMentorshipById = async (mentorshipId) => {
  try {
    const mentorshipRef = doc(db, COLLECTIONS.MENTORSHIPS, mentorshipId)
    const mentorshipSnap = await getDoc(mentorshipRef)
    
    if (mentorshipSnap.exists()) {
      return { id: mentorshipSnap.id, ...mentorshipSnap.data() }
    }
    return null
  } catch (error) {
    console.error('Error getting mentorship by id:', error)
    return null
  }
}

export const getPMMentorships = async (pmId) => {
  try {
    // Query mentorships where user is a project manager
    const pmQuery = query(
      collection(db, COLLECTIONS.MENTORSHIPS),
      where('projectManagerId', '==', pmId)
    )
    const snapshot = await getDocs(pmQuery)
    
    const pmMentorships = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return sortByTimestamp(pmMentorships, 'createdAt', true)
  } catch (error) {
    console.error('Error getting PM mentorships:', error)
    return []
  }
}

/**
 * MEETING/SESSION MANAGEMENT
 */

export const createKickoffMeeting = async (meetingData) => {
  try {
    const data = {
      ...meetingData,
      type: 'kickoff',
      status: 'pending_acceptance',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    const docRef = await addDoc(collection(db, COLLECTIONS.SESSIONS), data)
    return { id: docRef.id, ...data }
  } catch (error) {
    console.error('Error creating kickoff meeting:', error)
    throw new Error('Error creating kickoff meeting')
  }
}

export const updateMeetingStatus = async (meetingId, status, additionalData = {}) => {
  try {
    const meetingRef = doc(db, COLLECTIONS.SESSIONS, meetingId)
    const data = {
      status,
      ...additionalData,
      updatedAt: Timestamp.now()
    }
    
    await updateDoc(meetingRef, data)
    return data
  } catch (error) {
    console.error('Error updating meeting status:', error)
    throw new Error('Error updating meeting')
  }
}

export const getMeetingsByUser = async (userId) => {
  try {
    // Query sessions where user is a participant
    const sessionsQuery = query(
      collection(db, COLLECTIONS.SESSIONS),
      where('participantIds', 'array-contains', userId)
    )
    const snapshot = await getDocs(sessionsQuery)
    
    const userMeetings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return sortByTimestamp(userMeetings, 'scheduledDate', false)
  } catch (error) {
    console.error('Error getting meetings by user:', error)
    return []
  }
}

/**
 * INVITATION MANAGEMENT
 */

export const createMentorshipInvitation = async (invitationData) => {
  try {
    const data = {
      ...invitationData,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    const docRef = await addDoc(collection(db, 'mentorship_invitations'), data)
    return { id: docRef.id, ...data }
  } catch (error) {
    console.error('Error creating mentorship invitation:', error)
    throw new Error('Error creating invitation')
  }
}

export const getInvitationsForMentor = async (mentorId) => {
  try {
    // Query invitations for this mentor with pending status
    const invitationsQuery = query(
      collection(db, 'mentorship_invitations'),
      where('mentorId', '==', mentorId),
      where('status', '==', 'pending')
    )
    const snapshot = await getDocs(invitationsQuery)
    
    const mentorInvitations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return sortByTimestamp(mentorInvitations, 'createdAt', true)
  } catch (error) {
    console.error('Error getting invitations for mentor:', error)
    return []
  }
}

/**
 * Update invitation status and assign mentor to mentorship if accepted
 * This is the key function that transitions a mentorship from pending to active
 * When a mentor accepts, all other pending invitations are automatically declined
 */
export const updateInvitationStatus = async (invitationId, status, mentorData = null) => {
  try {
    const invitationRef = doc(db, 'mentorship_invitations', invitationId)
    
    // First get the invitation to know which mentorship it belongs to
    const invitationSnap = await getDoc(invitationRef)
    if (!invitationSnap.exists()) {
      throw new Error('Invitation not found')
    }
    
    const invitation = invitationSnap.data()
    
    // Update invitation status
    const invitationData = {
      status,
      updatedAt: Timestamp.now()
    }
    await updateDoc(invitationRef, invitationData)
    
    // If accepted, assign mentor to the mentorship and decline other invitations
    if (status === 'accepted' && invitation.mentorshipId) {
      const mentorshipRef = doc(db, COLLECTIONS.MENTORSHIPS, invitation.mentorshipId)
      const mentorshipData = {
        mentorId: invitation.mentorId,
        mentorName: invitation.mentorName || mentorData?.displayName,
        mentorAvatar: invitation.mentorAvatar || mentorData?.photoURL,
        status: 'active', // Change from 'pending' to 'active'
        acceptedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
      
      await updateDoc(mentorshipRef, mentorshipData)
      
      console.log('✅ Mentor assigned to mentorship:', invitation.mentorshipId)
      
      // Decline all other pending invitations for this mentorship
      const otherInvitationsQuery = query(
        collection(db, 'mentorship_invitations'),
        where('mentorshipId', '==', invitation.mentorshipId),
        where('status', '==', 'pending')
      )
      const otherInvitationsSnapshot = await getDocs(otherInvitationsQuery)
      
      const declinePromises = otherInvitationsSnapshot.docs
        .filter(doc => doc.id !== invitationId) // Don't decline the one being accepted
        .map(doc => updateDoc(doc.ref, {
          status: 'auto_declined',
          updatedAt: Timestamp.now(),
          declinedReason: 'Another mentor was selected'
        }))
      
      await Promise.all(declinePromises)
      
      console.log(`✅ Auto-declined ${declinePromises.length} other pending invitations`)
    }
    
    return invitationData
  } catch (error) {
    console.error('Error updating invitation status:', error)
    throw new Error('Error updating invitation')
  }
}

export const getInvitationsForMentorship = async (mentorshipId) => {
  try {
    // Query invitations for this mentorship
    const invitationsQuery = query(
      collection(db, 'mentorship_invitations'),
      where('mentorshipId', '==', mentorshipId)
    )
    const snapshot = await getDocs(invitationsQuery)
    
    const mentorshipInvitations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return sortByTimestamp(mentorshipInvitations, 'createdAt', true)
  } catch (error) {
    // Silently handle permission errors - return empty array
    console.warn('⚠️ Could not fetch invitations (may be permissions issue):', error.code)
    return []
  }
}

/**
 * JOIN REQUESTS
 */

export const createJoinRequest = async (requestData) => {
  try {
    const data = {
      ...requestData,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    const docRef = await addDoc(collection(db, 'mentorship_join_requests'), data)
    return { id: docRef.id, ...data }
  } catch (error) {
    console.error('Error creating join request:', error)
    throw new Error('Error creating join request')
  }
}

export const getJoinRequestsForMentorship = async (mentorshipId) => {
  try {
    // Query join requests for this mentorship with pending status
    const requestsQuery = query(
      collection(db, 'mentorship_join_requests'),
      where('mentorshipId', '==', mentorshipId),
      where('status', '==', 'pending')
    )
    const snapshot = await getDocs(requestsQuery)
    
    const mentorshipRequests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return sortByTimestamp(mentorshipRequests, 'createdAt', true)
  } catch (error) {
    console.error('Error getting join requests for mentorship:', error)
    return []
  }
}

export const updateJoinRequestStatus = async (requestId, status) => {
  try {
    const requestRef = doc(db, 'mentorship_join_requests', requestId)
    const data = {
      status,
      updatedAt: Timestamp.now()
    }
    
    await updateDoc(requestRef, data)
    return data
  } catch (error) {
    console.error('Error updating join request status:', error)
    throw new Error('Error updating join request')
  }
}

/**
 * Get all available mentors
 * Returns all users with userType 'mentor'
 * Uses memory filtering to avoid index requirements
 */
export const getAllMentors = async () => {
  try {
    // Get all users and filter in memory (same pattern as getMentors)
    const users = await safeGetCollection(COLLECTIONS.USERS)
    
    // Filter for mentors only
    const mentors = users.filter(user => user.userType === 'mentor')
    
    // Map id to uid for consistency
    return mentors.map(({ id, ...rest }) => ({ uid: id, ...rest }))
  } catch (error) {
    console.error('Error getting all mentors:', error)
    return []
  }
}

/**
 * Invite a mentor to a mentorship
 * Creates an invitation document that the mentor can accept/decline
 */
export const inviteMentorToMentorship = async (mentorshipId, mentorId, message = '') => {
  try {
    // Get mentorship data
    const mentorshipRef = doc(db, COLLECTIONS.MENTORSHIPS, mentorshipId)
    const mentorshipSnap = await getDoc(mentorshipRef)
    
    if (!mentorshipSnap.exists()) {
      throw new Error('Mentorship not found')
    }
    
    const mentorship = mentorshipSnap.data()
    
    // Check if already has a mentor
    if (mentorship.mentorId) {
      throw new Error('Mentorship already has a mentor assigned')
    }
    
    // Check if already invited
    const invitationsRef = collection(db, 'mentorship_invitations')
    const existingQuery = query(
      invitationsRef,
      where('mentorshipId', '==', mentorshipId),
      where('mentorId', '==', mentorId)
    )
    const existingSnap = await getDocs(existingQuery)
    
    if (!existingSnap.empty) {
      // Check if there's a pending invitation
      const pending = existingSnap.docs.find(doc => doc.data().status === 'pending')
      if (pending) {
        throw new Error('Mentor already has a pending invitation for this mentorship')
      }
    }
    
    // Create invitation
    const invitationData = {
      mentorshipId,
      mentorId,
      menteeId: mentorship.menteeId,
      projectManagerId: mentorship.projectManagerId,
      message,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    const invitationRef = await addDoc(invitationsRef, invitationData)
    
    return {
      id: invitationRef.id,
      ...invitationData
    }
  } catch (error) {
    console.error('Error inviting mentor to mentorship:', error)
    throw error
  }
}

export { COLLECTIONS }

