import { Matrix4, Vector3, type Color } from 'three';
import { OBJECT_ID } from '../../builder';
import { CHARIZARD, PIKACHU } from '../../layout';
import { CHARIZARD_COLORS, CHARIZARD_RIG, charizardFrame, PIKACHU_COLORS, PIKACHU_RIG, pikachuFrame } from '../../props';
import { sameColor, type TriangleInfo } from '../rig';

export type PokemonPartName =
  | 'pikachuBody'
  | 'pikachuEarL'
  | 'pikachuEarR'
  | 'pikachuTail'
  | 'charizardBody'
  | 'charizardWingL'
  | 'charizardWingR'
  | 'charizardTail'
  | 'charizardFlame';

const REACH = 0.065;
const HEIGHT = 0.13;
const PIKACHU_LOCAL = pikachuFrame().invert();
const CHARIZARD_LOCAL = charizardFrame().invert();

const matches = (color: TriangleInfo['color'], candidates: readonly Color[]) => candidates.some(candidate => sameColor(color, candidate));
const sideOf = (centroid: Vector3, toLocal: Matrix4) => (centroid.clone().applyMatrix4(toLocal).x < 0 ? 'L' : 'R');

function near(centroid: Vector3, base: Vector3): boolean {
  const rise = centroid.y - base.y;
  return Math.hypot(centroid.x - base.x, centroid.z - base.z) < REACH && rise > -0.002 && rise < HEIGHT;
}

function pikachuPart(centroid: Vector3, color: TriangleInfo['color']): PokemonPartName | null {
  const R = PIKACHU_RIG;
  if (matches(color, [R.ear, R.earTip])) return sideOf(centroid, PIKACHU_LOCAL) === 'L' ? 'pikachuEarL' : 'pikachuEarR';
  if (matches(color, [R.tail, R.tailRoot])) return 'pikachuTail';
  return matches(color, PIKACHU_COLORS) ? 'pikachuBody' : null;
}

function charizardPart(centroid: Vector3, color: TriangleInfo['color']): PokemonPartName | null {
  const C = CHARIZARD_RIG;
  if (matches(color, [C.wing, C.membrane, C.bone, C.claw])) return sideOf(centroid, CHARIZARD_LOCAL) === 'L' ? 'charizardWingL' : 'charizardWingR';
  if (matches(color, [C.tail])) return 'charizardTail';
  if (matches(color, [C.flame, C.core])) return 'charizardFlame';
  return matches(color, CHARIZARD_COLORS) ? 'charizardBody' : null;
}

export function pokemonPart({ oid, centroid, color }: TriangleInfo): PokemonPartName | null {
  if (oid !== OBJECT_ID.none) return null;
  if (near(centroid, PIKACHU.base)) return pikachuPart(centroid, color);
  if (near(centroid, CHARIZARD.base)) return charizardPart(centroid, color);
  return null;
}
