/**
 * ORCA — Safety Agent
 * Evaluates supplied weather and ocean measurements with deterministic rules.
 * It does not fetch data, call an LLM, or infer missing measurements.
 */

const CAUTION_WIND_M_S = 10;
const UNSAFE_WIND_M_S = 15;
const CAUTION_WAVE_M = 2;
const UNSAFE_WAVE_M = 3;

const STORM_PATTERN = /thunderstorm|storm|tornado|hurricane|cyclone|squall/i;
const RAIN_PATTERN = /rain|drizzle|shower/i;

function numberOrNull(value) {
  return Number.isFinite(value) ? value : null;
}

function firstObservation(ocean) {
  return Array.isArray(ocean?.observations) ? ocean.observations[0] : ocean;
}

function extractMeasurements(weather, ocean) {
  const observation = firstObservation(ocean);
  const weatherCondition = weather?.weather?.main ?? weather?.weather?.description ?? null;

  return {
    wind_speed_m_s: numberOrNull(weather?.wind?.speed),
    significant_wave_height_m: numberOrNull(observation?.wave?.significant_height_m),
    weather_condition: typeof weatherCondition === 'string' ? weatherCondition : null,
  };
}

/**
 * Deterministically evaluate whether supplied marine conditions are safe.
 */
export function assessSafety({ weather, ocean } = {}) {
  const measurements = extractMeasurements(weather, ocean);
  const unsafeReasons = [];
  const cautionReasons = [];

  if (measurements.wind_speed_m_s === null) {
    cautionReasons.push('Wind speed is unavailable.');
  } else if (measurements.wind_speed_m_s >= UNSAFE_WIND_M_S) {
    unsafeReasons.push(`Wind speed is ${measurements.wind_speed_m_s} m/s (unsafe threshold: ${UNSAFE_WIND_M_S} m/s).`);
  } else if (measurements.wind_speed_m_s >= CAUTION_WIND_M_S) {
    cautionReasons.push(`Wind speed is ${measurements.wind_speed_m_s} m/s (caution threshold: ${CAUTION_WIND_M_S} m/s).`);
  }

  if (measurements.significant_wave_height_m === null) {
    cautionReasons.push('Significant wave height is unavailable.');
  } else if (measurements.significant_wave_height_m >= UNSAFE_WAVE_M) {
    unsafeReasons.push(`Significant wave height is ${measurements.significant_wave_height_m} m (unsafe threshold: ${UNSAFE_WAVE_M} m).`);
  } else if (measurements.significant_wave_height_m >= CAUTION_WAVE_M) {
    cautionReasons.push(`Significant wave height is ${measurements.significant_wave_height_m} m (caution threshold: ${CAUTION_WAVE_M} m).`);
  }

  if (measurements.weather_condition === null) {
    cautionReasons.push('Weather condition is unavailable.');
  } else if (STORM_PATTERN.test(measurements.weather_condition)) {
    unsafeReasons.push(`Weather condition is ${measurements.weather_condition}.`);
  } else if (RAIN_PATTERN.test(measurements.weather_condition)) {
    cautionReasons.push(`Weather condition is ${measurements.weather_condition}.`);
  }

  const status = unsafeReasons.length > 0
    ? 'UNSAFE'
    : cautionReasons.length > 0
      ? 'CAUTION'
      : 'SAFE';

  return {
    status,
    reasons: status === 'SAFE' ? ['Available wind, wave, and weather conditions are below caution thresholds.'] : [...unsafeReasons, ...cautionReasons],
    measurements,
    source: 'ORCA deterministic safety assessment using supplied weather and ocean data',
    // Consumers must treat false as a hard gate: do not produce recommendations.
    recommendations_allowed: status !== 'UNSAFE',
  };
}

export const agentName = 'safety';
export const agentDescription = 'Evaluates weather and ocean measurements with deterministic safety rules for wind, waves, rain, and storms.';

export const agentTools = [
  {
    type: 'function',
    function: {
      name: 'assess_marine_safety',
      description:
        'Assess marine safety from existing weather and ocean tool data. Returns SAFE, CAUTION, or UNSAFE. An UNSAFE result is a hard gate: do not make fishing or voyage recommendations.',
      parameters: {
        type: 'object',
        properties: {
          weather: {
            type: 'object',
            description: 'Existing get_current_weather result containing wind.speed and weather.main or weather.description.',
          },
          ocean: {
            type: 'object',
            description: 'Existing get_ocean_data observation containing wave.significant_height_m, or its response containing observations.',
          },
        },
        required: [],
      },
    },
  },
];

export const agentHandlers = {
  assess_marine_safety: assessSafety,
};
