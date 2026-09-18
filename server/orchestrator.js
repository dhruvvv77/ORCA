/**
 * ORCA orchestration pipeline for an already interpreted fishing request.
 * Language and intent interpretation stay outside this module; all scoring and
 * safety decisions remain in their existing deterministic agents.
 */

import { agentHandlers as pfzHandlers } from './agents/pfz-agent.js';
import { agentHandlers as oceanHandlers } from './agents/ocean-agent.js';
import { agentHandlers as gisHandlers } from './agents/gis-agent.js';
import { agentHandlers as safetyHandlers } from './agents/safety-agent.js';
import { agentHandlers as recommendationHandlers } from './agents/recommendation-agent.js';
import { fetchCurrentWeather } from './weather.js';
import { getMarineMapData } from './marine-map.js';

const defaultAgents = {
  getPFZ: pfzHandlers.get_pfz_zones,
  getOcean: oceanHandlers.get_ocean_data,
  getWeather: fetchCurrentWeather,
  getGIS: gisHandlers.calculate_pfz_distances,
  getSafety: safetyHandlers.assess_marine_safety,
  getRecommendation: recommendationHandlers.get_fishing_recommendation,
  getMap: getMarineMapData,
};

function coordinatePair(location, weatherResult) {
  const latitude = location?.latitude ?? location?.coordinates?.lat ?? weatherResult?.coordinates?.lat;
  const longitude = location?.longitude ?? location?.coordinates?.lon ?? weatherResult?.coordinates?.lon;

  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? { lat: latitude, lon: longitude }
    : null;
}

function normalizedRequest(request, coordinates) {
  const location = request?.location ?? {};

  return {
    query: request?.query ?? null,
    intent: request?.intent ?? null,
    date: request?.date ?? null,
    location: {
      city: location.city ?? null,
      state: location.state ?? null,
      country_code: location.country_code ?? null,
      coordinates,
    },
  };
}

/**
 * Create an orchestrator. Dependency injection keeps the pipeline testable
 * without network requests while production uses the existing agent handlers.
 */
export function createOrchestrator(agents = defaultAgents) {
  return async function orchestrate(request = {}) {
    const location = request.location ?? {};
    const state = location.state;

    // PFZ → Ocean → Weather → GIS → Safety → Recommendation
    const pfzResult = await agents.getPFZ({ state });
    const oceanResult = await agents.getOcean({ state });
    const weatherResult = await agents.getWeather(location.city, location.country_code);
    const coordinates = coordinatePair(location, weatherResult);
    const gisResult = await agents.getGIS({
      latitude: coordinates?.lat,
      longitude: coordinates?.lon,
      pfz_candidates: pfzResult.zones ?? [],
      sort: 'asc',
    });
    const safetyResult = await agents.getSafety({
      weather: weatherResult,
      ocean: oceanResult,
    });
    const recommendationResult = await agents.getRecommendation({
      pfz: pfzResult,
      ocean: oceanResult,
      weather: weatherResult,
      gis: gisResult,
      safety: safetyResult,
    });
    const marineMap = await agents.getMap();

    return {
      interpreted_request: normalizedRequest(request, coordinates),
      agents_executed: ['pfz', 'ocean', 'weather', 'gis', 'safety', 'recommendation'],
      pfz_result: pfzResult,
      ocean_result: oceanResult,
      weather_result: weatherResult,
      gis_result: gisResult,
      safety_result: safetyResult,
      recommendation_result: recommendationResult,
      explanation_data: {
        nearest_pfz: gisResult.nearest_pfz ?? null,
        safety_status: safetyResult.status ?? null,
        recommendation_score: recommendationResult.score,
        recommendation_reasons: recommendationResult.reasons ?? [],
        scoring_factors: recommendationResult.factors ?? {},
      },
      map_data: {
        user_location: coordinates,
        pfz_candidates: gisResult.candidates ?? [],
        selected_pfz: recommendationResult.selected_pfz ?? null,
        marine_map: marineMap,
      },
    };
  };
}

export const orchestrateFishingRequest = createOrchestrator();

/**
 * LLM-facing entry point. The model supplies the already interpreted location
 * and date from the current conversation; this handler runs the deterministic
 * ORCA pipeline only.
 */
export const orchestratorTools = [
  {
    type: 'function',
    function: {
      name: 'run_orca_fishing_pipeline',
      description:
        'Run the complete deterministic ORCA fishing recommendation pipeline: PFZ, ocean, weather, GIS distance, safety, and recommendation. Use only for requests asking where or whether to fish, or for fishing-trip recommendations. Resolve city, state, country, and date from the current conversation when available.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'The fishing recommendation request in English.' },
          date: { type: 'string', description: 'Requested date from the conversation, if stated (for example, today).' },
          location: {
            type: 'object',
            properties: {
              city: { type: 'string' },
              state: { type: 'string', description: 'Indian coastal state for PFZ and ocean lookup. Mumbai is in Maharashtra.' },
              country_code: { type: 'string', description: 'ISO country code, for example IN.' },
              latitude: { type: 'number' },
              longitude: { type: 'number' },
            },
            required: ['city', 'state'],
          },
        },
        required: ['query', 'location'],
      },
    },
  },
];

export const orchestratorHandlers = {
  run_orca_fishing_pipeline: orchestrateFishingRequest,
};
