/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import RemixRouter from 'vite-plugin-remix-router';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), RemixRouter()],
  resolve: {
    alias: { '@/': path.resolve(__dirname, '/') },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    coverage: {
      exclude: ['postcss.config.js', 'tailwind.config.js', ' .eslintrc.cjs'],
    },
  },
  server: {
    port: 4000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
