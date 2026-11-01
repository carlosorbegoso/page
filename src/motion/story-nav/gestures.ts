import type { Snapper } from './snap';
import type { NavState } from './types';

export interface GestureHandlers {
  onTouchStart(event: TouchEvent): void;
  onTouchEnd(event: TouchEvent): void;
  onPointerDown(event: PointerEvent): void;
  onPointerUp(): void;
}

export function createGestureHandlers(state: NavState, snapper: Snapper, interrupt: (event: Event) => void): GestureHandlers {
  return {
    onTouchStart(event) {
      state.touches = event.touches.length;
      interrupt(event);
    },
    onTouchEnd(event) {
      state.touches = event.touches.length;
      if (state.touches === 0) snapper.schedule();
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
