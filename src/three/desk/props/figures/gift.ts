import { BoxGeometry, CatmullRomCurve3, Color, ExtrudeGeometry, Matrix4, Quaternion, Shape, TorusGeometry, TubeGeometry, Vector3, type BufferGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OBJECT_ID, PartBuilder, type Finish } from '../../builder';
import { FIGURES } from '../../layout';
import { seg, shade, UP } from '../geometry';
import type { Palette, Quality } from '../palette';
import { FRONT, standing } from './frame';

const BOX = { base: 0.056, baseH: 0.044, lid: 0.06, lidH: 0.013, band: 0.0095 } as const;
const LID_Y = BOX.baseH - 0.001 + BOX.lidH / 2;
const TOP = LID_Y + BOX.lidH / 2;

type Put = (geometry: BufferGeometry, finish: Finish, matrix: Matrix4) => void;
type At = (x: number, y: number, z: number, rotation?: Quaternion) => Matrix4;

function ribbonTail(width: number, length: number): ExtrudeGeometry {
  const notch = width * 0.45;
  const shape = new Shape();
  shape.moveTo(-width / 2, 0);
  shape.lineTo(width / 2, 0);
  shape.lineTo(width / 2, length);
  shape.lineTo(0, length - notch);
  shape.lineTo(-width / 2, length);
  shape.closePath();
  const thickness = 0.0011;
  return new ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false }).rotateX(Math.PI / 2).translate(0, thickness / 2, 0);
}

function bowLoop(size: number, q: Quality): TubeGeometry {
  const path = [
    [0, 0],
    [0.35, 0.4],
    [0.75, 0.7],
    [1, 0.5],
    [0.9, 0.12],
    [0.45, -0.06]
  ].map(([x, y]) => new Vector3(x! * size, y! * size, 0));
  return new TubeGeometry(new CatmullRomCurve3(path, true), seg(28, q, 14), 0.0008, 6, true).scale(1, 1, 3.8);
}

function buildBoxAndBands(put: Put, at: At, p: Palette, q: Quality): void {
  const { base, baseH, lid, lidH, band } = BOX;
  const ribbon: Finish = { ...p.giftRibbon, roughness: 0.28, metalness: 0.12 };
  const edge = shade(ribbon, 0.82);
  put(new RoundedBoxGeometry(base, baseH, base, seg(3, q, 2), 0.003), p.giftBody, at(0, baseH / 2, 0));
  put(new BoxGeometry(base + 0.0012, 0.0016, base + 0.0012), p.giftSeam, at(0, baseH - 0.0018, 0));
  put(new RoundedBoxGeometry(lid, lidH, lid, seg(3, q, 2), 0.0035), shade(p.giftBody, 1.04), at(0, LID_Y, 0));
  const bands: Array<[number, number, number, number]> = [
    [baseH / 2, baseH - 0.004, base + 0.0012, 0],
    [LID_Y, lidH + 0.0006, lid + 0.0012, 0]
  ];
  for (const [y, height, length] of bands) {
    for (const turn of [0, Math.PI / 2]) {
      const r = new Quaternion().setFromAxisAngle(UP, turn);
      put(new RoundedBoxGeometry(band, height, length, 1, 0.0004), ribbon, at(0, y, 0, r));
      for (const side of [-1, 1]) put(new BoxGeometry(0.0007, height + 0.0002, length + 0.0003), edge, at(side * (band / 2 - 0.0003), y, 0, r));
    }
  }
}

function buildBow(put: Put, at: At, p: Palette, q: Quality): void {
  const ribbon: Finish = { ...p.giftRibbon, roughness: 0.28, metalness: 0.12 };
  const lobes: Array<[number, number, number, number]> = [
    [1, 0.016, 0.38, 0],
    [-1, 0.016, 0.38, 0],
    [1, 0.012, 0.6, 0.55],
    [-1, 0.012, 0.6, -0.55]
  ];
  for (const [side, size, lift, yaw] of lobes) {
    const rotation = new Quaternion().setFromAxisAngle(UP, yaw + (side < 0 ? Math.PI : 0)).multiply(new Quaternion().setFromAxisAngle(FRONT, lift));
    put(bowLoop(size, q), size < 0.014 ? shade(ribbon, 0.93) : ribbon, at(0, TOP + 0.002, 0, rotation));
  }
  put(new RoundedBoxGeometry(0.0078, 0.0058, 0.007, 2, 0.0024), ribbon, at(0, TOP + 0.0032, 0));
  for (const side of [-1, 1]) {
    put(ribbonTail(0.0065, 0.026), ribbon, at(side * 0.002, TOP + 0.0007, 0.002, new Quaternion().setFromAxisAngle(UP, side * 0.55)));
  }
}

function buildTag(put: Put, at: At, q: Quality): void {
  const { base, baseH, lid } = BOX;
  const kraft: Finish = { color: new Color('#c9a273'), roughness: 0.85, metalness: 0 };
  const shape = new Shape();
  const [w, h, clip] = [0.017, 0.011, 0.003];
  shape.moveTo(-w / 2 + clip, h / 2);
  shape.lineTo(w / 2, h / 2);
  shape.lineTo(w / 2, -h / 2);
  shape.lineTo(-w / 2 + clip, -h / 2);
  shape.lineTo(-w / 2, -h / 2 + clip);
  shape.lineTo(-w / 2, h / 2 - clip);
  shape.closePath();
  const centre = new Vector3(base * 0.3, baseH * 0.5, base / 2 + 0.0012);
  const tilt = new Quaternion().setFromAxisAngle(FRONT, -0.22);
  const onTag = (x: number, y: number, z: number) => at(centre.x, centre.y, centre.z, tilt).multiply(new Matrix4().makeTranslation(x, y, z));
  put(new ExtrudeGeometry(shape, { depth: 0.0008, bevelEnabled: false }), kraft, onTag(0, 0, -0.0004));
  const brass: Finish = { color: new Color('#b08a4a'), roughness: 0.35, metalness: 1 };
  put(new TorusGeometry(0.0013, 0.00045, 6, seg(14, q, 8)), brass, onTag(-w / 2 + 0.0028, 0, 0.0005));
  const ink: Finish = { color: new Color('#5a3b2a'), roughness: 0.9, metalness: 0 };
  for (const [y, length] of [
    [0.0018, 0.0085],
    [-0.0012, 0.006]
  ] as const) {
    put(new BoxGeometry(length, 0.0006, 0.0002), ink, onTag(0.0018 + length / 2 - 0.004, y, 0.0005));
  }
  const hole = new Vector3(-w / 2 + 0.0028, 0, 0.0006).applyMatrix4(onTag(0, 0, 0));
  const knot = new Vector3(0.0035, TOP - 0.001, lid / 2 + 0.0012).applyMatrix4(at(0, 0, 0));
  const sag = hole.clone().lerp(knot, 0.5).add(new Vector3(0.0015, -0.002, 0.0012));
  const twine: Finish = { color: new Color('#8a3a3a'), roughness: 0.8, metalness: 0 };
  put(new TubeGeometry(new CatmullRomCurve3([hole, sag, knot]), 16, 0.00035, 4, false), twine, new Matrix4());
}

export function buildGift(b: PartBuilder, p: Palette, q: Quality): void {
  const id = OBJECT_ID.parati;
  const frame = standing(FIGURES.parati, -0.2);
  const at: At = (x, y, z, rotation = new Quaternion()) => frame(new Matrix4().compose(new Vector3(x, y, z), rotation, new Vector3(1, 1, 1)));
  const put: Put = (geometry, finish, matrix) => b.add(geometry, finish, matrix, id);
  buildBoxAndBands(put, at, p, q);
  buildBow(put, at, p, q);
  buildTag(put, at, q);
}
