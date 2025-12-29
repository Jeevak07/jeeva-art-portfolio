import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    testTimeout: 15000, // 15 seconds for property-based tests
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});