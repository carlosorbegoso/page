import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://carlosorbegoso.github.io',
  base: '/page',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false }
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-PE', en: 'en-US' } },
      filter: page => !page.includes('/404')
    })
  ],
  build: {
    inlineStylesheets: 'always'
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
