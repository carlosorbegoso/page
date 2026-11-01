import type { ChapterId } from './contracts';
import { chapterElement, SECTION_CHAPTERS } from './sections';

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
 */
export async function setupChapterScroll(host: ChapterScrollHost): Promise<ChapterScroll> {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const touch = matchMedia('(pointer: coarse)').matches || innerWidth < 1024;
  const triggers = new Map<ChapterId, InstanceType<typeof ScrollTrigger>>();
  let current: ChapterId | null = null;
  let currentSub = -1;

  const report = (chapter: ChapterId, progress: number) => {
    host.onProgress(chapter, progress);
    if (chapter !== current) return;
    const subs = Math.max(1, host.subCount(chapter));
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

  return {
    positionOf(chapter, sub) {
      const trigger = triggers.get(chapter);
      if (!trigger) return null;
      const subs = Math.max(1, host.subCount(chapter));
      return trigger.start + ((Math.min(sub, subs - 1) + 0.5) / subs) * (trigger.end - trigger.start);
    },
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
      for (const trigger of triggers.values()) trigger.kill(true);
      for (const chapter of SECTION_CHAPTERS) chapterElement(chapter)?.style.removeProperty('min-height');
    }
  };
}
