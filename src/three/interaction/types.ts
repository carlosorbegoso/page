import type { Object3D, PerspectiveCamera } from 'three';
import type { StationPick } from '../contracts';

export interface PickSource {
  picks(): readonly StationPick[];
  resolvePick(object: Object3D): StationPick | null;
  setHover(object: Object3D | null): void;
}

export interface InteractionOptions {
  source: PickSource;
  camera: PerspectiveCamera;
  canvas: HTMLCanvasElement;
  navigate: (pick: StationPick) => void;
  invalidate: () => void;
}
