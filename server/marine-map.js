/**
 * Read-only map composition for the ORCA dashboard.
 * It intentionally joins the existing PFZ and ocean mock advisories instead
 * of maintaining a second, divergent client-side data set.
 */
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

  return {
    source: pfz.source,
    last_updated: pfz.last_updated,
    zones,
    gis: { type: gis.type, features: gis.features },
  };
}
