import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  appType: 'mpa',
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 2048,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        careers: new URL('./careers.html', import.meta.url).pathname,
        privacy: new URL('./privacy.html', import.meta.url).pathname,
      },
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three/')) return 'three';
          if (id.includes('/node_modules/gsap/') || id.includes('/node_modules/lenis/')) return 'motion';
        },
      },
    },
  },
});
