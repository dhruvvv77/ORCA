/**
 * ORCA — Ocean Data Agent
 * Returns mock SST, chlorophyll-a, wave height, and other ocean parameters
 * for Indian coastal regions.
 */

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, '..', 'data', 'mock-ocean.json');

let oceanCache = null;

async function loadOceanData() {
  if (!oceanCache) {
    const raw = await readFile(DATA_PATH, 'utf-8');
    oceanCache = JSON.parse(raw);
  }
  return oceanCache;
}

export const agentName = 'ocean';
export const agentDescription = 'Provides ocean observation data including Sea Surface Temperature (SST), Chlorophyll-a concentration, wave height, and ocean currents for Indian coastal waters.';

export const agentTools = [
  {
    type: 'function',
    function: {
      name: 'get_ocean_data',
      description:
        'Get ocean observation data for an Indian coastal region. Returns Sea Surface Temperature (SST), chlorophyll-a, wave height, currents, salinity, and dissolved oxygen. Filter by state or parameter.',
      parameters: {
        type: 'object',
        properties: {
          state: {
            type: 'string',
            description:
              'Indian coastal state, e.g. "Kerala", "Gujarat", "Tamil Nadu". Leave empty for all regions.',
          },
          parameter: {
            type: 'string',
            enum: ['sst', 'chlorophyll', 'wave', 'current', 'all'],
            description:
              'Specific ocean parameter to retrieve. Use "all" for complete data. Defaults to "all".',
          },
        },
        required: [],
      },
    },
  },
];

export const agentHandlers = {
  get_ocean_data: async ({ state, parameter = 'all' }) => {
    const data = await loadOceanData();
    let observations = data.observations;

    // Filter by state
    if (state) {
      const stateNorm = state.toLowerCase().trim();
      observations = observations.filter(
        (o) => o.state.toLowerCase().includes(stateNorm) ||
               o.region.toLowerCase().includes(stateNorm)
      );
    }

    if (observations.length === 0) {
      return {
        found: false,
        message: `No ocean data found${state ? ` for ${state}` : ''}.`,
        source: 'ORCA Mock Data (simulated INCOIS/ISRO ocean observations)',
      };
    }

    // Filter by parameter if not "all"
    const results = observations.map((o) => {
      const base = {
        region: o.region,
        state: o.state,
        coordinates: o.coordinates,
        timestamp: o.timestamp,
      };

      if (parameter === 'all' || parameter === 'sst') base.sst = o.sst;
      if (parameter === 'all' || parameter === 'chlorophyll') base.chlorophyll = o.chlorophyll;
      if (parameter === 'all' || parameter === 'wave') base.wave = o.wave;
      if (parameter === 'all' || parameter === 'current') base.current = o.current;
      if (parameter === 'all') {
        base.salinity_psu = o.salinity_psu;
        base.dissolved_oxygen_ml_l = o.dissolved_oxygen_ml_l;
      }

      return base;
    });

    return {
      found: true,
      count: results.length,
      parameter: parameter,
      observations: results,
      source: 'ORCA Mock Data (simulated INCOIS/ISRO ocean observations)',
      last_updated: data.last_updated,
    };
  },
};
