import { Vector3, type PerspectiveCamera } from 'three';
import type { PlateAnchor } from '../contracts';

type ScreenPoint = { x: number; y: number } | null;

export function screenPoint(anchor: Vector3 | null, camera: PerspectiveCamera, size: { width: number; height: number }): { x: number; y: number } | null {
  if (!anchor) return null;
  const ndc = new Vector3().copy(anchor).project(camera);
  if (ndc.z > 1) return null;
  const clampNdc = (v: number) => Math.min(Math.max(v, -1.3), 1.3);
  return { x: ((clampNdc(ndc.x) + 1) / 2) * size.width, y: ((1 - clampNdc(ndc.y)) / 2) * size.height };
}

export function surfaceFoot(surface: PlateAnchor | null): Vector3 | null {
  if (!surface) return null;
  const drop = (surface.size?.height ?? 0) / 2;
  return new Vector3(0, -drop, 0).applyQuaternion(surface.quaternion).add(surface.position);
}

export function announceReveal(container: HTMLElement, intro: boolean, points: { lamp: ScreenPoint; monitor: ScreenPoint }, capture: boolean): void {
  window.dispatchEvent(new CustomEvent('stage:reveal', { detail: { intro, ...points } }));
  container.dataset.ready = 'true';
  if (capture) {
    requestAnimationFrame(() => {
      window.__captureReady = true;
    });
  }
}
