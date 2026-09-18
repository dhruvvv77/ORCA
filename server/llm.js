/**
 * Groq LLM client with function-calling (tool use) loop.
 * ORCA — Marine Intelligence powered by Groq.
 */

import { toolDefinitions, toolHandlers } from './tools.js';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'openai/gpt-oss-120b';
const MAX_TOOL_ITERATIONS = 2;

function getSystemPrompt() {
  const today = new Date().toISOString().split('T')[0];
  return `You are ORCA, a concise marine assistant for Indian fishers. Today is ${today}. Use tool data exactly; never invent measurements. Explain weather, ocean, and PFZ data practically, noting mock data when supplied. Mention PFZ confidence, species, and safety when available; mention maps or charts when data includes them. Use the user's language when possible. Treat selected marine-map context as factual.

For a fishing recommendation (for example, "Where can I fish today near Mumbai?"), call run_orca_fishing_pipeline once, using location (city and state, e.g. Mumbai is in Maharashtra) and date "${today}". Do not separately call PFZ, ocean, GIS, safety, or recommendation tools. Do not use the pipeline for weather-only, PFZ-only, or ocean-only requests.`;
}

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
    max_tokens: 384,
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

function isFishingRecommendationQuery(conversationHistory) {
  const latestUserMessage = [...conversationHistory].reverse().find((message) => message.role === 'user')?.content || '';
  return /\b(fish|fishing|angling)\b/i.test(latestUserMessage)
    && /\b(where|which|recommend|suitable|safe|should|today|near)\b/i.test(latestUserMessage);
}

function toolsForConversation(conversationHistory) {
  if (isFishingRecommendationQuery(conversationHistory)) {
    return toolDefinitions.filter((tool) => tool.function.name === 'run_orca_fishing_pipeline');
  }
  return toolDefinitions.filter((tool) => tool.function.name !== 'run_orca_fishing_pipeline');
}

function compactToolResult(fnName, result) {
  if (fnName === 'run_orca_fishing_pipeline') {
    const recommendation = result.recommendation_result || {};
    const selected = recommendation.selected_pfz;
    const distance = result.gis_result?.candidates?.find((candidate) => candidate.id === selected?.id)?.distance_km
      ?? result.gis_result?.nearest_pfz?.distance_km
      ?? null;
    return {
      date: result.interpreted_request?.date,
      location: result.interpreted_request?.location ? `${result.interpreted_request.location.city}, ${result.interpreted_request.location.state}` : null,
      recommendation: {
        score: recommendation.score,
        zone: selected?.name,
        confidence: selected?.confidence,
        species: selected?.likely_species,
        safety_status: recommendation.safety_status,
        distance_km: distance,
        reasons: recommendation.reasons?.slice(0, 2),
      },
      safety: {
        status: result.safety_result?.status,
        reasons: result.safety_result?.reasons?.slice(0, 2),
      },
    };
  }

  if (fnName === 'get_current_weather') {
    return {
      city: result.city,
      temp_c: result.temperature?.current,
      wind_m_s: result.wind?.speed,
      condition: result.weather?.description || result.weather?.main,
      humidity: result.humidity,
    };
  }

  if (fnName === 'get_forecast') {
    return {
      city: result.city,
      forecast: result.forecast?.slice(0, 3).map((d) => ({
        day: d.day_name,
        temp_c: `${d.temperature?.low}-${d.temperature?.high}`,
        condition: d.weather?.description,
        pop: d.precipitation_chance,
      })),
    };
  }

  if (fnName === 'get_air_quality') {
    return {
      city: result.city,
      aqi: result.aqi?.label,
      pm2_5: result.pollutants?.pm2_5,
      pm10: result.pollutants?.pm10,
    };
  }

  if (fnName === 'get_pfz_zones') {
    return {
      found: result.found,
      count: result.count,
      zones: result.zones?.slice(0, 3).map((zone) => ({
        name: zone.name,
        state: zone.state,
        confidence: zone.confidence,
        species: zone.likely_species,
        conditions: zone.conditions,
      })),
      source: result.source,
    };
  }

  if (fnName === 'get_ocean_data') {
    return {
      found: result.found,
      observations: result.observations?.slice(0, 3).map((observation) => ({
        region: observation.region,
        state: observation.state,
        sst: observation.sst?.value ?? observation.sst,
        chlorophyll: observation.chlorophyll?.value ?? observation.chlorophyll,
        wave_m: observation.wave?.significant_height_m ?? observation.wave,
        current: observation.current?.direction_cardinal ?? observation.current,
      })),
      source: result.source,
    };
  }

  if (fnName === 'calculate_pfz_distances') {
    return {
      nearest: result.nearest_pfz ? { name: result.nearest_pfz.name, distance_km: result.nearest_pfz.distance_km } : null,
      candidates: result.candidates?.slice(0, 3).map((c) => ({ name: c.name, distance_km: c.distance_km })),
    };
  }

  if (fnName === 'assess_marine_safety') {
    return {
      status: result.status,
      reasons: result.reasons?.slice(0, 2),
      recommendations_allowed: result.recommendations_allowed,
    };
  }

  if (fnName === 'get_fishing_recommendation') {
    return {
      score: result.score,
      selected_pfz: result.selected_pfz?.name,
      safety_status: result.safety_status,
      reasons: result.reasons?.slice(0, 2),
    };
  }

  return result;
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
  // Keep last 4 turns (2 user + 2 assistant) to save history tokens
  const rawHistory = conversationHistory.slice(-4);

  // Strip duplicate map context from earlier turns, preserving only the latest user message
  const recentHistory = rawHistory.map((msg, idx) => {
    if (idx < rawHistory.length - 1 && msg.role === 'user' && typeof msg.content === 'string') {
      const cleaned = msg.content.replace(/\n\n\[Selected ORCA marine-map context[^\]]*\]/g, '').trim();
      return { role: msg.role, content: cleaned };
    }
    return msg;
  });

  const availableTools = toolsForConversation(recentHistory);
  const messages = [
    { role: 'system', content: getSystemPrompt() },
    ...recentHistory,
  ];

  let weatherData = null;
  let forecastData = null;
  let airQualityData = null;
  let pfzData = null;
  let oceanData = null;
  let orchestratorData = null;
  let coordinates = null;

  // Tool-calling loop
  for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
    const response = await callGroq(messages, availableTools);
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
        orchestratorData,
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
          if (result.zones?.[0]?.coordinates) {
            coordinates = result.zones[0].coordinates;
          }
        } else if (fnName === 'get_ocean_data') {
          oceanData = result;
          if (result.observations?.[0]?.coordinates) {
            coordinates = result.observations[0].coordinates;
          }
        } else if (fnName === 'run_orca_fishing_pipeline') {
          orchestratorData = result;
          if (result.interpreted_request?.location?.coordinates) {
            coordinates = result.interpreted_request.location.coordinates;
          }
        }

        // Add compact tool result to conversation for LLM
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(compactToolResult(fnName, result)),
        });
      } catch (error) {
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify({ error: error.message }),
        });
      }
    }

    // Tools have executed. Synthesize final answer immediately without re-sending
    // the tool definitions, saving ~1,000+ tokens on every response synthesis.
    const finalResponse = await callGroq(messages);
    const finalContent = finalResponse.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that request.";

    return {
      reply: finalContent,
      weatherData,
      forecastData,
      airQualityData,
      pfzData,
      oceanData,
      orchestratorData,
      coordinates,
    };
  }

  // Fallback
  const finalResponse = await callGroq(messages);
  const finalContent = finalResponse.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that request.";

  return {
    reply: finalContent,
    weatherData,
    forecastData,
    airQualityData,
    pfzData,
    oceanData,
    orchestratorData,
    coordinates,
  };
}
