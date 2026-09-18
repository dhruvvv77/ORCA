import test from 'node:test';
import assert from 'node:assert/strict';
import { createRecommendation } from '../server/agents/recommendation-agent.js';

const safeSafety = { status: 'SAFE', recommendations_allowed: true };
const clearWeather = { weather: { main: 'Clear' } };

test('recommendation agent scores existing agent results with the specified weights', () => {
  const result = createRecommendation({
    pfz: {
      zones: [{ id: 'PFZ-MH-001', name: 'Ratnagiri', state: 'Maharashtra', confidence: 0.8 }],
    },
    ocean: {
      observations: [{
        state: 'Maharashtra',
        chlorophyll: { value: 2 },
        sst: { value: 28 },
        wave: { significant_height_m: 1 },
      }],
    },
    weather: clearWeather,
    gis: { candidates: [{ id: 'PFZ-MH-001', distance_km: 100 }] },
    safety: safeSafety,
  });

  assert.equal(result.score, 79.5);
  assert.equal(result.selected_pfz.id, 'PFZ-MH-001');
  assert.deepEqual(
    Object.fromEntries(Object.entries(result.factors).map(([name, value]) => [name, value.score])),
    { pfz: 24, chlorophyll: 12.5, sst: 20, distance: 8, weather: 10, waves: 5 },
  );
  assert.equal(result.safety_status, 'SAFE');
});

test('recommendation agent selects the highest-scoring PFZ deterministically', () => {
  const result = createRecommendation({
    pfz: {
      zones: [
        { id: 'PFZ-A', name: 'A', state: 'Goa', confidence: 0.7 },
        { id: 'PFZ-B', name: 'B', state: 'Kerala', confidence: 0.9 },
      ],
    },
    ocean: {
      observations: [
        { state: 'Goa', chlorophyll: { value: 1 }, sst: { value: 28 }, wave: { significant_height_m: 2 } },
        { state: 'Kerala', chlorophyll: { value: 4 }, sst: { value: 28 }, wave: { significant_height_m: 1 } },
      ],
    },
    weather: clearWeather,
    gis: { candidates: [{ id: 'PFZ-A', distance_km: 50 }, { id: 'PFZ-B', distance_km: 50 }] },
    safety: safeSafety,
  });

  assert.equal(result.selected_pfz.id, 'PFZ-B');
  assert.equal(result.score, 96);
});

test('recommendation agent makes UNSAFE a hard gate', () => {
  const result = createRecommendation({
    pfz: { zones: [{ id: 'PFZ-MH-001', confidence: 1 }] },
    ocean: { observations: [] },
    weather: clearWeather,
    gis: { candidates: [] },
    safety: { status: 'UNSAFE', recommendations_allowed: false },
  });

  assert.equal(result.score, 0);
  assert.equal(result.selected_pfz, null);
  assert.equal(result.safety_status, 'UNSAFE');
  assert.match(result.reasons[0], /No fishing recommendation is permitted/);
});
