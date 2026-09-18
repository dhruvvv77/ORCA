/**
 * ORCA — GIS Agent
 * Calculates distances from a user location to PFZ coordinates locally.
 * This module deliberately performs no LLM or external geospatial requests.
 */

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PFZ_DATA_PATH = join(__dirname, '..', 'data', 'mock-pfz.json');
const EARTH_RADIUS_KM = 6371;

let pfzCache = null;

async function loadPFZData() {
  if (!pfzCache) {
    pfzCache = JSON.parse(await readFile(PFZ_DATA_PATH, 'utf8'));
  }
  return pfzCache;
}

function isLatitude(value) {
  return Number.isFinite(value) && value >= -90 && value <= 90;
}

function isLongitude(value) {
  return Number.isFinite(value) && value >= -180 && value <= 180;
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Return the great-circle distance between two WGS84 positions in kilometres.
 */
export function haversineDistanceKm(from, to) {
  const latitudeDelta = toRadians(to.lat - from.lat);
  const longitudeDelta = toRadians(to.lon - from.lon);
  const fromLatitude = toRadians(from.lat);
  const toLatitude = toRadians(to.lat);

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function candidateCoordinates(candidate) {
  const coordinates = candidate?.coordinates ?? candidate;
  const lat = coordinates?.lat ?? coordinates?.latitude;
  const lon = coordinates?.lon ?? coordinates?.longitude;

  return { lat, lon };
}

function normalizeCandidate(candidate, index) {
  const { lat, lon } = candidateCoordinates(candidate);

  if (!isLatitude(lat) || !isLongitude(lon)) {
    return null;
  }

  return {
    id: candidate.id ?? `PFZ-${index + 1}`,
    name: candidate.name ?? `PFZ candidate ${index + 1}`,
    state: candidate.state ?? null,
    coordinates: { lat, lon },
  };
}

function inputError(message) {
  return {
    found: false,
    error: { code: 'INVALID_INPUT', message },
    candidates: [],
    nearest_pfz: null,
  };
}

export const agentName = 'gis';
export const agentDescription = 'Calculates deterministic Haversine distances from a user location to Potential Fishing Zone (PFZ) coordinates.';

export const agentTools = [
  {
    type: 'function',
    function: {
      name: 'calculate_pfz_distances',
      description: 'Calculate great-circle distances from user coordinates to ORCA PFZ candidates.',
      parameters: {
        type: 'object',
        properties: {
          latitude: { type: 'number', description: 'User latitude (-90 to 90).' },
          longitude: { type: 'number', description: 'User longitude (-180 to 180).' },
          state: { type: 'string', description: 'Optional state filter.' },
          sort: { type: 'string', enum: ['asc', 'desc'], description: 'Sort order.' },
        },
        required: ['latitude', 'longitude'],
      },
    },
  },
];

export const agentHandlers = {
  calculate_pfz_distances: async ({ latitude, longitude, pfz_candidates, state, sort = 'asc' } = {}) => {
    if (!isLatitude(latitude) || !isLongitude(longitude)) {
      return inputError('latitude must be between -90 and 90 and longitude must be between -180 and 180.');
    }

    if (!['asc', 'desc', 'none'].includes(sort)) {
      return inputError('sort must be one of: asc, desc, none.');
    }

    let rawCandidates = pfz_candidates;
    let source = 'Provided PFZ candidates';

    if (rawCandidates === undefined) {
      const pfzData = await loadPFZData();
      rawCandidates = pfzData.zones;
      source = pfzData.source;

      if (state) {
        const normalizedState = state.toLowerCase().trim();
        rawCandidates = rawCandidates.filter(
          (candidate) => candidate.state.toLowerCase().includes(normalizedState),
        );
      }
    }

    if (!Array.isArray(rawCandidates)) {
      return inputError('pfz_candidates must be an array when supplied.');
    }

    const invalidCount = rawCandidates.length - rawCandidates.filter((candidate) => normalizeCandidate(candidate, 0)).length;
    if (invalidCount > 0) {
      return inputError('Each PFZ candidate must contain valid latitude and longitude coordinates.');
    }

    const userCoordinates = { lat: latitude, lon: longitude };
    const candidates = rawCandidates.map((candidate, index) => {
      const normalized = normalizeCandidate(candidate, index);
      return {
        ...normalized,
        distance_km: Number(haversineDistanceKm(userCoordinates, normalized.coordinates).toFixed(3)),
      };
    });

    if (sort === 'asc') candidates.sort((a, b) => a.distance_km - b.distance_km);
    if (sort === 'desc') candidates.sort((a, b) => b.distance_km - a.distance_km);

    const nearest_pfz = candidates.length
      ? candidates.reduce((nearest, candidate) =>
        candidate.distance_km < nearest.distance_km ? candidate : nearest,
      )
      : null;

    return {
      found: candidates.length > 0,
      user_coordinates: userCoordinates,
      count: candidates.length,
      sorted_by: sort === 'none' ? null : `distance_km_${sort}`,
      candidates,
      nearest_pfz,
      source,
    };
  },
};
