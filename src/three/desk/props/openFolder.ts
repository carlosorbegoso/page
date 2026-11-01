import { BoxGeometry, Matrix4, Quaternion, Vector3 } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OBJECT_ID, PartBuilder } from '../builder';
import { OPEN_FOLDER } from '../layout';
import { shade, UP } from './geometry';
import type { Palette } from './palette';

/** Open TCS folder (linen boards, a few sheets) left of the keyboard. */
export function buildOpenFolder(b: PartBuilder, p: Palette): void {
  const { centre, width, depth, yaw } = OPEN_FOLDER;
  const frame = new Matrix4().compose(centre, new Quaternion().setFromAxisAngle(UP, yaw), new Vector3(1, 1, 1));
  const at = (x: number, y: number, z: number, rz = 0) =>
    new Matrix4().multiplyMatrices(frame, new Matrix4().compose(new Vector3(x, y, z), new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), rz), new Vector3(1, 1, 1)));
  const half = width / 2;
  const id = OBJECT_ID.openFolder;
  b.add(new RoundedBoxGeometry(half - 0.004, 0.004, depth, 1, 0.0015), p.folders.tcs, at(-half / 2, 0.002, 0, 0.02), OBJECT_ID.openFolderCover);
  b.add(new RoundedBoxGeometry(half - 0.004, 0.004, depth, 1, 0.0015), p.folders.tcs, at(half / 2, 0.002, 0, -0.02), id);
  b.add(new BoxGeometry(0.012, 0.006, depth), shade(p.folders.tcs, 0.7), at(0, 0.003, 0), id);
  b.add(new BoxGeometry(half - 0.03, 0.002, depth - 0.03), p.paper, at(half / 2, 0.006, 0, -0.02), id);
  b.add(new BoxGeometry(half - 0.034, 0.002, depth - 0.036), shade(p.paper, 0.93), at(half / 2 + 0.004, 0.0075, 0.004, -0.02), id);
  for (let line = 0; line < 7; line++) {
    b.add(new BoxGeometry(0.11 + (line % 3) * 0.02, 0.0004, 0.004), shade(p.bookDark, 0.8), at(half / 2 - 0.02, 0.0086, -0.09 + line * 0.022), id);
  }
  b.add(new BoxGeometry(half - 0.04, 0.002, depth - 0.04), shade(p.paper, 0.85), at(-half / 2, 0.005, 0, 0.02), OBJECT_ID.openFolderCover);
}
