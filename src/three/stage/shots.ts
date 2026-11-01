import type { ChapterId, Shot } from '../contracts';
import { CAMERA_LIMITS } from '../director';
import { layoutKind, stackedLayout, type LayoutKind } from '../scenes/common';
import type { World } from '../world';
import type { StageOptions } from './types';

const PHONE_MONITOR_PUSH = 0.1;
/** The intro holds 4 % further back on the same axis, so leaving it is a short dolly-in onto the hero. */
const INTRO_PULLBACK = 0.04;
/** Sub-shots when neither the desk nor the plates say otherwise. */
export const DEFAULT_SUBS: Partial<Record<ChapterId, number>> = { products: 3 };
/**
 * Chapters whose text lives in anchored 2D panels: the camera breathes there. The CSS3D chapters
 * (monitor, phone) stay still, because their 1:1 text would shimmer or slide on the glass.
 */
const BREATHING_CHAPTERS: ReadonlySet<ChapterId> = new Set(['company', 'products', 'experience', 'outro']);
/** Stacked phones read the monitor chapters from 2D panels too, so those shots breathe as well. */
const BREATHING_STACKED: ReadonlySet<ChapterId> = new Set([...BREATHING_CHAPTERS, 'hero', 'about']);

export function breathes(stacked: boolean, chapter: ChapterId): boolean {
  return (stacked ? BREATHING_STACKED : BREATHING_CHAPTERS).has(chapter);
}

export function stageFov(layout: LayoutKind, stacked: boolean): number {
  if (stacked) return CAMERA_LIMITS.fovStacked;
  return layout === 'desktop' ? CAMERA_LIMITS.fovDesktop : CAMERA_LIMITS.fovTouch;
}

/** The chapter fixed by capture or `?chapter=`, if any. */
export function fixedChapter(options: StageOptions): { id: ChapterId; sub: number } | null {
  const fixed = options.capture ?? (options.forcedChapter ? { chapter: options.forcedChapter, sub: options.forcedSub ?? 0 } : null);
  return fixed ? { id: fixed.chapter, sub: fixed.sub } : null;
}

/**
 * Chapter shot for the current layout. Landscape phones push the hero (and intro) in 10 % towards
 * the target so the screen text is not tiny (a straight dolly: roll and FOV are unchanged).
 */
export function layoutShot(world: World, layout: LayoutKind, stacked: boolean, id: ChapterId, sub: number): Shot {
  const shot = world.shot(id, sub);
  const readsMonitor = layout === 'phone' && !stacked && (id === 'hero' || id === 'intro');
  const push = (readsMonitor ? PHONE_MONITOR_PUSH : 0) - (id === 'intro' ? INTRO_PULLBACK : 0);
  if (!push) return shot;
  const position = shot.position.clone().lerp(shot.target, push);
  return { ...shot, position };
}

const RESIZE_HEIGHT_THRESHOLD = 150;

/** Canvas size and the layout it implies (desktop / touch / phone, stacked or not). */
export class StageLayout {
  size = { width: 0, height: 0 };
  kind: LayoutKind = 'desktop';
  stacked = false;

  /** Re-reads the container; null when the change is too small to matter (mobile URL bar), else whether stacking flipped. */
  measure(container: HTMLElement, force: boolean): { restack: boolean } | null {
    const rect = container.getBoundingClientRect();
    const width = Math.round(rect.width) || window.innerWidth;
    const height = Math.round(rect.height) || window.innerHeight;
    if (!force && width === this.size.width && Math.abs(height - this.size.height) <= RESIZE_HEIGHT_THRESHOLD) return null;
    this.size = { width, height };
    this.kind = layoutKind(width);
    const stacked = stackedLayout(this.size);
    const restack = stacked !== this.stacked;
    this.stacked = stacked;
    return { restack };
  }

  fov(): number {
    return stageFov(this.kind, this.stacked);
  }

  shot(world: World, id: ChapterId, sub: number): Shot {
    return layoutShot(world, this.kind, this.stacked, id, sub);
  }
}
