import test from 'node:test';
import assert from 'node:assert/strict';
import { agentHandlers, agentTools, haversineDistanceKm } from '../server/agents/gis-agent.js';

test('GIS agent returns Ratnagiri as the nearest Maharashtra PFZ from Mumbai', async () => {
  const result = await agentHandlers.calculate_pfz_distances({
    latitude: 19.076,
    longitude: 72.8777,
    state: 'Maharashtra',
  });

  assert.equal(result.found, true);
  assert.equal(result.count, 1);
  assert.equal(result.nearest_pfz.id, 'PFZ-MH-001');
  assert.equal(result.candidates[0].distance_km, 232.034);
  assert.deepEqual(result.candidates[0].coordinates, { lat: 17, lon: 73.1 });
});

test('GIS agent can order supplied PFZ candidates by distance', async () => {
  const result = await agentHandlers.calculate_pfz_distances({
    latitude: 19.076,
    longitude: 72.8777,
    pfz_candidates: [
      { id: 'far', coordinates: { lat: 15.35, lon: 73.7 } },
      { id: 'near', coordinates: { lat: 17, lon: 73.1 } },
    ],
    sort: 'desc',
  });

  assert.deepEqual(result.candidates.map((candidate) => candidate.id), ['far', 'near']);
  assert.equal(result.nearest_pfz.id, 'near');
});

test('GIS distance tool accepts a missing state filter and searches all PFZ candidates', async () => {
  const result = await agentHandlers.calculate_pfz_distances({
    latitude: 19.076,
    longitude: 72.8777,
    state: null,
  });

  assert.deepEqual(agentTools[0].function.parameters.properties.state.type, ['string', 'null']);
  assert.equal(result.found, true);
  assert.equal(result.count, 8);
  assert.equal(result.nearest_pfz.id, 'PFZ-MH-001');
});

test('Haversine calculation is deterministic', () => {
  assert.equal(
    haversineDistanceKm({ lat: 19.076, lon: 72.8777 }, { lat: 17, lon: 73.1 }).toFixed(3),
    '232.034',
  );
});
