import { Plane, Raycaster, Vector2, Vector3, type PerspectiveCamera } from 'three';
import type { PointerField, PointerSample } from './contracts';

export class StagePointer implements PointerField {
  readonly ndc = new Vector2();
  readonly screen = new Vector2();
  readonly velocity = new Vector2();
  world: Vector3 | null = null;
  active = false;
  enabled = true;
  readonly fine = matchMedia('(pointer: fine)').matches;
  private readonly listeners = new Set<(sample: Readonly<PointerSample>) => void>();
  private readonly raycaster = new Raycaster();
  private readonly plane = new Plane();
  private lastTime = 0;

  onPointer(listener: (sample: Readonly<PointerSample>) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  move(x: number, y: number, width: number, height: number, camera: PerspectiveCamera, target: Vector3): void {
    const now = performance.now();
    const dt = Math.max((now - this.lastTime) / 1000, 1 / 240);
    if (this.lastTime > 0) {
      const vx = (x - this.screen.x) / dt;
      const vy = (y - this.screen.y) / dt;
      this.velocity.set(this.velocity.x * 0.6 + vx * 0.4, this.velocity.y * 0.6 + vy * 0.4);
    }
    this.lastTime = now;
    this.screen.set(x, y);
    this.ndc.set((x / width) * 2 - 1, -(y / height) * 2 + 1);
    this.active = this.fine;
    this.raycaster.setFromCamera(this.ndc, camera);
    this.plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new Vector3()).negate(), target);
    this.world = this.raycaster.ray.intersectPlane(this.plane, this.world ?? new Vector3());
    for (const listener of this.listeners) listener(this);
  }

  settle(dt: number): void {
    const decay = Math.exp(-dt * 6);
    this.velocity.multiplyScalar(decay);
    if (this.velocity.lengthSq() < 1) this.velocity.set(0, 0);
  }

  leave(): void {
    this.active = false;
  }
}
