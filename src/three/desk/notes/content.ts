import enProducts from '../../../content/products/en.json';
import esProducts from '../../../content/products/es.json';
import enProfile from '../../../content/profile/en.json';
import esProfile from '../../../content/profile/es.json';
import { en } from '../../../i18n/ui.en';
import { es } from '../../../i18n/ui.es';
import type { ProductId } from './layout';

export interface CompanyPrint {
  title: string;
  role: string;
  phrase: string;
  parentBrand: string;
}

export interface ProductPrint {
  id: ProductId;
  name: string;
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
