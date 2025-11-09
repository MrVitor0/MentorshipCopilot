# AI Setup Instructions

This document explains how to configure the AI features for the Mentorship CoPilot application.

## Overview

The application uses **Claude AI** (by Anthropic) with **LangChain** to provide:
- AI-powered mentor recommendations
- Intelligent chat assistant with system knowledge
- Context-aware responses with tool usage

## Model

The system uses **claude-3-haiku-20240307** - a fast, efficient, and cost-effective model perfect for this use case.

## Required Environment Variable

You need to set up the `ANTHROPIC_API_KEY` environment variable in your Firebase Functions configuration.

### Step 1: Get Your API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (it will look like: `sk-ant-...`)

### Step 2: Configure Firebase

#### For Local Development (Emulator)

Create a `.env` file in the `functions` directory:

```bash
# functions/.env
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

#### For Production (Firebase)

Set the environment variable using Firebase CLI:

```bash
firebase functions:config:set anthropic.api_key="sk-ant-your-actual-key-here"
```

Then deploy your functions:

```bash
firebase deploy --only functions
```

### Step 3: Verify Configuration

You can check if the key is set correctly:

```bash
# For production
firebase functions:config:get

# For local, check your .env file exists
cat functions/.env
```

## Testing the AI Features

### 1. Test Mentor Recommendations

Navigate to `/create-mentorship` and complete the wizard:
1. Select technologies
2. Choose a mentee
3. Describe the challenge (minimum 20 characters)
4. Click "Find Mentors"

The AI will analyze the requirements and return:
- Top 3 recommended mentors
- AI-generated insights for each mentor
- Additional mentors matching the criteria

### 2. Test AI Chat

Click the "Ask AI CoPilot" button on any page:
- Ask questions like "Find me mentors for React"
- The AI will use tools to search the database
- It provides context-aware responses

Example queries:
- "Show me JavaScript mentors"
- "Who are the Python experts?"
- "Find mentors for AWS and cloud technologies"
- "How many active mentorships are there?"

## Architecture

### AI Service (`functions/src/ai/service.ts`)

The main AI logic that:
- Initializes Claude model
- Handles mentor recommendations with 2-step process:
  1. Query database for matching mentors
  2. Use AI to analyze and rank them
- Manages chat conversations with context

### Tools (`functions/src/ai/tools.ts`)

LangChain tools that the AI can use:
- `search_mentors_by_technology` - Find mentors by skills
- `get_mentor_details` - Get detailed mentor information
- `get_all_mentors` - List all available mentors
- `get_active_mentorships` - Query mentorship statistics
- `get_mentees` - List all mentees
- `get_system_statistics` - Get system overview

### Endpoints (`functions/src/index.ts`)

Two Firebase callable functions:
- `getAIMentorRecommendations` - Returns AI-powered mentor matches
- `mentorshipCopilotChat` - Handles chat interactions

## Cost Considerations

Claude Haiku is very cost-effective:
- Input: ~$0.25 per million tokens
- Output: ~$1.25 per million tokens

Typical costs:
- Mentor recommendation: ~$0.001-0.003 per request
- Chat message: ~$0.0005-0.002 per message

For a small-medium organization, expect $5-20/month in AI costs.

## Troubleshooting

### "ANTHROPIC_API_KEY is not set"

**Problem:** The environment variable is not configured.

**Solution:** Follow Step 2 above to set the key.

### "Failed to get AI mentor recommendations"

**Problem:** The API key might be invalid or expired.

**Solution:** 
1. Verify your API key is correct
2. Check Anthropic console for key status
3. Generate a new key if needed

### Chat not responding

**Problem:** Network issues or function timeout.

**Solution:**
1. Check Firebase Functions logs: `firebase functions:log`
2. Verify the function is deployed
3. Check for rate limiting on Anthropic's side

## Best Practices

1. **Never commit API keys** - Use environment variables
2. **Monitor usage** - Check Anthropic dashboard regularly
3. **Set up rate limiting** - Implement client-side throttling
4. **Handle errors gracefully** - Always have fallback responses
5. **Test locally first** - Use emulator before production

## Security Notes

- API keys should be stored in Firebase Functions config, not in client code
- Functions enforce authentication where appropriate
- Rate limiting should be implemented for production use
- Consider implementing usage quotas per user

## Additional Resources

- [Anthropic Documentation](https://docs.anthropic.com/)
- [LangChain Documentation](https://js.langchain.com/)
- [Firebase Functions Config](https://firebase.google.com/docs/functions/config-env)

