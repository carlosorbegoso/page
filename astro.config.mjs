import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const SITE_ROOT = 'https://carlosorbegoso.github.io/page/';
const READING_PAGES = { es: `${SITE_ROOT}lectura/`, en: `${SITE_ROOT}en/reading/` };

function linkReadingPages(item) {
  if (!Object.values(READING_PAGES).includes(item.url)) return item;
  const links = Object.entries(READING_PAGES).map(([lang, url]) => ({ lang, url }));
  return { ...item, links };
}

export default defineConfig({
  devToolbar: { enabled: false },
  site: 'https://carlosorbegoso.github.io',
  base: '/page',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false }
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en' } },
      filter: page => !page.includes('/404'),
      serialize: linkReadingPages
    })
  ],
  build: {
    inlineStylesheets: 'always'
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
