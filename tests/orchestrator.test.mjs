import test from 'node:test';
import assert from 'node:assert/strict';
import { createOrchestrator } from '../server/orchestrator.js';

test('orchestrator passes structured results through the ORCA fishing pipeline', async () => {
  const calls = [];
  const orchestrate = createOrchestrator({
    getPFZ: async ({ state }) => {
      calls.push(`pfz:${state}`);
      return { zones: [{ id: 'PFZ-MH-001', state: 'Maharashtra' }] };
    },
    getOcean: async ({ state }) => {
      calls.push(`ocean:${state}`);
      return { observations: [{ state: 'Maharashtra', wave: { significant_height_m: 1 } }] };
    },
    getWeather: async (city, countryCode) => {
      calls.push(`weather:${city}:${countryCode}`);
      return { coordinates: { lat: 19.076, lon: 72.8777 }, weather: { main: 'Clear' } };
    },
    getGIS: async (input) => {
      calls.push('gis');
      assert.deepEqual(input, {
        latitude: 19.076,
        longitude: 72.8777,
        pfz_candidates: [{ id: 'PFZ-MH-001', state: 'Maharashtra' }],
        sort: 'asc',
      });
      return { candidates: [{ id: 'PFZ-MH-001', distance_km: 232.034 }], nearest_pfz: { id: 'PFZ-MH-001' } };
    },
    getSafety: async (input) => {
      calls.push('safety');
      assert.equal(input.weather.weather.main, 'Clear');
      assert.equal(input.ocean.observations[0].state, 'Maharashtra');
      return { status: 'SAFE', recommendations_allowed: true };
    },
    getRecommendation: async (input) => {
      calls.push('recommendation');
      assert.equal(input.gis.nearest_pfz.id, 'PFZ-MH-001');
      assert.equal(input.safety.status, 'SAFE');
      return {
        score: 80,
        selected_pfz: { id: 'PFZ-MH-001' },
        factors: { pfz: { score: 24 } },
        reasons: ['Safe conditions.'],
        safety_status: 'SAFE',
      };
    },
    getMap: async () => ({ zones: [{ id: 'PFZ-MH-001' }] }),
  });

  const result = await orchestrate({
    query: 'Where can I fish today near Mumbai?',
    intent: 'fishing_recommendation',
    location: { city: 'Mumbai', state: 'Maharashtra', country_code: 'IN' },
  });

  assert.deepEqual(calls, [
    'pfz:Maharashtra',
    'ocean:Maharashtra',
    'weather:Mumbai:IN',
    'gis',
    'safety',
    'recommendation',
  ]);
  assert.deepEqual(result.agents_executed, ['pfz', 'ocean', 'weather', 'gis', 'safety', 'recommendation']);
  assert.equal(result.interpreted_request.location.coordinates.lat, 19.076);
  assert.equal(result.recommendation_result.selected_pfz.id, 'PFZ-MH-001');
  assert.equal(result.map_data.marine_map.zones[0].id, 'PFZ-MH-001');
});
