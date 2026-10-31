import { Matrix4, Quaternion, Vector3 } from 'three';

/**
 * Room-local coordinates (1 u = 1 m, +Y up): origin on the floor under the centre of the
 * desk top, −Z towards the window wall. `deskWorldMatrix()` places the room in the world.
 */
export const ROOM = {
  left: -1.35,
  right: 1.95,
  back: -0.42,
  front: 3.4,
  height: 2.7,
  wallThickness: 0.14
} as const;

/** Keyboard group (keyboard, trackpad, notebook) centre on the desk, right of the figures. */
export const KEYBOARD_X = 0.08;

export const DESK = { width: 1.4, depth: 0.7, top: 0.74, thickness: 0.03, z: 0 } as const;

export const WINDOW = { x: 0.5, y: 1.5, width: 1.6, height: 1.1, frame: 0.04, mullion: 0.5 } as const;

/** Inner (room-side) plane of the glass. */
export const GLASS_Z = ROOM.back - ROOM.wallThickness / 2;

/**
 * 32" 16:10 panel (desk.md asks for 27" 16:9; the taller, larger glass is what lets the hero
 * plate sit at 1:1 with the room still in frame). The head pivots to portrait on phones.
 */
export const MONITOR = {
  centre: new Vector3(-0.12, 1.13, -0.13),
  yaw: -0.08,
  tilt: -0.2,
  screen: { width: 0.69, height: 0.43 },
  bezel: 0.006,
  depth: 0.018
} as const;

export const LAMP = {
  base: new Vector3(-0.62, DESK.top, -0.24),
  elbow: new Vector3(-0.72, 1.16, -0.3),
  head: new Vector3(-0.5, 1.3, 0.1),
  aim: new Vector3(-0.3, DESK.top, 0.12)
} as const;

export const FIGURES = {
  plinth: new Vector3(-0.34, DESK.top, 0.0),
  burbu: new Vector3(-0.44, 0, 0.0),
  alfa: new Vector3(-0.34, 0, -0.01),
  gift: new Vector3(-0.24, 0, 0.01)
} as const;

export const TELESCOPE = { foot: new Vector3(1.18, 0, 0.42), headHeight: 1.08 } as const;

/** The hero C and Alfa in world space (constellation.md §2/§8). */
export const WORLD_C = new Vector3(0, 0.55, 0);
export const WORLD_ALFA = new Vector3(0, 0.6, -14);

/** Nominal reading eye (desk.md §5) used to orient the room: the window must frame the C. */
const NOMINAL_EYE = new Vector3(-0.3, 1.25, 1.95);
const WINDOW_CENTRE = new Vector3(WINDOW.x + 0.15, WINDOW.y, GLASS_Z);
/** Depth of the eye in front of the C plane: the C fills about half the window height. */
const EYE_DEPTH = 13;
/** Fraction of the C radius where Alfa should appear (inside the opening, like the engine's hero). */
const ALFA_IN_OPENING = 0.92;

let cached: Matrix4 | null = null;

/**
 * Room → world transform. The eye sits on the +X side of the C–Alfa axis so that, by
 * parallax, Alfa (14 m behind the C) shows in the C's opening; the room is yawed so the
 * line eye → window centre points straight at the C.
 */
export function deskWorldMatrix(): Matrix4 {
  if (cached) return cached;
  const depthBehind = WORLD_C.z - WORLD_ALFA.z;
  const offset = (2.2 * ALFA_IN_OPENING * (depthBehind + EYE_DEPTH)) / depthBehind;
  const local = WINDOW_CENTRE.clone().sub(NOMINAL_EYE);
  const localYaw = Math.atan2(local.x, -local.z);
  const localPitch = Math.atan2(local.y, Math.hypot(local.x, local.z));
  const eyeXZ = new Vector3(WORLD_C.x + offset, 0, WORLD_C.z + EYE_DEPTH);
  const toC = WORLD_C.clone().sub(eyeXZ);
  const horizontal = Math.hypot(toC.x, toC.z);
  const worldYaw = Math.atan2(toC.x, -toC.z);
  const eye = new Vector3(eyeXZ.x, WORLD_C.y - horizontal * Math.tan(localPitch), eyeXZ.z);
  const yaw = localYaw - worldYaw;
  const rotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), yaw);
  const translation = eye.clone().sub(NOMINAL_EYE.clone().applyQuaternion(rotation));
  cached = new Matrix4().compose(translation, rotation, new Vector3(1, 1, 1));
  return cached;
}

/** World → room-local point. */
export function toLocal(world: Vector3): Vector3 {
  return world.clone().applyMatrix4(deskWorldMatrix().clone().invert());
}
