import { OWNS_POINTER, swallowNextClick } from '../look-input';
import type { ExploreCamera } from './camera';

const DEG = Math.PI / 180;
const RADIANS_PER_PX = 0.0042;
const KEY_STEP = 12 * DEG;
const DRAG_THRESHOLD_PX = 6;
const TILT_GAIN = 0.9;
const KEYS: Record<string, [number, number]> = {
  ArrowLeft: [KEY_STEP, 0],
  ArrowRight: [-KEY_STEP, 0],
  ArrowUp: [0, KEY_STEP / 2],
  ArrowDown: [0, -KEY_STEP / 2],
  a: [KEY_STEP, 0],
  d: [-KEY_STEP, 0],
  w: [0, KEY_STEP / 2],
  s: [0, -KEY_STEP / 2]
};

export interface ExploreInputHost {
  camera: ExploreCamera;
  wake(): void;
  exit(): void;
}

class Drag {
  private start: { x: number; y: number; id: number } | null = null;
  private last = { x: 0, y: 0 };
  private dragging = false;

  constructor(private readonly host: ExploreInputHost) {}

  readonly down = (event: PointerEvent) => {
    if (
      event.button !== 0 ||
      !(event.target instanceof Element) ||
      event.target.closest(OWNS_POINTER)
    )
      return;
    this.start = { x: event.clientX, y: event.clientY, id: event.pointerId };
    this.last = { x: event.clientX, y: event.clientY };
    this.dragging = false;
  };

  readonly move = (event: PointerEvent) => {
    if (!this.start || event.pointerId !== this.start.id) return;
    if (
      !this.dragging &&
      Math.hypot(event.clientX - this.start.x, event.clientY - this.start.y) < DRAG_THRESHOLD_PX
    )
      return;
    this.dragging = true;
    this.host.camera.turn(
      (event.clientX - this.last.x) * RADIANS_PER_PX,
      (event.clientY - this.last.y) * RADIANS_PER_PX
    );
    this.last = { x: event.clientX, y: event.clientY };
    this.host.wake();
  };

  readonly up = (event: PointerEvent) => {
    if (!this.start || event.pointerId !== this.start.id) return;
    if (this.dragging) swallowNextClick();
    this.start = null;
    this.dragging = false;
  };
}

function keyHandler(host: ExploreInputHost): (event: KeyboardEvent) => void {
  return event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'Escape') {
      host.exit();
      return;
    }
    const turn = KEYS[event.key.length === 1 ? event.key.toLowerCase() : event.key];
    if (!turn) return;
    event.preventDefault();
    host.camera.turn(turn[0], turn[1]);
    host.wake();
  };
}

function tiltHandler(host: ExploreInputHost): (event: DeviceOrientationEvent) => void {
  let previous: { alpha: number; beta: number } | null = null;
  return event => {
    if (event.alpha === null || event.beta === null) return;
    if (previous) {
      const dAlpha = ((event.alpha - previous.alpha + 540) % 360) - 180;
      host.camera.turn(dAlpha * DEG * TILT_GAIN, (event.beta - previous.beta) * DEG * TILT_GAIN);
      host.wake();
    }
    previous = { alpha: event.alpha, beta: event.beta };
  };
}

export function attachExploreInput(host: ExploreInputHost): () => void {
  const drag = new Drag(host);
  const onKey = keyHandler(host);
  const onTilt = tiltHandler(host);
  const pointer = [
    ['pointerdown', drag.down],
    ['pointermove', drag.move],
    ['pointerup', drag.up],
    ['pointercancel', drag.up]
  ] as const;
  for (const [type, handler] of pointer) window.addEventListener(type, handler, { passive: true });
  window.addEventListener('keydown', onKey, { capture: true });
  window.addEventListener('deviceorientation', onTilt);
  return () => {
    for (const [type, handler] of pointer) window.removeEventListener(type, handler);
    window.removeEventListener('keydown', onKey, { capture: true });
    window.removeEventListener('deviceorientation', onTilt);
  };
}
