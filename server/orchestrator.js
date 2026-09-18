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

const defaultAgents = {
  getPFZ: pfzHandlers.get_pfz_zones,
  getOcean: oceanHandlers.get_ocean_data,
  getWeather: fetchCurrentWeather,
  getGIS: gisHandlers.calculate_pfz_distances,
  getSafety: safetyHandlers.assess_marine_safety,
  getRecommendation: recommendationHandlers.get_fishing_recommendation,
};

function compactPFZCandidates(zones = []) {
  return zones.map((zone) => ({
    id: zone.id,
    name: zone.name,
    state: zone.state,
    coordinates: zone.coordinates,
    confidence: zone.confidence,
  }));
}

function compactOceanObservations(observations = []) {
  return observations.map((observation) => ({
    state: observation.state,
    sst: observation.sst,
    chlorophyll: observation.chlorophyll,
    wave: observation.wave,
  }));
}

function compactWeatherForDecision(weather) {
  return {
    coordinates: weather?.coordinates,
    wind: { speed: weather?.wind?.speed },
    weather: {
      main: weather?.weather?.main,
      description: weather?.weather?.description,
    },
  };
}

function coordinatePair(location, weatherResult) {
  const latitude = location?.latitude ?? location?.coordinates?.lat ?? weatherResult?.coordinates?.lat;
  const longitude = location?.longitude ?? location?.coordinates?.lon ?? weatherResult?.coordinates?.lon;

  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? { lat: latitude, lon: longitude }
    : null;
}

function normalizedRequest(request, coordinates) {
  const location = request?.location ?? {};
  const today = new Date().toISOString().split('T')[0];
  let date = request?.date ?? null;
  if (!date || date.toLowerCase() === 'today' || date === '2024-09-18' || date.startsWith('2024-')) {
    date = today;
  }

  return {
    query: request?.query ?? null,
    intent: request?.intent ?? null,
    date,
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
    const pfzCandidates = compactPFZCandidates(pfzResult.zones);
    const oceanForDecision = { observations: compactOceanObservations(oceanResult.observations) };
    const weatherForDecision = compactWeatherForDecision(weatherResult);
    const gisResult = await agents.getGIS({
      latitude: coordinates?.lat,
      longitude: coordinates?.lon,
      pfz_candidates: pfzCandidates,
      sort: 'asc',
    });
    const safetyResult = await agents.getSafety({
      weather: weatherForDecision,
      ocean: oceanForDecision,
    });
    const recommendationResult = await agents.getRecommendation({
      pfz: { zones: pfzCandidates },
      ocean: oceanForDecision,
      weather: weatherForDecision,
      gis: gisResult,
      safety: safetyResult,
    });

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
      description: 'Run ORCA deterministic fishing pipeline (PFZ, ocean, weather, GIS, safety). Use for fishing trip/location queries.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Query in English.' },
          date: { type: 'string', description: 'Date (YYYY-MM-DD or today).' },
          location: {
            type: 'object',
            properties: {
              city: { type: 'string', description: 'City name (e.g. Mumbai).' },
              state: { type: 'string', description: 'Coastal state (e.g. Maharashtra).' },
              country_code: { type: 'string', description: 'Country code (default IN).' },
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
