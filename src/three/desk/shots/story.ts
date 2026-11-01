import type { ChapterId } from '../../contracts';
import { PRODUCT_FIGURES, type FolderId } from '../layout';

export const EXPERIENCE_ORDER = ['sysarp', 'baufest', 'intercorp', 'tcs'] as const satisfies readonly FolderId[];

export function experienceFolder(subIndex: number): FolderId | null {
  return subIndex < 1 ? null : EXPERIENCE_ORDER[Math.min(subIndex - 1, EXPERIENCE_ORDER.length - 1)]!;
}

export const SUB_SHOTS: Partial<Record<ChapterId, number>> = { about: 2, products: PRODUCT_FIGURES.length, experience: EXPERIENCE_ORDER.length + 1 };

export const EXPERIENCE_ANCHOR: Record<(typeof EXPERIENCE_ORDER)[number], string> = {
  sysarp: 'exp-sysarp',
  baufest: 'exp-baufest',
  intercorp: 'exp-intercorp-retail',
  tcs: 'exp-tcs'
};

export const SHOT_LIMITS = { degrees: 28, metres: 1.4 } as const;

export const ANCHOR_NAMES = [
  'company',
  'product-skymek',
  'product-parati',
  'product-ventixs',
  'exp-intro',
  'exp-tcs',
  'exp-intercorp-retail',
  'exp-baufest',
  'exp-sysarp',
  'outro',
  'hero',
  'about-bio',
  'about-stack'
] as const;
