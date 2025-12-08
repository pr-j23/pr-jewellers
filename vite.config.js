import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { randomFillSync, webcrypto } from 'crypto';
import { createRequire } from 'module';

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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/utils/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
