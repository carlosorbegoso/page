import type { Vector3 } from 'three';
import { ExploreCamera } from './camera';
import { attachExploreInput } from './input';

export interface CameraOverride {
  apply(position: Vector3, target: Vector3, dt: number, instant: boolean): boolean;
}

export interface ExploreHost {
  setOverride(override: CameraOverride | null): void;
  resetLook(): void;
  wake(): void;
}

const EXIT_SETTLE_MS = 1500;

export class ExploreMode {
  private readonly camera = new ExploreCamera();
  private releaseInput: (() => void) | null = null;
  private exitTimer = 0;
  private active = false;

  constructor(private readonly host: ExploreHost) {}

  toggle(): void {
    if (this.active) this.exit();
    else this.enter();
  }

  enter(): void {
    if (this.active) return;
    window.clearTimeout(this.exitTimer);
    this.active = true;
    this.camera.enter();
    this.host.resetLook();
    this.host.setOverride(this.camera);
    this.releaseInput = attachExploreInput({
      camera: this.camera,
      wake: () => this.host.wake(),
      exit: () => this.exit()
    });
    document.documentElement.dataset.exploring = '';
    this.announce();
  }

  exit(): void {
    if (!this.active) return;
    this.active = false;
    this.camera.exit();
    this.releaseInput?.();
    this.releaseInput = null;
    delete document.documentElement.dataset.exploring;
    this.exitTimer = window.setTimeout(() => {
      if (!this.camera.engaged) this.host.setOverride(null);
    }, EXIT_SETTLE_MS);
    this.announce();
  }

  private announce(): void {
    this.host.wake();
    window.dispatchEvent(new CustomEvent('explore:change', { detail: { active: this.active } }));
  }

  dispose(): void {
    if (this.active) this.exit();
    window.clearTimeout(this.exitTimer);
    this.host.setOverride(null);
  }
}
