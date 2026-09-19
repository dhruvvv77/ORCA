import test from 'node:test';
import assert from 'node:assert/strict';
import { getMarineAlerts } from '../server/agents/marine-alerts-agent.js';

const baseInput = {
  wind_speed_m_s: 4,
  wave_height_m: 0.8,
  condition: 'Clear',
  advisory: 'Routine observation.',
  affected_zone: 'Tamil Nadu Coast',
  timestamp: '2026-09-18T06:00:00Z',
};

test('marine alerts agent returns INFO when supplied telemetry is normal', () => {
  const result = getMarineAlerts(baseInput);

  assert.deepEqual(result.alerts, [{
    severity: 'INFO',
    title: 'No alert thresholds met',
    message: 'Supplied marine telemetry is below configured alert thresholds.',
    source: 'ORCA deterministic marine alerts using supplied telemetry',
    timestamp: '2026-09-18T06:00:00Z',
    affected_zone: 'Tamil Nadu Coast',
  }]);
});

test('marine alerts agent returns deterministic warning alerts for strong wind and high waves', () => {
  const result = getMarineAlerts({ ...baseInput, wind_speed_m_s: 13, wave_height_m: 2.7 });

  assert.deepEqual(result.alerts.map((alert) => alert.severity), ['WARNING', 'WARNING']);
  assert.match(result.alerts[0].message, /13 m\/s/);
  assert.match(result.alerts[1].message, /2.7 m/);
});

test('marine alerts agent reports missing telemetry without inferring safe conditions', () => {
  const result = getMarineAlerts({ affected_zone: 'Goa Coast' });

  assert.equal(result.alerts.length, 1);
  assert.equal(result.alerts[0].severity, 'INFO');
  assert.equal(result.alerts[0].title, 'Incomplete marine telemetry');
  assert.match(result.alerts[0].message, /wind, wave, weather condition, advisory/);
  assert.equal(result.alerts[0].timestamp, null);
  assert.equal(result.alerts[0].affected_zone, 'Goa Coast');
});
