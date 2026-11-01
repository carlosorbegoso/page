import { CircleGeometry, Color, LatheGeometry, Matrix4, Quaternion, SphereGeometry, Vector2, Vector3 } from 'three';
import { PartBuilder, type Finish } from '../builder';
import { SUCCULENT } from '../layout';
import { seeded, seg, shade, UP } from './geometry';
import type { Palette, Quality } from './palette';

const POT_HEIGHT = 0.052;
const SOIL_Y = POT_HEIGHT - 0.007;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const LEAF: Finish = { color: new Color('#8fae8b'), roughness: 0.55, metalness: 0 };
const BLUSH: Finish = { color: new Color('#c98a86'), roughness: 0.55, metalness: 0 };

function buildPot(b: PartBuilder, p: Palette, q: Quality, at: (m: Matrix4) => Matrix4): void {
  const profile = [
    [0, 0],
    [0.027, 0],
    [0.029, 0.003],
    [0.034, POT_HEIGHT - 0.004],
    [0.036, POT_HEIGHT],
    [0.032, POT_HEIGHT],
    [0.03, SOIL_Y],
    [0, SOIL_Y]
  ].map(([x, y]) => new Vector2(x!, y!));
  const ceramic: Finish = { color: new Color('#d9d2c5'), roughness: 0.35, metalness: 0 };
  b.add(new LatheGeometry(profile, seg(32, q, 14)), ceramic, at(new Matrix4()));
  b.add(new CircleGeometry(0.031, seg(24, q, 10)).rotateX(-Math.PI / 2), p.soil, at(new Matrix4().makeTranslation(0, SOIL_Y + 0.0005, 0)));
  const random = seeded(5);
  for (let i = 0; i < 9; i++) {
    const angle = random() * Math.PI * 2;
    const radius = 0.016 + random() * 0.012;
    const pebble = new SphereGeometry(0.0028 + random() * 0.0015, 7, 5).scale(1, 0.6, 1);
    b.add(pebble, shade(p.paper, 0.75 + random() * 0.2), at(new Matrix4().makeTranslation(Math.cos(angle) * radius, SOIL_Y + 0.0012, Math.sin(angle) * radius)));
  }
}

/**
 * Echeveria rosette: fleshy pointed leaves on a golden-angle spiral, the outer ones long and nearly
 * flat, the inner ones short and upright, each with a blushed tip.
 */
function buildRosette(b: PartBuilder, q: Quality, at: (m: Matrix4) => Matrix4): void {
  const count = Math.round(22 + 10 * q);
  const random = seeded(17);
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const length = 0.026 - 0.016 * t;
    const width = length * 0.5;
    const tilt = 1.35 - 1.05 * t;
    const heading = i * GOLDEN_ANGLE;
    const rotation = new Quaternion().setFromAxisAngle(UP, heading).multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), tilt));
    const base = new Vector3(0, SOIL_Y + 0.004 + 0.007 * t, 0);
    const toTip = new Vector3(0, length * 0.5, 0).applyQuaternion(rotation);
    const shadeFactor = 0.85 + 0.25 * t + random() * 0.08;
    const leaf = new SphereGeometry(1, seg(12, q, 8), seg(8, q, 6)).scale(width / 2, length / 2, width * 0.22);
    b.add(leaf, shade(LEAF, shadeFactor), at(new Matrix4().compose(base.clone().add(toTip), rotation, new Vector3(1, 1, 1))));
    const tip = new SphereGeometry(1, 8, 6).scale(width * 0.16, length * 0.12, width * 0.12);
    b.add(tip, BLUSH, at(new Matrix4().compose(base.clone().addScaledVector(toTip, 1.9), rotation, new Vector3(1, 1, 1))));
  }
}

/** Carlos's living succulent: a blue-green echeveria in a small ceramic pot with pebbles, beside the laptop. */
export function buildSucculent(b: PartBuilder, p: Palette, q: Quality): void {
  const frame = new Matrix4().compose(SUCCULENT, new Quaternion(), new Vector3(1, 1, 1));
  const at = (m: Matrix4) => new Matrix4().multiplyMatrices(frame, m);
  buildPot(b, p, q, at);
  buildRosette(b, q, at);
}
