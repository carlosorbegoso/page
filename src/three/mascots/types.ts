import type { Object3D } from 'three';

export type MascotId = 'alfa' | 'burbu' | 'gift' | 'tool';

/**
 * Contract every mascot honours, procedural or GLB: 1 unit = 1 metre, `root` pivot at the
 * base (y = 0 touches the ground), facing +Z. Scenes only talk to this interface.
 */
export interface Mascot {
  readonly id: MascotId;
  readonly root: Object3D;
  /** Approximate height in metres, used for framing. */
  readonly height: number;
  /** Scales the signal line emission relative to its token intensity (1 = nominal). */
  setSignal(level: number): void;
  /** 0..1 focus weight; mascots react in their own way (the gift lid lifts, …). */
  setFocus(weight: number): void;
  /** Idle animation. `motion` is false under reduced-motion, pause or capture. */
  update(time: number, motion: boolean): void;
  /** Re-reads colour tokens (theme change). */
  applyTokens(): void;
  dispose(): void;
}
