import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { FOLDER, folderCentre, type FolderId } from '../layout';
import { CLEAR_X, FACE_TURN, HOLD_LEAN, LIFT, MAX_FORWARD, NEARER, SLIDE_END, TURN_START } from './constants';
import { ease } from './ease';

const scratch = new Matrix4();
const scratchQuaternion = new Quaternion();
const scratchPosition = new Vector3();
const IDENTITY = new Quaternion();
const ONE = new Vector3(1, 1, 1);

/** Where the visitor holds a shelf box: in front of the shelf, brought towards `eye` and turned to face it. */
export function aimShelfFolder(id: FolderId, eye: Vector3, targetAt: Vector3, targetTurn: Quaternion): void {
  const centre = folderCentre(id);
  const forward = scratchPosition.copy(folderCentre(id)).setX(centre.x + FOLDER.depth / 2).sub(eye).setY(0);
  const distance = forward.length();
  forward.normalize();
  const x = Math.max(CLEAR_X, centre.x);
  const nearer = distance * NEARER;
  const z = Math.abs(forward.z) > 0.3 ? eye.z + (nearer - (x - eye.x) * forward.x) / forward.z : centre.z;
  targetAt.set(x, centre.y + LIFT, centre.z + Math.min(Math.max(z - centre.z, 0), MAX_FORWARD));
  const toEye = eye.clone().sub(targetAt);
  const yaw = Math.atan2(toEye.x, toEye.z) * FACE_TURN;
  const elevation = Math.asin(Math.min(Math.max(toEye.y / toEye.length(), -1), 1));
  targetTurn.setFromEuler(new Euler(-elevation * FACE_TURN - HOLD_LEAN, yaw, 0, 'YXZ'));
}

/** Rest-to-held world transform at `progress`: slide out first, then turn and come forward. */
export function shelfHoldPose(id: FolderId, progress: number, pull: number, targetAt: Vector3, targetTurn: Quaternion, out: Matrix4): Matrix4 {
  const centre = folderCentre(id);
  const slide = ease(progress / SLIDE_END);
  const turn = ease((progress - TURN_START) / (1 - TURN_START));
  const fromX = centre.x + pull;
  scratchPosition.set(
    fromX + (targetAt.x - fromX) * slide,
    centre.y + (targetAt.y - centre.y) * slide,
    centre.z + (targetAt.z - centre.z) * turn
  );
  scratchQuaternion.copy(IDENTITY).slerp(targetTurn, turn);
  return out.compose(scratchPosition, scratchQuaternion, ONE).multiply(scratch.makeTranslation(-centre.x, -centre.y, -centre.z));
}

/** Turn of the open-folder sheet once lifted towards `eye`, in the open folder's frame. */
export function aimOpenSheet(eye: Vector3, openFrame: Matrix4, takenEdge: Vector3, flat: Quaternion, out: Quaternion): void {
  const local = eye.clone().applyMatrix4(scratch.copy(openFrame).invert()).sub(takenEdge).normalize();
  const facing = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), local);
  out.copy(IDENTITY).slerp(facing, 0.85).multiply(flat);
}
