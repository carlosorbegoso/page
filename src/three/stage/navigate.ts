import type { ChapterId, ChapterState, StationPick } from '../contracts';
import { SECTION_CHAPTERS } from '../sections';

/** How long a clicked figure reacts on its own before the camera travels (two-step click). */
const FIGURE_REACTION_MS = 550;
/** Same for objects that only answer with a press pulse (folders, phone). */
const PRESS_REACTION_MS = 300;

export interface NavigateHost {
  state(): ChapterState;
  movesAllowed(): boolean;
  scrollToChapter(chapter: ChapterId, sub: number): void;
}

function emit(type: string, detail?: unknown): void {
  window.dispatchEvent(new CustomEvent(type, { detail }));
}

/**
 * Two-step click: the object reacts first (`desk:action` play, or the press pulse DeskSet runs on
 * `desk:interact`), then — only if the click leads somewhere new — the camera travels once that
 * reaction has read. Toys (lamp, clock, mug) and the shot already on screen stay put.
 */
export class PickNavigator {
  private travelTimer = 0;

  constructor(private readonly host: NavigateHost) {}

  navigate(pick: StationPick): void {
    const id = pick.key.startsWith('desk:') ? pick.key.slice(5) : '';
    if (id === 'clock') {
      window.dispatchEvent(new CustomEvent('desk:clock'));
      return;
    }
    const figure = Boolean(pick.product) || id === 'alfa';
    if (figure || id === 'mug') emit('desk:action', { action: 'play', id });
    if (id === 'mug') return;
    if (pick.action) {
      emit('desk:action', { action: pick.action, id });
      return;
    }
    const chapter = pick.target.replace('#', '') as ChapterId;
    const sub = pick.sub ?? (pick.product ? ['skymek', 'parati', 'ventixs'].indexOf(pick.product) : 0);
    const state = this.host.state();
    if (pick.experience && pick.sub !== undefined && state.id === chapter && state.subIndex === pick.sub) {
      emit('desk:action', { action: 'folder', id: pick.experience });
      return;
    }
    const subMatters = Boolean(pick.product) || pick.sub !== undefined;
    if (state.id === chapter && (!subMatters || state.subIndex === sub)) return;
    this.schedule(() => this.travel(pick, chapter, sub), figure);
  }

  private schedule(travel: () => void, figure: boolean): void {
    window.clearTimeout(this.travelTimer);
    if (this.host.movesAllowed()) this.travelTimer = window.setTimeout(travel, figure ? FIGURE_REACTION_MS : PRESS_REACTION_MS);
    else travel();
  }

  private travel(pick: StationPick, chapter: ChapterId, sub: number): void {
    if (SECTION_CHAPTERS.includes(chapter)) this.host.scrollToChapter(chapter, Math.max(0, sub));
    else document.querySelector(pick.target)?.scrollIntoView({ behavior: this.host.movesAllowed() ? 'smooth' : 'auto' });
    if (pick.product) emit('product:focus', { id: pick.product, source: 'scene' });
    if (pick.experience) emit('experience:focus', { id: pick.experience, source: 'scene' });
  }
}
