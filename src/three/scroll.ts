import type { ChapterId } from './contracts';
import { chapterElement, SECTION_CHAPTERS } from './sections';
import { setupStoryNav, type StoryShot } from '../motion/story-nav';
import type { ScrollTrigger as ScrollTriggerApi } from 'gsap/ScrollTrigger';

export interface ChapterScrollHost {
  /** Number of sub-shots of a chapter (products, experience). */
  subCount(chapter: ChapterId): number;
  /** The section owning the viewport changed (or its sub-shot). */
  onChapter(chapter: ChapterId, sub: number): void;
  onProgress(chapter: ChapterId, progress: number): void;
}

export interface ChapterScroll {
  /** Scroll position that shows a chapter's sub-shot. */
  positionOf(chapter: ChapterId, sub: number): number | null;
  refresh(): void;
  dispose(): void;
}

type Trigger = InstanceType<typeof ScrollTriggerApi>;

interface Tracker {
  host: ChapterScrollHost;
  ScrollTrigger: typeof ScrollTriggerApi;
  triggers: Map<ChapterId, Trigger>;
  lastChapter: ChapterId | undefined;
  current: ChapterId | null;
  currentSub: number;
  healed: string;
}

const subsOf = (tracker: Tracker, chapter: ChapterId) => Math.max(1, tracker.host.subCount(chapter));
const storyChapters = (tracker: Tracker) => SECTION_CHAPTERS.filter(chapter => tracker.triggers.has(chapter));
/** The last trigger runs 2 px past the maximum scroll: ScrollTrigger is inactive at progress 1. */
const edgeOf = (tracker: Tracker, chapter: ChapterId) => (chapter === tracker.lastChapter ? 2 : 0);

/** Overall progress maps the centre of the first sub-shot to 0 and the centre of the last one to 1. */
function reportStory(tracker: Tracker, chapter: ChapterId, progress: number): void {
  let before = 0;
  let total = 0;
  for (const id of storyChapters(tracker)) {
    if (id === chapter) before = total;
    total += subsOf(tracker, id);
  }
  const subs = subsOf(tracker, chapter);
  const position = before + progress * subs;
  const value = total > 1 ? Math.min(1, Math.max(0, (position - 0.5) / (total - 1))) : 1;
  const index = Math.min(total - 1, before + Math.min(subs - 1, Math.floor(progress * subs)));
  window.dispatchEvent(new CustomEvent('story:progress', { detail: { value, index, total } }));
}

function report(tracker: Tracker, chapter: ChapterId, progress: number): void {
  tracker.host.onProgress(chapter, progress);
  if (chapter !== tracker.current) return;
  reportStory(tracker, chapter, progress);
  const subs = subsOf(tracker, chapter);
  const sub = Math.min(subs - 1, Math.floor(progress * subs));
  if (sub === tracker.currentSub) return;
  tracker.currentSub = sub;
  tracker.host.onChapter(chapter, sub);
}

/** The most recently entered active trigger owns the camera; on leave, fall back to any other active one. */
function toggle(tracker: Tracker, chapter: ChapterId, active: boolean, progress: number): void {
  if (active) {
    tracker.current = chapter;
    tracker.currentSub = -1;
    tracker.healed = '';
    report(tracker, chapter, progress);
    return;
  }
  if (tracker.current !== chapter) return;
  const other = [...tracker.triggers].find(([id, trigger]) => id !== chapter && trigger.isActive);
  if (!other) return;
  tracker.current = other[0];
  tracker.currentSub = -1;
  report(tracker, other[0], other[1].progress);
}

/** Sections are bare spacers once the plates live in their layers: each box is exactly subs × 100svh. */
function sizeSpacers(tracker: Tracker): void {
  for (const chapter of SECTION_CHAPTERS) {
    const section = chapterElement(chapter);
    if (!section) continue;
    const height = `${subsOf(tracker, chapter) * 100}svh`;
    Object.assign(section.style, { height, minHeight: height, paddingBlock: '0px', boxSizing: 'border-box' });
  }
}

function clearSpacers(): void {
  for (const chapter of SECTION_CHAPTERS) {
    const style = chapterElement(chapter)?.style;
    for (const property of ['height', 'min-height', 'padding-block', 'box-sizing']) style?.removeProperty(property);
  }
}

function createTriggers(tracker: Tracker): void {
  for (const chapter of SECTION_CHAPTERS) {
    const section = chapterElement(chapter);
    if (!section) continue;
    const edge = edgeOf(tracker, chapter);
    tracker.triggers.set(
      chapter,
      tracker.ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: () => `bottom 50%-=${edge}`,
        invalidateOnRefresh: true,
        onToggle: self => toggle(tracker, chapter, self.isActive, self.progress),
        onUpdate: self => report(tracker, chapter, self.progress)
      })
    );
  }
}

/** Re-measures every spacer and hands the camera to the shot the real scrollY shows. */
function sync(tracker: Tracker): void {
  sizeSpacers(tracker);
  tracker.ScrollTrigger.refresh();
  const active = [...tracker.triggers].filter(([, trigger]) => trigger.isActive).pop();
  const [chapter, trigger] = active ?? [...tracker.triggers][0] ?? [];
  if (!chapter || !trigger) return;
  const progress = active ? trigger.progress : 0;
  if (chapter === tracker.current) report(tracker, chapter, progress);
  else toggle(tracker, chapter, true, progress);
}

function positionOf(tracker: Tracker, chapter: ChapterId, sub: number): number | null {
  const trigger = tracker.triggers.get(chapter);
  if (!trigger) return null;
  const subs = subsOf(tracker, chapter);
  const span = trigger.end - trigger.start - edgeOf(tracker, chapter);
  const index = Math.min(sub, subs - 1);
  /* The final shot rests at the very bottom so nothing scrolls past the credits. */
  if (chapter === tracker.lastChapter && index === subs - 1)
    return Math.min(trigger.start + span - 1, tracker.ScrollTrigger.maxScroll(window));
  return trigger.start + ((index + 0.5) / subs) * span;
}

/** A shot requested while the power-on held the camera can land after a newer one: ask again for the shot the scroll shows. */
function healSettledShot(tracker: Tracker, event: Event): void {
  const detail = (event as CustomEvent<{ id: ChapterId; subIndex: number }>).detail;
  const { current, currentSub } = tracker;
  if (!detail || detail.id === 'intro' || !current || currentSub < 0) return;
  const wanted = `${current}:${currentSub}`;
  if ((detail.id === current && detail.subIndex === currentSub) || tracker.healed === wanted) return;
  tracker.healed = wanted;
  tracker.host.onChapter(current, currentSub);
}

function storyShots(tracker: Tracker): StoryShot[] {
  return storyChapters(tracker).flatMap(chapter =>
    Array.from({ length: subsOf(tracker, chapter) }, (_, sub) => ({ chapter, sub, top: positionOf(tracker, chapter, sub) ?? 0 }))
  );
}

function activeShotIndex(tracker: Tracker): number {
  if (!tracker.current || tracker.currentSub < 0) return -1;
  let index = 0;
  for (const chapter of storyChapters(tracker)) {
    if (chapter === tracker.current) return index + Math.min(tracker.currentSub, subsOf(tracker, chapter) - 1);
    index += subsOf(tracker, chapter);
  }
  return -1;
}

async function loadGsap() {
  const [{ gsap }, { ScrollTrigger }, { ScrollToPlugin }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/ScrollToPlugin')
  ]);
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  ScrollTrigger.config({ ignoreMobileResize: true });
  return { gsap, ScrollTrigger };
}

/**
 * Chapters on scroll (GSAP ScrollTrigger, loaded only inside the 3D chunk). Every sub-shot owns
 * exactly one viewport of scroll and nothing else scrolls: every section is a `subs × 100svh` spacer,
 * with no pin and no scrub, on every device. A chapter fires when its section reaches 50 % of the
 * viewport and the camera changes shot only at sub-shot boundaries. No `normalizeScroll`.
 * Also emits `story:progress` (overall 0..1 across every sub-shot) and mounts the shot-by-shot
 * navigation (`src/motion/story-nav.ts`: settle, keyboard, `story:goto`, auto tour).
 */
export async function setupChapterScroll(host: ChapterScrollHost): Promise<ChapterScroll> {
  const { gsap, ScrollTrigger } = await loadGsap();
  /* A restored mid-page scroll lands before the pins exist and shows the wrong shot; the story starts at the top. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const tracker: Tracker = {
    host,
    ScrollTrigger,
    triggers: new Map(),
    lastChapter: SECTION_CHAPTERS.filter(chapter => chapterElement(chapter)).at(-1),
    current: null,
    currentSub: -1,
    healed: ''
  };
  sizeSpacers(tracker);
  createTriggers(tracker);
  const refresh = () => sync(tracker);
  refresh();
  const onLoaded = () => refresh();
  if (document.readyState !== 'complete') window.addEventListener('load', onLoaded, { once: true });
  void document.fonts?.ready.then(() => refresh());
  const onSettled = (event: Event) => healSettledShot(tracker, event);
  window.addEventListener('chapter:settled', onSettled);
  const disposeNav = setupStoryNav({ gsap, shots: () => storyShots(tracker), activeIndex: () => activeShotIndex(tracker) });

  return {
    positionOf: (chapter, sub) => positionOf(tracker, chapter, sub),
    refresh,
    dispose() {
      window.removeEventListener('load', onLoaded);
      window.removeEventListener('chapter:settled', onSettled);
      disposeNav();
      for (const trigger of tracker.triggers.values()) trigger.kill(true);
      clearSpacers();
    }
  };
}
