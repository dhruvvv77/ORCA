import test from 'node:test';
import assert from 'node:assert/strict';
import { agentHandlers } from '../server/agents/ocean-agent.js';

test('ocean agent maps Chennai to the existing Tamil Nadu observation', async () => {
  const result = await agentHandlers.get_ocean_data({ state: 'Chennai' });

  assert.equal(result.found, true);
  assert.equal(result.count, 1);
  assert.equal(result.observations[0].state, 'Tamil Nadu');
  assert.equal(result.observations[0].sst.value, 29.5);
  assert.equal(result.observations[0].timestamp.slice(0, 10), '2026-09-15');
});

test('ocean agent returns the existing Tamil Nadu SST for Chennai', async () => {
  const result = await agentHandlers.get_ocean_data({ state: 'Chennai', parameter: 'sst' });

  assert.equal(result.found, true);
  assert.equal(result.parameter, 'sst');
  assert.deepEqual(result.observations[0].sst, {
    value: 29.5,
    unit: '°C',
    trend: 'rising',
    anomaly: 0.8,
  });
  assert.equal(result.observations[0].wave, undefined);
});
