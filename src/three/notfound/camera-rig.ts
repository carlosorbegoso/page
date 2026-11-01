import { PerspectiveCamera, Vector3, type WebGLRenderer } from 'three';
import { DEG, TARGET } from './constants';

const UP = new Vector3(0, 1, 0);

/** Pointer or tilt target in [-1, 1] and the eased value the camera follows. */
export interface PointerState {
  x: number;
  y: number;
  tx: number;
  ty: number;
}

export interface CameraRig {
  camera: PerspectiveCamera;
  pointer: PointerState;
  /** Fits the renderer and projection to the container; returns the viewport height in device pixels. */
  layout(container: HTMLElement, renderer: WebGLRenderer): number;
  place(time: number): void;
  centre(): void;
}

function shiftProjectionAwayFromCopy(camera: PerspectiveCamera, width: number, height: number, portrait: boolean): void {
  // The HTML copy sits left on landscape and below on portrait; shifting the projection keeps the sheet clear of it.
  if (portrait) camera.setViewOffset(width, height, width * 0.14, height * 0.23, width, height);
  else camera.setViewOffset(width, height, -width * 0.2, -height * 0.06, width, height);
}

function easePointer(pointer: PointerState): void {
  pointer.x += (pointer.tx - pointer.x) * 0.04;
  pointer.y += (pointer.ty - pointer.y) * 0.04;
}

function swayedOffset(base: Vector3, pointer: PointerState, time: number, out: Vector3): Vector3 {
  const yaw = pointer.x * 2 * DEG + Math.sin(time * 0.21) * 0.4 * DEG;
  const pitch = pointer.y * 1.2 * DEG + Math.sin(time * 0.33) * 0.25 * DEG;
  out.copy(base).applyAxisAngle(UP, yaw);
  const side = new Vector3(out.z, 0, -out.x).normalize();
  out.applyAxisAngle(side, pitch);
  return out.multiplyScalar(1 + Math.sin(time * 0.17) * 0.006);
}

export function createCameraRig(): CameraRig {
  const camera = new PerspectiveCamera(32, 1, 0.1, 30);
  const pointer: PointerState = { x: 0, y: 0, tx: 0, ty: 0 };
  const baseOffset = new Vector3();
  const offset = new Vector3();
  return {
    camera,
    pointer,
    layout(container, renderer) {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      renderer.setSize(width, height, false);
      const portrait = height > width;
      camera.aspect = width / height;
      camera.fov = portrait ? 46 : 34;
      baseOffset.set(0.12, 0.44, 0.89).normalize().multiplyScalar(portrait ? 4.9 : 4.2);
      shiftProjectionAwayFromCopy(camera, width, height, portrait);
      camera.updateProjectionMatrix();
      return height * renderer.getPixelRatio();
    },
    place(time) {
      easePointer(pointer);
      camera.position.copy(TARGET).add(swayedOffset(baseOffset, pointer, time, offset));
      camera.up.set(0, 1, 0);
      camera.lookAt(TARGET);
    },
    centre() {
      pointer.x = pointer.tx = 0;
      pointer.y = pointer.ty = 0;
    }
  };
}
