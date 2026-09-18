import test from 'node:test';
import assert from 'node:assert/strict';
import { assessSafety } from '../server/agents/safety-agent.js';

const ocean = (significantHeight) => ({
  wave: { significant_height_m: significantHeight },
});

const weather = (windSpeed, condition) => ({
  wind: { speed: windSpeed },
  weather: { main: condition },
});

test('safety agent returns SAFE for calm, clear conditions', () => {
  const result = assessSafety({
    weather: weather(5, 'Clear'),
    ocean: ocean(1.2),
  });

  assert.equal(result.status, 'SAFE');
  assert.equal(result.recommendations_allowed, true);
  assert.deepEqual(result.measurements, {
    wind_speed_m_s: 5,
    significant_wave_height_m: 1.2,
    weather_condition: 'Clear',
  });
});

test('safety agent returns CAUTION for rain or threshold wind', () => {
  const result = assessSafety({
    weather: weather(10, 'Rain'),
    ocean: ocean(1.2),
  });

  assert.equal(result.status, 'CAUTION');
  assert.equal(result.recommendations_allowed, true);
  assert.match(result.reasons.join(' '), /Wind speed is 10 m\/s/);
  assert.match(result.reasons.join(' '), /Weather condition is Rain/);
});

test('safety agent returns UNSAFE and gates recommendations for storm conditions', () => {
  const result = assessSafety({
    weather: weather(16, 'Thunderstorm'),
    ocean: ocean(3.1),
  });

  assert.equal(result.status, 'UNSAFE');
  assert.equal(result.recommendations_allowed, false);
  assert.match(result.reasons.join(' '), /unsafe threshold/);
  assert.match(result.reasons.join(' '), /Thunderstorm/);
});
