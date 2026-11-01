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
 * Chapters on scroll (GSAP ScrollTrigger, loaded only inside the 3D chunk). Desktop: each section
 * is pinned for `subs × 100vh` and the camera changes shot only at chapter / sub-shot boundaries.
 * Touch: no pin and no scrub; a chapter fires when its section reaches 50 % of the viewport and
 * its spacer is `subs × 100svh` tall. No `normalizeScroll`.
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
  const touch = matchMedia('(pointer: coarse)').matches || innerWidth < 1024;
  const triggers = new Map<ChapterId, InstanceType<typeof ScrollTrigger>>();
  let current: ChapterId | null = null;
  let currentSub = -1;

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

  for (const chapter of SECTION_CHAPTERS) {
    const section = chapterElement(chapter);
    if (!section) continue;
    const subs = () => Math.max(1, host.subCount(chapter));
    if (!touch) {
      triggers.set(
        chapter,
        ScrollTrigger.create({
          trigger: section,
          start: 'top top+=2',
          end: () => `+=${subs() * innerHeight}`,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          onToggle: self => toggle(chapter, self.isActive, self.progress),
          onUpdate: self => report(chapter, self.progress)
        })
      );
    } else {
      section.style.minHeight = `${subs() * 100}svh`;
      triggers.set(
        chapter,
        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: self => toggle(chapter, self.isActive, self.progress),
          onUpdate: self => report(chapter, self.progress)
        })
      );
    }
  }
  ScrollTrigger.refresh();
  const active = [...triggers].filter(([, trigger]) => trigger.isActive).pop();
  if (active) toggle(active[0], true, active[1].progress);

  const positionOf = (chapter: ChapterId, sub: number): number | null => {
    const trigger = triggers.get(chapter);
    if (!trigger) return null;
    const subs = subsOf(chapter);
    return trigger.start + ((Math.min(sub, subs - 1) + 0.5) / subs) * (trigger.end - trigger.start);
  };

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
    refresh() {
      if (touch) {
        for (const chapter of SECTION_CHAPTERS) {
          const section = chapterElement(chapter);
          if (section) section.style.minHeight = `${Math.max(1, host.subCount(chapter)) * 100}svh`;
        }
      }
      ScrollTrigger.refresh();
    },
    dispose() {
      disposeNav();
      for (const trigger of triggers.values()) trigger.kill(true);
      for (const chapter of SECTION_CHAPTERS) chapterElement(chapter)?.style.removeProperty('min-height');
    }
  };
}
