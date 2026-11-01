import { CHAPTERS, isChapterId, type ChapterId } from './contracts';

export { CHAPTERS, isChapterId, type ChapterId };

export const SECTION_CHAPTERS: readonly ChapterId[] = CHAPTERS.filter(id => id !== 'intro');

export function chapterElement(id: ChapterId): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-station="${id}"]`) ?? document.getElementById(id);
}
