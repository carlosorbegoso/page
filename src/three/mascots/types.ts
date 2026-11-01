import type { Object3D } from 'three';

export type MascotId = 'alfa' | 'burbu' | 'gift' | 'tool';

export interface Mascot {
  readonly id: MascotId;
  readonly root: Object3D;
  readonly height: number;
  setSignal(level: number): void;
  setFocus(weight: number): void;
  update(time: number, motion: boolean): void;
  applyTokens(): void;
  dispose(): void;
}
