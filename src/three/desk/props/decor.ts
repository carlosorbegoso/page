import {
  CircleGeometry,
  CylinderGeometry,
  LatheGeometry,
  Matrix4,
  Quaternion,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  Vector2,
  Vector3,
  type BufferGeometry
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { doubleSided, PartBuilder } from '../builder';
import { PLANT, TELESCOPE } from '../layout';
import { along, rod, seeded, seg, shade, UP } from './geometry';
import type { Palette, Quality } from './palette';

/** A curved, folded leaf blade (pointing +Y in its own frame). */
function leaf(length: number, width: number, curl: number, q: Quality): BufferGeometry {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(width * 0.65, length * 0.18, width * 0.55, length * 0.75, 0, length);
  shape.bezierCurveTo(-width * 0.55, length * 0.75, -width * 0.65, length * 0.18, 0, 0);
  const geometry = new ShapeGeometry(shape, seg(8, q, 4));
  const position = geometry.getAttribute('position');
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const v = y / length;
    position.setZ(i, -curl * v * v * length + Math.abs(x) * 0.35);
  }
  geometry.deleteAttribute('uv');
  geometry.computeVertexNormals();
  return doubleSided(geometry);
}

/** Soil centre: the pivot the foliage sways about. */
export const PLANT_PIVOT = PLANT.clone().add(new Vector3(0, 0.106, 0));

/** Terracotta pot and soil (static); the foliage is `buildPlantLeaves`. */
export function buildPlant(b: PartBuilder, p: Palette, q: Quality): void {
  const pot = PLANT.clone();
  const profile = [
    [0, 0],
    [0.045, 0],
    [0.048, 0.005],
    [0.058, 0.11],
    [0.061, 0.114],
    [0.061, 0.12],
    [0.054, 0.12],
    [0.052, 0.106],
    [0, 0.106]
  ].map(([x, y]) => new Vector2(x!, y!));
  b.add(new LatheGeometry(profile, seg(28, q, 10)), p.pot, { position: pot.toArray() });
  b.add(new CircleGeometry(0.052, seg(20, q, 8)), p.soil, { position: [pot.x, pot.y + 0.108, pot.z], rotation: [-Math.PI / 2, 0, 0] });
}

/** Stems and leaf blades relative to `PLANT_PIVOT`, dealt round-robin into `builders` so each clump can sway on its own. */
export function buildPlantLeaves(builders: readonly PartBuilder[], p: Palette, q: Quality): void {
  const random = seeded(11);
  const leaves = Math.round(6 + 2 * q);
  for (let i = 0; i < leaves; i++) {
    const b = builders[i % builders.length]!;
    const angle = (i / leaves) * Math.PI * 2 + random() * 0.5;
    const height = 0.1 + random() * 0.16;
    const lean = 0.25 + random() * 0.3;
    const stemBase = new Vector3(Math.cos(angle) * 0.012, 0, Math.sin(angle) * 0.012);
    const outward = new Vector3(Math.cos(angle), 0, Math.sin(angle));
    const stemTop = stemBase.clone().add(new Vector3(0, height, 0)).addScaledVector(outward, height * lean);
    rod(b, stemBase, stemTop, 0.002, shade(p.plant, 0.8), q * 0.5);
    const length = 0.1 + random() * 0.07;
    const tip = outward.clone().multiplyScalar(0.8).add(new Vector3(0, 0.35 + random() * 0.4, 0)).normalize();
    const blade = new Quaternion().setFromUnitVectors(UP, tip);
    const twist = new Quaternion().setFromAxisAngle(tip, random() * 0.8 - 0.4);
    const facing = new Quaternion().setFromAxisAngle(UP, -angle + Math.PI / 2);
    const rotation = twist.multiply(blade).multiply(facing);
    b.add(leaf(length, length * 0.55, 0.25 + random() * 0.2, q), shade(p.plant, 0.85 + random() * 0.3), new Matrix4().compose(stemTop, rotation, new Vector3(1, 1, 1)));
  }
}

/** Direction the telescope tube points to (room-local), set by the station from Alfa's position. */
/** Refractor on a tripod by the window, pointing at the city (pure set dressing). */
export function buildTelescope(b: PartBuilder, p: Palette, q: Quality): void {
  const foot = TELESCOPE.foot;
  const head = new Vector3(foot.x, TELESCOPE.headHeight, foot.z);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.4;
    const tip = new Vector3(foot.x + Math.cos(a) * 0.34, 0, foot.z + Math.sin(a) * 0.34);
    rod(b, head.clone().add(new Vector3(Math.cos(a) * 0.03, -0.02, Math.sin(a) * 0.03)), tip, 0.011, p.metal, q * 0.7);
    b.add(new SphereGeometry(0.014, seg(8, q), seg(6, q)), shade(p.metal, 0.5), { position: [tip.x, 0.012, tip.z] });
  }
  b.add(new CylinderGeometry(0.1, 0.1, 0.008, seg(24, q, 6)), p.metal, { position: [foot.x, 0.46, foot.z] });
  b.add(new CylinderGeometry(0.035, 0.04, 0.06, seg(16, q, 6)), p.metal, { position: head.toArray() });
  const pivot = head.clone().add(new Vector3(0, 0.06, 0));
  b.add(new RoundedBoxGeometry(0.06, 0.05, 0.07, 1, 0.006), p.metal, { position: pivot.toArray() });
  const dir = TELESCOPE.aim.clone().normalize();
  const tubeCentre = pivot.clone().add(new Vector3(0, 0.055, 0)).addScaledVector(dir, 0.08);
  const radial = seg(28, q, 10);
  b.add(new CylinderGeometry(0.045, 0.045, 0.7, radial), p.telescope, along(tubeCentre, dir, 0));
  b.add(new CylinderGeometry(0.053, 0.053, 0.17, radial, 1, true), p.telescope, along(tubeCentre, dir, 0.42));
  b.add(new CircleGeometry(0.05, radial), p.lens, new Matrix4().multiplyMatrices(along(tubeCentre, dir, 0.37), new Matrix4().makeRotationX(-Math.PI / 2)));
  for (const offset of [-0.1, 0.12]) b.add(new CylinderGeometry(0.05, 0.05, 0.022, radial), p.telescopeBrass, along(tubeCentre, dir, offset));
  b.add(new CylinderGeometry(0.024, 0.026, 0.09, seg(16, q, 6)), p.telescopeBrass, along(tubeCentre, dir, -0.39));
  const up = new Vector3(0, 1, 0).sub(dir.clone().multiplyScalar(dir.y)).normalize();
  const eyepiece = tubeCentre.clone().addScaledVector(dir, -0.44);
  rod(b, eyepiece, eyepiece.clone().addScaledVector(up, 0.06), 0.014, p.metal, q);
  const finder = tubeCentre.clone().addScaledVector(up, 0.07).addScaledVector(dir, -0.12);
  b.add(new CylinderGeometry(0.012, 0.012, 0.17, seg(12, q)), p.telescope, along(finder, dir, 0));
}
