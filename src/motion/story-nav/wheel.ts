import { dialogOpen, type NavState, type StoryGotoDetail } from './types';

/** A wheel gesture ends after this long without wheel events; a flick's momentum tail has no such gap. */
const WHEEL_GESTURE_GAP_MS = 160;
const WHEEL_STEP_PX = 40;
const WHEEL_LINE_PX = 16;

/** The wheel belongs to something else: a scrollable box under the pointer, a dialog or the HUD menu. */
function wheelOwnedElsewhere(event: WheelEvent): boolean {
  if (dialogOpen()) return true;
  for (let el = event.target instanceof Element ? event.target : null; el && el !== document.body; el = el.parentElement) {
    if (el.matches('dialog, [data-hud-menu], [role="listbox"]')) return true;
    const overflow = getComputedStyle(el).overflowY;
    if ((overflow === 'auto' || overflow === 'scroll') && el.scrollHeight > el.clientHeight + 1) return true;
  }
  return false;
}

function startGestureIfIdle(state: NavState, now: number): void {
  if (now - state.lastWheel > WHEEL_GESTURE_GAP_MS) {
    state.wheelSum = 0;
    state.wheelStepped = false;
  }
  state.lastWheel = now;
}

function wheelPixels(event: WheelEvent): number {
  const scale = event.deltaMode === 1 ? WHEEL_LINE_PX : event.deltaMode === 2 ? innerHeight : 1;
  return event.deltaY * scale;
}

/**
 * One wheel gesture moves at most one shot: the first ~40 px in a direction step through
 * `story:goto`; the rest of the gesture, and any wheel while a step tween runs, is swallowed.
 */
export function createWheelHandler(state: NavState, interrupt: (event: Event) => void): (event: WheelEvent) => void {
  return event => {
    startGestureIfIdle(state, performance.now());
    interrupt(event);
    if (event.ctrlKey || event.metaKey || event.altKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    if (wheelOwnedElsewhere(event)) return;
    if (state.wheelStepped || state.tween) {
      if (event.cancelable) event.preventDefault();
      if (state.wheelStepped) return;
    }
    const delta = wheelPixels(event);
    if (Math.sign(delta) !== Math.sign(state.wheelSum)) state.wheelSum = 0;
    state.wheelSum += delta;
    if (Math.abs(state.wheelSum) < WHEEL_STEP_PX) return;
    if (event.cancelable) event.preventDefault();
    state.wheelStepped = true;
    state.wheelSum = 0;
    window.dispatchEvent(
      new CustomEvent<StoryGotoDetail>('story:goto', { detail: { step: delta > 0 ? 1 : -1 } })
    );
  };
}
