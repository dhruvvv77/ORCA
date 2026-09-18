import test from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import { findAvailablePort } from '../server/port.js';

test('findAvailablePort skips occupied ports', async () => {
  const server = net.createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const occupiedPort = server.address().port;

  const nextPort = await findAvailablePort(occupiedPort);

  assert.notEqual(nextPort, occupiedPort);

  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});
