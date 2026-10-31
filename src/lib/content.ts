import { getEntry, type CollectionEntry } from 'astro:content';
import { LOCALES, type Locale } from '../i18n/utils';

type LocalizedCollection = 'profile' | 'experience' | 'products';

async function requireEntry<C extends LocalizedCollection>(
  collection: C,
  locale: Locale
): Promise<CollectionEntry<C>['data']> {
  const entry = await getEntry(collection, locale);
  if (!entry) throw new Error(`Missing src/content/${collection}/${locale}.json`);
  return entry.data as CollectionEntry<C>['data'];
}

type Entry = { id: string };

async function assertSameIds(collection: 'experience' | 'products') {
  const [first, ...rest] = await Promise.all(
    LOCALES.map(async locale => ({
      locale,
      ids: ((await requireEntry(collection, locale)).entries as Entry[]).map(e => e.id).join(',')
    }))
  );
  for (const other of rest) {
    if (other.ids !== first.ids) {
      throw new Error(
        `src/content/${collection}: ids differ between ${first.locale} [${first.ids}] and ${other.locale} [${other.ids}]`
      );
    }
  }
}

export function getProfile(locale: Locale) {
  return requireEntry('profile', locale);
}

export async function getExperience(locale: Locale) {
  await assertSameIds('experience');
  return (await requireEntry('experience', locale)).entries;
}

export async function getProducts(locale: Locale) {
  await assertSameIds('products');
  return (await requireEntry('products', locale)).entries;
}
