import { Matrix4, Quaternion, Vector3 } from 'three';
import { UP } from '../geometry';

export const FRONT = new Vector3(0, 0, 1);

export function standing(base: Vector3, yaw: number): (m: Matrix4) => Matrix4 {
  const frame = new Matrix4().compose(base, new Quaternion().setFromAxisAngle(UP, yaw), new Vector3(1, 1, 1));
  return m => new Matrix4().multiplyMatrices(frame, m);
}

export function sphereDirection(phi: number, theta: number): Vector3 {
  return new Vector3(-Math.cos(phi) * Math.sin(theta), Math.cos(theta), Math.sin(phi) * Math.sin(theta));
}
