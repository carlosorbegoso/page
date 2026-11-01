import { getRelativeLocaleUrl } from 'astro:i18n';
import { es, type UiKey } from './ui.es';
import { en } from './ui.en';

export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

export const LOCALE_TAGS: Record<Locale, { bcp47: string; og: string }> = {
  es: { bcp47: 'es-PE', og: 'es_PE' },
  en: { bcp47: 'en-US', og: 'en_US' }
};

const dictionaries: Record<Locale, Record<UiKey, string>> = { es, en };

export function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function getLocale(currentLocale: string | undefined, url: URL): Locale {
  if (isLocale(currentLocale)) return currentLocale;
  const [segment] = url.pathname.slice(import.meta.env.BASE_URL.length).split('/');
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
}

export function useTranslations(locale: Locale) {
  return function t(key: UiKey): string {
    return dictionaries[locale][key];
  };
}

export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}${path.replace(/^\/+/, '')}`;
}

export function localeUrl(locale: Locale, path = ''): string {
  return getRelativeLocaleUrl(locale, path);
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'es' ? 'en' : 'es';
}

export function formatYearMonth(value: string, locale: Locale): string {
  const [year, month] = value.split('-').map(Number);
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale].bcp47, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}
