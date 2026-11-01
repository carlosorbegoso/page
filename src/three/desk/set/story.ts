import { CHAPTERS, type ChapterId } from '../../contracts';
import { PRODUCT_FIGURES, type FigureId } from '../layout';
import { EXPERIENCE_ORDER, experienceFolder } from '../shots';

export function storyRank(chapter: ChapterId, subIndex: number): number {
  return CHAPTERS.indexOf(chapter) * 10 + subIndex;
}

/** How late the night is per chapter: city windows go dark as the story advances. */
export const LATENESS: Record<ChapterId, number> = { intro: 0, hero: 0, about: 0.05, experience: 0.1, company: 0.25, products: 0.35, contact: 0.5, outro: 0.6 };

/** Where the story introduces each figure; before that it waits dim and grey on the plinth. */
export const FIGURE_INTRO: Record<FigureId, [ChapterId, number]> = {
  alfa: ['company', 0],
  skymek: ['products', 0],
  parati: ['products', 1],
  ventixs: ['products', 2]
};

export const FOLDER_OPENS_AT = storyRank('experience', EXPERIENCE_ORDER.length);

export const EXPERIENCE_IDS: Record<string, string> = { tcs: 'tcs', intercorp: 'intercorp-retail', baufest: 'baufest', sysarp: 'sysarp' };

/** The object the shot introduces, pulsed once on touch screens in place of a hover. */
export function shotObject(chapter: ChapterId, subIndex: number): string | null {
  if (chapter === 'company') return 'alfa';
  if (chapter === 'products') return PRODUCT_FIGURES[Math.min(subIndex, PRODUCT_FIGURES.length - 1)] ?? null;
  if (chapter === 'experience') return experienceFolder(subIndex);
  return chapter === 'contact' ? 'phone' : null;
}

/** The product figure the current shot is about, if any. */
export function focusedFigure(chapter: ChapterId, subIndex: number): FigureId | null {
  return chapter === 'products' ? PRODUCT_FIGURES[Math.min(subIndex, PRODUCT_FIGURES.length - 1)]! : null;
}
