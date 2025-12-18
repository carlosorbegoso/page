import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['three']
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three']
          }
        }
      }
    }
  }
});
