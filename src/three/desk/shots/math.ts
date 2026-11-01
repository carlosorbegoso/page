import { Vector3 } from 'three';
import type { Viewport } from './types';

export const DEG = Math.PI / 180;

/** View direction for a heading (+ = looking right, towards +X) and pitch (+ = up). */
function direction(heading: number, pitch: number): Vector3 {
  return new Vector3(Math.sin(heading * DEG) * Math.cos(pitch * DEG), Math.sin(pitch * DEG), -Math.cos(heading * DEG) * Math.cos(pitch * DEG));
}

export function eyeFor(focus: Vector3, heading: number, pitch: number, distance: number): Vector3 {
  return focus.clone().addScaledVector(direction(heading, pitch), -distance);
}

/** Distance at which an object of `size` metres spans `fraction` of the frame width. */
export function widthFit(size: number, fraction: number, view: Viewport): number {
  const tan = Math.tan((view.fov * DEG) / 2);
  return size / fraction / (2 * tan * (view.width / view.height));
}

/** Distance at which an object of `size` metres spans `fraction` of the frame height. */
export function heightFit(size: number, fraction: number, view: Viewport): number {
  return size / fraction / (2 * Math.tan((view.fov * DEG) / 2));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * How portrait the viewport is: 0 from a square frame up (landscape values verbatim, so desktop
 * keeps its shots), 1 from a 0.6 phone down, eased in between so tablets get one blended shot.
 */
export function portraitBlend(view: Viewport): number {
  const x = clamp((1 - view.width / view.height) / 0.4, 0, 1);
  return x * x * (3 - 2 * x);
}
