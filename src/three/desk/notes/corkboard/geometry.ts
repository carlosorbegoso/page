import { BoxGeometry, Color, CylinderGeometry, Matrix4, SphereGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { Finish, PartBuilder } from '../../builder';
import { seg, shade } from '../../props/geometry';
import type { Palette, Quality } from '../../props/palette';
import { boardFaceMatrix, CORKBOARD } from '../layout';
import { pinSpots } from './pins';

/** How far the frame stands proud of the cork face, so the print sits inside a lip. */
export const FRAME_LIP = 0.004;
const CORK: Finish = { color: new Color('#9c7448'), roughness: 0.95, metalness: 0 };
const PIN = { head: 0.0034, collar: 0.0026, needle: 0.0006, reach: 0.0062 } as const;

function inFace(x: number, y: number, z: number, extra?: Matrix4): Matrix4 {
  const matrix = boardFaceMatrix().multiply(new Matrix4().makeTranslation(x, y, z));
  return extra ? matrix.multiply(extra) : matrix;
}

function buildFrame(b: PartBuilder, finish: Finish): void {
  const { width, height, frame, depth } = CORKBOARD;
  const thickness = depth + FRAME_LIP;
  const z = FRAME_LIP - thickness / 2;
  const radius = frame * 0.3;
  const across = new RoundedBoxGeometry(width, frame, thickness, 2, radius);
  const upright = new RoundedBoxGeometry(frame, height - 2 * frame, thickness, 2, radius);
  b.add(across, finish, inFace(width / 2, frame / 2, z));
  b.add(across, finish, inFace(width / 2, height - frame / 2, z));
  b.add(upright, finish, inFace(frame / 2, height / 2, z));
  b.add(upright, finish, inFace(width - frame / 2, height / 2, z));
}

function buildCork(b: PartBuilder): void {
  const { width, height, frame, depth } = CORKBOARD;
  const panel = new BoxGeometry(width - 2 * frame + 0.002, height - 2 * frame + 0.002, depth - 0.002);
  b.add(panel, CORK, inFace(width / 2, height / 2, -(depth - 0.002) / 2));
}

function buildPins(b: PartBuilder, q: Quality): void {
  const alongZ = new Matrix4().makeRotationX(Math.PI / 2);
  const needle = new CylinderGeometry(PIN.needle, PIN.needle, PIN.reach, seg(6, q));
  const collar = new CylinderGeometry(PIN.collar, PIN.head * 0.9, 0.0024, seg(14, q, 6));
  const head = new SphereGeometry(PIN.head, seg(14, q, 6), seg(10, q, 5));
  const steel: Finish = { color: new Color('#b9bec6'), roughness: 0.3, metalness: 1 };
  for (const pin of pinSpots()) {
    const plastic: Finish = { color: new Color(pin.color), roughness: 0.35, metalness: 0 };
    b.add(needle, steel, inFace(pin.x, pin.y, PIN.reach / 2, alongZ));
    b.add(collar, plastic, inFace(pin.x, pin.y, PIN.reach + 0.0012, alongZ));
    b.add(head, plastic, inFace(pin.x, pin.y, PIN.reach + 0.0024 + PIN.head * 0.7));
  }
}

/** TUSOCIO's cork board: a rounded wooden frame, the cork panel behind the print and its push pins (static). */
export function buildCorkboard(b: PartBuilder, p: Palette, q: Quality): void {
  buildFrame(b, shade(p.wood, 1.45, 0.06));
  buildCork(b);
  buildPins(b, q);
}
