import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  base: '/Web-3.0-Wallet/',
  plugins: [react(), nodePolyfills()],
  define: {
    global: "window",  // 🔹 Ensure 'global' is defined
  },
  resolve: {
    alias: {
      buffer: 'buffer/',
    }
  },
  optimizeDeps: {
    include: ['buffer'], // 🔹 Ensure Buffer is included
  },
});
