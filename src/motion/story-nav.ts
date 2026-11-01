import type { gsap as Gsap } from 'gsap';
import type { ChapterId } from '../three/contracts';
import { motionAllowed, readMotion } from '../three/motion';

export interface StoryShot {
  chapter: ChapterId;
  sub: number;
  top: number;
}

export interface StoryNavHost {
  gsap: typeof Gsap;
  /** Every sub-shot in story order with its current scroll position (recomputed on each call). */
  shots(): StoryShot[];
  /** Index (into `shots()`) of the sub-shot ScrollTrigger considers active, or -1. */
  activeIndex(): number;
}

export type StoryGotoDetail =
  { chapter: ChapterId; sub?: number } | { step: 1 | -1 } | { edge: 'start' | 'end' };
export type StoryTourState = 'playing' | 'paused' | 'finished';

const SNAP_IDLE_MS = 150;
const KEY_GUARD_MS = 1000;
const SETTLE_FALLBACK_MS = 2500;
const READ_MIN_MS = 4000;
const READ_MAX_MS = 10000;
const READ_BASE_MS = 1500;
const READ_MS_PER_CHAR = 45;
/** Plates get `data-active` on the frame after `chapter:settled`; measure the text once they have it. */
const PLATE_FLAG_DELAY_MS = 120;
const TOUR_TOGGLE = '[data-story-tour]';
const FORM_FIELD = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])';
const NATIVE_SPACE =
  'button, a[href], summary, [role="button"], [role="checkbox"], [role="switch"]';

const NEXT_KEYS = new Set(['ArrowDown', 'PageDown']);
const PREV_KEYS = new Set(['ArrowUp', 'PageUp']);
const NATIVE_SCROLL_KEYS = new Set([
  'ArrowDown',
  'ArrowUp',
  'PageDown',
  'PageUp',
  'Home',
  'End',
  ' '
]);

const moves = () => motionAllowed(readMotion());

/**
 * Shot-by-shot navigation on top of the chapter scroll (3D mode only): a gentle settle on the
 * active sub-shot after the visitor stops, keyboard steps, `story:goto` and the auto tour. It never
 * scrolls while a wheel, touch, pointer drag or unhandled scroll key is in progress.
 */
export function setupStoryNav(host: StoryNavHost): () => void {
  const { gsap } = host;
  const html = document.documentElement;
  let tween: ReturnType<typeof gsap.to> | null = null;
  let targetIndex: number | null = null;
  let snapTimer = 0;
  let lastWheel = 0;
  let lastNativeKey = 0;
  let touches = 0;
  let pointerHeld = false;
  let settled: { id: ChapterId; subIndex: number } | null = null;
  let tour: { readTimer: number; settleTimer: number; offSettled: (() => void) | null } | null =
    null;

  const maxScroll = () => Math.max(0, html.scrollHeight - innerHeight);

  const cancelScroll = () => {
    tween?.kill();
    tween = null;
    targetIndex = null;
  };

  function scrollToY(y: number, index: number | null, onArrive?: () => void): void {
    cancelScroll();
    const top = Math.round(Math.min(Math.max(0, y), maxScroll()));
    if (Math.abs(top - scrollY) < 2) {
      onArrive?.();
      return;
    }
    if (!moves()) {
      scrollTo({ top, behavior: 'instant' });
      onArrive?.();
      return;
    }
    targetIndex = index;
    const distance = Math.abs(top - scrollY) / Math.max(1, innerHeight);
    tween = gsap.to(window, {
      duration: Math.min(1.2, Math.max(0.35, 0.3 + distance * 0.35)),
      ease: 'power2.inOut',
      scrollTo: {
        y: top,
        autoKill: true,
        onAutoKill: () => {
          tween = null;
          targetIndex = null;
          stopTour('paused');
        }
      },
      onComplete: () => {
        tween = null;
        targetIndex = null;
        onArrive?.();
      }
    });
  }

  function goToIndex(index: number, onArrive?: () => void): void {
    const shots = host.shots();
    if (index < 0) return scrollToY(0, null, onArrive);
    const shot = shots[Math.min(index, shots.length - 1)];
    if (shot) scrollToY(shot.top, index, onArrive);
  }

  function currentIndex(shots: StoryShot[]): number {
    const active = host.activeIndex();
    if (active >= 0) return active;
    const last = shots.at(-1);
    return last && scrollY > last.top ? shots.length - 1 : -1;
  }

  function step(direction: 1 | -1): void {
    const shots = host.shots();
    if (!shots.length) return;
    const base = targetIndex ?? currentIndex(shots);
    goToIndex(Math.min(Math.max(base + direction, -1), shots.length - 1));
  }

  function goto(detail: StoryGotoDetail | undefined): void {
    if (!detail) return;
    if ('step' in detail) return step(detail.step);
    if ('edge' in detail)
      return detail.edge === 'start' ? goToIndex(-1) : goToIndex(host.shots().length - 1);
    const shots = host.shots();
    const index = shots.findIndex(
      shot => shot.chapter === detail.chapter && shot.sub === (detail.sub ?? 0)
    );
    if (index >= 0) goToIndex(index);
  }

  function trySnap(): void {
    snapTimer = 0;
    if (tween || touches > 0 || pointerHeld || !moves()) return;
    const now = performance.now();
    if (now - lastNativeKey < KEY_GUARD_MS) return;
    if (now - lastWheel < SNAP_IDLE_MS) {
      scheduleSnap();
      return;
    }
    if (html.matches(':has(dialog[open])')) return;
    const shots = host.shots();
    const first = shots[0];
    const last = shots.at(-1);
    const active = shots[host.activeIndex()];
    if (!first || !last || !active || scrollY < first.top || scrollY > last.top) return;
    const distance = Math.abs(active.top - scrollY);
    if (distance < 2 || distance > innerHeight) return;
    scrollToY(active.top, host.activeIndex());
  }

  function scheduleSnap(): void {
    window.clearTimeout(snapTimer);
    snapTimer = window.setTimeout(trySnap, SNAP_IDLE_MS);
  }

  function readingPauseMs(): number {
    const text = [...document.querySelectorAll<HTMLElement>('[data-plate][data-active]')]
      .map(plate => plate.textContent ?? '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    return Math.min(
      READ_MAX_MS,
      Math.max(READ_MIN_MS, READ_BASE_MS + text.length * READ_MS_PER_CHAR)
    );
  }

  function announceTour(state: StoryTourState): void {
    window.dispatchEvent(new CustomEvent('story:tour-state', { detail: { state } }));
  }

  function clearTourTimers(): void {
    if (!tour) return;
    window.clearTimeout(tour.readTimer);
    window.clearTimeout(tour.settleTimer);
    tour.offSettled?.();
    tour.offSettled = null;
  }

  function stopTour(state: Exclude<StoryTourState, 'playing'>): void {
    if (!tour) return;
    clearTourTimers();
    tour = null;
    cancelScroll();
    announceTour(state);
  }

  function readThenAdvance(): void {
    if (!tour) return;
    clearTourTimers();
    const started = performance.now();
    tour.readTimer = window.setTimeout(() => {
      if (tour)
        tour.readTimer = window.setTimeout(
          advanceTour,
          readingPauseMs() - (performance.now() - started)
        );
    }, PLATE_FLAG_DELAY_MS);
  }

  /** At the very top the Stage holds the power-on and defers chapters, so `chapter:settled` may never come. */
  function afterSettled(shot: StoryShot | undefined, run: () => void): void {
    if (!tour) return;
    clearTourTimers();
    if (shot && settled?.id === shot.chapter && settled.subIndex === shot.sub) return run();
    const done = () => {
      clearTourTimers();
      run();
    };
    const onSettled = (event: Event) => {
      const detail = (event as CustomEvent<{ id: ChapterId; subIndex: number }>).detail;
      if (!shot || (detail?.id === shot.chapter && detail.subIndex === shot.sub)) done();
    };
    window.addEventListener('chapter:settled', onSettled);
    tour.offSettled = () => window.removeEventListener('chapter:settled', onSettled);
    tour.settleTimer = window.setTimeout(done, SETTLE_FALLBACK_MS);
  }

  function advanceTour(): void {
    if (!tour) return;
    const shots = host.shots();
    const next = currentIndex(shots) + 1;
    if (next >= shots.length) return stopTour('finished');
    goToIndex(next, () => {
      if (next >= shots.length - 1) return stopTour('finished');
      afterSettled(shots[next], readThenAdvance);
    });
  }

  function startTour(): void {
    if (tour) return;
    tour = { readTimer: 0, settleTimer: 0, offSettled: null };
    announceTour('playing');
    const shots = host.shots();
    const index = currentIndex(shots);
    if (index >= shots.length - 1 || index < 0) {
      goToIndex(0, () => afterSettled(shots[0], readThenAdvance));
      return;
    }
    readThenAdvance();
  }

  const fromTourToggle = (event: Event) =>
    event.target instanceof Element && event.target.closest(TOUR_TOGGLE) !== null;

  function interrupt(event: Event): void {
    if (!tour || fromTourToggle(event)) return;
    stopTour('paused');
  }

  function onKeyDown(event: KeyboardEvent): void {
    interrupt(event);
    if (
      event.defaultPrevented ||
      event.isComposing ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    )
      return;
    const key = event.key;
    if (!NATIVE_SCROLL_KEYS.has(key)) return;
    const target = event.target instanceof Element ? event.target : null;
    const blocked =
      html.matches(':has(dialog[open])') ||
      Boolean(
        target?.closest(
          `${FORM_FIELD}, dialog, [data-hud-menu], [role="menu"], [role="listbox"], [role="slider"]`
        )
      ) ||
      (key === ' ' && Boolean(target?.closest(NATIVE_SPACE)));
    if (blocked) {
      lastNativeKey = performance.now();
      return;
    }
    let action: (() => void) | null = null;
    if (NEXT_KEYS.has(key) || (key === ' ' && !event.shiftKey)) action = () => step(1);
    else if (PREV_KEYS.has(key) || (key === ' ' && event.shiftKey)) action = () => step(-1);
    else if (key === 'Home') action = () => goToIndex(-1);
    else if (key === 'End') action = () => goToIndex(host.shots().length - 1);
    if (!action) return;
    event.preventDefault();
    if (event.repeat) return;
    action();
  }

  const onScroll = () => {
    if (!tween) scheduleSnap();
  };
  const onWheel = (event: WheelEvent) => {
    lastWheel = performance.now();
    interrupt(event);
  };
  const onTouchStart = (event: TouchEvent) => {
    touches = event.touches.length;
    interrupt(event);
  };
  const onTouchEnd = (event: TouchEvent) => {
    touches = event.touches.length;
    if (touches === 0) scheduleSnap();
  };
  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') pointerHeld = true;
    interrupt(event);
  };
  const onPointerUp = () => {
    if (!pointerHeld) return;
    pointerHeld = false;
    scheduleSnap();
  };
  const onGoto = (event: Event) => goto((event as CustomEvent<StoryGotoDetail>).detail);
  const onTour = (event: Event) => {
    const action =
      (event as CustomEvent<{ action?: 'toggle' | 'start' | 'stop' }>).detail?.action ?? 'toggle';
    if (action === 'stop' || (action === 'toggle' && tour)) stopTour('paused');
    else startTour();
  };
  const onChapterEnter = () => {
    settled = null;
  };
  const onChapterSettled = (event: Event) => {
    settled = (event as CustomEvent<{ id: ChapterId; subIndex: number }>).detail ?? null;
  };
  const onVisibility = () => {
    if (document.visibilityState === 'hidden') stopTour('paused');
  };

  const listeners: Array<[EventTarget, string, EventListener, AddEventListenerOptions]> = [
    [window, 'keydown', onKeyDown as EventListener, {}],
    [window, 'scroll', onScroll, { passive: true }],
    [window, 'wheel', onWheel as EventListener, { passive: true, capture: true }],
    [window, 'touchstart', onTouchStart as EventListener, { passive: true, capture: true }],
    [window, 'touchend', onTouchEnd as EventListener, { passive: true, capture: true }],
    [window, 'touchcancel', onTouchEnd as EventListener, { passive: true, capture: true }],
    [window, 'pointerdown', onPointerDown as EventListener, { passive: true, capture: true }],
    [window, 'pointerup', onPointerUp, { passive: true, capture: true }],
    [window, 'pointercancel', onPointerUp, { passive: true, capture: true }],
    [window, 'story:goto', onGoto, {}],
    [window, 'story:tour', onTour, {}],
    [window, 'chapter:enter', onChapterEnter, {}],
    [window, 'chapter:settled', onChapterSettled, {}],
    [document, 'visibilitychange', onVisibility, {}]
  ];
  for (const [target, type, listener, options] of listeners)
    target.addEventListener(type, listener, options);
  html.dataset.storyNav = 'ready';
  window.dispatchEvent(new CustomEvent('story:ready', { detail: { total: host.shots().length } }));

  return () => {
    stopTour('paused');
    cancelScroll();
    window.clearTimeout(snapTimer);
    for (const [target, type, listener, options] of listeners)
      target.removeEventListener(type, listener, options);
    delete html.dataset.storyNav;
    window.dispatchEvent(new CustomEvent('story:disposed'));
  };
}
