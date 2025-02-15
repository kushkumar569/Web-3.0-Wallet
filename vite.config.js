import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {NodePolyfills }from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    NodePolyfills()
  ],
  base: '/Web-3.0-Wallet/',
});
