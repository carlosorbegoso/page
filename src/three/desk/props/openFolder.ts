import { BoxGeometry, CatmullRomCurve3, Color, ExtrudeGeometry, Matrix4, Quaternion, Shape, TubeGeometry, Vector3 } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OBJECT_ID, PartBuilder, type Finish } from '../builder';
import { OPEN_FOLDER } from '../layout';
import { seeded, shade, UP } from './geometry';
import type { Palette } from './palette';

/** Both boards rise slightly towards the spine, so everything on a board shares its roll. */
const BOARD_ROLL = 0.02;
const BOARD_TOP = 0.004;

type Place = (x: number, y: number, z: number, yaw?: number) => Matrix4;

interface Side {
  place: Place;
  id: number;
  width: number;
}

function boardFrame(side: -1 | 1): Place {
  const { centre, width, yaw } = OPEN_FOLDER;
  const folder = new Matrix4().compose(centre, new Quaternion().setFromAxisAngle(UP, yaw), new Vector3(1, 1, 1));
  const board = new Matrix4().multiplyMatrices(
    folder,
    new Matrix4().compose(new Vector3((side * width) / 4, 0, 0), new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), -side * BOARD_ROLL), new Vector3(1, 1, 1))
  );
  return (x, y, z, turn = 0) =>
    new Matrix4().multiplyMatrices(board, new Matrix4().compose(new Vector3(x, y, z), new Quaternion().setFromAxisAngle(UP, turn), new Vector3(1, 1, 1)));
}

function addSheet(b: PartBuilder, side: Side, paper: Finish, size: [number, number], at: [number, number, number], yaw = 0): void {
  b.add(new BoxGeometry(size[0], 0.0006, size[1]), paper, side.place(at[0], at[1], at[2], yaw), side.id);
}

/** Printed text as thin grey bars: a heading, then paragraph lines of varying length. */
function addPrint(b: PartBuilder, side: Side, p: Palette, origin: [number, number, number], width: number, lines: number, yaw: number, seed: number): void {
  const ink = shade(p.bookDark, 0.7);
  const faint: Finish = { ...shade(p.paper, 0.62), roughness: 0.9 };
  const random = seeded(seed);
  const [x0, y, z0] = origin;
  const cos = Math.cos(yaw);
  const sin = Math.sin(yaw);
  const bar = (dx: number, dz: number, w: number, d: number, finish: Finish) => {
    const x = x0 + (dx + w / 2) * cos + dz * sin;
    const z = z0 - (dx + w / 2) * sin + dz * cos;
    b.add(new BoxGeometry(w, 0.0003, d), finish, side.place(x, y, z, yaw), side.id);
  };
  bar(0, 0, width * 0.55, 0.0055, ink);
  bar(0, 0.011, width * 0.32, 0.003, { ...p.folders.tcs, roughness: 0.8 });
  for (let line = 0; line < lines; line++) {
    const paragraphBreak = Math.floor(line / 4) * 0.005;
    const length = line % 4 === 3 ? 0.35 + random() * 0.25 : 0.82 + random() * 0.18;
    bar(0, 0.024 + line * 0.0085 + paragraphBreak, width * length, 0.0022, faint);
  }
}

function buildBoards(b: PartBuilder, p: Palette, left: Side, right: Side, depth: number): void {
  const board = p.folders.tcs;
  const liner = { ...shade(board, 1.12), roughness: 0.85 };
  for (const side of [left, right]) {
    b.add(new RoundedBoxGeometry(side.width, BOARD_TOP, depth, 2, 0.0016), board, side.place(0, BOARD_TOP / 2, 0), side.id);
    b.add(new BoxGeometry(side.width - 0.006, 0.0003, depth - 0.006), liner, side.place(0, BOARD_TOP + 0.0001, 0), side.id);
  }
  const spine = boardFrame(1);
  const spineX = -right.width / 2 - 0.004;
  b.add(new RoundedBoxGeometry(0.014, 0.006, depth, 2, 0.002), shade(board, 0.78), spine(spineX, 0.003, 0), right.id);
  for (const offset of [-0.004, 0.004]) {
    b.add(new BoxGeometry(0.0008, 0.0004, depth - 0.004), shade(board, 0.55), spine(spineX + offset, 0.006, 0), right.id);
  }
}

/** Inside pocket of the left board: a die-cut flap with a clipped outer corner and a thumb notch. */
function pocketGeometry(width: number, top: number, bottom: number): ExtrudeGeometry {
  const w = width / 2;
  const notch = 0.022;
  const corner = 0.03;
  const shape = new Shape();
  shape.moveTo(-w, -bottom);
  shape.lineTo(w, -bottom);
  shape.lineTo(w, -top);
  shape.lineTo(notch, -top);
  shape.absarc(0, -top, notch, 0, Math.PI, true);
  shape.lineTo(-w + corner, -top);
  shape.lineTo(-w, -top - corner);
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, { depth: 0.0008, bevelEnabled: false, curveSegments: 10 });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function buildLeftPage(b: PartBuilder, p: Palette, left: Side, depth: number): void {
  const pocketTop = 0.01;
  const tuckedYaw = 0.035;
  addSheet(b, left, p.paper, [left.width - 0.036, depth - 0.05], [0.002, BOARD_TOP + 0.0007, 0.008], tuckedYaw);
  addPrint(b, left, p, [-left.width / 2 + 0.03, BOARD_TOP + 0.0012, -depth / 2 + 0.042], left.width - 0.07, 5, tuckedYaw, 7);
  const pocket = { ...shade(p.folders.tcs, 1.05), roughness: 0.8 };
  b.add(pocketGeometry(left.width - 0.01, pocketTop, depth / 2 - 0.005), pocket, left.place(0, BOARD_TOP + 0.0014, 0), left.id);
  const note: Finish = { color: new Color('#e3c766'), roughness: 0.85, metalness: 0 };
  b.add(new BoxGeometry(0.052, 0.0004, 0.052), note, left.place(left.width / 2 - 0.05, BOARD_TOP + 0.0026, depth / 2 - 0.07, -0.12), left.id);
  for (let line = 0; line < 3; line++) {
    b.add(new BoxGeometry(0.03 - line * 0.006, 0.0002, 0.0018), shade(p.bookBlue, 0.9), left.place(left.width / 2 - 0.052, BOARD_TOP + 0.003, depth / 2 - 0.082 + line * 0.009, -0.12), left.id);
  }
}

function paperClip(at: Matrix4): TubeGeometry {
  const loop = [
    [0, 0],
    [0.03, 0],
    [0.034, 0.004],
    [0.03, 0.008],
    [0.004, 0.008],
    [0.0012, 0.005],
    [0.004, 0.0022],
    [0.025, 0.0022],
    [0.027, 0.004],
    [0.025, 0.0058],
    [0.009, 0.0058]
  ].map(([x, z]) => new Vector3(x!, 0, z!).applyMatrix4(at));
  return new TubeGeometry(new CatmullRomCurve3(loop), 64, 0.0006, 5, false);
}

function buildRightPage(b: PartBuilder, p: Palette, right: Side, depth: number): void {
  const sheet: [number, number] = [right.width - 0.03, depth - 0.03];
  addSheet(b, right, shade(p.paper, 0.9), sheet, [0.004, BOARD_TOP + 0.0007, 0.004], -0.03);
  addSheet(b, right, shade(p.paper, 0.95), sheet, [-0.002, BOARD_TOP + 0.0014, -0.002], 0.018);
  addSheet(b, right, p.paper, sheet, [0, BOARD_TOP + 0.0021, 0], -0.008);
  addPrint(b, right, p, [-sheet[0] / 2 + 0.022, BOARD_TOP + 0.0026, -sheet[1] / 2 + 0.024], sheet[0] - 0.05, 18, -0.008, 3);
  const clip: Finish = { color: new Color('#b9bec6'), roughness: 0.25, metalness: 1 };
  b.add(paperClip(right.place(-sheet[0] / 2 + 0.03, BOARD_TOP + 0.003, -sheet[1] / 2 - 0.006, -Math.PI / 2)), clip, new Matrix4(), right.id);
  const elastic: Finish = { color: new Color('#15171b'), roughness: 0.7, metalness: 0 };
  const halfWidth = right.width / 2;
  const halfDepth = depth / 2;
  for (const [sx, sz] of [
    [1, -1],
    [1, 1]
  ] as const) {
    b.add(new BoxGeometry(0.05, 0.0009, 0.006), elastic, right.place(sx * (halfWidth - 0.017), BOARD_TOP + 0.003, sz * (halfDepth - 0.017), sx * sz * (Math.PI / 4)), right.id);
  }
}

/** Open TCS folder (linen boards, pocket, a clipped stack of printed sheets) left of the keyboard. */
export function buildOpenFolder(b: PartBuilder, p: Palette): void {
  const { width, depth } = OPEN_FOLDER;
  const boardWidth = width / 2 - 0.004;
  const left: Side = { place: boardFrame(-1), id: OBJECT_ID.openFolderCover, width: boardWidth };
  const right: Side = { place: boardFrame(1), id: OBJECT_ID.openFolder, width: boardWidth };
  buildBoards(b, p, left, right, depth);
  buildLeftPage(b, p, left, depth);
  buildRightPage(b, p, right, depth);
}
