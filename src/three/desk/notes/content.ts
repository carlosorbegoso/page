import enProducts from '../../../content/products/en.json';
import esProducts from '../../../content/products/es.json';
import enProfile from '../../../content/profile/en.json';
import esProfile from '../../../content/profile/es.json';
import { en } from '../../../i18n/ui.en';
import { es } from '../../../i18n/ui.es';
import type { ProductId } from './layout';

export interface CompanyPrint {
  /** Handwritten across the top of the board: "TUSOCIO IA". */
  title: string;
  /** "Cofundador · TUSOCIO IA S.A.C." */
  role: string;
  /** The company in one sentence. */
  phrase: string;
  /** "Alfa, la marca madre". */
  parentBrand: string;
}

export interface ProductPrint {
  id: ProductId;
  name: string;
  /** "En producción" / "En construcción". */
  status: string;
  tagline: string;
  description: string;
  roleLabel: string;
  role: string;
  visit: string;
  url: string;
}

interface ProductEntry {
  id: string;
  name: string;
  url: string;
  status: string;
  role: string;
  tagline: string;
  description: string;
}

function english(): boolean {
  return document.documentElement.lang.startsWith('en');
}

/** The board's text, from the same profile and UI strings the page uses, in the page's language. */
export function readCompany(): CompanyPrint {
  const isEnglish = english();
  const ui = isEnglish ? en : es;
  const company = (isEnglish ? enProfile : esProfile).company;
  return {
    title: ui['company.title'],
    role: `${company.role} · ${company.legalName}`,
    phrase: ui['company.subtitle'],
    parentBrand: ui['company.parentBrand']
  };
}

/** A product card's text, from the products content in the page's language. */
export function readProduct(id: ProductId): ProductPrint {
  const isEnglish = english();
  const ui = isEnglish ? en : es;
  const entries = (isEnglish ? enProducts : esProducts).entries as ProductEntry[];
  const entry = entries.find(candidate => candidate.id === id)!;
  const status = entry.status === 'production' ? ui['products.status.production'] : ui['products.status.building'];
  return {
    id,
    name: entry.name,
    status,
    tagline: entry.tagline,
    description: entry.description,
    roleLabel: ui['products.role'],
    role: entry.role,
    visit: ui['products.visit'],
    url: entry.url
  };
}
