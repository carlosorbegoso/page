import type { Plane, Quaternion, Vector3 } from 'three';

export interface Viewport {
  width: number;
  height: number;
  /** Device FOV from the director (30 desktop, 40 below 1024 px, wider on stacked phones). */
  fov: number;
}

/** A framed shot: eye, subject and where the subject lands on screen. */
export interface Framing {
  eye: Vector3;
  /** Subject in sharp focus (depth of field). */
  focus: Vector3;
  /** Point placed at (sx, sy) when it differs from `focus` (the centre of a group framed whole). */
  aim?: Vector3;
  sx: number;
  sy: number;
  /** Where a 2D panel starts on screen for this shot (`getAnchor`). */
  panel?: { name: string; sx: number; sy: number; plane?: Plane };
}

export interface SurfaceFrame {
  centre: Vector3;
  normal: Vector3;
  quaternion: Quaternion;
  width: number;
  height: number;
}

/** Camera pose of a shot around its subject; portrait distances are for a 40° lens. */
export interface Setup {
  heading: number;
  pitch: number;
  distance: number;
}

/** Screen area (fractions) that every protagonist point must stay inside. */
export interface Region {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export type ScreenPoint = { x: number; y: number };

/** Where the subject lands on screen (fractions, y down). */
export type Place = { sx: number; sy: number };
