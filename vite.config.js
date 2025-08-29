import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'assets',
  base: './', // Esto asegura que las rutas sean relativas
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html'
      },
      output: {
        manualChunks: {
          three: ['three']
        }
      }
    },
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: ['three'],
    exclude: []
  },
  resolve: {
    alias: {
      'three': 'three'
    }
  },
  define: {
    global: 'globalThis'
  }
});
