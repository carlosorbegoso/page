import { Matrix4, Vector3 } from 'three';

export interface BodyPose {
  offset: Vector3;
  facing: number;
  yaw: number;
  lean: number;
  roll: number;
  squash: number;
}

const turn = new Matrix4();
const tilt = new Matrix4();
const right = new Vector3();
const forward = new Vector3();

export function bodyMatrix(out: Matrix4, base: Vector3, pose: BodyPose): Matrix4 {
  const facing = pose.facing + pose.yaw;
  right.set(Math.cos(facing), 0, -Math.sin(facing));
  forward.set(Math.sin(facing), 0, Math.cos(facing));
  const wide = 1 + 0.5 * pose.squash;
  out.makeTranslation(base.x + pose.offset.x, base.y + pose.offset.y, base.z + pose.offset.z);
  out.multiply(tilt.makeRotationAxis(right, pose.lean));
  out.multiply(tilt.makeRotationAxis(forward, pose.roll));
  out.multiply(turn.makeRotationY(pose.yaw));
  out.multiply(tilt.makeScale(wide, 1 - pose.squash, wide));
  return out.multiply(turn.makeTranslation(-base.x, -base.y, -base.z));
}

export function inRest(out: Matrix4, rest: Matrix4, restInverse: Matrix4, local: Matrix4): Matrix4 {
  return out.multiplyMatrices(rest, local).multiply(restInverse);
}
