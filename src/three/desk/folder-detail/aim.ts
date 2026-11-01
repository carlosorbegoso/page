import { Matrix4, Quaternion, Vector3, type PerspectiveCamera } from 'three';
import { FOLDER, FOLDERS, ROOM, folderCentre, type FolderId } from '../layout';
import { CLEAR_X, SLIDE_END, TURN_START } from './constants';
import { ease } from './ease';
import { FLAP_OPEN } from './flap';

const scratch = new Matrix4();
const scratchQuaternion = new Quaternion();
const scratchPosition = new Vector3();
const IDENTITY = new Quaternion();
const ONE = new Vector3(1, 1, 1);
const UP = new Vector3(0, 1, 0);
const scratchEye = new Vector3();
const scratchForward = new Vector3();
const scratchRay = new Vector3();
const HOLD_YAW = 0.12;
const FOCUS_SHARE = 0.6;
const SPOT_STEP = 0.04;
const SCREEN_EDGE = 0.94;
const PUSH_STEP = 1.08;
const MAX_PUSH = 1.8;
const MIN_PULL = 0.75;
const COVER_WIDTH = Math.cos(Math.PI - FLAP_OPEN);

const STACK_FRONT_Z = folderCentre(FOLDERS[0]).z + FOLDER.spine / 2 + FOLDER.depth / 2 + 0.02;
const WALL_X = ROOM.left + FOLDER.depth / 2 + 0.03;

interface HoldSpot {
  x: number;
  y: number;
  height: number;
  width: number;
  cover: number;
}

function clearOfShelf(at: Vector3): boolean {
  return at.x >= CLEAR_X || (at.z >= STACK_FRONT_Z && at.x >= WALL_X);
}

function holdSpot(aspect: number): HoldSpot {
  return aspect >= 1
    ? { x: 0.06, y: -0.02, height: 0.64, width: 0.78, cover: COVER_WIDTH }
    : { x: 0, y: 0.04, height: 0.5, width: 0.96, cover: COVER_WIDTH * 0.08 };
}

function placeOnRay(camera: PerspectiveCamera, x: number, y: number, depth: number, out: Vector3): Vector3 {
  const eye = camera.getWorldPosition(scratchEye);
  const forward = camera.getWorldDirection(scratchForward);
  const ray = scratchRay.set(x, y, 0.5).unproject(camera).sub(eye).normalize();
  return out.copy(eye).addScaledVector(ray, depth / ray.dot(forward));
}

function depthsToTry(nearest: number): number[] {
  const depths: number[] = [];
  for (let depth = nearest; depth <= nearest * MAX_PUSH; depth *= PUSH_STEP) depths.push(depth);
  for (let depth = nearest / PUSH_STEP; depth >= nearest * MIN_PULL; depth /= PUSH_STEP) depths.push(depth);
  return depths;
}

function* candidatesAround(preferred: number, lo: number, hi: number): Generator<number> {
  const start = Math.min(Math.max(preferred, lo), hi);
  for (let offset = 0; start + offset <= hi || start - offset >= lo; offset += SPOT_STEP) {
    if (start + offset <= hi) yield start + offset;
    if (offset > 0 && start - offset >= lo) yield start - offset;
  }
}

function findClearSpot(camera: PerspectiveCamera, spot: HoldSpot, nearest: number, tan: number, targetAt: Vector3): boolean {
  for (const depth of depthsToTry(nearest)) {
    const halfBox = FOLDER.depth / 2 / (depth * tan * camera.aspect);
    const lo = -SCREEN_EDGE + halfBox * (1 + 2 * spot.cover);
    const hi = SCREEN_EDGE - halfBox;
    for (const x of candidatesAround(spot.x + spot.cover * halfBox, lo, hi)) {
      if (clearOfShelf(placeOnRay(camera, x, spot.y, depth, targetAt))) return true;
    }
  }
  return false;
}

export function aimShelfFolder(id: FolderId, camera: PerspectiveCamera, targetAt: Vector3, targetTurn: Quaternion): void {
  camera.updateMatrixWorld();
  const forward = camera.getWorldDirection(scratchForward);
  const spot = holdSpot(camera.aspect);
  const tan = Math.tan((camera.fov * Math.PI) / 360);
  const focus = scratchPosition.copy(folderCentre(id)).sub(camera.getWorldPosition(scratchEye)).dot(forward) * FOCUS_SHARE;
  const fitHeight = FOLDER.height / (spot.height * 2 * tan);
  const fitWidth = (FOLDER.depth * (1 + spot.cover)) / (spot.width * 2 * tan * camera.aspect);
  const nearest = Math.max(focus, fitHeight, fitWidth);
  if (!findClearSpot(camera, spot, nearest, tan, targetAt)) {
    placeOnRay(camera, spot.x, spot.y, nearest, targetAt);
  }
  scratch.lookAt(camera.getWorldPosition(scratchEye), targetAt, UP);
  targetTurn.setFromRotationMatrix(scratch).multiply(scratchQuaternion.setFromAxisAngle(UP, -HOLD_YAW));
}

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

export function aimOpenSheet(eye: Vector3, openFrame: Matrix4, takenEdge: Vector3, flat: Quaternion, out: Quaternion): void {
  const local = eye.clone().applyMatrix4(scratch.copy(openFrame).invert()).sub(takenEdge).normalize();
  const facing = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), local);
  out.copy(IDENTITY).slerp(facing, 0.85).multiply(flat);
}
