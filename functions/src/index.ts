/**
 * Firebase Functions for MentorshipCopilot
 * Backend endpoints for AI-powered recommendations and complex operations
 */

// Load environment variables from .env file (for local development)
import dotenv from "dotenv";
dotenv.config();

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
 * Get AI-Powered Mentor Recommendations
 * 
 * This function uses Claude AI with LangChain to analyze the mentee's needs
 * and return the top 3 most compatible mentors with AI-generated insights.
 * 
 * @param data - Request data with mentee info, technologies, and challenge description
 * @returns {Object} - AI-generated mentor recommendations with insights
 */
export const getAIMentorRecommendations = onCall(
  {
    cors: true,
    region: "us-central1",
    timeoutSeconds: 60,
    memory: "512MiB",
  },
  async (request) => {
    try {
      const {menteeId, technologies, challengeDescription} = request.data;

      logger.info("Getting AI mentor recommendations", {
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

      if (!challengeDescription || challengeDescription.length < 20) {
        throw new HttpsError(
          "invalid-argument",
          "challengeDescription must be at least 20 characters"
        );
      }

      // Import AI service dynamically to avoid cold start issues
      const aiService = await import("./ai/service.js");

      // Get AI recommendations
      const recommendations = await aiService.getAIMentorRecommendations(
        menteeId,
        technologies,
        challengeDescription
      );

      logger.info("AI recommendations generated successfully", {
        topCount: recommendations.topMentors.length,
        otherCount: recommendations.otherMentors.length,
      });

      return recommendations;
    } catch (error) {
      logger.error("Error getting AI mentor recommendations:", error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError(
        "internal",
        "Failed to get AI mentor recommendations. " +
        "Please ensure ANTHROPIC_API_KEY is set in environment.",
        error
      );
    }
  }
);

/**
 * Mentorship CoPilot Chat (Streaming)
 * 
 * AI-powered chat assistant that can answer questions and use tools
 * to fetch information from the system.
 * 
 * @param data - Message and chat history
 * @returns Stream of AI responses
 */
export const mentorshipCopilotChat = onCall(
  {
    cors: true,
    region: "us-central1",
    timeoutSeconds: 60,
    memory: "512MiB",
  },
  async (request) => {
    try {
      const {message, chatHistory = []} = request.data;

      logger.info("Mentorship CoPilot chat request", {
        messageLength: message?.length,
        historyLength: chatHistory.length,
      });

      // Validate input
      if (!message || typeof message !== "string") {
        throw new HttpsError(
          "invalid-argument",
          "message is required and must be a string"
        );
      }

      // Import AI service
      const aiService = await import("./ai/service.js");

      // Collect thinking steps for UI display
      const thinkingSteps: Array<{type: string; message: string; toolName?: string; timestamp: string}> = [];
      
      const onThinkingStep = (step: {type: string; message: string; toolName?: string}) => {
        thinkingSteps.push({
          ...step,
          timestamp: new Date().toISOString(),
        });
        logger.info("Thinking step", step);
      };

      // Get AI response with thinking breakdown
      const response = await aiService.chatWithAI(message, chatHistory, onThinkingStep);

      logger.info("Chat response generated", {
        responseLength: response.length,
        thinkingStepsCount: thinkingSteps.length,
      });

      return {
        success: true,
        response: response,
        thinkingSteps: thinkingSteps,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error("Error in mentorship copilot chat:", error);
      if (error instanceof HttpsError) {
        throw error;
      }
      throw new HttpsError(
        "internal",
        "Failed to process chat message. " +
        "Please ensure ANTHROPIC_API_KEY is set in environment.",
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
