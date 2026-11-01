import { Color, Matrix3, Vector3 } from 'three';

/** Number of object ids the per-object arrays cover (ids 0 … OBJECT_SLOTS − 1). */
export const OBJECT_SLOTS = 12;
/** Figures animated in the vertex shader: object ids 1 … FIGURE_SLOTS. */
export const FIGURE_SLOTS = 4;

/** Uniforms the atlas shader exposes: hover, per-figure lift/turn and per-object light. */
export interface AtlasUniforms {
  uHoverId: { value: number };
  uHoverMix: { value: number };
  uHoverColor: { value: Color };
  /** Pivot (base centre) of each animated figure. */
  uFigPivot: { value: Vector3[] };
  uFigLift: { value: number[] };
  uFigYaw: { value: number[] };
  /** Multiplier of the baked emission (signal lines) per object id. */
  uSignal: { value: number[] };
  /** Extra self-illumination (albedo × value) per object id: folder labels, highlights. */
  uGlow: { value: number[] };
  /** 1 lit and in colour … 0 dim and grey: a figure waits in the dark until the story introduces it. */
  uPresence: { value: number[] };
  /** Metres an object slides out along +X (a folder pulled off the shelf). */
  uPull: { value: number[] };
  /** Rotation of the TCS folder's left board about its spine, and a point on that spine. */
  uHinge: { value: Matrix3 };
  uHingeOrigin: { value: Vector3 };
}
