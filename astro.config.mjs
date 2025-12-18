import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://carlosorbegoso.github.io',
  base: '/page',
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
