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

export const COASTAL_CITY_TO_STATE = {
  // Tamil Nadu
  chennai: 'Tamil Nadu',
  madras: 'Tamil Nadu',
  tuticorin: 'Tamil Nadu',
  thoothukudi: 'Tamil Nadu',
  rameswaram: 'Tamil Nadu',
  cuddalore: 'Tamil Nadu',
  kanyakumari: 'Tamil Nadu',
  nagapattinam: 'Tamil Nadu',
  ennore: 'Tamil Nadu',

  // Maharashtra
  mumbai: 'Maharashtra',
  bombay: 'Maharashtra',
  ratnagiri: 'Maharashtra',
  alibag: 'Maharashtra',
  malvan: 'Maharashtra',
  sindhudurg: 'Maharashtra',
  palghar: 'Maharashtra',
  raigad: 'Maharashtra',
  dahanu: 'Maharashtra',
  jnpt: 'Maharashtra',

  // Kerala
  kochi: 'Kerala',
  cochin: 'Kerala',
  trivandrum: 'Kerala',
  thiruvananthapuram: 'Kerala',
  calicut: 'Kerala',
  kozhikode: 'Kerala',
  kollam: 'Kerala',
  quilon: 'Kerala',
  alappuzha: 'Kerala',
  alleppey: 'Kerala',
  kannur: 'Kerala',
  vizhinjam: 'Kerala',

  // Goa
  panaji: 'Goa',
  panjim: 'Goa',
  vasco: 'Goa',
  mormugao: 'Goa',
  margao: 'Goa',

  // Karnataka
  mangalore: 'Karnataka',
  mangaluru: 'Karnataka',
  karwar: 'Karnataka',
  udupi: 'Karnataka',
  malpe: 'Karnataka',

  // Gujarat
  porbandar: 'Gujarat',
  veraval: 'Gujarat',
  okha: 'Gujarat',
  surat: 'Gujarat',
  kandla: 'Gujarat',
  bhavnagar: 'Gujarat',
  mandvi: 'Gujarat',
  dwarka: 'Gujarat',
  mundra: 'Gujarat',
  jafrabad: 'Gujarat',

  // Andhra Pradesh
  visakhapatnam: 'Andhra Pradesh',
  vizag: 'Andhra Pradesh',
  kakinada: 'Andhra Pradesh',
  machilipatnam: 'Andhra Pradesh',
  krishnapatnam: 'Andhra Pradesh',
  bhavanapadu: 'Andhra Pradesh',

  // Odisha
  puri: 'Odisha',
  paradip: 'Odisha',
  paradeep: 'Odisha',
  gopalpur: 'Odisha',
  dhamra: 'Odisha',
  chandipur: 'Odisha',

  // West Bengal
  kolkata: 'West Bengal',
  calcutta: 'West Bengal',
  haldia: 'West Bengal',
  digha: 'West Bengal',
};

export function resolveCoastalState(input) {
  if (!input || typeof input !== 'string') return '';
  const clean = input.toLowerCase().trim();
  if (COASTAL_CITY_TO_STATE[clean]) {
    return COASTAL_CITY_TO_STATE[clean];
  }
  for (const [city, state] of Object.entries(COASTAL_CITY_TO_STATE)) {
    if (clean.includes(city)) {
      return state;
    }
  }
  return input.trim();
}

export const agentTools = [
  {
    type: 'function',
    function: {
      name: 'get_ocean_data',
      description: 'Get ocean observation data (SST, chlorophyll, wave height, currents) for Indian coastal regions or cities (e.g. Chennai, Tamil Nadu, Mumbai, Maharashtra).',
      parameters: {
        type: 'object',
        properties: {
          state: { type: 'string', description: 'Indian coastal state or city (e.g. Tamil Nadu, Chennai, Maharashtra, Mumbai).' },
          parameter: { type: 'string', enum: ['sst', 'chlorophyll', 'wave', 'current', 'all'] },
        },
        required: [],
      },
    },
  },
];

export const agentHandlers = {
  get_ocean_data: async ({ state, location, city, region, parameter = 'all' } = {}) => {
    const data = await loadOceanData();
    let observations = data.observations;

    const rawLocation = (state || location || city || region || '').trim();

    // Filter by state or coastal city
    if (rawLocation) {
      const resolvedState = resolveCoastalState(rawLocation);
      const searchTerms = [
        rawLocation.toLowerCase(),
        resolvedState.toLowerCase(),
      ].filter(Boolean);

      observations = observations.filter((o) => {
        const obsState = (o.state || '').toLowerCase();
        const obsRegion = (o.region || '').toLowerCase();
        return searchTerms.some((term) => obsState.includes(term) || obsRegion.includes(term));
      });
    }

    if (observations.length === 0) {
      return {
        found: false,
        message: `No ocean data found${rawLocation ? ` for ${rawLocation}` : ''}.`,
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
