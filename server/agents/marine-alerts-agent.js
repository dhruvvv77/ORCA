/**
 * ORCA — Marine Alerts Agent
 * Produces deterministic alerts from telemetry supplied by existing agents.
 * It never fetches data or treats missing measurements as safe conditions.
 */

const SOURCE = 'ORCA deterministic marine alerts using supplied telemetry';
const STORM_PATTERN = /thunderstorm|storm|tornado|hurricane|cyclone|squall/i;
const RAIN_PATTERN = /rain|drizzle|shower/i;
const DANGER_ADVISORY_PATTERN = /avoid|danger|warning|unsafe|gale|cyclone|storm/i;
const CAUTION_ADVISORY_PATTERN = /caution|watch|rough|swell|monsoon/i;

function finiteOrNull(value) {
  return Number.isFinite(value) ? value : null;
}

function stringOrNull(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function telemetryFrom(input = {}) {
  const weather = input.weather ?? {};
  const ocean = Array.isArray(input.ocean?.observations) ? input.ocean.observations[0] : (input.ocean ?? {});
  const advisory = input.advisory;

  return {
    wind: finiteOrNull(input.wind?.speed ?? input.wind_speed_m_s ?? weather.wind?.speed),
    waves: finiteOrNull(input.waves?.significant_height_m ?? input.wave_height_m ?? ocean.wave?.significant_height_m),
    condition: stringOrNull(input.condition ?? weather.weather?.main ?? weather.weather?.description),
    rain: input.rain === true,
    storm: input.storm === true,
    advisory: stringOrNull(typeof advisory === 'string' ? advisory : advisory?.message ?? advisory?.description),
    affectedZone: stringOrNull(input.affected_zone ?? input.zone ?? ocean.region ?? ocean.state ?? weather.city),
    timestamp: stringOrNull(input.timestamp ?? ocean.timestamp ?? weather.timestamp),
  };
}

function createAlert(severity, title, message, telemetry) {
  return {
    severity,
    title,
    message,
    source: SOURCE,
    timestamp: telemetry.timestamp,
    affected_zone: telemetry.affectedZone,
  };
}

/**
 * Return zero or more factual marine alerts. Thresholds are deliberately kept
 * local so an alert's severity is stable for the same supplied telemetry.
 */
export function getMarineAlerts(input = {}) {
  const telemetry = telemetryFrom(input);
  const alerts = [];

  if (telemetry.storm || STORM_PATTERN.test(telemetry.condition || '') || DANGER_ADVISORY_PATTERN.test(telemetry.advisory || '')) {
    alerts.push(createAlert('DANGER', 'Severe marine conditions', 'Storm or severe advisory data was reported. Avoid marine operations.', telemetry));
  }

  if (telemetry.wind !== null) {
    if (telemetry.wind >= 15) {
      alerts.push(createAlert('DANGER', 'Dangerous wind', `Wind speed is ${telemetry.wind} m/s (danger threshold: 15 m/s).`, telemetry));
    } else if (telemetry.wind >= 12) {
      alerts.push(createAlert('WARNING', 'Strong wind', `Wind speed is ${telemetry.wind} m/s (warning threshold: 12 m/s).`, telemetry));
    } else if (telemetry.wind >= 8) {
      alerts.push(createAlert('CAUTION', 'Elevated wind', `Wind speed is ${telemetry.wind} m/s (caution threshold: 8 m/s).`, telemetry));
    }
  }

  if (telemetry.waves !== null) {
    if (telemetry.waves >= 3) {
      alerts.push(createAlert('DANGER', 'Dangerous waves', `Significant wave height is ${telemetry.waves} m (danger threshold: 3 m).`, telemetry));
    } else if (telemetry.waves >= 2.5) {
      alerts.push(createAlert('WARNING', 'High waves', `Significant wave height is ${telemetry.waves} m (warning threshold: 2.5 m).`, telemetry));
    } else if (telemetry.waves >= 1.5) {
      alerts.push(createAlert('CAUTION', 'Elevated waves', `Significant wave height is ${telemetry.waves} m (caution threshold: 1.5 m).`, telemetry));
    }
  }

  if (telemetry.rain || RAIN_PATTERN.test(telemetry.condition || '')) {
    alerts.push(createAlert('CAUTION', 'Rain reported', 'Rain conditions may reduce visibility and deck safety.', telemetry));
  }

  if (CAUTION_ADVISORY_PATTERN.test(telemetry.advisory || '')) {
    alerts.push(createAlert('CAUTION', 'Marine advisory', telemetry.advisory, telemetry));
  }

  const missing = [
    telemetry.wind === null && 'wind',
    telemetry.waves === null && 'wave',
    telemetry.condition === null && !telemetry.rain && !telemetry.storm && 'weather condition',
    telemetry.advisory === null && 'advisory',
  ].filter(Boolean);

  if (missing.length > 0) {
    alerts.push(createAlert('INFO', 'Incomplete marine telemetry', `No ${missing.join(', ')} data was supplied.`, telemetry));
  } else if (alerts.length === 0) {
    alerts.push(createAlert('INFO', 'No alert thresholds met', 'Supplied marine telemetry is below configured alert thresholds.', telemetry));
  }

  return { alerts };
}

export const agentName = 'marine-alerts';
export const agentDescription = 'Produces deterministic marine safety and advisory alerts from supplied wind, wave, weather, and advisory telemetry.';

export const agentTools = [
  {
    type: 'function',
    function: {
      name: 'get_marine_alerts',
      description: 'Get deterministic marine alerts from supplied wind, wave, rain, storm, and advisory data.',
      parameters: {
        type: 'object',
        properties: {
          wind: { type: 'object', description: 'Wind telemetry with speed in m/s.' },
          waves: { type: 'object', description: 'Wave telemetry with significant_height_m.' },
          wind_speed_m_s: { type: 'number' },
          wave_height_m: { type: 'number' },
          condition: { type: 'string' },
          rain: { type: 'boolean' },
          storm: { type: 'boolean' },
          advisory: { type: 'string' },
          affected_zone: { type: 'string' },
          timestamp: { type: 'string' },
        },
      },
    },
  },
];

export const agentHandlers = {
  get_marine_alerts: getMarineAlerts,
};
