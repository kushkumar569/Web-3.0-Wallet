import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

export default defineConfig({
  base: "/Web-3.0-Wallet/",
  plugins: [react()],
  define: {
    global: "window", // Fix for global object
  },
  resolve: {
    alias: {
      buffer: "buffer/", // Fix for Buffer
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    rollupOptions: {
      external: ["vite-plugin-node-polyfills/shims/process", "vite-plugin-node-polyfills/shims/buffer"],
    },
  },
});
