import type { Object3D, PerspectiveCamera, WebGLRenderer } from 'three';
import type { StationContext } from '../contracts';
import type { StagePointer } from '../pointer';
import type { Tier } from '../tier';
import type { World } from '../world';

export interface StationContextHost {
  tier: Tier;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  world: World;
  pointer: StagePointer;
  capture: boolean;
  motion(): boolean;
  fov(): number;
  invalidate(): void;
  precompile(object?: Object3D): Promise<void>;
}

/** What the desk set and legacy stations get from the stage when they load. */
export function stationContext(host: StationContextHost): StationContext {
  return {
    tier: host.tier,
    renderer: host.renderer,
    camera: host.camera,
    scene: host.world.scene,
    pointer: host.pointer,
    capture: host.capture,
    motion: () => host.motion(),
    fov: () => host.fov(),
    readingPose: id => host.world.shot(id, 0),
    invalidate: () => host.invalidate(),
    precompile: object => host.precompile(object)
  };
}
