import { Vector3, type PerspectiveCamera } from 'three';

/** Where a desk anchor lands on screen (CSS px), clamped near the frame for anchors outside it. */
export function screenPoint(anchor: Vector3 | null, camera: PerspectiveCamera, size: { width: number; height: number }): { x: number; y: number } | null {
  if (!anchor) return null;
  const ndc = new Vector3().copy(anchor).project(camera);
  if (ndc.z > 1) return null;
  const clampNdc = (v: number) => Math.min(Math.max(v, -1.3), 1.3);
  return { x: ((clampNdc(ndc.x) + 1) / 2) * size.width, y: ((1 - clampNdc(ndc.y)) / 2) * size.height };
}

/** First rendered frame: tells the page (and the capture script) the scene is visible. */
export function announceReveal(container: HTMLElement, intro: boolean, lamp: { x: number; y: number } | null, capture: boolean): void {
  window.dispatchEvent(new CustomEvent('stage:reveal', { detail: { intro, lamp } }));
  container.dataset.ready = 'true';
  if (capture) {
    requestAnimationFrame(() => {
      window.__captureReady = true;
    });
  }
}
