import {
  AdditiveBlending,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  type MeshStandardMaterial,
  type Quaternion,
  type Scene
} from 'three';
import { tokenColor } from '../tokens';
import { beamShader } from './beam.glsl';
import { DEG, LAMP_HEAD, TARGET } from './constants';
import type { RoomMaterials } from './materials';
import { rod } from './rod';

const DOWN = new Vector3(0, -1, 0);
const LAMP_BASE = new Vector3(-1.35, 0.03, -1.05);
const LAMP_ELBOW = new Vector3(-1.2, 1.25, -1.15);

export interface LampBeam {
  color: Color;
  direction: Vector3;
  length: number;
  orientation: Quaternion;
}

function addArm(scene: Scene, metal: MeshStandardMaterial): void {
  const base = new Mesh(new CylinderGeometry(0.24, 0.27, 0.06, 32), metal);
  base.position.copy(LAMP_BASE);
  base.castShadow = true;
  scene.add(base, rod(LAMP_BASE, LAMP_ELBOW, 0.022, metal), rod(LAMP_ELBOW, LAMP_HEAD, 0.02, metal));
}

function addHead(scene: Scene, shade: MeshStandardMaterial, direction: Vector3, color: Color): void {
  const headGeometry = new ConeGeometry(0.2, 0.3, 32, 1, true);
  headGeometry.translate(0, -0.15, 0);
  const head = new Mesh(headGeometry, shade);
  head.position.copy(LAMP_HEAD).addScaledVector(direction, -0.08);
  head.quaternion.setFromUnitVectors(DOWN, direction);
  scene.add(head);

  const bulb = new Mesh(new SphereGeometry(0.06, 16, 12), new MeshBasicMaterial({ color: new Color(color).multiplyScalar(2) }));
  bulb.position.copy(LAMP_HEAD).addScaledVector(direction, 0.02);
  scene.add(bulb);
}

function addVisibleBeam(scene: Scene, direction: Vector3, color: Color, length: number): Mesh {
  const beamGeometry = new ConeGeometry(Math.tan(30 * DEG) * length, length, 40, 1, true);
  beamGeometry.translate(0, -length / 2, 0);
  const beamMaterial = new ShaderMaterial({
    ...beamShader,
    uniforms: { uColor: { value: color } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide
  });
  const beam = new Mesh(beamGeometry, beamMaterial);
  beam.position.copy(LAMP_HEAD);
  beam.quaternion.setFromUnitVectors(DOWN, direction);
  scene.add(beam);
  return beam;
}

export function buildLamp(scene: Scene, materials: RoomMaterials): LampBeam {
  const direction = TARGET.clone().sub(LAMP_HEAD).normalize();
  const color = tokenColor('--color-lamp', '#ffb566');
  addArm(scene, materials.metal);
  addHead(scene, materials.shade, direction, color);
  const length = LAMP_HEAD.distanceTo(TARGET) * 1.02;
  const beam = addVisibleBeam(scene, direction, color, length);
  return { color, direction, length, orientation: beam.quaternion };
}
