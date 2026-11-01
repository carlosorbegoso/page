import { Matrix4, type Object3D, type Vector3 } from 'three';

const scratch = new Matrix4();

/** Makes an object ride along a held folder (`pose`), or hands it back to its own position. */
export function follow(object: Object3D, pose: Matrix4 | null, rest: Vector3): void {
  if (!pose) {
    object.matrixAutoUpdate = true;
    return;
  }
  object.matrixAutoUpdate = false;
  object.matrix.copy(pose).multiply(scratch.makeTranslation(rest.x, rest.y, rest.z));
  object.matrixWorldNeedsUpdate = true;
}
