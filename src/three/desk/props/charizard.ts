import { CapsuleGeometry, CatmullRomCurve3, Color, ConeGeometry, ExtrudeGeometry, Matrix4, Quaternion, Shape, SphereGeometry, TubeGeometry, Vector3 } from 'three';
import { PartBuilder, type Finish } from '../builder';
import { CHARIZARD } from '../layout';
import { between, seg, UP } from './geometry';
import type { Quality } from './palette';

const VINYL = { roughness: 0.42, metalness: 0 } as const;
const FINISH = {
  orange: { color: new Color('#e2702a'), ...VINYL },
  cream: { color: new Color('#f0d39a'), ...VINYL },
  membrane: { color: new Color('#2f7d88'), ...VINYL },
  horn: { color: new Color('#efe2c4'), ...VINYL },
  black: { color: new Color('#141210'), roughness: 0.3, metalness: 0 },
  white: { color: new Color('#f7f4ee'), roughness: 0.25, metalness: 0 },
  flame: { color: new Color('#ff8a24'), roughness: 0.5, metalness: 0, emissive: 1.6 },
  core: { color: new Color('#ffd36a'), roughness: 0.5, metalness: 0, emissive: 2.2 }
} satisfies Record<string, Finish>;

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

/** Bat wing: a leading edge rising to a tip and a scalloped trailing edge, x outwards, y up. */
function wingShape(): Shape {
  const points = [
    [0, 0],
    [0.012, 0.014],
    [0.036, 0.044],
    [0.031, 0.027],
    [0.025, 0.025],
    [0.021, 0.016],
    [0.014, 0.014],
    [0.009, 0.005]
  ];
  const shape = new Shape();
  shape.moveTo(points[0]![0]!, points[0]![1]!);
  for (const [x, y] of points.slice(1)) shape.lineTo(x!, y!);
  shape.closePath();
  return shape;
}

function buildWings(b: PartBuilder, place: Place): void {
  const shape = wingShape();
  for (const side of [-1, 1]) {
    const sweep = new Quaternion().setFromAxisAngle(UP, side * 0.55).multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -0.25));
    const root = new Vector3(side * 0.007, 0.05, -0.012);
    const mirror = new Vector3(side, 1, 1);
    b.add(new ExtrudeGeometry(shape, { depth: 0.0012, bevelEnabled: false }).translate(0, 0, -0.0012), FINISH.orange, place(root, sweep, mirror));
    const inner = new ExtrudeGeometry(shape, { depth: 0.0004, bevelEnabled: false }).scale(0.9, 0.9, 1).translate(0.0025, 0.0018, 0);
    b.add(inner, FINISH.membrane, place(root, sweep, mirror));
  }
}

function buildTail(b: PartBuilder, q: Quality, place: Place): void {
  const path = [
    new Vector3(0, 0.014, -0.012),
    new Vector3(0.008, 0.008, -0.028),
    new Vector3(0.024, 0.011, -0.034),
    new Vector3(0.033, 0.021, -0.025)
  ];
  b.add(new TubeGeometry(new CatmullRomCurve3(path), seg(24, q, 12), 0.0036, seg(10, q, 6), false), FINISH.orange, place(new Vector3()));
  const tip = path[path.length - 1]!;
  b.add(ball(q, 0.0036), FINISH.orange, place(tip));
  b.add(new ConeGeometry(0.0048, 0.016, seg(12, q, 8)), FINISH.flame, place(tip.clone().add(new Vector3(0, 0.0085, 0))));
  b.add(ball(q, 0.0032).scale(1, 1.5, 1), FINISH.core, place(tip.clone().add(new Vector3(0, 0.0055, 0.0016))));
}

/** Carlos's Charizard vinyl figure (about 10 cm) on the monitor stand, left of the column; its tail flame glows. */
export function buildCharizard(b: PartBuilder, q: Quality): void {
  const frame = new Matrix4().compose(CHARIZARD.base, new Quaternion().setFromAxisAngle(UP, CHARIZARD.yaw), new Vector3(1, 1, 1));
  const place: Place = (position, rotation = new Quaternion(), scale = new Vector3(1, 1, 1)) =>
    new Matrix4().multiplyMatrices(frame, new Matrix4().compose(position, rotation, scale));
  buildTorso(b, q, place);
  buildHead(b, q, place);
  buildWings(b, place);
  buildTail(b, q, place);
}
