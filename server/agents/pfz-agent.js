/**
 * ORCA — Potential Fishing Zone (PFZ) Agent
 * Returns mock PFZ advisory data for Indian coastal regions.
 * Simulates INCOIS-style PFZ advisories.
 */

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, '..', 'data', 'mock-pfz.json');

let pfzCache = null;

async function loadPFZData() {
  if (!pfzCache) {
    const raw = await readFile(DATA_PATH, 'utf-8');
    pfzCache = JSON.parse(raw);
  }
  return pfzCache;
}

export const agentName = 'pfz';
export const agentDescription = 'Provides Potential Fishing Zone (PFZ) advisories for Indian coastal regions based on satellite-derived ocean data.';

export const agentTools = [
  {
    type: 'function',
    function: {
      name: 'get_pfz_zones',
      description: 'Get Potential Fishing Zone (PFZ) advisories for Indian coastal regions.',
      parameters: {
        type: 'object',
        properties: {
          state: { type: 'string', description: 'Indian coastal state (e.g. Maharashtra, Kerala, Tamil Nadu).' },
          min_confidence: { type: 'number', description: 'Min confidence score (0-1).' },
        },
        required: [],
      },
    },
  },
];

export const agentHandlers = {
  get_pfz_zones: async ({ state, min_confidence = 0 }) => {
    const data = await loadPFZData();
    let zones = data.zones;

    // Filter by state if provided
    if (state) {
      const stateNorm = state.toLowerCase().trim();
      zones = zones.filter(
        (z) => z.state.toLowerCase().includes(stateNorm)
      );
    }

    // Filter by minimum confidence
    if (min_confidence > 0) {
      zones = zones.filter((z) => z.confidence >= min_confidence);
    }

    if (zones.length === 0) {
      return {
        found: false,
        message: `No PFZ zones found${state ? ` for ${state}` : ''} with confidence ≥ ${min_confidence}.`,
        source: 'ORCA Mock Data (simulated INCOIS PFZ advisory)',
      };
    }

    return {
      found: true,
      count: zones.length,
      zones: zones.map((z) => ({
        id: z.id,
        name: z.name,
        state: z.state,
        coordinates: z.coordinates,
        bounds: z.bounds,
        depth_range_m: z.depth_range_m,
        confidence: z.confidence,
        confidence_label: z.confidence >= 0.8 ? 'High' : z.confidence >= 0.6 ? 'Moderate' : 'Low',
        advisory: z.advisory,
        likely_species: z.likely_species,
        conditions: {
          sst_celsius: z.sst_celsius,
          chlorophyll_mg_m3: z.chlorophyll_mg_m3,
          wind_speed_knots: z.wind_speed_knots,
        },
        valid_from: z.valid_from,
        valid_until: z.valid_until,
      })),
      source: 'ORCA Mock Data (simulated INCOIS PFZ advisory)',
      last_updated: data.last_updated,
    };
  },
};
