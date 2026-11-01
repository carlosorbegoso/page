import { Matrix4, Quaternion, Vector3, type PerspectiveCamera } from 'three';
import { FOLDER, FOLDERS, ROOM, folderCentre, type FolderId } from '../layout';
import { CLEAR_X, SLIDE_END, TURN_START } from './constants';
import { ease } from './ease';

const scratch = new Matrix4();
const scratchQuaternion = new Quaternion();
const scratchPosition = new Vector3();
const IDENTITY = new Quaternion();
const ONE = new Vector3(1, 1, 1);
const UP = new Vector3(0, 1, 0);
const scratchEye = new Vector3();
const scratchForward = new Vector3();
const scratchRay = new Vector3();
/** Width of the box plus its cover opened past square, in box widths. */
const COVER_SPREAD = 1.45;
/** Slight turn that keeps the spine label in view while the cover opens on the other edge. */
const HOLD_YAW = 0.12;
/** Nearer than this share of the focus distance the depth of field blurs the sheet. */
const FOCUS_SHARE = 0.8;
const SPOT_MAX_X = 0.8;
const SPOT_STEP = 0.04;

/** Beyond the near end of the stack a held box only has to clear the wall. */
const STACK_FRONT_Z = folderCentre(FOLDERS[0]).z + FOLDER.spine / 2 + FOLDER.depth / 2 + 0.02;
const WALL_X = ROOM.left + FOLDER.depth / 2 + 0.03;

function clearOfShelf(at: Vector3): boolean {
  return at.x >= CLEAR_X || (at.z >= STACK_FRONT_Z && at.x >= WALL_X);
}

/** First screen spot (NDC) tried for the held box's centre: right of the panel on wide screens, above it on tall ones. */
function holdSpot(aspect: number): { x: number; y: number; height: number; width: number } {
  return aspect >= 1 ? { x: 0.34, y: 0.04, height: 0.62, width: 0.5 } : { x: -0.2, y: 0.4, height: 0.42, width: 0.86 };
}

/**
 * Where the visitor holds a shelf box: near the shot's focus distance (the shelf), so depth of field
 * keeps the sheet sharp, pushed back only when the box and its opened cover would not fit. It sits on
 * the ray through `holdSpot`, moved right across the screen until it clears the stack and the wall.
 */
export function aimShelfFolder(id: FolderId, camera: PerspectiveCamera, targetAt: Vector3, targetTurn: Quaternion): void {
  camera.updateMatrixWorld();
  const eye = camera.getWorldPosition(scratchEye);
  const forward = camera.getWorldDirection(scratchForward);
  const spot = holdSpot(camera.aspect);
  const tan = Math.tan((camera.fov * Math.PI) / 360);
  const focus = scratchPosition.copy(folderCentre(id)).sub(eye).dot(forward) * FOCUS_SHARE;
  const fitHeight = FOLDER.height / (spot.height * 2 * tan);
  const fitWidth = (FOLDER.depth * COVER_SPREAD) / (spot.width * 2 * tan * camera.aspect);
  const depth = Math.max(focus, fitHeight, fitWidth);
  for (let x = spot.x; x <= SPOT_MAX_X; x += SPOT_STEP) {
    const ray = scratchRay.set(x, spot.y, 0.5).unproject(camera).sub(eye).normalize();
    targetAt.copy(eye).addScaledVector(ray, depth / ray.dot(forward));
    if (clearOfShelf(targetAt)) break;
  }
  if (!clearOfShelf(targetAt)) targetAt.x = Math.max(targetAt.x, CLEAR_X);
  scratch.lookAt(eye, targetAt, UP);
  targetTurn.setFromRotationMatrix(scratch).multiply(scratchQuaternion.setFromAxisAngle(UP, -HOLD_YAW));
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
