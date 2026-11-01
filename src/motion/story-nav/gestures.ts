import type { Snapper } from './snap';
import { dialogOpen, type NavState } from './types';

const SWIPE_MIN_PX = 48;
const SWIPE_DOMINANCE = 1.5;
const SWIPE_MAX_MS = 800;
const EDGE_PX = 24;
const OWNS_SWIPES = '[data-plate-mode="surface-phone"], input, textarea, select, [contenteditable]:not([contenteditable="false"]), dialog, [data-hud-menu]';

export interface GestureHandlers {
  onTouchStart(event: TouchEvent): void;
  onTouchEnd(event: TouchEvent): void;
  onPointerDown(event: PointerEvent): void;
  onPointerUp(): void;
}

interface SwipeStart {
  x: number;
  y: number;
  at: number;
}

function swipeStart(event: TouchEvent): SwipeStart | null {
  const touch = event.touches[0];
  if (event.touches.length !== 1 || !touch || dialogOpen()) return null;
  if (touch.clientX < EDGE_PX || touch.clientX > innerWidth - EDGE_PX) return null;
  if (event.target instanceof Element && event.target.closest(OWNS_SWIPES)) return null;
  return { x: touch.clientX, y: touch.clientY, at: performance.now() };
}

export function horizontalSwipe(start: SwipeStart | null, event: TouchEvent): -1 | 1 | 0 {
  const touch = event.changedTouches[0];
  if (!start || !touch || performance.now() - start.at > SWIPE_MAX_MS) return 0;
  const dx = touch.clientX - start.x;
  const dy = touch.clientY - start.y;
  if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * SWIPE_DOMINANCE) return 0;
  return dx < 0 ? 1 : -1;
}

export function createGestureHandlers(state: NavState, snapper: Snapper, interrupt: (event: Event) => void, step: (delta: 1 | -1) => void): GestureHandlers {
  let start: SwipeStart | null = null;
  return {
    onTouchStart(event) {
      state.touches = event.touches.length;
      start = swipeStart(event);
      interrupt(event);
    },
    onTouchEnd(event) {
      state.touches = event.touches.length;
      if (state.touches > 0) return;
      const delta = horizontalSwipe(start, event);
      start = null;
      if (delta) step(delta);
      else snapper.schedule();
    },
    onPointerDown(event) {
      if (event.pointerType === 'mouse') state.pointerHeld = true;
      interrupt(event);
    },
    onPointerUp() {
      if (!state.pointerHeld) return;
      state.pointerHeld = false;
      snapper.schedule();
    }
  };
}
