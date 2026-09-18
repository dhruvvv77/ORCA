import test from 'node:test';
import assert from 'node:assert/strict';
import { chat } from '../server/llm.js';
import { registerToolHandlers } from '../server/tools.js';

function completion(message) {
  return { ok: true, json: async () => ({ choices: [{ message }] }) };
}

test('chat preserves individual tools and exposes the ORCA pipeline result for fishing recommendations', async () => {
  const originalFetch = global.fetch;
  const originalKey = process.env.GROQ_API_KEY;
  const originalWeatherKey = process.env.OWM_API_KEY;
  process.env.GROQ_API_KEY = 'test-key';
  process.env.OWM_API_KEY = 'test-key';

  registerToolHandlers({
    get_current_weather: async () => ({
      city: 'Mumbai',
      coordinates: { lat: 19.076, lon: 72.8777 },
      wind: { speed: 4 },
      weather: { main: 'Clear' },
    }),
  });

  const responses = [
    { tool_calls: [{ id: 'weather-1', function: { name: 'get_current_weather', arguments: '{"city":"Mumbai","country_code":"IN"}' } }] },
    { content: 'Weather response' },
    { tool_calls: [{ id: 'pfz-1', function: { name: 'get_pfz_zones', arguments: '{"state":"Maharashtra"}' } }] },
    { content: 'PFZ response' },
    { tool_calls: [{ id: 'ocean-1', function: { name: 'get_ocean_data', arguments: '{"state":"Maharashtra"}' } }] },
    { content: 'Ocean response' },
    {
      tool_calls: [{
        id: 'pipeline-1',
        function: {
          name: 'run_orca_fishing_pipeline',
          arguments: '{"query":"Where can I fish today near Mumbai?","date":"today","location":{"city":"Mumbai","state":"Maharashtra","country_code":"IN"}}',
        },
      }],
    },
    { content: 'Fishing recommendation response' },
  ];

  global.fetch = async (url) => {
    if (url.includes('api.groq.com')) return completion(responses.shift());

    return {
      ok: true,
      json: async () => ({
        name: 'Mumbai',
        coord: { lat: 19.076, lon: 72.8777 },
        main: { temp: 28, feels_like: 29, temp_min: 27, temp_max: 29, humidity: 70, pressure: 1010 },
        wind: { speed: 4, deg: 250 },
        weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
        sys: { country: 'IN' },
        dt: 0,
      }),
    };
  };

  try {
    const weatherOnly = await chat([{ role: 'user', content: 'Weather in Mumbai?' }]);
    const pfzOnly = await chat([{ role: 'user', content: 'Show Maharashtra PFZ zones.' }]);
    const oceanOnly = await chat([{ role: 'user', content: 'Show Maharashtra ocean conditions.' }]);
    const fishing = await chat([{ role: 'user', content: 'Where can I fish today near Mumbai?' }]);

    assert.equal(weatherOnly.weatherData.city, 'Mumbai');
    assert.equal(weatherOnly.orchestratorData, null);
    assert.equal(pfzOnly.pfzData.zones[0].state, 'Maharashtra');
    assert.equal(pfzOnly.orchestratorData, null);
    assert.equal(oceanOnly.oceanData.observations[0].state, 'Maharashtra');
    assert.equal(oceanOnly.orchestratorData, null);
    assert.equal(fishing.orchestratorData.interpreted_request.location.city, 'Mumbai');
    assert.equal(fishing.orchestratorData.recommendation_result.safety_status, 'CAUTION');
    assert.equal(fishing.orchestratorData.recommendation_result.selected_pfz.id, 'PFZ-MH-001');
  } finally {
    global.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = originalKey;
    if (originalWeatherKey === undefined) delete process.env.OWM_API_KEY;
    else process.env.OWM_API_KEY = originalWeatherKey;
  }
});
