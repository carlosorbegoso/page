import { CapsuleGeometry, CatmullRomCurve3, Color, ConeGeometry, ExtrudeGeometry, Matrix4, Quaternion, Shape, SphereGeometry, TubeGeometry, Vector3 } from 'three';
import { PartBuilder, type Finish } from '../builder';
import { CHARIZARD } from '../layout';
import { between, seg, UP } from './geometry';
import type { Quality } from './palette';

const VINYL = { roughness: 0.42, metalness: 0 } as const;
/** Moving parts for `life/pokemon`, found by colour (each a hair off its neighbour) and the pivots they turn on. */
export const CHARIZARD_RIG = {
  wing: new Color('#e2722c'),
  membrane: new Color('#2f7d88'),
  bone: new Color('#e0702e'),
  claw: new Color('#efe2c7'),
  tail: new Color('#e47028'),
  flame: new Color('#ff8a24'),
  core: new Color('#ffd36a'),
  wingRoot: (side: number) => new Vector3(side * 0.007, 0.05, -0.012),
  tailRootAt: new Vector3(0, 0.014, -0.012),
  tailTip: new Vector3(0.033, 0.021, -0.025)
} as const;

const FINISH = {
  orange: { color: new Color('#e2702a'), ...VINYL },
  wing: { color: CHARIZARD_RIG.wing, ...VINYL },
  bone: { color: CHARIZARD_RIG.bone, ...VINYL },
  claw: { color: CHARIZARD_RIG.claw, ...VINYL },
  tail: { color: CHARIZARD_RIG.tail, ...VINYL },
  cream: { color: new Color('#f0d39a'), ...VINYL },
  membrane: { color: CHARIZARD_RIG.membrane, roughness: 0.55, metalness: 0 },
  horn: { color: new Color('#efe2c4'), ...VINYL },
  black: { color: new Color('#141210'), roughness: 0.3, metalness: 0 },
  white: { color: new Color('#f7f4ee'), roughness: 0.25, metalness: 0 },
  flame: { color: CHARIZARD_RIG.flame, roughness: 0.5, metalness: 0, emissive: 1.8 },
  core: { color: CHARIZARD_RIG.core, roughness: 0.5, metalness: 0, emissive: 2.4 }
} satisfies Record<string, Finish>;

/** Every colour of the figure, so `life/pokemon` can move the whole body in the battle. */
export const CHARIZARD_COLORS: readonly Color[] = Object.values(FINISH).map(finish => finish.color);

type Place = (position: Vector3, rotation?: Quaternion, scale?: Vector3) => Matrix4;

function ball(q: Quality, r = 1): SphereGeometry {
  return new SphereGeometry(r, seg(24, q, 12), seg(18, q, 9));
}

function buildTorso(b: PartBuilder, q: Quality, place: Place): void {
  const lean = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), 0.12);
  b.add(ball(q), FINISH.orange, place(new Vector3(0, 0.03, 0), lean, new Vector3(0.019, 0.026, 0.017)));
  b.add(ball(q), FINISH.cream, place(new Vector3(0, 0.029, 0.0095), lean, new Vector3(0.0145, 0.021, 0.009)));
  for (const side of [-1, 1]) {
    b.add(ball(q, 0.0095), FINISH.orange, place(new Vector3(side * 0.012, 0.012, 0.002)));
    b.add(ball(q), FINISH.orange, place(new Vector3(side * 0.013, 0.004, 0.009), undefined, new Vector3(0.0062, 0.004, 0.0105)));
    for (const toe of [-1, 0, 1]) {
      b.add(new ConeGeometry(0.0013, 0.004, 6).rotateX(Math.PI / 2), FINISH.horn, place(new Vector3(side * 0.013 + toe * 0.003, 0.003, 0.0195)));
    }
    const arm = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), 1.0).premultiply(new Quaternion().setFromAxisAngle(UP, side * 0.45));
    b.add(new CapsuleGeometry(0.0034, 0.009, seg(5, q, 3), seg(10, q, 6)), FINISH.orange, place(new Vector3(side * 0.015, 0.038, 0.012), arm));
  }
}

function buildHead(b: PartBuilder, q: Quality, place: Place): void {
  const neckFrom = new Vector3(0, 0.05, 0.002);
  const neckTo = new Vector3(0, 0.07, 0.006);
  b.add(new CapsuleGeometry(0.0068, neckFrom.distanceTo(neckTo), seg(5, q, 3), seg(12, q, 8)), FINISH.orange, place(neckFrom.clone().lerp(neckTo, 0.5), new Quaternion().setFromRotationMatrix(between(neckFrom, neckTo))));
  b.add(ball(q), FINISH.orange, place(new Vector3(0, 0.076, 0.008), undefined, new Vector3(0.011, 0.0098, 0.0125)));
  b.add(ball(q), FINISH.orange, place(new Vector3(0, 0.0725, 0.019), undefined, new Vector3(0.0078, 0.006, 0.0085)));
  for (const side of [-1, 1]) {
    const horn = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -1.05).premultiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), -side * 0.25));
    b.add(new ConeGeometry(0.0026, 0.013, seg(10, q, 6)), FINISH.horn, place(new Vector3(side * 0.006, 0.084, -0.002), horn));
    const eye = new Vector3(side * 0.0072, 0.0785, 0.0158);
    const facing = new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), new Vector3(side * 0.55, 0.15, 1).normalize());
    b.add(ball(q, 0.0022).scale(1, 1.25, 0.5), FINISH.black, place(eye, facing));
    b.add(ball(q, 0.0007), FINISH.white, place(eye.clone().add(new Vector3(side * 0.0004, 0.0009, 0.001))));
  }
}

/** Bat wing, x outwards and y up: the bone rises to the tip, the membrane scallops back down to the root. */
const WING_OUTLINE = [
  [0, 0],
  [0.013, 0.031],
  [0.033, 0.052],
  [0.044, 0.031],
  [0.036, 0.027],
  [0.039, 0.013],
  [0.027, 0.012],
  [0.024, 0.001],
  [0.011, 0.003]
] as const;

function wingShape(inset = 0): Shape {
  const shape = new Shape();
  const centre = new Vector3(0.024, 0.022, 0);
  const points = WING_OUTLINE.map(([x, y]) => new Vector3(x, y, 0).lerp(centre, inset));
  shape.moveTo(points[0]!.x, points[0]!.y);
  for (const point of points.slice(1)) shape.lineTo(point.x, point.y);
  shape.closePath();
  return shape;
}

function buildWings(b: PartBuilder, q: Quality, place: Place): void {
  const bonePath = [new Vector3(0, 0, 0.0004), new Vector3(0.013, 0.031, 0.0004), new Vector3(0.033, 0.052, 0.0004)];
  for (const side of [-1, 1]) {
    const sweep = new Quaternion().setFromAxisAngle(UP, side * 0.42).multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -0.22));
    const root = CHARIZARD_RIG.wingRoot(side);
    const mirror = new Vector3(side, 1, 1);
    b.add(new ExtrudeGeometry(wingShape(), { depth: 0.0012, bevelEnabled: false }).translate(0, 0, -0.0012), FINISH.wing, place(root, sweep, mirror));
    b.add(new ExtrudeGeometry(wingShape(0.12), { depth: 0.0004, bevelEnabled: false }), FINISH.membrane, place(root, sweep, mirror));
    b.add(new TubeGeometry(new CatmullRomCurve3(bonePath), seg(12, q, 6), 0.0013, 6, false), FINISH.bone, place(root, sweep, mirror));
    b.add(new ConeGeometry(0.0011, 0.004, 6), FINISH.claw, place(root, sweep, mirror).multiply(new Matrix4().makeTranslation(0.0345, 0.0545, 0.0004)));
  }
}

function buildTail(b: PartBuilder, q: Quality, place: Place): void {
  const tip = CHARIZARD_RIG.tailTip;
  const path = [CHARIZARD_RIG.tailRootAt, new Vector3(0.008, 0.008, -0.028), new Vector3(0.024, 0.011, -0.034), tip];
  b.add(new TubeGeometry(new CatmullRomCurve3(path), seg(24, q, 12), 0.0036, seg(10, q, 6), false), FINISH.tail, place(new Vector3()));
  b.add(ball(q, 0.0036), FINISH.tail, place(tip));
  b.add(new ConeGeometry(0.0062, 0.022, seg(14, q, 8)), FINISH.flame, place(tip.clone().add(new Vector3(0, 0.0115, 0))));
  b.add(ball(q, 0.0042).scale(1, 1.7, 1), FINISH.core, place(tip.clone().add(new Vector3(0, 0.007, 0.0012))));
}

export function charizardFrame(): Matrix4 {
  return new Matrix4().compose(CHARIZARD.base, new Quaternion().setFromAxisAngle(UP, CHARIZARD.yaw), new Vector3(1, 1, 1));
}

/** Carlos's Charizard vinyl figure (about 10 cm) on the monitor stand, left of the column; its tail flame glows. */
export function buildCharizard(b: PartBuilder, q: Quality): void {
  const frame = charizardFrame();
  const place: Place = (position, rotation = new Quaternion(), scale = new Vector3(1, 1, 1)) =>
    new Matrix4().multiplyMatrices(frame, new Matrix4().compose(position, rotation, scale));
  buildTorso(b, q, place);
  buildHead(b, q, place);
  buildWings(b, q, place);
  buildTail(b, q, place);
}
