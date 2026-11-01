import { Euler, Quaternion, Vector3, type Matrix4 } from 'three';
import { MONITOR } from '../layout';
import type { SurfaceFrame } from './types';

export function monitorFrame(): SurfaceFrame {
  const quaternion = new Quaternion().setFromEuler(new Euler(MONITOR.tilt, MONITOR.yaw, 0, 'YXZ'));
  const normal = new Vector3(0, 0, 1).applyQuaternion(quaternion);
  const centre = MONITOR.centre.clone().addScaledVector(normal, MONITOR.depth / 2 + 0.0006);
  const { width, height } = MONITOR.screen;
  return { centre, normal, quaternion, width, height };
}

export function phoneFrame(matrix: Matrix4, width: number, height: number): SurfaceFrame {
  const centre = new Vector3();
  const quaternion = new Quaternion();
  matrix.decompose(centre, quaternion, new Vector3());
  return { centre, normal: new Vector3(0, 0, 1).applyQuaternion(quaternion), quaternion, width, height };
}
