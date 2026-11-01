import { Matrix4, Quaternion, Vector3 } from 'three';
import { OPEN_FOLDER } from '../layout';
import { OPEN_SHEET } from './constants';

const X = new Vector3(1, 0, 0);
const Y = new Vector3(0, 1, 0);
const ONE = new Vector3(1, 1, 1);
const LEAN_BACK = 0.5;
const PAGE_TOP = 0.0095;
const RESTING_GAP = 0.002;

export const OPEN_SHEET_FLAT = new Quaternion().setFromAxisAngle(X, -Math.PI / 2);
export const OPEN_SHEET_EDGE = new Vector3(OPEN_FOLDER.width / 4, PAGE_TOP, OPEN_SHEET.height / 2);
export const OPEN_SHEET_TAKEN_EDGE = OPEN_SHEET_EDGE.clone().add(new Vector3(0, RESTING_GAP, 0));

const FOLDER_FRAME = new Matrix4().compose(OPEN_FOLDER.centre, new Quaternion().setFromAxisAngle(Y, OPEN_FOLDER.yaw), ONE);
const FROM_WORLD = FOLDER_FRAME.clone().invert();
const SHEET_CENTRE = new Matrix4().makeTranslation(0, OPEN_SHEET.height / 2, 0);
const scratch = new Matrix4();

export function takenSheetTurn(eye: Vector3, out = new Quaternion()): Quaternion {
  const local = eye.clone().applyMatrix4(FROM_WORLD).sub(OPEN_SHEET_TAKEN_EDGE);
  const facing = new Quaternion().setFromAxisAngle(Y, Math.atan2(local.x, local.z));
  return out.copy(facing).multiply(new Quaternion().setFromAxisAngle(X, -LEAN_BACK));
}

export function sheetMatrix(edge: Vector3, turn: Quaternion, out = new Matrix4()): Matrix4 {
  return out.multiplyMatrices(FOLDER_FRAME, scratch.compose(edge, turn, ONE)).multiply(SHEET_CENTRE);
}

export function takenSheetCorners(eye: Vector3): Vector3[] {
  const frame = sheetMatrix(OPEN_SHEET_TAKEN_EDGE, takenSheetTurn(eye));
  const halfWidth = OPEN_SHEET.width / 2;
  const halfHeight = OPEN_SHEET.height / 2;
  return [-1, 1].flatMap(x => [-1, 1].map(y => new Vector3(x * halfWidth, y * halfHeight, 0).applyMatrix4(frame)));
}
