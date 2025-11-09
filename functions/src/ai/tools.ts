/**
 * AI Tools for LangChain
 * 
 * This module defines tools that the AI can use to interact with the system.
 * Each tool is a function that the AI can call to fetch or manipulate data.
 * 
 * Following SOLID principles and clean architecture:
 * - Single Responsibility: Each tool does one thing well
 * - Interface Segregation: Tools are small and focused
 * - Dependency Inversion: Tools depend on abstractions (Firestore admin)
 */

import * as admin from "firebase-admin";
import {DynamicStructuredTool} from "@langchain/core/tools";
import {z} from "zod";

const db = admin.firestore();

/**
 * Tool: Search Mentors by Technology
 * Finds mentors who have expertise in specific technologies
 */
export const searchMentorsByTechnologyTool = new DynamicStructuredTool({
  name: "search_mentors_by_technology",
  description: `Search for mentors who have expertise in specific technologies or skills. 
  Use this when the user asks about finding mentors for a particular technology, language, or skill.
  Returns a list of mentors with their details and expertise.`,
  schema: z.object({
    technologies: z.array(z.string()).describe(
      "Array of technology names to search for (e.g., ['React', 'Python', 'AWS'])"
    ),
    limit: z.number().optional().default(10).describe(
      "Maximum number of mentors to return"
    ),
  }),
  func: async ({technologies, limit = 10}) => {
    try {
      const usersRef = db.collection("users");
      const mentorsQuery = await usersRef
        .where("userType", "==", "mentor")
        .get();

      if (mentorsQuery.empty) {
        return JSON.stringify({
          success: true,
          mentors: [],
          message: "No mentors found in the system",
        });
      }

      // Filter mentors by technology in memory
      const techLower = technologies.map((t) => t.toLowerCase());
      const mentors = mentorsQuery.docs
        .map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }))
        .filter((mentor: any) => {
          const mentorTechs = mentor.technologies || [];
          return mentorTechs.some((mt: any) => {
            const techName = typeof mt === "string" ? mt : mt.name;
            return techLower.some((t) =>
              techName?.toLowerCase().includes(t)
            );
          });
        })
        .slice(0, limit);

      return JSON.stringify({
        success: true,
        count: mentors.length,
        mentors: mentors.map((m: any) => ({
          uid: m.uid,
          name: m.displayName,
          bio: m.bio,
          technologies: m.technologies,
          yearsOfExperience: m.yearsOfExperience,
          rating: m.rating,
        })),
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: "Failed to search mentors",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
});

/**
 * Tool: Get Mentor Details
 * Retrieves detailed information about a specific mentor
 */
export const getMentorDetailsTool = new DynamicStructuredTool({
  name: "get_mentor_details",
  description: `Get detailed information about a specific mentor by their ID or name.
  Use this when the user wants to know more about a particular mentor.`,
  schema: z.object({
    mentorId: z.string().optional().describe("The mentor's unique ID"),
    mentorName: z.string().optional().describe("The mentor's display name"),
  }),
  func: async ({mentorId, mentorName}) => {
    try {
      const usersRef = db.collection("users");
      let mentorDoc;

      if (mentorId) {
        mentorDoc = await usersRef.doc(mentorId).get();
      } else if (mentorName) {
        const mentorQuery = await usersRef
          .where("displayName", "==", mentorName)
          .where("userType", "==", "mentor")
          .limit(1)
          .get();
        mentorDoc = mentorQuery.docs[0];
      } else {
        return JSON.stringify({
          success: false,
          error: "Either mentorId or mentorName must be provided",
        });
      }

      if (!mentorDoc || !mentorDoc.exists) {
        return JSON.stringify({
          success: false,
          message: "Mentor not found",
        });
      }

      const mentorData = mentorDoc.data();
      return JSON.stringify({
        success: true,
        mentor: {
          uid: mentorDoc.id,
          name: mentorData?.displayName,
          email: mentorData?.email,
          bio: mentorData?.bio,
          technologies: mentorData?.technologies || [],
          yearsOfExperience: mentorData?.yearsOfExperience,
          rating: mentorData?.rating,
          totalMentees: mentorData?.totalMentees || 0,
          role: mentorData?.role,
        },
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: "Failed to get mentor details",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
});

/**
 * Tool: Get All Available Mentors
 * Lists all mentors in the system
 */
export const getAllMentorsTool = new DynamicStructuredTool({
  name: "get_all_mentors",
  description: `Get a list of all available mentors in the system.
  Use this when the user wants to see all mentors or browse available mentors.`,
  schema: z.object({
    limit: z.number().optional().default(20).describe(
      "Maximum number of mentors to return"
    ),
  }),
  func: async ({limit = 20}) => {
    try {
      const usersRef = db.collection("users");
      const mentorsQuery = await usersRef
        .where("userType", "==", "mentor")
        .limit(limit)
        .get();

      const mentors = mentorsQuery.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          name: data.displayName,
          bio: data.bio,
          technologies: data.technologies || [],
          yearsOfExperience: data.yearsOfExperience,
          rating: data.rating,
        };
      });

      return JSON.stringify({
        success: true,
        count: mentors.length,
        mentors,
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: "Failed to get mentors",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
});

/**
 * Tool: Get Active Mentorships
 * Retrieves information about active mentorships
 */
export const getActiveMentorshipsTool = new DynamicStructuredTool({
  name: "get_active_mentorships",
  description: `Get a list of active mentorships in the system.
  Use this when the user asks about ongoing mentorships or wants statistics.`,
  schema: z.object({
    limit: z.number().optional().default(10).describe(
      "Maximum number of mentorships to return"
    ),
  }),
  func: async ({limit = 10}) => {
    try {
      const mentorshipsRef = db.collection("mentorships");
      const mentorshipsQuery = await mentorshipsRef
        .where("status", "==", "active")
        .limit(limit)
        .get();

      const mentorships = mentorshipsQuery.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          mentorName: data.mentorName,
          menteeName: data.menteeName,
          technologies: data.technologies || [],
          progress: data.progress || 0,
          status: data.status,
        };
      });

      return JSON.stringify({
        success: true,
        count: mentorships.length,
        mentorships,
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: "Failed to get mentorships",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
});

/**
 * Tool: Get Mentees
 * Lists all mentees in the system
 */
export const getMenteesTool = new DynamicStructuredTool({
  name: "get_mentees",
  description: `Get a list of all mentees in the system.
  Use this when the user asks about available mentees or who needs mentorship.`,
  schema: z.object({
    limit: z.number().optional().default(20).describe(
      "Maximum number of mentees to return"
    ),
  }),
  func: async ({limit = 20}) => {
    try {
      const usersRef = db.collection("users");
      const menteesQuery = await usersRef
        .where("userType", "==", "mentee")
        .limit(limit)
        .get();

      const mentees = menteesQuery.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          name: data.displayName,
          bio: data.bio,
          technologies: data.technologies || [],
        };
      });

      return JSON.stringify({
        success: true,
        count: mentees.length,
        mentees,
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: "Failed to get mentees",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
});

/**
 * Tool: Get System Statistics
 * Provides overview statistics about the mentorship system
 */
export const getSystemStatsTool = new DynamicStructuredTool({
  name: "get_system_statistics",
  description: `Get overall statistics about the mentorship system.
  Use this when the user asks about system metrics, totals, or overview information.`,
  schema: z.object({}),
  func: async () => {
    try {
      const [mentorsSnap, menteesSnap, mentorshipsSnap] = await Promise.all([
        db.collection("users").where("userType", "==", "mentor").get(),
        db.collection("users").where("userType", "==", "mentee").get(),
        db.collection("mentorships").get(),
      ]);

      const activeMentorships = mentorshipsSnap.docs.filter(
        (doc) => doc.data().status === "active"
      ).length;

      return JSON.stringify({
        success: true,
        statistics: {
          totalMentors: mentorsSnap.size,
          totalMentees: menteesSnap.size,
          totalMentorships: mentorshipsSnap.size,
          activeMentorships,
          pendingMentorships: mentorshipsSnap.docs.filter(
            (doc) => doc.data().status === "pending"
          ).length,
        },
      });
    } catch (error) {
      return JSON.stringify({
        success: false,
        error: "Failed to get system statistics",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
});

/**
 * Export all tools as an array for easy use with LangChain
 */
export const allTools = [
  searchMentorsByTechnologyTool,
  getMentorDetailsTool,
  getAllMentorsTool,
  getActiveMentorshipsTool,
  getMenteesTool,
  getSystemStatsTool,
];

