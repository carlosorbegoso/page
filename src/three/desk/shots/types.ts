import type { Plane, Quaternion, Vector3 } from 'three';

export interface Viewport {
  width: number;
  height: number;
  fov: number;
}

export interface Framing {
  eye: Vector3;
  focus: Vector3;
  aim?: Vector3;
  sx: number;
  sy: number;
  panel?: { name: string; sx: number; sy: number; plane?: Plane };
}

export interface SurfaceFrame {
  centre: Vector3;
  normal: Vector3;
  quaternion: Quaternion;
  width: number;
  height: number;
}

export interface Setup {
  heading: number;
  pitch: number;
  distance: number;
}

export interface Region {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export type ScreenPoint = { x: number; y: number };

export type Place = { sx: number; sy: number };
