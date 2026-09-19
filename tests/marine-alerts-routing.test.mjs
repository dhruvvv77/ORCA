import test from 'node:test';
import assert from 'node:assert/strict';
import { chat, toolsForConversation } from '../server/llm.js';
import { registerToolHandlers } from '../server/tools.js';

test('marine safety queries expose only the Marine Alerts tool', () => {
  for (const query of [
    'Are there any marine safety alerts near Mumbai?',
    'Any warnings for Maharashtra?',
    'Is there a marine alert near Mumbai?',
    'Are sea conditions dangerous?',
  ]) {
    const tools = toolsForConversation([{ role: 'user', content: query }]);
    assert.deepEqual(tools.map((tool) => tool.function.name), ['get_marine_alerts']);
  }
});

test('closest PFZ queries expose only the GIS distance tool', () => {
  const tools = toolsForConversation([{ role: 'user', content: 'Which PFZ is closest to Mumbai?' }]);

  assert.deepEqual(tools.map((tool) => tool.function.name), ['calculate_pfz_distances']);
});

test('marine alert chat requests get_marine_alerts with automatic tool choice', async () => {
  const originalFetch = global.fetch;
  const originalKey = process.env.GROQ_API_KEY;
  process.env.GROQ_API_KEY = 'test-key';
  registerToolHandlers({});

  const requests = [];
  const responses = [
    { choices: [{ message: { tool_calls: [{
      id: 'marine-alert-mumbai',
      function: { name: 'get_marine_alerts', arguments: '{"affected_zone":"Mumbai"}' },
    }] } }] },
    { choices: [{ message: { content: 'Marine alert status for Mumbai.' } }] },
  ];

  global.fetch = async (_url, options) => {
    requests.push(JSON.parse(options.body));
    return { ok: true, json: async () => responses.shift() };
  };

  try {
    const result = await chat([{ role: 'user', content: 'Are there any marine safety alerts near Mumbai?' }]);

    assert.equal(requests[0].tool_choice, 'auto');
    assert.deepEqual(requests[0].tools.map((tool) => tool.function.name), ['get_marine_alerts']);
    assert.equal(result.reply, 'Marine alert status for Mumbai.');
  } finally {
    global.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = originalKey;
  }
});

test('closest PFZ chat requests calculate_pfz_distances with automatic tool choice', async () => {
  const originalFetch = global.fetch;
  const originalKey = process.env.GROQ_API_KEY;
  process.env.GROQ_API_KEY = 'test-key';
  registerToolHandlers({});

  const requests = [];
  const responses = [
    { choices: [{ message: { tool_calls: [{
      id: 'pfz-distance-mumbai',
      function: { name: 'calculate_pfz_distances', arguments: '{"latitude":19.076,"longitude":72.8777,"sort":"asc"}' },
    }] } }] },
    { choices: [{ message: { content: 'The nearest PFZ is Ratnagiri Coastal Zone.' } }] },
  ];

  global.fetch = async (_url, options) => {
    requests.push(JSON.parse(options.body));
    return { ok: true, json: async () => responses.shift() };
  };

  try {
    const result = await chat([{ role: 'user', content: 'Which PFZ is closest to Mumbai?' }]);

    assert.equal(requests[0].tool_choice, 'auto');
    assert.deepEqual(requests[0].tools.map((tool) => tool.function.name), ['calculate_pfz_distances']);
    assert.equal(result.reply, 'The nearest PFZ is Ratnagiri Coastal Zone.');
  } finally {
    global.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = originalKey;
  }
});
