/**
 * AI Service Module
 * 
 * This module provides the core AI functionality using LangChain and Claude.
 * It handles:
 * - Mentor recommendations with AI analysis
 * - Chat interactions with tool usage
 * - Streaming responses
 * 
 * Architecture follows:
 * - Dependency Injection: AI model and tools are injected
 * - Single Responsibility: Each function has one clear purpose
 * - Clean Code: Well-documented and easy to understand
 */

// Load environment variables (backup for emulator)
import dotenv from "dotenv";
dotenv.config();

import {ChatAnthropic} from "@langchain/anthropic";
import {HumanMessage, SystemMessage, AIMessage} from "@langchain/core/messages";
import {
  searchMentorsByTechnologyTool,
  getAllMentorsTool,
} from "./tools.js";
import * as logger from "firebase-functions/logger";

/**
 * Initialize Claude AI model
 * Using claude-3-haiku-20240307 as specified
 */
export function createAIModel(streaming = false): ChatAnthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    logger.error("ANTHROPIC_API_KEY not found. Please check:", {
      hasApiKey: !!process.env.ANTHROPIC_API_KEY,
      envKeys: Object.keys(process.env).filter(k => k.includes("ANTH")),
    });
    throw new Error(
      "ANTHROPIC_API_KEY environment variable is not set. " +
      "Please add it to functions/.env file or Firebase config."
    );
  }

  return new ChatAnthropic({
    modelName: "claude-3-haiku-20240307",
    temperature: 0.7,
    maxTokens: 2048,
    apiKey: apiKey,
    streaming,
  });
}

/**
 * Get AI-powered mentor recommendations
 * This function analyzes the mentee's needs and returns top mentor matches
 * with AI-generated insights
 */
export async function getAIMentorRecommendations(
  menteeId: string,
  technologies: string[],
  challengeDescription: string
): Promise<{
  topMentors: any[];
  otherMentors: any[];
  message: string;
}> {
  try {
    logger.info("Getting AI mentor recommendations", {
      menteeId,
      technologies,
      challengeDescription: challengeDescription.substring(0, 100),
    });

    // Step 1: Get mentors with matching technologies
    const mentorsResult = await searchMentorsByTechnologyTool.func({
      technologies,
      limit: 20,
    });

    const mentorsData = JSON.parse(mentorsResult);

    if (!mentorsData.success || mentorsData.mentors.length === 0) {
      logger.warn("No mentors found with specified technologies");
      return {
        topMentors: [],
        otherMentors: [],
        message: "No mentors found with the required technologies",
      };
    }

    // Step 2: Use AI to analyze and rank mentors
    const model = createAIModel(false);

    const systemPrompt = `You are the Mentorship CoPilot AI. Your task is to analyze mentor profiles and select the TOP 3 best matches for a mentee.

Instructions:
1. Consider the mentee's challenge and required technologies
2. Evaluate each mentor's expertise, experience, and background
3. Select the 3 BEST matches
4. For each selected mentor, write a personalized "aiInsight" (2-3 sentences) explaining WHY they're a perfect match

IMPORTANT: You must respond ONLY with valid JSON in this exact format:
{
  "topMentors": [
    {
      "uid": "mentor_uid",
      "displayName": "mentor_name",
      "bio": "mentor_bio",
      "technologies": ["tech1", "tech2"],
      "yearsOfExperience": number,
      "rating": number,
      "aiInsight": "Personalized explanation of why this mentor is perfect"
    }
  ]
}`;

    const humanPrompt = `Mentee Challenge: ${challengeDescription}

Required Technologies: ${technologies.join(", ")}

Available Mentors:
${JSON.stringify(mentorsData.mentors, null, 2)}

Select the TOP 3 best mentors and provide insights. Respond with JSON only.`;

    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(humanPrompt),
    ]);

    logger.info("AI response received", {
      contentLength: response.content.toString().length,
    });

    // Parse AI response
    let parsedResponse;
    try {
      const content = response.content.toString();
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      logger.warn("Failed to parse AI response, using top mentors directly", {
        error: parseError,
      });

      // Fallback: Return top mentors with generic insights
      parsedResponse = {
        topMentors: mentorsData.mentors.slice(0, 3).map((mentor: any) => ({
          ...mentor,
          aiInsight: `Strong expertise in ${technologies.join(
            " and "
          )}. Proven experience with ${mentor.yearsOfExperience || 5}+ years in the field. Excellent rating of ${mentor.rating || 4.5}/5.`,
        })),
      };
    }

    // Validate and format response
    const topMentors = parsedResponse.topMentors || [];
    const otherMentors = mentorsData.mentors
      .filter((m: any) => !topMentors.find((tm: any) => tm.uid === m.uid))
      .slice(0, 10);

    logger.info("Recommendations generated", {
      topCount: topMentors.length,
      otherCount: otherMentors.length,
    });

    return {
      topMentors,
      otherMentors,
      message: "AI recommendations generated successfully",
    };
  } catch (error) {
    logger.error("Error in getAIMentorRecommendations", {error});
    throw error;
  }
}

/**
 * Chat with AI
 * The AI can answer questions and use tools to fetch information
 */
export async function chatWithAI(
  message: string,
  chatHistory: Array<{role: string; content: string}> = []
): Promise<string> {
  try {
    logger.info("chatWithAI called", {
      message,
      hasApiKey: !!process.env.ANTHROPIC_API_KEY,
      apiKeyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 10),
    });
    
    const model = createAIModel(false);

    // Determine if we need to use tools based on the message
    const needsMentorSearch =
      message.toLowerCase().includes("mentor") &&
      (message.toLowerCase().includes("find") ||
        message.toLowerCase().includes("search") ||
        message.toLowerCase().includes("recommend"));

    let contextData = "";

    // Use tools if needed
    if (needsMentorSearch) {
      // Extract technologies from message
      const techKeywords = [
        "react",
        "python",
        "javascript",
        "java",
        "node",
        "aws",
        "cloud",
        "database",
        "frontend",
        "backend",
        "mobile",
        "devops",
      ];
      const detectedTechs = techKeywords.filter((tech) =>
        message.toLowerCase().includes(tech)
      );

      if (detectedTechs.length > 0) {
        const mentorsResult = await searchMentorsByTechnologyTool.func({
          technologies: detectedTechs,
          limit: 5,
        });
        contextData = `\n\nAvailable mentors data:\n${mentorsResult}`;
      } else {
        // Get all mentors if no specific tech mentioned
        const mentorsResult = await getAllMentorsTool.func({limit: 10});
        contextData = `\n\nAvailable mentors data:\n${mentorsResult}`;
      }
    }

    // Build messages
    const messages = [];

    // System message
    messages.push(
      new SystemMessage(`You are the Mentorship CoPilot, an intelligent AI assistant for BairesDev's internal mentorship program.

Your role is to help users by:
- Finding and recommending mentors based on skills
- Answering questions about the mentorship system
- Providing guidance and insights

Keep responses:
- Friendly and professional
- Clear and helpful
- Focused on actionable advice

Current date: ${new Date().toLocaleDateString()}${contextData}`)
    );

    // Add chat history (convert to proper message types)
    chatHistory.forEach((msg) => {
      messages.push(
        msg.role === "user"
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content) // AI responses should be AIMessage, not SystemMessage
      );
    });

    // Add current message
    messages.push(new HumanMessage(message));

    // Get response
    const response = await model.invoke(messages);

    return response.content.toString();
  } catch (error) {
    logger.error("Error in chatWithAI", {
      error,
      errorMessage: error instanceof Error ? error.message : "Unknown",
      errorStack: error instanceof Error ? error.stack : undefined,
      errorName: error instanceof Error ? error.constructor.name : typeof error,
    });
    return `I apologize, but I encountered an error: ${
      error instanceof Error ? error.message : "Unknown error"
    }. Please try again or rephrase your question.`;
  }
}

