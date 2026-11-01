import type { Vector3 } from 'three';
import type { Shot } from '../contracts';

/** Within the director's limits for the short hops it is used for (≤ 24° and ≤ 1.2 m). */
const DETOUR_SECONDS = 1.2;

export interface DetourDetail {
  /** Close look to ease towards, or null to ease back to the chapter's shot. */
  shot: Shot | null;
}

function smootherstep(x: number): number {
  return x * x * x * (x * (x * 6 - 15) + 10);
}

/**
 * A close look at a prop on top of the chapter's shot (`desk:detour`): the camera eases there and
 * back without changing chapter, so the director stays settled and no chapter event fires.
 */
export class CameraDetour {
  private shot: Shot | null = null;
  private goal = 0;
  private progress = 0;

  set(shot: Shot | null): void {
    if (shot) this.shot = shot;
    this.goal = shot ? 1 : 0;
  }

  /** Blends the chapter pose towards the close look in place; true while it still eases. */
  apply(position: Vector3, target: Vector3, dt: number, instant: boolean): boolean {
    const step = instant ? 1 : dt / DETOUR_SECONDS;
    this.progress += Math.max(-step, Math.min(step, this.goal - this.progress));
    if (!this.shot || this.progress <= 0) return false;
    const t = smootherstep(this.progress);
    position.lerp(this.shot.position, t);
    target.lerp(this.shot.target, t);
    return this.progress !== this.goal;
  }
}

/** Feeds `desk:detour` window events to the director's detour; returns the cleanup. */
export function listenDetour(detour: CameraDetour, wake: () => void): () => void {
  const onDetour = (event: Event) => {
    detour.set((event as CustomEvent<DetourDetail>).detail?.shot ?? null);
    wake();
  };
  window.addEventListener('desk:detour', onDetour);
  return () => window.removeEventListener('desk:detour', onDetour);
}
