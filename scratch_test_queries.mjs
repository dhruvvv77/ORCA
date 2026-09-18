import 'dotenv/config';
import { chat } from './server/llm.js';

async function testAll() {
  console.log('--- Test 1: Show PFZ zones in Maharashtra ---');
  try {
    const res1 = await chat([{ role: 'user', content: 'Show PFZ zones in Maharashtra' }]);
    console.log('Reply 1:', res1.reply?.slice(0, 120), '...');
    console.log('PFZ Data attached:', !!res1.pfzData, 'count:', res1.pfzData?.count);
  } catch (err) {
    console.error('Test 1 error:', err.message);
  }

  console.log('\n--- Test 2: What are ocean conditions near Chennai? ---');
  try {
    const res2 = await chat([{ role: 'user', content: 'What are ocean conditions near Chennai?' }]);
    console.log('Reply 2:', res2.reply?.slice(0, 120), '...');
    console.log('Ocean Data attached:', !!res2.oceanData);
  } catch (err) {
    console.error('Test 2 error:', err.message);
  }

  console.log('\n--- Test 3: Where can I fish today near Mumbai? ---');
  try {
    const res3 = await chat([{ role: 'user', content: 'Where can I fish today near Mumbai?' }]);
    console.log('Reply 3:', res3.reply?.slice(0, 120), '...');
    console.log('Orchestrator Data attached:', !!res3.orchestratorData);
    console.log('Date resolved:', res3.orchestratorData?.interpreted_request?.date);
  } catch (err) {
    console.error('Test 3 error:', err.message);
  }
}

testAll();
