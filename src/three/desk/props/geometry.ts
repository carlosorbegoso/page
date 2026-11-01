import { CylinderGeometry, Matrix4, Quaternion, Vector3 } from 'three';
import { PartBuilder, type Finish } from '../builder';
import type { Quality } from './palette';

export const UP = new Vector3(0, 1, 0);

export function seg(base: number, q: Quality, min = 3): number {
  return Math.max(min, Math.round(base * q));
}

export function shade(finish: Finish, factor: number, warmth = 0): Finish {
  const color = finish.color.clone().multiplyScalar(factor);
  color.r *= 1 + warmth;
  color.b *= 1 - warmth;
  return { ...finish, color };
}

/** Matrix that places a +Y-aligned primitive centred between two points. */
export function between(from: Vector3, to: Vector3): Matrix4 {
  const direction = to.clone().sub(from);
  const quaternion = new Quaternion().setFromUnitVectors(UP, direction.clone().normalize());
  return new Matrix4().compose(from.clone().add(to).multiplyScalar(0.5), quaternion, new Vector3(1, 1, 1));
}

export function along(origin: Vector3, direction: Vector3, offset: number): Matrix4 {
  const quaternion = new Quaternion().setFromUnitVectors(UP, direction.clone().normalize());
  return new Matrix4().compose(origin.clone().addScaledVector(direction, offset), quaternion, new Vector3(1, 1, 1));
}

export function rod(builder: PartBuilder, from: Vector3, to: Vector3, radius: number, finish: Finish, q: Quality, id = 0): void {
  builder.add(new CylinderGeometry(radius, radius, from.distanceTo(to), seg(10, q)), finish, between(from, to), id);
}

export function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
