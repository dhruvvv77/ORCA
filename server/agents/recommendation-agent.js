/**
 * ORCA — Recommendation Agent
 * Scores PFZ candidates from existing agent results only. No LLM or external
 * data is used for scoring.
 */

const WEIGHTS = {
  pfz: 30,
  chlorophyll: 25,
  sst: 20,
  distance: 10,
  weather: 10,
  waves: 5,
};

const STORM_PATTERN = /thunderstorm|storm|tornado|hurricane|cyclone|squall/i;
const RAIN_PATTERN = /rain|drizzle|shower/i;

function numberOrNull(value) {
  return Number.isFinite(value) ? value : null;
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function roundScore(value) {
  return Number(value.toFixed(2));
}

function zonesFrom(pfz) {
  if (Array.isArray(pfz?.zones)) return pfz.zones;
  return pfz?.id ? [pfz] : [];
}

function observationsFrom(ocean) {
  if (Array.isArray(ocean?.observations)) return ocean.observations;
  return ocean ? [ocean] : [];
}

function matchingObservation(ocean, pfz) {
  const observations = observationsFrom(ocean);
  const state = typeof pfz?.state === 'string' ? pfz.state.toLowerCase() : null;

  if (state) {
    const stateMatch = observations.find(
      (observation) => observation?.state?.toLowerCase() === state,
    );
    if (stateMatch) return stateMatch;
  }

  return observations.length === 1 ? observations[0] : null;
}

function matchingDistance(gis, pfz) {
  const candidates = Array.isArray(gis?.candidates) ? gis.candidates : [];
  const candidate = candidates.find((item) => item?.id === pfz?.id);

  if (candidate) return numberOrNull(candidate.distance_km);
  if (gis?.nearest_pfz?.id === pfz?.id) return numberOrNull(gis.nearest_pfz.distance_km);
  return null;
}

function factor(weightPercent, value, normalizedScore, valueKey) {
  return {
    weight_percent: weightPercent,
    [valueKey]: value,
    score: roundScore(weightPercent * normalizedScore),
  };
}

function pfzFactor(pfz) {
  const confidence = numberOrNull(pfz?.confidence);
  return factor(WEIGHTS.pfz, confidence, confidence === null ? 0 : clamp(confidence, 0, 1), 'confidence');
}

function chlorophyllFactor(observation) {
  const chlorophyll = numberOrNull(observation?.chlorophyll?.value);
  // 4 mg/m³ or above receives the full allocation; lower values scale linearly.
  return factor(
    WEIGHTS.chlorophyll,
    chlorophyll,
    chlorophyll === null ? 0 : clamp(chlorophyll / 4, 0, 1),
    'mg_m3',
  );
}

function sstFactor(observation) {
  const sst = numberOrNull(observation?.sst?.value);
  let normalized = 0;

  // The full SST allocation is for 26–30 °C. It tapers linearly to zero at
  // 24 °C and 32 °C, so the score is deterministic outside the target band.
  if (sst !== null) {
    if (sst >= 26 && sst <= 30) normalized = 1;
    else if (sst >= 24 && sst < 26) normalized = (sst - 24) / 2;
    else if (sst > 30 && sst <= 32) normalized = (32 - sst) / 2;
  }

  return factor(WEIGHTS.sst, sst, clamp(normalized, 0, 1), 'celsius');
}

function distanceFactor(distanceKm) {
  // The distance allocation decreases linearly to zero at 500 km.
  const normalized = distanceKm === null ? 0 : clamp(1 - (distanceKm / 500), 0, 1);
  return factor(WEIGHTS.distance, distanceKm, normalized, 'km');
}

function weatherFactor(weather) {
  const condition = weather?.weather?.main ?? weather?.weather?.description;
  const value = typeof condition === 'string' ? condition : null;
  const normalized = value === null
    ? 0
    : STORM_PATTERN.test(value)
      ? 0
      : RAIN_PATTERN.test(value)
        ? 0.5
        : 1;

  return factor(WEIGHTS.weather, value, normalized, 'condition');
}

function waveFactor(observation) {
  const height = numberOrNull(observation?.wave?.significant_height_m);
  const normalized = height === null ? 0 : height <= 1.5 ? 1 : height <= 2.5 ? 0.5 : 0;
  return factor(WEIGHTS.waves, height, normalized, 'significant_height_m');
}

function reasonsFor(factors, safetyStatus) {
  const reasons = [
    `Safety status is ${safetyStatus}.`,
  ];

  for (const [name, details] of Object.entries(factors)) {
    if (Object.values(details).includes(null)) {
      reasons.push(`${name} data is unavailable and contributes 0 points.`);
    } else {
      reasons.push(`${name} contributes ${details.score}/${details.weight_percent} points.`);
    }
  }

  return reasons;
}

function emptyResult(safetyStatus, reason) {
  return {
    score: 0,
    selected_pfz: null,
    factors: {},
    reasons: [reason],
    safety_status: safetyStatus,
  };
}

function scoreCandidate(pfz, { ocean, weather, gis, safetyStatus }) {
  const observation = matchingObservation(ocean, pfz);
  const factors = {
    pfz: pfzFactor(pfz),
    chlorophyll: chlorophyllFactor(observation),
    sst: sstFactor(observation),
    distance: distanceFactor(matchingDistance(gis, pfz)),
    weather: weatherFactor(weather),
    waves: waveFactor(observation),
  };

  return {
    score: roundScore(Object.values(factors).reduce((total, item) => total + item.score, 0)),
    selected_pfz: {
      id: pfz.id,
      name: pfz.name ?? null,
      state: pfz.state ?? null,
      coordinates: pfz.coordinates ?? null,
    },
    factors,
    reasons: reasonsFor(factors, safetyStatus),
    safety_status: safetyStatus,
  };
}

/**
 * Return the highest-scoring PFZ from supplied ORCA agent results.
 */
export function createRecommendation({ pfz, ocean, weather, gis, safety } = {}) {
  const safetyStatus = safety?.status ?? null;

  // This must remain before all scoring: UNSAFE conditions never yield a PFZ.
  if (safetyStatus === 'UNSAFE' || safety?.recommendations_allowed === false) {
    return emptyResult('UNSAFE', 'Safety status is UNSAFE. No fishing recommendation is permitted.');
  }

  if (safetyStatus !== 'SAFE' && safetyStatus !== 'CAUTION') {
    return emptyResult(safetyStatus, 'Safety status is unavailable. No fishing recommendation is permitted.');
  }

  const zones = zonesFrom(pfz);
  if (zones.length === 0) {
    return emptyResult(safetyStatus, 'No PFZ candidates are available for recommendation.');
  }

  const scored = zones.map((zone) => scoreCandidate(zone, { ocean, weather, gis, safetyStatus }));
  return scored.reduce((best, candidate) => candidate.score > best.score ? candidate : best);
}

export const agentName = 'recommendation';
export const agentDescription = 'Produces deterministic PFZ recommendations by combining existing PFZ, ocean, weather, GIS, and safety results.';

export const agentTools = [
  {
    type: 'function',
    function: {
      name: 'get_fishing_recommendation',
      description:
        'Deterministically score existing PFZ, ocean, weather, GIS, and safety results. PFZ confidence is 30%, chlorophyll 25%, SST 20%, distance 10%, weather 10%, and waves 5%. UNSAFE safety results prohibit recommendations.',
      parameters: {
        type: 'object',
        properties: {
          pfz: { type: 'object', description: 'Existing get_pfz_zones result, or one PFZ zone.' },
          ocean: { type: 'object', description: 'Existing get_ocean_data result, or one ocean observation.' },
          weather: { type: 'object', description: 'Existing get_current_weather result.' },
          gis: { type: 'object', description: 'Existing calculate_pfz_distances result.' },
          safety: { type: 'object', description: 'Existing assess_marine_safety result.' },
        },
        required: ['pfz', 'ocean', 'weather', 'gis', 'safety'],
      },
    },
  },
];

export const agentHandlers = {
  get_fishing_recommendation: createRecommendation,
};
