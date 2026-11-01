import { CapsuleGeometry, Color, ConeGeometry, ExtrudeGeometry, Matrix4, Quaternion, Shape, SphereGeometry, TorusGeometry, Vector3 } from 'three';
import { PartBuilder, type Finish } from '../builder';
import { PIKACHU } from '../layout';
import { seg, UP } from './geometry';
import type { Quality } from './palette';

const VINYL = { roughness: 0.42, metalness: 0 } as const;
/**
 * The ears and the tail move (`life/pokemon`), which finds their triangles by these colours: each is
 * a hair off the body's so the eye cannot tell, but `sameColor` can.
 */
export const PIKACHU_RIG = {
  ear: new Color('#f2c432'),
  earTip: new Color('#141214'),
  tail: new Color('#f2c034'),
  tailRoot: new Color('#7a4a22'),
  earRoot: (side: number) => new Vector3(side * 0.011, 0.064, -0.001),
  tailRootAt: new Vector3(0.004, 0.006, -0.017),
  cheek: (side: number) => new Vector3(side * 0.0138, 0.0478, 0.016)
} as const;

const FINISH = {
  yellow: { color: new Color('#f2c22e'), ...VINYL },
  ear: { color: PIKACHU_RIG.ear, ...VINYL },
  earTip: { color: PIKACHU_RIG.earTip, roughness: 0.3, metalness: 0 },
  tail: { color: PIKACHU_RIG.tail, ...VINYL },
  tailRoot: { color: PIKACHU_RIG.tailRoot, ...VINYL },
  black: { color: new Color('#141210'), roughness: 0.3, metalness: 0 },
  white: { color: new Color('#f7f4ee'), roughness: 0.25, metalness: 0 },
  cheek: { color: new Color('#d8432a'), ...VINYL },
  mouth: { color: new Color('#6a1d18'), ...VINYL },
  brown: { color: new Color('#7a4a1e'), ...VINYL }
} satisfies Record<string, Finish>;

/** Every colour of the figure, so `life/pokemon` can lift the whole body when Pikachu walks. */
export const PIKACHU_COLORS: readonly Color[] = Object.values(FINISH).map(finish => finish.color);

const HEAD = { centre: new Vector3(0, 0.052, 0.002), radii: new Vector3(0.0213, 0.018, 0.018) };

type Place = (position: Vector3, rotation?: Quaternion, scale?: Vector3) => Matrix4;

/** Point on the front of the head ellipsoid at (x, y) and the rotation that lays a decal flat on it. */
function onHead(x: number, y: number, lift = 0): { position: Vector3; facing: Quaternion } {
  const { centre, radii } = HEAD;
  const u = x / radii.x;
  const v = (y - centre.y) / radii.y;
  const z = centre.z + radii.z * Math.sqrt(Math.max(1 - u * u - v * v, 0));
  const normal = new Vector3(x / radii.x ** 2, (y - centre.y) / radii.y ** 2, (z - centre.z) / radii.z ** 2).normalize();
  return { position: new Vector3(x, y, z).addScaledVector(normal, lift), facing: new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), normal) };
}

function buildBodyAndHead(b: PartBuilder, q: Quality, place: Place): void {
  const ball = (r: number) => new SphereGeometry(r, seg(28, q, 14), seg(20, q, 10));
  b.add(ball(0.021), FINISH.yellow, place(new Vector3(0, 0.0215, 0), undefined, new Vector3(1, 1.05, 0.9)));
  b.add(ball(1), FINISH.yellow, place(HEAD.centre, undefined, HEAD.radii));
  for (const side of [-1, 1]) {
    b.add(ball(0.0055), FINISH.yellow, place(new Vector3(side * 0.0095, 0.003, 0.014), undefined, new Vector3(1, 0.6, 1.5)));
    const arm = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), 1.1).premultiply(new Quaternion().setFromAxisAngle(UP, side * 0.5));
    b.add(new CapsuleGeometry(0.0038, 0.007, seg(5, q, 3), seg(12, q, 8)), FINISH.yellow, place(new Vector3(side * 0.011, 0.029, 0.0155), arm));
  }
  for (const y of [0.025, 0.034]) {
    b.add(ball(0.009), FINISH.brown, place(new Vector3(0, y, -0.0175), undefined, new Vector3(1.3, 0.22, 0.3)));
  }
}

function buildEars(b: PartBuilder, q: Quality, place: Place): void {
  const length = 0.031;
  const radius = 0.0062;
  const tipLength = 0.011;
  for (const side of [-1, 1]) {
    const tilt = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), -side * 0.42).multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -0.12));
    const axis = new Vector3(0, 1, 0).applyQuaternion(tilt);
    const root = PIKACHU_RIG.earRoot(side);
    const flat = new Vector3(1, 1, 0.6);
    b.add(new ConeGeometry(radius, length, seg(16, q, 8)), FINISH.ear, place(root.clone().addScaledVector(axis, length / 2), tilt, flat));
    const tipRadius = radius * (tipLength / length) * 1.12;
    b.add(new ConeGeometry(tipRadius, tipLength, seg(16, q, 8)), FINISH.earTip, place(root.clone().addScaledVector(axis, length - tipLength / 2 + 0.0002), tilt, flat));
  }
}

function buildFace(b: PartBuilder, q: Quality, place: Place): void {
  const dot = (r: number, depth: number) => new SphereGeometry(r, seg(14, q, 8), seg(10, q, 6)).scale(1, 1, depth);
  for (const side of [-1, 1]) {
    const eye = onHead(side * 0.0075, 0.0555);
    b.add(dot(0.0034, 0.45), FINISH.black, place(eye.position, eye.facing));
    const shine = onHead(side * 0.0075 + 0.001, 0.057, 0.0013);
    b.add(dot(0.0012, 0.5), FINISH.white, place(shine.position, shine.facing));
    const cheek = onHead(side * 0.0138, 0.0478);
    b.add(dot(0.0041, 0.3), FINISH.cheek, place(cheek.position, cheek.facing));
  }
  const nose = onHead(0, 0.0515);
  b.add(dot(0.0008, 0.6), FINISH.black, place(nose.position, nose.facing));
  for (const side of [-1, 1]) {
    const smile = onHead(side * 0.0016, 0.0482, 0.0002);
    const arc = new TorusGeometry(0.0016, 0.00042, 4, seg(10, q, 6), Math.PI).rotateZ(Math.PI);
    b.add(arc, FINISH.mouth, place(smile.position, smile.facing));
  }
}

/** Zigzag lightning tail, drawn in its own plane: x runs backwards from the root, y up. */
function tailGeometry(): ExtrudeGeometry {
  const points = [
    [0, 0],
    [0.006, 0],
    [0.01, 0.01],
    [0.0072, 0.011],
    [0.016, 0.021],
    [0.0115, 0.0225],
    [0.023, 0.04],
    [0.0075, 0.026],
    [0.0118, 0.0247],
    [0.003, 0.0135],
    [0.0058, 0.0122]
  ];
  const shape = new Shape();
  shape.moveTo(points[0]![0]!, points[0]![1]!);
  for (const [x, y] of points.slice(1)) shape.lineTo(x!, y!);
  shape.closePath();
  const thickness = 0.0026;
  return new ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: true, bevelSize: 0.0006, bevelThickness: 0.0006, bevelSegments: 1 })
    .translate(0, 0, -thickness / 2)
    .rotateY(Math.PI / 2);
}

function buildTail(b: PartBuilder, place: Place): void {
  const turn = new Quaternion().setFromAxisAngle(UP, 0.55);
  const root = PIKACHU_RIG.tailRootAt;
  b.add(tailGeometry(), FINISH.tail, place(root, turn));
  b.add(new SphereGeometry(0.003, 8, 6), FINISH.tailRoot, place(root.clone().add(new Vector3(0, 0.002, 0)), turn, new Vector3(0.8, 1, 1.4)));
}

export function pikachuFrame(): Matrix4 {
  return new Matrix4().compose(PIKACHU.base, new Quaternion().setFromAxisAngle(UP, PIKACHU.yaw), new Vector3(1, 1, 1));
}

/** Carlos's Pikachu vinyl figure (about 8 cm with the ears) on the monitor stand, where most desks keep a rubber duck. */
export function buildPikachu(b: PartBuilder, q: Quality): void {
  const frame = pikachuFrame();
  const place: Place = (position, rotation = new Quaternion(), scale = new Vector3(1, 1, 1)) =>
    new Matrix4().multiplyMatrices(frame, new Matrix4().compose(position, rotation, scale));
  buildBodyAndHead(b, q, place);
  buildEars(b, q, place);
  buildFace(b, q, place);
  buildTail(b, place);
}
