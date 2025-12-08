#!/usr/bin/env node
import { randomFillSync, webcrypto } from 'crypto';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto ?? {};
}

if (typeof globalThis.crypto.getRandomValues !== 'function') {
  globalThis.crypto.getRandomValues = array => randomFillSync(array);
}

const require = createRequire(import.meta.url);
const legacyCrypto = require('crypto');

if (typeof legacyCrypto.getRandomValues !== 'function') {
  legacyCrypto.getRandomValues = array => randomFillSync(array);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const vitestEntrypoint = resolve(__dirname, '../node_modules/vitest/vitest.mjs');

await import(vitestEntrypoint);
