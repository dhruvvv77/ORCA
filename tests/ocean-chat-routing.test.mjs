import test from 'node:test';
import assert from 'node:assert/strict';
import { chat } from '../server/llm.js';
import { registerToolHandlers } from '../server/tools.js';

test('Chennai ocean queries expose only the ocean tool and return Tamil Nadu data', async () => {
  const originalFetch = global.fetch;
  const originalKey = process.env.GROQ_API_KEY;
  process.env.GROQ_API_KEY = 'test-key';
  registerToolHandlers({});

  const requests = [];
  const responses = [
    {
      choices: [{ message: {
        tool_calls: [{
          id: 'ocean-chennai',
          function: { name: 'get_ocean_data', arguments: '{"state":"Chennai","parameter":"all"}' },
        }],
      } }],
    },
    { choices: [{ message: { content: 'Tamil Nadu ocean conditions.' } }] },
  ];

  global.fetch = async (_url, options) => {
    requests.push(JSON.parse(options.body));
    return { ok: true, json: async () => responses.shift() };
  };

  try {
    const result = await chat([{ role: 'user', content: 'What are ocean conditions near Chennai?' }]);

    assert.equal(requests[0].tool_choice, 'auto');
    assert.deepEqual(requests[0].tools.map((tool) => tool.function.name), ['get_ocean_data']);
    assert.equal(result.oceanData.found, true);
    assert.equal(result.oceanData.observations[0].state, 'Tamil Nadu');
    assert.equal(result.oceanData.observations[0].sst.value, 29.5);
  } finally {
    global.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = originalKey;
  }
});
