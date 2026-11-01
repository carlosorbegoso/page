import { CHARIZARD, PIKACHU } from '../../../layout';

export const span = (t: number, from: number, to: number) => Math.min(Math.max((t - from) / (to - from), 0), 1);
export const ease = (t: number) => t * t * (3 - 2 * t);
export const easeOut = (t: number) => 1 - (1 - t) * (1 - t);
export const bump = (t: number) => (t <= 0 || t >= 1 ? 0 : Math.sin(Math.PI * t));
export const pulse = (t: number, from: number, to: number) => bump(span(t, from, to));
export const hold = (t: number, rise: readonly [number, number], fall: readonly [number, number]) =>
  ease(span(t, rise[0], rise[1])) * (1 - ease(span(t, fall[0], fall[1])));

export const arc = (t: number, from: number, to: number) => {
  const u = span(t, from, to);
  return u <= 0 || u >= 1 ? 0 : 4 * u * (1 - u);
};

const toCharizard = { x: CHARIZARD.base.x - PIKACHU.base.x, z: CHARIZARD.base.z - PIKACHU.base.z };
const distance = Math.hypot(toCharizard.x, toCharizard.z);

export const LINE = { x: toCharizard.x / distance, z: toCharizard.z / distance };
export const SIDE = { x: LINE.z, z: -LINE.x };
export const FACE_CHARIZARD = Math.atan2(toCharizard.x, toCharizard.z) - PIKACHU.yaw;
export const FACE_PIKACHU = Math.atan2(-toCharizard.x, -toCharizard.z) - CHARIZARD.yaw;
