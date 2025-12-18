import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import compressor from 'astro-compressor';

export default defineConfig({
  site: 'https://carlosorbegoso.github.io',
  base: '/page',

  // Integraciones SEO y optimización
  integrations: [
    // Genera sitemap.xml automáticamente
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          es: 'es-PE'
        }
      }
    }),

    // Genera robots.txt
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/api/', '/_astro/'],
          crawlDelay: 10
        }
      ],
      sitemap: true
    }),

    // Compresión gzip/brotli (debe ir al final)
    compressor({
      gzip: true,
      brotli: true
    })
  ],

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
      },
      // Optimizaciones adicionales
      cssCodeSplit: true,
      minify: 'esbuild'  // esbuild es más rápido y viene incluido
    }
  },

  // Optimizaciones de build
  build: {
    inlineStylesheets: 'auto'
  },

  // Prefetch para navegación más rápida
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  }
});
