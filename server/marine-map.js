/**
 * Read-only map composition for the ORCA dashboard.
 * It intentionally joins the existing PFZ and ocean mock advisories instead
 * of maintaining a second, divergent client-side data set.
 */
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { agentHandlers as marineAlertsHandlers } from './agents/marine-alerts-agent.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const readData = (name) => readFile(join(__dirname, 'data', name), 'utf8').then(JSON.parse);

function classifyZone(zone, observation) {
  const wind = zone.wind_speed_knots;
  const wave = observation?.wave?.significant_height_m;

  // Risk is derived only from the existing mock telemetry. It is a demo aid,
  // not a live navigation or weather warning.
  if (wind >= 18 || wave >= 2.5) return { level: 'high-risk', label: 'High risk / unsafe', color: '#ef4444' };
  if (zone.confidence >= 0.8 && wind <= 12 && (wave == null || wave <= 1.8)) {
    return { level: 'favourable', label: 'Favourable fishing', color: '#22c55e' };
  }
  return { level: 'caution', label: 'Caution / moderate', color: '#facc15' };
}

function classifyOceanCondition(observation) {
  const wave = observation.wave?.significant_height_m;

  // These display categories are deterministic demo visualization only.
  if (!Number.isFinite(wave)) return { level: 'unavailable', label: 'Data unavailable', color: '#38bdf8' };
  if (wave >= 2.5) return { level: 'danger', label: 'High waves', color: '#ef4444' };
  if (wave >= 1.5) return { level: 'caution', label: 'Moderate waves', color: '#facc15' };
  return { level: 'favourable', label: 'Calm conditions', color: '#22c55e' };
}

export async function getMarineMapData() {
  const [pfz, ocean, gis] = await Promise.all([
    readData('mock-pfz.json'),
    readData('mock-ocean.json'),
    readData('mock-gis.json'),
  ]);

  const zones = pfz.zones.map((zone) => {
    const observation = ocean.observations.find((item) => item.state === zone.state);
    return {
      ...zone,
      ocean: observation ? {
        wave: observation.wave,
        current: observation.current,
        salinity_psu: observation.salinity_psu,
      } : null,
      risk: classifyZone(zone, observation),
    };
  });
  const marine_alerts = ocean.observations.flatMap((observation) => {
    const zone = pfz.zones.find((item) => item.state === observation.state);
    const { alerts } = marineAlertsHandlers.get_marine_alerts({
      wave_height_m: observation.wave?.significant_height_m,
      advisory: zone?.advisory,
      affected_zone: observation.region,
      timestamp: observation.timestamp,
    });

    return alerts.map((alert) => ({
      ...alert,
      coordinates: observation.coordinates,
      is_demo: /mock/i.test(ocean.source),
    }));
  });

  return {
    source: pfz.source,
    last_updated: pfz.last_updated,
    zones,
    ocean_conditions: ocean.observations.map((observation) => ({
      region: observation.region,
      state: observation.state,
      coordinates: observation.coordinates,
      sst: observation.sst,
      chlorophyll: observation.chlorophyll,
      wave: observation.wave,
      current: observation.current,
      timestamp: observation.timestamp,
      source: ocean.source,
      condition: classifyOceanCondition(observation),
    })),
    marine_alerts,
    gis: { type: gis.type, features: gis.features },
  };
}
