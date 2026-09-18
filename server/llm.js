/**
 * Groq LLM client with function-calling (tool use) loop.
 * ORCA — Marine Intelligence powered by Groq.
 */

import { toolDefinitions, toolHandlers } from './tools.js';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'openai/gpt-oss-120b';
const MAX_TOOL_ITERATIONS = 3;

const SYSTEM_PROMPT = `You are ORCA, a marine ecosystem intelligence assistant built for Indian fishers and coastal communities. Your capabilities:

- You provide weather information, ocean conditions, and Potential Fishing Zone (PFZ) advisories
- You understand queries about fishing, marine conditions, SST, chlorophyll, wave height, and ocean currents
- You use relevant emojis naturally (🐟 🌊 ⛅ 🎣 🗺️ 🌡️ etc.)
- You keep answers concise but informative — 2-4 sentences for simple queries, more for detailed analysis
- For fishing queries, combine PFZ data with weather conditions to give practical advice
- For weather queries, provide clear conversational information including what to wear and travel advisories
- For ocean data, explain SST, chlorophyll, and wave conditions in practical terms fishers can understand
- IMPORTANT: When you have data from your tools, always base your answer on the ACTUAL data provided. Never fabricate SST, chlorophyll, coordinates, wave heights, or any measurements.
- When PFZ data is returned, always mention the confidence level, likely species, and safety conditions
- If data includes coordinates, mention that a map is available for reference
- When presenting forecast data, mention that a chart is available for visualization
- Clearly note when data is from mock/simulated sources
- When a user message includes a bracketed "Selected ORCA marine-map context", treat it as the currently selected dashboard PFZ. Use its supplied values for zone/species/distance questions; do not invent missing values.
- You respond in the same language as the user's query when possible`;

function getApiKey() {
  const key = process.env.GROQ_API_KEY;
  if (!key || key === 'your_groq_api_key_here') {
    throw new Error('GROQ_API_KEY not configured');
  }
  return key;
}

/**
 * Send a chat completion request to Groq.
 */
async function callGroq(messages, tools = null) {
  const apiKey = getApiKey();

  const body = {
    model: MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 1024,
  };

  if (tools && tools.length > 0) {
    body.tools = tools;
    body.tool_choice = 'auto';
  }

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Groq API error:', err);
    throw new Error(err.error?.message || `Groq API error: ${res.status}`);
  }

  return res.json();
}

/**
 * Execute a tool call by name with the given arguments.
 */
async function executeTool(toolCall) {
  const fnName = toolCall.function.name;
  const args = JSON.parse(toolCall.function.arguments);
  const handler = toolHandlers[fnName];

  if (!handler) {
    throw new Error(`Unknown tool: ${fnName}`);
  }

  console.log(`  ↳ Calling tool: ${fnName}(${JSON.stringify(args)})`);
  const result = await handler(args);
  return { result, fnName, args };
}

/**
 * Main chat function with tool-calling loop.
 *
 * @param {Array} conversationHistory - Array of {role, content} messages
 * @returns {{ reply: string, weatherData: object|null, forecastData: object|null, coordinates: object|null }}
 */
export async function chat(conversationHistory) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory,
  ];

  let weatherData = null;
  let forecastData = null;
  let airQualityData = null;
  let pfzData = null;
  let oceanData = null;
  let coordinates = null;

  // Tool-calling loop
  for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
    const response = await callGroq(messages, toolDefinitions);
    const choice = response.choices?.[0];

    if (!choice) {
      throw new Error('No response from Groq');
    }

    const assistantMessage = choice.message;

    // If no tool calls, we have our final answer
    if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
      return {
        reply: assistantMessage.content,
        weatherData,
        forecastData,
        airQualityData,
        pfzData,
        oceanData,
        coordinates,
      };
    }

    // Add the assistant's tool-call message to history
    messages.push(assistantMessage);

    // Execute each tool call
    for (const toolCall of assistantMessage.tool_calls) {
      try {
        const { result, fnName } = await executeTool(toolCall);

        // Track data for frontend rendering
        if (fnName === 'get_current_weather') {
          weatherData = result;
          coordinates = result.coordinates;
        } else if (fnName === 'get_forecast') {
          forecastData = result;
          coordinates = result.coordinates;
        } else if (fnName === 'get_air_quality') {
          airQualityData = result;
          coordinates = result.coordinates;
        } else if (fnName === 'get_pfz_zones') {
          pfzData = result;
          // Use first zone's coordinates for map if available
          if (result.zones?.[0]?.coordinates) {
            coordinates = result.zones[0].coordinates;
          }
        } else if (fnName === 'get_ocean_data') {
          oceanData = result;
          if (result.observations?.[0]?.coordinates) {
            coordinates = result.observations[0].coordinates;
          }
        }

        // Add tool result to conversation
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      } catch (error) {
        // Send error back to LLM so it can inform the user gracefully
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify({ error: error.message }),
        });
      }
    }
  }

  // If we exhausted iterations, make one final call without tools
  const finalResponse = await callGroq(messages);
  const finalContent = finalResponse.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that request.";

  return {
    reply: finalContent,
    weatherData,
    forecastData,
    airQualityData,
    pfzData,
    oceanData,
    coordinates,
  };
}
