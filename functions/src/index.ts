/**
 * Firebase Functions for MentorshipCopilot
 * Backend endpoints for AI-powered recommendations and complex operations
 */

import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

/**
 * Interface definitions for type safety
 */
interface MentorRecommendationRequest {
  menteeId: string;
  technologies: string[];
  challengeDescription: string;
}

interface MentorData {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  userType: string;
  technologies?: Array<{name: string; level?: string}>;
  bio?: string;
  yearsOfExperience?: number;
  rating?: number;
  totalMentees?: number;
}

/**
 * Get Mentor Recommendations
 * 
 * This function analyzes the mentee's needs and returns ranked mentor recommendations.
 * Currently returns all mentors formatted for the frontend.
 * TODO: Implement AI-based ranking algorithm in future iterations.
 * 
 * @param {MentorRecommendationRequest} data - Request data with mentee info
 * @returns {Object} - Formatted mentor recommendations (topMentors and otherMentors)
 */
export const getMentorRecommendations = onCall<MentorRecommendationRequest>(
  {
    cors: true,
    region: "us-central1",
  },
  async (request) => {
    try {
      const {menteeId, technologies, challengeDescription} = request.data;

      logger.info("Getting mentor recommendations", {
        menteeId,
        technologies,
        challengeDescription: challengeDescription?.substring(0, 50),
      });

      // Validate input
      if (!menteeId || !technologies || technologies.length === 0) {
        throw new HttpsError(
          "invalid-argument",
          "menteeId and technologies are required"
        );
      }

      // Query all mentors from Firestore
      const mentorsRef = db.collection("users");
      const mentorsQuery = await mentorsRef
        .where("userType", "==", "mentor")
        .get();

      if (mentorsQuery.empty) {
        logger.warn("No mentors found in database");
        return {
          topMentors: [],
          otherMentors: [],
          message: "No mentors available at this time",
        };
      }

      // Transform mentor data to match frontend expectations
      const allMentors: MentorData[] = mentorsQuery.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      } as MentorData));

      // TODO: Implement AI-based scoring and ranking
      // For now, simple random shuffle and split
      const shuffled = allMentors.sort(() => Math.random() - 0.5);

      // Calculate mock AI scores (to be replaced with real AI logic)
      const mentorsWithScores = shuffled.map((mentor, index) => ({
        ...mentor,
        aiScore: 98 - (index * 3), // Mock decreasing scores
        matchReasons: [
          "Strong expertise match",
          "Proven track record",
          "Available in your timezone",
        ],
      }));

      // Split into top 3 and others
      const topMentors = mentorsWithScores.slice(0, 3);
      const otherMentors = mentorsWithScores.slice(3);

      logger.info("Recommendations generated successfully", {
        topCount: topMentors.length,
        otherCount: otherMentors.length,
      });

      return {
        topMentors,
        otherMentors,
        message: "Recommendations generated successfully",
      };
    } catch (error) {
      logger.error("Error getting mentor recommendations:", error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError(
        "internal",
        "Failed to get mentor recommendations",
        error
      );
    }
  }
);

/**
 * Create Mentorship Invitation
 * 
 * Creates a mentorship invitation that the mentor can accept or decline.
 * 
 * @param data - Mentorship details and invitation data
 * @returns The created invitation document
 */
export const createMentorshipInvitation = onCall(
  {
    cors: true,
    region: "us-central1",
  },
  async (request) => {
    try {
      const {mentorshipId, mentorId, message} = request.data;

      if (!mentorshipId || !mentorId) {
        throw new HttpsError(
          "invalid-argument",
          "mentorshipId and mentorId are required"
        );
      }

      // Create invitation document
      const invitationData = {
        mentorshipId,
        mentorId,
        message: message || "",
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const invitationRef = await db
        .collection("mentorship_invitations")
        .add(invitationData);

      logger.info("Mentorship invitation created", {
        invitationId: invitationRef.id,
        mentorshipId,
        mentorId,
      });

      return {
        success: true,
        invitationId: invitationRef.id,
      };
    } catch (error) {
      logger.error("Error creating mentorship invitation:", error);
      throw new HttpsError(
        "internal",
        "Failed to create mentorship invitation",
        error
      );
    }
  }
);

/**
 * Health check endpoint
 */
export const healthCheck = onCall(
  {
    cors: true,
    region: "us-central1",
  },
  async () => {
  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  };
});
