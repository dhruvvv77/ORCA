import test from 'node:test';
import assert from 'node:assert/strict';
import { getMarineMapData } from '../server/marine-map.js';

test('marine map exposes deterministic mock ocean conditions for the Ocean Conditions layer', async () => {
  const data = await getMarineMapData();
  const tamilNadu = data.ocean_conditions.find((item) => item.state === 'Tamil Nadu');
  const goa = data.ocean_conditions.find((item) => item.state === 'Goa');

  assert.equal(data.ocean_conditions.length, 8);
  assert.deepEqual(tamilNadu.sst, { value: 29.5, unit: '°C', trend: 'rising', anomaly: 0.8 });
  assert.deepEqual(tamilNadu.chlorophyll, { value: 1.5, unit: 'mg/m³', level: 'low', bloom: false });
  assert.equal(tamilNadu.condition.level, 'favourable');
  assert.equal(goa.condition.level, 'danger');
  assert.match(tamilNadu.source, /Mock data/i);
});

test('marine map exposes existing deterministic Marine Alerts output with affected zones', async () => {
  const data = await getMarineMapData();
  const goaAlert = data.marine_alerts.find((alert) => alert.affected_zone === 'Goa Coast');

  assert.ok(data.marine_alerts.length > 0);
  assert.equal(goaAlert.severity, 'WARNING');
  assert.equal(goaAlert.coordinates.lat, 15.35);
  assert.match(goaAlert.source, /deterministic marine alerts/i);
  assert.equal(goaAlert.timestamp, '2026-09-15T06:00:00Z');
  assert.equal(goaAlert.is_demo, true);
});
