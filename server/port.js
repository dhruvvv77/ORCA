export async function findAvailablePort(startPort, host = '127.0.0.1') {
  const net = await import('node:net');

  return await new Promise((resolve, reject) => {
    const tryPort = (port) => {
      const tester = net.default.createServer();

      tester.once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          resolve(findAvailablePort(port + 1, host));
          return;
        }

        reject(err);
      });

      tester.once('listening', () => {
        tester.close(() => resolve(port));
      });

      tester.listen(port, host);
    };

    tryPort(startPort);
  });
}
