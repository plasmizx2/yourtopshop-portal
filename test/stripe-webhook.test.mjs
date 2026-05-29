import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import net from 'node:net';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

async function getFreePort() {
  const server = net.createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const { port } = server.address();
  server.close();
  await once(server, 'close');
  return port;
}

async function waitForHealth(port, output) {
  const deadline = Date.now() + 8000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/health`);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`server did not start:\n${output()}`);
}

function startServer(port, env) {
  const child = spawn(process.execPath, ['server.js'], {
    cwd: repoRoot,
    env: {
      ...process.env,
      PORT: String(port),
      DEV: 'false',
      STRIPE_SECRET_KEY: 'sk_test_dummy',
      ...env,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let output = '';
  child.stdout.on('data', (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on('data', (chunk) => {
    output += chunk.toString();
  });

  return { child, output: () => output };
}

async function stopServer(child) {
  if (child.exitCode !== null) return;

  child.kill();
  await once(child, 'exit');
}

test('production webhook rejects unsigned events when STRIPE_WEBHOOK_SECRET is missing', async (t) => {
  const port = await getFreePort();
  const server = startServer(port, { STRIPE_WEBHOOK_SECRET: '' });
  t.after(() => stopServer(server.child));

  await waitForHealth(port, server.output);

  const response = await fetch(`http://127.0.0.1:${port}/api/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'checkout.session.completed',
      data: { object: { id: 'cs_test_unsigned' } },
    }),
  });

  assert.equal(response.status, 500);
  assert.match(await response.text(), /secret is not configured/i);
});

test('production webhook rejects requests without Stripe-Signature when secret is set', async (t) => {
  const port = await getFreePort();
  const server = startServer(port, { STRIPE_WEBHOOK_SECRET: 'whsec_test' });
  t.after(() => stopServer(server.child));

  await waitForHealth(port, server.output);

  const response = await fetch(`http://127.0.0.1:${port}/api/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'checkout.session.completed' }),
  });

  assert.equal(response.status, 400);
  assert.match(await response.text(), /missing stripe signature/i);
});
