import type { ChapterId } from './contracts';
import { chapterElement, SECTION_CHAPTERS } from './sections';
import { setupStoryNav, type StoryShot } from '../motion/story-nav';

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

/**
 * Chapters on scroll (GSAP ScrollTrigger, loaded only inside the 3D chunk). Every sub-shot owns
 * exactly one viewport of scroll and nothing else scrolls: every section is a `subs × 100svh` spacer,
 * with no pin and no scrub, on every device. A chapter fires when its section reaches 50 % of the
 * viewport and the camera changes shot only at sub-shot boundaries. No `normalizeScroll`.
 * Also emits `story:progress` (overall 0..1 across every sub-shot) and mounts the shot-by-shot
 * navigation (`src/motion/story-nav.ts`: settle, keyboard, `story:goto`, auto tour).
 */
export async function setupChapterScroll(host: ChapterScrollHost): Promise<ChapterScroll> {
  const [{ gsap }, { ScrollTrigger }, { ScrollToPlugin }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/ScrollToPlugin')
  ]);
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  ScrollTrigger.config({ ignoreMobileResize: true });
  /* A restored mid-page scroll lands before the pins exist and shows the wrong shot; the story starts at the top. */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const triggers = new Map<ChapterId, InstanceType<typeof ScrollTrigger>>();
  let current: ChapterId | null = null;
  let currentSub = -1;
  let healed = '';

  const subsOf = (chapter: ChapterId) => Math.max(1, host.subCount(chapter));
  const storyChapters = () => SECTION_CHAPTERS.filter(chapter => triggers.has(chapter));

  /** Overall progress maps the centre of the first sub-shot to 0 and the centre of the last one to 1. */
  const reportStory = (chapter: ChapterId, progress: number) => {
    let before = 0;
    let total = 0;
    for (const id of storyChapters()) {
      if (id === chapter) before = total;
      total += subsOf(id);
    }
    const position = before + progress * subsOf(chapter);
    const value = total > 1 ? Math.min(1, Math.max(0, (position - 0.5) / (total - 1))) : 1;
    const index = Math.min(total - 1, before + Math.min(subsOf(chapter) - 1, Math.floor(progress * subsOf(chapter))));
    window.dispatchEvent(new CustomEvent('story:progress', { detail: { value, index, total } }));
  };

  const report = (chapter: ChapterId, progress: number) => {
    host.onProgress(chapter, progress);
    if (chapter !== current) return;
    reportStory(chapter, progress);
    const subs = subsOf(chapter);
    const sub = Math.min(subs - 1, Math.floor(progress * subs));
    if (sub === currentSub) return;
    currentSub = sub;
    host.onChapter(chapter, sub);
  };

  /** The most recently entered active trigger owns the camera; on leave, fall back to any other active one. */
  const toggle = (chapter: ChapterId, active: boolean, progress: number) => {
    if (active) {
      current = chapter;
      currentSub = -1;
      healed = '';
      report(chapter, progress);
      return;
    }
    if (current !== chapter) return;
    const other = [...triggers].find(([id, trigger]) => id !== chapter && trigger.isActive);
    if (!other) return;
    current = other[0];
    currentSub = -1;
    report(other[0], other[1].progress);
  };

  const lastChapter = SECTION_CHAPTERS.filter(chapter => chapterElement(chapter)).at(-1);
  /** The last trigger runs 2 px past the maximum scroll: ScrollTrigger is inactive at progress 1. */
  const edgeOf = (chapter: ChapterId) => (chapter === lastChapter ? 2 : 0);

  /** Sections are bare spacers once the plates live in their layers: each box is exactly subs × 100svh. */
  const sizeSpacers = () => {
    for (const chapter of SECTION_CHAPTERS) {
      const section = chapterElement(chapter);
      if (!section) continue;
      const height = `${subsOf(chapter) * 100}svh`;
      Object.assign(section.style, { height, minHeight: height, paddingBlock: '0px', boxSizing: 'border-box' });
    }
  };
  sizeSpacers();

  for (const chapter of SECTION_CHAPTERS) {
    const section = chapterElement(chapter);
    if (!section) continue;
    const edge = edgeOf(chapter);
    triggers.set(
      chapter,
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: () => `bottom 50%-=${edge}`,
        invalidateOnRefresh: true,
        onToggle: self => toggle(chapter, self.isActive, self.progress),
        onUpdate: self => report(chapter, self.progress)
      })
    );
  }

  /** Re-measures every spacer and hands the camera to the shot the real scrollY shows. */
  const sync = () => {
    sizeSpacers();
    ScrollTrigger.refresh();
    const active = [...triggers].filter(([, trigger]) => trigger.isActive).pop();
    const [chapter, trigger] = active ?? [...triggers][0] ?? [];
    if (!chapter || !trigger) return;
    const progress = active ? trigger.progress : 0;
    if (chapter === current) report(chapter, progress);
    else toggle(chapter, true, progress);
  };
  sync();
  const onLoaded = () => sync();
  if (document.readyState !== 'complete') window.addEventListener('load', onLoaded, { once: true });
  void document.fonts?.ready.then(() => sync());

  const positionOf = (chapter: ChapterId, sub: number): number | null => {
    const trigger = triggers.get(chapter);
    if (!trigger) return null;
    const subs = subsOf(chapter);
    const span = trigger.end - trigger.start - edgeOf(chapter);
    const index = Math.min(sub, subs - 1);
    /* The final shot rests at the very bottom so nothing scrolls past the credits. */
    if (chapter === lastChapter && index === subs - 1) return Math.min(trigger.start + span - 1, ScrollTrigger.maxScroll(window));
    return trigger.start + ((index + 0.5) / subs) * span;
  };

  /** A shot requested while the power-on held the camera can land after a newer one: ask again for the shot the scroll shows. */
  const onSettled = (event: Event) => {
    const detail = (event as CustomEvent<{ id: ChapterId; subIndex: number }>).detail;
    if (!detail || detail.id === 'intro' || !current || currentSub < 0) return;
    const wanted = `${current}:${currentSub}`;
    if ((detail.id === current && detail.subIndex === currentSub) || healed === wanted) return;
    healed = wanted;
    host.onChapter(current, currentSub);
  };
  window.addEventListener('chapter:settled', onSettled);

  const shots = (): StoryShot[] =>
    storyChapters().flatMap(chapter =>
      Array.from({ length: subsOf(chapter) }, (_, sub) => ({ chapter, sub, top: positionOf(chapter, sub) ?? 0 }))
    );

  const disposeNav = setupStoryNav({
    gsap,
    shots,
    activeIndex() {
      if (!current || currentSub < 0) return -1;
      let index = 0;
      for (const chapter of storyChapters()) {
        if (chapter === current) return index + Math.min(currentSub, subsOf(chapter) - 1);
        index += subsOf(chapter);
      }
      return -1;
    }
  });

  return {
    positionOf,
    refresh: sync,
    dispose() {
      window.removeEventListener('load', onLoaded);
      window.removeEventListener('chapter:settled', onSettled);
      disposeNav();
      for (const trigger of triggers.values()) trigger.kill(true);
      for (const chapter of SECTION_CHAPTERS) {
        const style = chapterElement(chapter)?.style;
        for (const property of ['height', 'min-height', 'padding-block', 'box-sizing']) style?.removeProperty(property);
      }
    }
  };
}
