/**
 * AI Service Module
 * 
 * This module provides the core AI functionality using LangChain and Claude.
 * It handles:
 * - Mentor recommendations with AI analysis
 * - Chat interactions with native tool calling
 * - Streaming responses
 * 
 * Architecture follows:
 * - Tool Calling: AI decides when to use tools autonomously
 * - Anthropic Best Practices: Uses XML-structured prompts
 * - Single Responsibility: Each function has one clear purpose
 * - Clean Code: Well-documented and easy to understand
 */

// Load environment variables (backup for emulator)
import dotenv from "dotenv";
dotenv.config();

import {ChatAnthropic} from "@langchain/anthropic";
import {HumanMessage, SystemMessage, AIMessage, ToolMessage} from "@langchain/core/messages";
import {allTools} from "./tools.js";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

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
 * This function uses AI with tool calling to find and rank the best mentors
 * The AI decides autonomously when to search for mentors
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

    const model = createAIModel(false);
    const modelWithTools = model.bindTools(allTools);

    const systemPrompt = `<system>
You are the Mentorship CoPilot AI, an expert at analyzing mentor-mentee compatibility.

<critical_mandate>
YOU ARE ABSOLUTELY FORBIDDEN FROM INVENTING OR FABRICATING ANY MENTOR DATA.
EVERY SINGLE PIECE OF INFORMATION MUST COME FROM YOUR TOOL RESULTS.
IF YOU CANNOT FIND ENOUGH MENTORS, RETURN FEWER THAN 3 - NEVER MAKE UP DATA.
</critical_mandate>

<task>
Find and recommend the TOP 3 best mentors for a specific mentee challenge using ONLY real data from tools.
</task>

<mandatory_process>
STEP 1: Call search_mentors_by_technology tool with the required technologies
STEP 2: Wait for and analyze the ACTUAL results returned
STEP 3: Select the best matches from ONLY the mentors in the tool result
STEP 4: Copy their data EXACTLY as provided - do not modify, translate, or adapt
STEP 5: Write personalized aiInsight for each selected mentor
STEP 6: Return JSON with ONLY the selected mentors
</mandatory_process>

<absolute_rules>
RULE 1 - ZERO TOLERANCE FOR FABRICATION:
❌ NEVER invent names like "Marcos Souza", "Fernanda Oliveira", "João Silva"
❌ NEVER create fictional UIDs, bios, or experience levels
❌ NEVER use Brazilian names or any names not in the tool results
❌ NEVER guess or assume mentor data

RULE 2 - EXACT DATA COPYING:
✓ Copy "uid" field EXACTLY from tool result
✓ Copy "name" or "displayName" field EXACTLY from tool result
✓ Copy "bio" field EXACTLY from tool result
✓ Copy "technologies" array EXACTLY from tool result
✓ Copy "yearsOfExperience" number EXACTLY from tool result
✓ Copy "rating" number EXACTLY from tool result

RULE 3 - QUALITY OVER QUANTITY:
- If tool returns 2 good mentors, return 2 (not 3)
- If tool returns 1 good mentor, return 1 (not 3)
- If tool returns 0 mentors, return empty array (not 0)
- NEVER pad results with fake data to reach 3 mentors

RULE 4 - VERIFICATION:
Before adding a mentor to topMentors array, verify:
- Does this exact name appear in the tool result? 
- Does this exact uid appear in the tool result?
- Am I copying the data EXACTLY as provided?
</absolute_rules>

<examples>
<bad_example>
Tool returns: [{"name": "Dr. Emily Rodriguez", "uid": "mentor-001"}]
WRONG OUTPUT: [
  {"name": "Dr. Emily Rodriguez", ...},
  {"name": "Carlos Silva", ...},  ← INVENTED! This is FORBIDDEN!
  {"name": "Ana Costa", ...}      ← INVENTED! This is FORBIDDEN!
]
</bad_example>

<good_example>
Tool returns: [{"name": "Dr. Emily Rodriguez", "uid": "mentor-001", ...}]
CORRECT OUTPUT: [
  {"name": "Dr. Emily Rodriguez", "uid": "mentor-001", ...}
]
Only 1 mentor because that's what the tool returned. This is CORRECT!
</good_example>
</examples>

<output_format>
Respond with ONLY valid JSON in this exact structure:
{
  "topMentors": [
    {
      "uid": "<<EXACT uid from tool>>",
      "displayName": "<<EXACT name from tool>>",
      "bio": "<<EXACT bio from tool>>",
      "technologies": ["<<EXACT technologies from tool>>"],
      "yearsOfExperience": <<EXACT number from tool>>,
      "rating": <<EXACT number from tool>>,
      "matchPercentage": <<YOUR calculated match % (75-99)>>,
      "aiInsight": "<<YOUR personalized analysis>>"
    }
  ]
}

NOTE: You create TWO fields:
1. aiInsight: Detailed explanation of why this mentor matches
2. matchPercentage: A number from 75-99 representing how well this mentor matches the requirements
   - Consider: technology overlap, experience level, rating, bio relevance
   - Best match should be 90-99%
   - Good matches should be 80-89%
   - Decent matches should be 75-79%

Everything else MUST be copied EXACTLY from tool results.
</output_format>
</system>`;

    const humanPrompt = `<task>
Find the TOP 3 best mentors for this challenge.
</task>

<challenge>
${challengeDescription}
</challenge>

<required_technologies>
${technologies.join(", ")}
</required_technologies>

<critical_reminder>
YOU MUST INCLUDE "matchPercentage" FOR EACH MENTOR!
This is a REQUIRED field. Calculate it based on:
- Technology overlap with requirements
- Years of experience
- Rating score
- Bio relevance to the challenge

Example mentor output:
{
  "uid": "mentor-001",
  "displayName": "Dr. Emily Rodriguez",
  "matchPercentage": 94,
  "aiInsight": "Perfect match because..."
}

DO NOT FORGET matchPercentage - it's mandatory!
</critical_reminder>

<instructions>
1. Use your tools to search for mentors
2. Analyze and select the best matches
3. For EACH mentor, calculate matchPercentage (75-99)
4. Respond with JSON only
</instructions>`;

    const messages: any[] = [
      new SystemMessage(systemPrompt),
      new HumanMessage(humanPrompt),
    ];

    // Tool calling loop
    let response = await modelWithTools.invoke(messages);
    let iterations = 0;
    const maxIterations = 5;

    while (response.tool_calls && response.tool_calls.length > 0 && iterations < maxIterations) {
      iterations++;
      logger.info(`Tool calling iteration ${iterations}`, {
        toolCallsCount: response.tool_calls.length,
      });

      messages.push(response);

      // Execute each tool call
      for (const toolCall of response.tool_calls) {
        logger.info("Executing tool", {
          toolName: toolCall.name,
          toolArgs: toolCall.args,
        });

        const tool = allTools.find((t) => t.name === toolCall.name);
        if (!tool) {
          logger.error("Tool not found", {toolName: toolCall.name});
          continue;
        }

        try {
          const toolResult = await tool.func(toolCall.args as any);
          
          // Log detailed tool result for debugging fabrication issues
          logger.info("Tool executed successfully", {
            toolName: toolCall.name,
            toolArgs: toolCall.args,
            resultLength: toolResult.length,
            resultPreview: toolResult.substring(0, 500),
          });
          
          messages.push(
            new ToolMessage({
              tool_call_id: toolCall.id || "",
              content: toolResult,
            })
          );
        } catch (toolError) {
          logger.error("Tool execution failed", {
            toolName: toolCall.name,
            error: toolError,
          });
          messages.push(
            new ToolMessage({
              tool_call_id: toolCall.id || "",
              content: JSON.stringify({
                success: false,
                error: "Tool execution failed",
              }),
            })
          );
        }
      }

      response = await modelWithTools.invoke(messages);
    }

    const rawContent = response.content.toString();
    logger.info("AI response received", {
      contentLength: rawContent.length,
      iterations,
      responsePreview: rawContent.substring(0, 500),
      fullResponse: rawContent, // Log completo para debug
    });

    // Parse AI response
    let parsedResponse;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        logger.info("JSON found in response", {
          jsonLength: jsonMatch[0].length,
          jsonContent: jsonMatch[0], // Log do JSON completo
        });
        
        parsedResponse = JSON.parse(jsonMatch[0]);
        
        // Log ANTES do processamento
        logger.info("BEFORE processing - Parsed AI recommendations", {
          mentorCount: parsedResponse.topMentors?.length || 0,
          rawTopMentors: JSON.stringify(parsedResponse.topMentors),
        });
        
        // Ensure matchPercentage exists on each mentor (fallback if AI didn't provide it)
        if (parsedResponse.topMentors && Array.isArray(parsedResponse.topMentors)) {
          parsedResponse.topMentors = parsedResponse.topMentors.map((mentor: any, index: number) => {
            const hasMatchPercentage = mentor.matchPercentage !== undefined && mentor.matchPercentage !== null;
            
            if (!hasMatchPercentage) {
              // Generate fallback based on ranking: 1st=95%, 2nd=90%, 3rd=85%
              const fallbackMatch = 95 - (index * 5);
              logger.warn(`⚠️ Mentor ${mentor.displayName} MISSING matchPercentage, using fallback: ${fallbackMatch}%`);
              return { 
                ...mentor, 
                matchPercentage: fallbackMatch 
              };
            }
            
            logger.info(`✅ Mentor ${mentor.displayName} HAS matchPercentage: ${mentor.matchPercentage}%`);
            return mentor;
          });
          
          // Log DEPOIS do processamento
          logger.info("AFTER processing - Match percentages", {
            finalMentors: parsedResponse.topMentors.map((m: any) => ({
              name: m.displayName,
              matchPercentage: m.matchPercentage,
              hasField: m.matchPercentage !== undefined
            }))
          });
        }
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      logger.error("Failed to parse AI response", {
        error: parseError,
        rawContent: rawContent.substring(0, 500),
      });
      throw new Error("Failed to generate recommendations. Please try again.");
    }

    const topMentors = parsedResponse.topMentors || [];

    if (topMentors.length === 0) {
      logger.warn("No mentors recommended by AI");
      return {
        topMentors: [],
        otherMentors: [],
        message: "No suitable mentors found for the specified requirements",
      };
    }

    // Get other mentors for comparison (from tool results if available)
    const otherMentors: any[] = [];

    // Final log before returning
    logger.info("✅ FINAL - Recommendations generated", {
      topCount: topMentors.length,
      otherCount: otherMentors.length,
      mentorsData: topMentors.map((m: any) => ({
        name: m.displayName,
        uid: m.uid,
        matchPercentage: m.matchPercentage,
        hasMatchPercentage: m.matchPercentage !== undefined
      })),
      fullTopMentors: JSON.stringify(topMentors),
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
 * Normalize a name by removing common prefixes and titles
 * This allows flexible matching (e.g., "Emily Rodriguez" matches "Dr. Emily Rodriguez")
 */
function normalizeName(name: string): string {
  const prefixes = ["Dr.", "Dr", "Mr.", "Mr", "Ms.", "Ms", "Mrs.", "Mrs", "Prof.", "Prof"];
  let normalized = name.trim();
  
  for (const prefix of prefixes) {
    if (normalized.startsWith(prefix + " ")) {
      normalized = normalized.substring(prefix.length + 1).trim();
    }
  }
  
  return normalized.toLowerCase();
}

/**
 * Validate that all mentor names in AI response actually exist in database
 * This prevents hallucinations by cross-referencing with real data
 * Now supports flexible matching (handles name variations like "Dr. Emily" vs "Emily")
 */
async function validateMentorNamesInResponse(response: string): Promise<string> {
  try {
    // Extract potential mentor names from response
    // Look for patterns like "- Name Surname" or "Name Surname -" or "Name Surname is"
    const namePattern = /(?:^|\s|-)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)(?:\s+[-:]|\s+is|\s+has|\s+specializes|\.|,|$)/gm;
    const potentialNames = new Set<string>();
    
    let match;
    while ((match = namePattern.exec(response)) !== null) {
      const name = match[1].trim();
      // Filter out common false positives
      if (name.length > 3 && !name.includes("Based") && !name.includes("Here") && !name.includes("There")) {
        potentialNames.add(name);
      }
    }

    if (potentialNames.size === 0) {
      // No names found, response is safe
      return response;
    }

    logger.info("Validating potential mentor names", {
      names: Array.from(potentialNames),
    });

    // Fetch all mentors from database
    const usersRef = admin.firestore().collection("users");
    const mentorsQuery = await usersRef
      .where("userType", "==", "mentor")
      .get();

    const realMentorNames = new Set<string>();
    const normalizedToRealName = new Map<string, string>();
    
    mentorsQuery.docs.forEach((doc: any) => {
      const data = doc.data();
      if (data.displayName) {
        const realName = data.displayName;
        const normalized = normalizeName(realName);
        realMentorNames.add(realName);
        normalizedToRealName.set(normalized, realName);
      }
    });

    logger.info("Real mentors in database", {
      count: realMentorNames.size,
      names: Array.from(realMentorNames),
    });

    // Check for invented names (names in response but NOT in database)
    // Use flexible matching: normalize both sides for comparison
    const inventedNames: string[] = [];
    
    for (const potentialName of potentialNames) {
      const normalizedPotential = normalizeName(potentialName);
      
      // Check if this normalized name exists in our mapping
      const isValid = normalizedToRealName.has(normalizedPotential);
      
      if (!isValid) {
        // Also check exact match (case-insensitive)
        const exactMatch = Array.from(realMentorNames).some(
          (realName) => realName.toLowerCase() === potentialName.toLowerCase()
        );
        
        if (!exactMatch) {
          inventedNames.push(potentialName);
        }
      }
    }

    if (inventedNames.length > 0) {
      logger.error("🚨 HALLUCINATION DETECTED: AI invented mentor names", {
        inventedNames,
        realNames: Array.from(realMentorNames),
      });

      // Replace response with error message about hallucination
      return `I apologize, but I need to search the database before I can recommend specific mentors. Let me check our system for you.\n\nI found ${realMentorNames.size} mentors in our database. Would you like me to search for mentors with specific technologies?`;
    }

    // All names are valid
    logger.info("✅ All mentor names validated successfully", {
      validatedNames: Array.from(potentialNames),
    });
    return response;
  } catch (error) {
    logger.error("Error in name validation", {error});
    // If validation fails, return original response (fail-safe)
    return response;
  }
}

/**
 * Chat with AI using native tool calling with thinking breakdown
 * The AI autonomously decides when to use tools to fetch information
 * Returns both the response and thinking steps for UI display
 */
export async function chatWithAI(
  message: string,
  chatHistory: Array<{role: string; content: string}> = [],
  onThinkingStep?: (step: {type: string; message: string; toolName?: string}) => void
): Promise<string> {
  try {
    logger.info("chatWithAI called", {
      messageLength: message.length,
      historyLength: chatHistory.length,
    });

    const model = createAIModel(false);
    const modelWithTools = model.bindTools(allTools);

    const systemPrompt = `<system>
You are the Mentorship CoPilot, an intelligent AI assistant for BairesDev's internal mentorship program.

<critical_instruction>
YOU MUST USE YOUR TOOLS TO GET DATA BEFORE RESPONDING ABOUT MENTORS.
YOU ARE FORBIDDEN FROM USING YOUR TRAINING DATA OR MAKING UP INFORMATION.
IF YOU MENTION A MENTOR NAME, IT MUST COME FROM A TOOL RESULT IN THIS CONVERSATION.
</critical_instruction>

<tools_available>
MANDATORY: Use these tools to get real data from the system:
- search_mentors_by_technology: Find mentors with specific tech skills
- get_all_mentors: List all available mentors  
- get_mentor_details: Get detailed info about a specific mentor
- get_active_mentorships: See active mentorships
- get_mentees: List all mentees
- get_system_statistics: Get system overview and metrics
</tools_available>

<absolute_rules>
RULE 1 - NEVER INVENT DATA:
- NEVER create fictional mentor names like "Marcos Souza", "Fernanda Oliveira", "Lucas Martins"
- NEVER use common names or make up profiles
- NEVER rely on your training data or general knowledge about mentors
- NEVER assume or guess information

RULE 2 - MANDATORY TOOL USAGE:
- If user asks about mentors, you MUST call search_mentors_by_technology or get_all_mentors FIRST
- Wait for the tool result before responding
- ONLY mention mentors that appear in the tool results
- If tool returns empty/no mentors, say "No mentors found in the system"

RULE 3 - USE EXACT DATA:
- Copy names EXACTLY as they appear in tool results
- Copy technologies EXACTLY as provided
- Use EXACT experience numbers from tool results
- Do not modify, translate, or adapt any data

RULE 4 - VERIFICATION:
- Before mentioning ANY mentor, verify they were in a tool result
- If unsure, call the tool again to confirm
- Never reference mentors from previous conversations unless in THIS conversation's history
</absolute_rules>

<examples>
<bad_example>
User: "Quem pode me ajudar com React?"
BAD Response: "Marcos Souza e Fernanda Oliveira são especialistas em React..."
WHY BAD: These names are INVENTED. You made them up!
</bad_example>

<good_example>
User: "Quem pode me ajudar com React?"
CORRECT Process:
1. Call search_mentors_by_technology with ["React"]
2. Wait for result
3. If result shows "Dr. Emily Rodriguez" and "David Kim"
4. THEN respond: "Based on the system, Dr. Emily Rodriguez and David Kim specialize in React..."
</good_example>

<if_no_data>
If tools return no data or error, respond ONLY:
"I couldn't find any mentors in the system. Let me search again or try rephrasing your request."
NEVER fill in with fake examples.
</if_no_data>
</examples>

<behavior>
- Always call tools BEFORE answering questions about mentors
- Be helpful but ONLY with verified data
- If you cannot find information via tools, admit it honestly
- Keep responses clear and based ONLY on tool results
</behavior>

<context>
Current date: ${new Date().toLocaleDateString()}
Language: Respond in the same language the user uses
</context>
</system>`;

    const messages: any[] = [new SystemMessage(systemPrompt)];

    // Add chat history
    chatHistory.forEach((msg) => {
      messages.push(
        msg.role === "user"
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      );
    });

    // Add current user message
    messages.push(new HumanMessage(message));

    // Tool calling loop
    let response = await modelWithTools.invoke(messages);
    let iterations = 0;
    const maxIterations = 5;

    while (response.tool_calls && response.tool_calls.length > 0 && iterations < maxIterations) {
      iterations++;
      logger.info(`Chat tool calling iteration ${iterations}`, {
        toolCallsCount: response.tool_calls.length,
      });

      messages.push(response);

      // Execute each tool call
      for (const toolCall of response.tool_calls) {
        logger.info("Executing chat tool", {
          toolName: toolCall.name,
          toolArgs: toolCall.args,
        });
        
        // Notify frontend about tool usage (thinking step)
        if (onThinkingStep) {
          const toolMessages: Record<string, string> = {
            search_mentors_by_technology: `Searching for ${(toolCall.args as any).technologies?.join(", ")} mentors...`,
            get_all_mentors: "Fetching all available mentors...",
            get_mentor_details: "Getting mentor details...",
            get_active_mentorships: "Checking active mentorships...",
            get_mentees: "Loading mentees...",
            get_system_statistics: "Gathering system statistics...",
          };
          
          onThinkingStep({
            type: "tool_call",
            message: toolMessages[toolCall.name] || "Using tool...",
            toolName: toolCall.name,
          });
        }

        const tool = allTools.find((t) => t.name === toolCall.name);
        if (!tool) {
          logger.error("Tool not found in chat", {toolName: toolCall.name});
          messages.push(
            new ToolMessage({
              tool_call_id: toolCall.id || "",
              content: JSON.stringify({
                success: false,
                error: "Tool not found",
              }),
            })
          );
          continue;
        }

        try {
          const toolResult = await tool.func(toolCall.args as any);
          
          // Log detailed tool result for debugging
          logger.info("Chat tool executed successfully", {
            toolName: toolCall.name,
            toolArgs: toolCall.args,
            resultLength: toolResult.length,
            resultPreview: toolResult.substring(0, 500),
          });
          
          // Notify about successful tool execution
          if (onThinkingStep) {
            const parsed = JSON.parse(toolResult);
            const count = parsed.mentors?.length || parsed.count || 0;
            if (count > 0) {
              onThinkingStep({
                type: "tool_result",
                message: `Found ${count} result${count > 1 ? "s" : ""} in database`,
              });
            }
          }
          
          messages.push(
            new ToolMessage({
              tool_call_id: toolCall.id || "",
              content: toolResult,
            })
          );
        } catch (toolError) {
          logger.error("Chat tool execution failed", {
            toolName: toolCall.name,
            error: toolError,
          });
          
          if (onThinkingStep) {
            onThinkingStep({
              type: "error",
              message: "Tool execution failed",
            });
          }
          
          messages.push(
            new ToolMessage({
              tool_call_id: toolCall.id || "",
              content: JSON.stringify({
                success: false,
                error: "Tool execution failed",
                message: toolError instanceof Error ? toolError.message : "Unknown error",
              }),
            })
          );
        }
      }

      // Notify about AI thinking
      if (onThinkingStep && iterations < maxIterations) {
        onThinkingStep({
          type: "analyzing",
          message: "Analyzing results...",
        });
      }

      // Get next response from AI
      response = await modelWithTools.invoke(messages);
    }

    if (iterations >= maxIterations) {
      logger.warn("Chat reached max tool calling iterations", {iterations});
    }

    const finalResponse = response.content.toString();

    // CRITICAL VALIDATION: Verify ALL mentioned mentor names exist in database
    // This prevents AI hallucinations by cross-referencing every name
    if (onThinkingStep) {
      onThinkingStep({
        type: "validating",
        message: "Validating mentor data...",
      });
    }
    
    const validatedResponse = await validateMentorNamesInResponse(finalResponse);

    // Log final response for debugging
    logger.info("Chat final response", {
      responseLength: finalResponse.length,
      responsePreview: finalResponse.substring(0, 200),
      toolCallsUsed: iterations > 0,
      iterations,
      validationApplied: validatedResponse !== finalResponse,
    });
    
    if (onThinkingStep) {
      onThinkingStep({
        type: "complete",
        message: "Response ready!",
      });
    }

    return validatedResponse;
  } catch (error) {
    logger.error("Error in chatWithAI", {
      error,
      errorMessage: error instanceof Error ? error.message : "Unknown",
      errorStack: error instanceof Error ? error.stack : undefined,
    });
    return `I apologize, but I encountered an error: ${
      error instanceof Error ? error.message : "Unknown error"
    }. Please try again or rephrase your question.`;
  }
}

