import type { StoryShot } from './types';

/** The active shot, or the last one once the page is scrolled past it, else -1 (the top). */
export function currentIndex(shots: StoryShot[], active: number): number {
  if (active >= 0) return active;
  const last = shots.at(-1);
  return last && scrollY > last.top ? shots.length - 1 : -1;
}

/** Index of the resting point nearest to the scroll position: -1 is the top of the page. */
export function nearestIndex(shots: StoryShot[]): number {
  let best = -1;
  let distance = scrollY;
  shots.forEach((shot, index) => {
    const gap = Math.abs(shot.top - scrollY);
    if (gap < distance) {
      best = index;
      distance = gap;
    }
  });
  return best;
}

/** Steps from where the page is (or is already heading), so a stale active shot never skips one. */
export function stepIndex(shots: StoryShot[], direction: 1 | -1, active: number, targetIndex: number | null): number {
  let next: number;
  if (targetIndex !== null) next = targetIndex + direction;
  else if (direction > 0) {
    next = shots.findIndex(shot => shot.top > scrollY + 2);
    if (next < 0) next = shots.length - 1;
    if (active >= 0) next = Math.max(next, active + 1);
  } else {
    next = shots.findLastIndex(shot => shot.top < scrollY - 2);
    if (active >= 0) next = Math.min(next, active - 1);
  }
  return Math.min(Math.max(next, -1), shots.length - 1);
}
