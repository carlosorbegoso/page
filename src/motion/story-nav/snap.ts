import { moves, type Scroller } from './scroll';
import { nearestIndex } from './shot-index';
import { dialogOpen, type NavState, type StoryNavHost } from './types';

const SNAP_IDLE_MS = 150;
const KEY_GUARD_MS = 1000;

export interface Snapper {
  schedule(): void;
}

function snapBlocked(state: NavState): boolean {
  return Boolean(state.tween) || state.touches > 0 || state.pointerHeld || !moves();
}

/** A gentle settle on the nearest shot once the visitor has stopped scrolling. */
export function createSnapper(host: StoryNavHost, state: NavState, scroller: Scroller): Snapper {
  function trySnap(): void {
    state.snapTimer = 0;
    if (snapBlocked(state)) return;
    const now = performance.now();
    if (now - state.lastNativeKey < KEY_GUARD_MS) return;
    if (now - state.lastWheel < SNAP_IDLE_MS) {
      schedule();
      return;
    }
    if (dialogOpen()) return;
    const shots = host.shots();
    if (!shots.length) return;
    const index = nearestIndex(shots);
    const top = index < 0 ? 0 : shots[index]!.top;
    if (Math.abs(top - scrollY) < 2) return;
    scroller.scrollToY(top, index < 0 ? null : index);
  }

  function schedule(): void {
    window.clearTimeout(state.snapTimer);
    state.snapTimer = window.setTimeout(trySnap, SNAP_IDLE_MS);
  }

  return { schedule };
}
