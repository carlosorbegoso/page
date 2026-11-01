import type { ChapterId, Shot } from '../contracts';
import { CAMERA_LIMITS } from '../director';
import { layoutKind, stackedLayout, type LayoutKind } from '../scenes/common';
import type { World } from '../world';
import type { StageOptions } from './types';

const PHONE_MONITOR_PUSH = 0.1;
const INTRO_PULLBACK = 0.14;
export const DEFAULT_SUBS: Partial<Record<ChapterId, number>> = { products: 3 };
const BREATHING_CHAPTERS: ReadonlySet<ChapterId> = new Set(['company', 'products', 'experience', 'outro']);
const BREATHING_STACKED: ReadonlySet<ChapterId> = new Set([...BREATHING_CHAPTERS, 'hero', 'about']);

export function breathes(stacked: boolean, chapter: ChapterId): boolean {
  return (stacked ? BREATHING_STACKED : BREATHING_CHAPTERS).has(chapter);
}

export function stageFov(layout: LayoutKind, stacked: boolean): number {
  if (stacked) return CAMERA_LIMITS.fovStacked;
  return layout === 'desktop' ? CAMERA_LIMITS.fovDesktop : CAMERA_LIMITS.fovTouch;
}

export function fixedChapter(options: StageOptions): { id: ChapterId; sub: number } | null {
  const fixed = options.capture ?? (options.forcedChapter ? { chapter: options.forcedChapter, sub: options.forcedSub ?? 0 } : null);
  return fixed ? { id: fixed.chapter, sub: fixed.sub } : null;
}

export function layoutShot(world: World, layout: LayoutKind, stacked: boolean, id: ChapterId, sub: number): Shot {
  const shot = world.shot(id, sub);
  const readsMonitor = layout === 'phone' && !stacked && (id === 'hero' || id === 'intro');
  const push = (readsMonitor ? PHONE_MONITOR_PUSH : 0) - (id === 'intro' ? INTRO_PULLBACK : 0);
  if (!push) return shot;
  const position = shot.position.clone().lerp(shot.target, push);
  return { ...shot, position };
}

const RESIZE_HEIGHT_THRESHOLD = 150;

export class StageLayout {
  size = { width: 0, height: 0 };
  kind: LayoutKind = 'desktop';
  stacked = false;

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
