/**
 * Groq LLM client with function-calling (tool use) loop.
 * ORCA — Marine Intelligence powered by Groq.
 */

import { toolDefinitions, toolHandlers } from './tools.js';
import { translateText } from './translate.js';
import { COASTAL_CITY_TO_STATE, resolveCoastalState } from './agents/ocean-agent.js';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'openai/gpt-oss-120b';
const MAX_TOOL_ITERATIONS = 2;

function getCurrentRouteInstruction(intent) {
  const instructions = {
    weather_only: 'For this request, the only available tool is get_current_weather.',
    pfz_only: 'For this request, the only available tool is get_pfz_zones.',
    ocean_only: 'For this request, the only available tool is get_ocean_data.',
    marine_alerts: 'For this request, the only available tool is get_marine_alerts.',
    pfz_distance: 'For this request, the only available tool is calculate_pfz_distances. Omit state unless a string state filter is known.',
    fishing_recommendation: 'For this request, the only available tool is run_orca_fishing_pipeline. Fishing safety questions use this pipeline, not get_marine_alerts.',
  };
  return instructions[intent] || 'Only call tools included in the current request.';
}

function getSystemPrompt(intent) {
  const today = new Date().toISOString().split('T')[0];
  return `You are ORCA, a concise marine assistant for Indian fishers. Today is ${today}. Use tool data exactly; never invent measurements. Explain weather, ocean, and PFZ data practically. Mention maps or charts when data includes them. Use the user's language when possible. Treat selected marine-map context as factual.

Strict Routing Rules:
- Before answering a classified weather, PFZ, ocean, marine alert, or fishing recommendation query, make the matching tool call. Do not answer from general knowledge when that tool is available.
- Weather queries (e.g. "weather in Mumbai") -> call get_current_weather. NEVER use run_orca_fishing_pipeline.
- PFZ queries (e.g. "Show PFZ zones in Maharashtra") -> call get_pfz_zones. NEVER use run_orca_fishing_pipeline.
- Ocean queries (e.g. "What are ocean conditions near Chennai?") -> call get_ocean_data. NEVER use run_orca_fishing_pipeline.
- Marine safety, warning, or alert queries (e.g. "Any marine alerts near Mumbai?") -> call get_marine_alerts.
- Nearest or closest PFZ queries (e.g. "Which PFZ is closest to Mumbai?") -> call calculate_pfz_distances.
- Fishing recommendation queries (e.g. "Where can I fish today near Mumbai?") -> call run_orca_fishing_pipeline with location (city and state) and date "${today}".

${getCurrentRouteInstruction(intent)}`;
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
async function callGroq(messages, tools = null, toolChoice = 'auto') {
  const apiKey = getApiKey();

  const body = {
    model: MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 384,
  };

  if (tools && tools.length > 0) {
    body.tools = tools;
    body.tool_choice = toolChoice;
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

export function extractUserQuery(rawContent) {
  if (!rawContent || typeof rawContent !== 'string') return '';
  return rawContent.split('\n\n[Selected ORCA marine-map context')[0].trim();
}

export function classifyQueryIntent(text) {
  const clean = extractUserQuery(text).toLowerCase();

  // 1. Fishing recommendation intent: asks where/whether to fish
  const hasFishWord = /\b(fish|fishing|angling|machli|machhli|pakadna|pakadne)\b|मछली|पकड़/i.test(clean);
  const hasRecommendationIntent = /\b(where|which|recommend|recommendation|suitable|should|can i|trip|best place|best spot|good to|kahan|kahaan|jagah|jgh|aas pas|as pas)\b|कहाँ|जगह/i.test(clean);

  if (hasFishWord && hasRecommendationIntent) {
    return 'fishing_recommendation';
  }

  // 2. GIS: nearest-PFZ questions require distances, not a PFZ listing.
  const isPFZWord = /\b(pfz|potential fishing zone|fishing zone|fishing zones|zones)\b/i.test(clean);
  const isDistanceQuestion = /\b(closest|nearest|distance|how far)\b/i.test(clean);
  if (isPFZWord && isDistanceQuestion) {
    return 'pfz_distance';
  }

  // 3. Marine alerts: safety warnings take priority over PFZ/ocean terminology.
  const isMarineAlertWord = /\b(marine alert|marine alerts|marine safety|safety alert|safety alerts|warning|warnings|danger|dangerous)\b/i.test(clean);
  if (isMarineAlertWord && !hasFishWord) {
    return 'marine_alerts';
  }

  // 4. Weather-only: asks about weather, forecast, rain, temp, aqi without asking where to fish
  const isWeatherWord = /\b(weather|forecast|rain|raining|temp|temperature|climate|wind|humidity|aqi|air quality|mausam)\b|मौसम/i.test(clean);
  if (isWeatherWord && !hasFishWord) {
    return 'weather_only';
  }

  // 5. PFZ-only: asks specifically about PFZ / fishing zones
  if (isPFZWord && !hasRecommendationIntent) {
    return 'pfz_only';
  }

  // 6. Ocean-only: asks about ocean conditions, wave, SST, chlorophyll, currents
  const isOceanWord = /\b(ocean|sea|marine condition|wave|waves|sst|chlorophyll|current|currents|swell|water temp|salinity)\b/i.test(clean);
  if (isOceanWord && !hasFishWord && !isPFZWord) {
    return 'ocean_only';
  }

  if (hasFishWord) {
    return 'fishing_recommendation';
  }

  return 'general';
}

export function toolsForConversation(conversationHistory) {
  const latestUserMessage = [...conversationHistory].reverse().find((m) => m.role === 'user')?.content || '';
  const intent = classifyQueryIntent(latestUserMessage);

  switch (intent) {
    case 'weather_only':
      return toolDefinitions.filter((t) => t.function.name === 'get_current_weather');
    case 'pfz_only':
      return toolDefinitions.filter((t) => t.function.name === 'get_pfz_zones');
    case 'ocean_only':
      return toolDefinitions.filter((t) => t.function.name === 'get_ocean_data');
    case 'marine_alerts':
      return toolDefinitions.filter((t) => t.function.name === 'get_marine_alerts');
    case 'pfz_distance':
      return toolDefinitions.filter((t) => t.function.name === 'calculate_pfz_distances');
    case 'fishing_recommendation':
      return toolDefinitions.filter((t) => t.function.name === 'run_orca_fishing_pipeline');
    default:
      return toolDefinitions.filter((t) =>
        ['get_current_weather', 'get_forecast', 'get_air_quality', 'get_pfz_zones', 'get_ocean_data'].includes(t.function.name)
      );
  }
}

function locationFromQuery(query) {
  const clean = extractUserQuery(query);
  const match = clean.match(/\b(?:in|near|at|around|for)\s+([^?!,.]+)/i);
  if (match?.[1]) {
    return match[1].replace(/\b(?:today|tomorrow|please)\b/gi, '').trim();
  }

  const normalized = clean.toLowerCase();
  return Object.keys(COASTAL_CITY_TO_STATE).find((city) => normalized.includes(city)) || null;
}

function fallbackToolCall(intent, query) {
  const location = locationFromQuery(query);
  const id = `route-${intent}`;

  if (intent === 'weather_only' && location) {
    return {
      id,
      type: 'function',
      function: {
        name: 'get_current_weather',
        arguments: JSON.stringify({ city: location, country_code: 'IN' }),
      },
    };
  }

  if (intent === 'pfz_only' && location) {
    return {
      id,
      type: 'function',
      function: {
        name: 'get_pfz_zones',
        arguments: JSON.stringify({ state: location }),
      },
    };
  }

  if (intent === 'ocean_only' && location) {
    return {
      id,
      type: 'function',
      function: {
        name: 'get_ocean_data',
        arguments: JSON.stringify({ state: location, parameter: 'all' }),
      },
    };
  }

  if (intent === 'marine_alerts') {
    return {
      id,
      type: 'function',
      function: {
        name: 'get_marine_alerts',
        arguments: JSON.stringify(location ? { affected_zone: location } : {}),
      },
    };
  }

  if (intent === 'fishing_recommendation' && location) {
    return {
      id,
      type: 'function',
      function: {
        name: 'run_orca_fishing_pipeline',
        arguments: JSON.stringify({
          query: extractUserQuery(query),
          date: new Date().toISOString().split('T')[0],
          location: {
            city: location,
            state: resolveCoastalState(location),
            country_code: 'IN',
          },
        }),
      },
    };
  }

  return null;
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
      message: result.message,
      observations: result.observations?.slice(0, 3).map((observation) => ({
        region: observation.region,
        state: observation.state,
        sst: observation.sst?.value ?? observation.sst,
        chlorophyll: observation.chlorophyll?.value ?? observation.chlorophyll,
        wave_m: observation.wave?.significant_height_m ?? observation.wave,
        current: observation.current?.speed_knots != null
          ? `${observation.current.speed_knots}kt ${observation.current.direction || ''}`.trim()
          : (observation.current?.direction_cardinal ?? observation.current),
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
async function executeTool(toolCall, queryIntent) {
  const fnName = toolCall.function.name;
  const args = JSON.parse(toolCall.function.arguments);
  const handler = toolHandlers[fnName];

  if (!handler) {
    throw new Error(`Unknown tool: ${fnName}`);
  }

  if (fnName === 'run_orca_fishing_pipeline' && queryIntent && queryIntent !== 'fishing_recommendation') {
    throw new Error('run_orca_fishing_pipeline cannot be used for weather-only, PFZ-only, or ocean-only queries.');
  }

  console.log(`  ↳ Calling tool: ${fnName}(${JSON.stringify(args)})`);
  const result = await handler(args);
  return { result, fnName, args };
}

async function synthesizeToolReply(messages, availableTools, queryIntent) {
  messages.push({
    role: 'system',
    content: 'The required tool data is already available. Respond with the final answer in plain text, using that data. Do not call a tool unless essential data is still missing.',
  });

  // Keep tool_choice automatic for every Groq request. If the model still asks
  // for more data, execute that valid call and give it one more chance to reply.
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await callGroq(messages, availableTools);
    const assistantMessage = response.choices?.[0]?.message;

    if (!assistantMessage) {
      throw new Error('No response from Groq');
    }

    if (!assistantMessage.tool_calls?.length) {
      return assistantMessage.content || "I'm sorry, I couldn't process that request.";
    }

    messages.push(assistantMessage);
    for (const toolCall of assistantMessage.tool_calls) {
      try {
        const { result, fnName } = await executeTool(toolCall, queryIntent);
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
  }

  return "I'm sorry, I couldn't process that request.";
}

/**
 * Main chat function with tool-calling loop.
 *
 * @param {Array} conversationHistory - Array of {role, content} messages
 * @returns {{ reply: string, weatherData: object|null, forecastData: object|null, coordinates: object|null }}
 */
export async function chat(conversationHistory, inputLanguage = 'en') {
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

  const latestUserMessage = [...recentHistory].reverse().find((m) => m.role === 'user')?.content || '';
  const availableTools = toolsForConversation(recentHistory);
  const queryIntent = classifyQueryIntent(latestUserMessage);
  const messages = [
    { role: 'system', content: getSystemPrompt(queryIntent) },
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

    let assistantMessage = choice.message;

    // Groq is allowed to choose tools automatically, but a classified request
    // must still be grounded in its route's data source when it skips a call.
    if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
      const routedToolCall = fallbackToolCall(queryIntent, latestUserMessage);
      if (!routedToolCall) {
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

      console.warn(`  ↳ Groq skipped tool use; routing to ${routedToolCall.function.name}`);
      assistantMessage = {
        role: 'assistant',
        content: null,
        tool_calls: [routedToolCall],
      };
    }

    // Add the assistant's tool-call message to history
    messages.push(assistantMessage);

    // Execute each tool call
    for (const toolCall of assistantMessage.tool_calls) {
      try {
        const { result, fnName } = await executeTool(toolCall, queryIntent);

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

    const finalContent = await synthesizeToolReply(messages, availableTools, queryIntent);

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
