import type { Scroller } from './scroll';
import { currentIndex } from './shot-index';
import type { NavState, SettledShot, StoryNavHost, StoryShot, StoryTourState } from './types';

const SETTLE_FALLBACK_MS = 2500;
const READ_MIN_MS = 4000;
const READ_MAX_MS = 10000;
const READ_BASE_MS = 1500;
const READ_MS_PER_CHAR = 45;
const PLATE_FLAG_DELAY_MS = 120;

interface TourRun {
  readTimer: number;
  settleTimer: number;
  offSettled: (() => void) | null;
}

export interface Tour {
  readonly playing: boolean;
  start(): void;
  stop(state: Exclude<StoryTourState, 'playing'>): void;
}

function readingPauseMs(): number {
  const text = [...document.querySelectorAll<HTMLElement>('[data-plate][data-active]')]
    .map(plate => plate.textContent ?? '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  return Math.min(READ_MAX_MS, Math.max(READ_MIN_MS, READ_BASE_MS + text.length * READ_MS_PER_CHAR));
}

function announceTour(state: StoryTourState): void {
  window.dispatchEvent(new CustomEvent('story:tour-state', { detail: { state } }));
}

function clearTourTimers(tour: TourRun): void {
  window.clearTimeout(tour.readTimer);
  window.clearTimeout(tour.settleTimer);
  tour.offSettled?.();
  tour.offSettled = null;
}

function waitForSettle(tour: TourRun, shot: StoryShot | undefined, done: () => void): void {
  const onSettled = (event: Event) => {
    const detail = (event as CustomEvent<SettledShot>).detail;
    if (!shot || (detail?.id === shot.chapter && detail.subIndex === shot.sub)) done();
  };
  window.addEventListener('chapter:settled', onSettled);
  tour.offSettled = () => window.removeEventListener('chapter:settled', onSettled);
  tour.settleTimer = window.setTimeout(done, SETTLE_FALLBACK_MS);
}

class AutoTour implements Tour {
  private run: TourRun | null = null;

  constructor(
    private readonly host: StoryNavHost,
    private readonly state: NavState,
    private readonly scroller: Scroller
  ) {}

  get playing(): boolean {
    return this.run !== null;
  }

  start(): void {
    if (this.run) return;
    this.run = { readTimer: 0, settleTimer: 0, offSettled: null };
    announceTour('playing');
    const shots = this.host.shots();
    const index = currentIndex(shots, this.host.activeIndex());
    if (index >= shots.length - 1 || index < 0) {
      this.scroller.goToIndex(0, () => this.afterSettled(shots[0], () => this.readThenAdvance()));
      return;
    }
    this.readThenAdvance();
  }

  stop(final: Exclude<StoryTourState, 'playing'>): void {
    if (!this.run) return;
    clearTourTimers(this.run);
    this.run = null;
    this.scroller.cancel();
    announceTour(final);
  }

  private readThenAdvance(): void {
    if (!this.run) return;
    clearTourTimers(this.run);
    const started = performance.now();
    this.run.readTimer = window.setTimeout(() => {
      if (this.run) this.run.readTimer = window.setTimeout(() => this.advance(), readingPauseMs() - (performance.now() - started));
    }, PLATE_FLAG_DELAY_MS);
  }

  private afterSettled(shot: StoryShot | undefined, next: () => void): void {
    if (!this.run) return;
    clearTourTimers(this.run);
    const { settled } = this.state;
    if (shot && settled?.id === shot.chapter && settled.subIndex === shot.sub) return next();
    const current = this.run;
    waitForSettle(current, shot, () => {
      clearTourTimers(current);
      next();
    });
  }

  private advance(): void {
    if (!this.run) return;
    const shots = this.host.shots();
    const next = currentIndex(shots, this.host.activeIndex()) + 1;
    if (next >= shots.length) return this.stop('finished');
    this.scroller.goToIndex(next, () => {
      if (next >= shots.length - 1) return this.stop('finished');
      this.afterSettled(shots[next], () => this.readThenAdvance());
    });
  }
}

export function createTour(host: StoryNavHost, state: NavState, scroller: Scroller): Tour {
  return new AutoTour(host, state, scroller);
}
