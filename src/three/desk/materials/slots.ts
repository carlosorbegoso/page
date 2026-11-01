import { Color, Matrix3, Vector3 } from 'three';

export const OBJECT_SLOTS = 12;
export const FIGURE_SLOTS = 4;

export interface AtlasUniforms {
  uHoverId: { value: number };
  uHoverMix: { value: number };
  uHoverColor: { value: Color };
  uFigPivot: { value: Vector3[] };
  uFigLift: { value: number[] };
  uFigYaw: { value: number[] };
  uSignal: { value: number[] };
  uGlow: { value: number[] };
  uPresence: { value: number[] };
  uPull: { value: number[] };
  uHinge: { value: Matrix3 };
  uHingeOrigin: { value: Vector3 };
}
