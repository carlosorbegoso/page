import { CHAPTERS, isChapterId, type ChapterId } from './contracts';

export { CHAPTERS, isChapterId, type ChapterId };

/** Chapters that own a page section (`intro` is the power-on sequence and has none). */
export const SECTION_CHAPTERS: readonly ChapterId[] = CHAPTERS.filter(id => id !== 'intro');

/** Section element of a chapter: `[data-station="<id>"]`, falling back to `#<id>`. */
export function chapterElement(id: ChapterId): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[data-station="${id}"]`) ?? document.getElementById(id);
}
