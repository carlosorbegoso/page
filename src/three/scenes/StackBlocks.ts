import { BoxGeometry, Color, Group, InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { tokenColor, tokenNumber } from '../tokens';
import { mulberry32 } from './common';

const LAYERS = 4;
const ORBITERS = 8;
const LAYER_GAP = 0.17;

/** About station: a sober "stack" of slabs with signal edges and orbiting tech nodes (3 draw calls). */
export class StackBlocks {
  readonly root = new Group();
  readonly height = 0.15 + LAYERS * LAYER_GAP + 0.1;
  private readonly slabGeometry = new RoundedBoxGeometry(0.9, 0.09, 0.55, 2, 0.02);
  private readonly stripGeometry = new BoxGeometry(0.82, 0.012, 0.012);
  private readonly cubeGeometry = new BoxGeometry(0.09, 0.09, 0.09);
  private readonly slabMaterial = new MeshStandardMaterial({ flatShading: true });
  private readonly stripMaterial = new MeshStandardMaterial();
  private readonly cubeMaterial = new MeshStandardMaterial({ roughness: 0.5, metalness: 0.3 });
  private readonly slabs = new InstancedMesh(this.slabGeometry, this.slabMaterial, LAYERS);
  private readonly strips = new InstancedMesh(this.stripGeometry, this.stripMaterial, LAYERS);
  private readonly cubes = new InstancedMesh(this.cubeGeometry, this.cubeMaterial, ORBITERS);
  private readonly orbit = Array.from({ length: ORBITERS }, (_, i) => {
    const random = mulberry32(31 + i);
    return { angle: (i / ORBITERS) * Math.PI * 2, radius: 0.75 + random() * 0.25, y: 0.12 + random() * 0.75, tilt: random() };
  });

  constructor() {
    const matrix = new Matrix4();
    const rotation = new Quaternion();
    const one = new Vector3(1, 1, 1);
    for (let i = 0; i < LAYERS; i++) {
      const y = 0.15 + i * LAYER_GAP;
      rotation.setFromAxisAngle(new Vector3(0, 1, 0), (i - 1.5) * 0.08);
      this.slabs.setMatrixAt(i, matrix.compose(new Vector3(0, y, 0), rotation, one));
      const front = new Vector3(0, y, 0.28).applyQuaternion(rotation).setY(y);
      this.strips.setMatrixAt(i, matrix.compose(front, rotation, one));
    }
    this.layoutCubes(0);
    this.root.add(this.slabs, this.strips, this.cubes);
    this.applyTokens();
  }

  private layoutCubes(time: number): void {
    const matrix = new Matrix4();
    const rotation = new Quaternion();
    const one = new Vector3(1, 1, 1);
    this.orbit.forEach((o, i) => {
      const a = o.angle + time * 0.15;
      rotation.setFromAxisAngle(new Vector3(o.tilt, 1, 0.3).normalize(), a * 2);
      this.cubes.setMatrixAt(i, matrix.compose(new Vector3(Math.cos(a) * o.radius, o.y, Math.sin(a) * o.radius * 0.7), rotation, one));
    });
    this.cubes.instanceMatrix.needsUpdate = true;
  }

  update(time: number, motion: boolean): void {
    if (motion) this.layoutCubes(time);
  }

  applyTokens(): void {
    this.slabMaterial.color.copy(tokenColor('--color-alfa-body'));
    this.slabMaterial.roughness = tokenNumber('--alfa-roughness', 0.4);
    this.slabMaterial.metalness = tokenNumber('--alfa-metalness', 0.6);
    const signal = tokenColor('--color-alfa-signal');
    this.stripMaterial.color.copy(signal).multiplyScalar(0.25);
    this.stripMaterial.emissive.copy(signal);
    this.stripMaterial.emissiveIntensity = tokenNumber('--alfa-signal-intensity', 1.6) * 0.8;
    const palette = [tokenColor('--color-scene-node'), tokenColor('--color-tool-body'), tokenColor('--color-alfa-body')];
    const color = new Color();
    for (let i = 0; i < ORBITERS; i++) this.cubes.setColorAt(i, color.copy(palette[i % palette.length]!));
    if (this.cubes.instanceColor) this.cubes.instanceColor.needsUpdate = true;
  }

  dispose(): void {
    for (const mesh of [this.slabs, this.strips, this.cubes]) mesh.dispose();
    for (const geometry of [this.slabGeometry, this.stripGeometry, this.cubeGeometry]) geometry.dispose();
    for (const material of [this.slabMaterial, this.stripMaterial, this.cubeMaterial]) material.dispose();
  }
}
