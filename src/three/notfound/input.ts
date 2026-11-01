import { motionAllowed, watchMotion } from '../motion';
import type { PointerState } from './camera-rig';
import type { FrameLoop } from './loop';

export interface InputHost {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  pointer: PointerState;
  loop: FrameLoop;
  relayout(): void;
}

function aimWithMouse(pointer: PointerState, event: PointerEvent): void {
  if (event.pointerType !== 'mouse') return;
  pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
}

function aimWithTilt(pointer: PointerState, event: DeviceOrientationEvent): void {
  if (event.gamma === null || event.beta === null) return;
  pointer.tx = Math.max(-1, Math.min(1, event.gamma / 30));
  pointer.ty = Math.max(-1, Math.min(1, (event.beta - 45) / 30));
}

function followMotionPreference(loop: FrameLoop): () => void {
  return watchMotion(state => {
    const allowed = motionAllowed(state);
    loop.setMotion(allowed);
    if (allowed) loop.play();
    else {
      loop.stop();
      loop.still();
    }
  });
}

/** Wires pointer, tilt, resize, visibility, motion preference and context loss; returns the detacher. */
export function listenNotFound({ container, canvas, pointer, loop, relayout }: InputHost): () => void {
  const onPointer = (event: PointerEvent) => aimWithMouse(pointer, event);
  const onTilt = (event: DeviceOrientationEvent) => aimWithTilt(pointer, event);
  const onResize = () => {
    relayout();
    if (!loop.running) loop.still();
  };
  const onVisibility = () => (document.hidden ? loop.stop() : loop.play());
  const unwatch = followMotionPreference(loop);
  const onContextLost = (event: Event) => {
    event.preventDefault();
    loop.stop();
    container.dataset.degraded = 'context-lost';
  };

  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('deviceorientation', onTilt, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('webglcontextlost', onContextLost);

  return () => {
    unwatch();
    window.removeEventListener('pointermove', onPointer);
    window.removeEventListener('deviceorientation', onTilt);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.removeEventListener('webglcontextlost', onContextLost);
  };
}
