import test from 'node:test';
import assert from 'node:assert/strict';
import { chat } from '../server/llm.js';
import { registerToolHandlers, toolHandlers } from '../server/tools.js';

function groqResponses(responses, requests) {
  return async (_url, options) => {
    requests.push(JSON.parse(options.body));
    return { ok: true, json: async () => responses.shift() };
  };
}

test('fishing safety requests expose only the fishing pipeline', async () => {
  const originalFetch = global.fetch;
  const originalKey = process.env.GROQ_API_KEY;
  const originalPipeline = toolHandlers.run_orca_fishing_pipeline;
  process.env.GROQ_API_KEY = 'test-key';
  registerToolHandlers({});
  toolHandlers.run_orca_fishing_pipeline = async () => ({});

  const requests = [];
  global.fetch = groqResponses([
    { choices: [{ message: { tool_calls: [{
      id: 'fishing-safety',
      function: { name: 'run_orca_fishing_pipeline', arguments: '{"query":"Is it safe to fish near Mumbai?","location":{"city":"Mumbai","state":"Maharashtra"}}' },
    }] } }] },
    { choices: [{ message: { content: 'Fishing safety result.' } }] },
  ], requests);

  try {
    await chat([{ role: 'user', content: 'Is it safe to fish near Mumbai?' }]);

    assert.deepEqual(requests[0].tools.map((tool) => tool.function.name), ['run_orca_fishing_pipeline']);
    assert.match(requests[0].messages[0].content, /Fishing safety questions use this pipeline/);
  } finally {
    global.fetch = originalFetch;
    toolHandlers.run_orca_fishing_pipeline = originalPipeline;
    if (originalKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = originalKey;
  }
});

test('GIS distance requests safely execute with state null', async () => {
  const originalFetch = global.fetch;
  const originalKey = process.env.GROQ_API_KEY;
  process.env.GROQ_API_KEY = 'test-key';
  registerToolHandlers({});

  const requests = [];
  global.fetch = groqResponses([
    { choices: [{ message: { tool_calls: [{
      id: 'distance-null-state',
      function: { name: 'calculate_pfz_distances', arguments: '{"latitude":19.076,"longitude":72.8777,"state":null}' },
    }] } }] },
    { choices: [{ message: { content: 'Nearest PFZ result.' } }] },
  ], requests);

  try {
    const result = await chat([{ role: 'user', content: 'Which PFZ is closest to Mumbai?' }]);

    assert.deepEqual(requests[0].tools.map((tool) => tool.function.name), ['calculate_pfz_distances']);
    assert.equal(result.reply, 'Nearest PFZ result.');
  } finally {
    global.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = originalKey;
  }
});
