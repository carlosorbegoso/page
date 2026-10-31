import {
  AdditiveBlending,
  ConeGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  RingGeometry,
  Vector3
} from 'three';
import { tokenColor, tokenNumber } from '../tokens';

const SWEEP_PERIOD = 12;
const SWEEP = (6 * Math.PI) / 180;

/** Contact station (constellation.md §9): a faint open cone from Alfa towards the viewer plus an expanding ring. */
export class Beacon {
  readonly root = new Group();
  private readonly aim = new Group();
  private readonly coneGeometry = new ConeGeometry(0.9, 3.5, 32, 1, true).translate(0, -1.75, 0).rotateX(-Math.PI / 2);
  private readonly ringGeometry = new RingGeometry(0.95, 1, 64);
  private readonly coneMaterial = new MeshBasicMaterial({ transparent: true, opacity: 0.06, blending: AdditiveBlending, depthWrite: false, side: DoubleSide });
  private readonly ringMaterial = new MeshBasicMaterial({ transparent: true, blending: AdditiveBlending, depthWrite: false, side: DoubleSide });
  private readonly ring = new Mesh(this.ringGeometry, this.ringMaterial);
  private readonly period = tokenNumber('--beacon-period', 6);

  constructor() {
    const cone = new Mesh(this.coneGeometry, this.coneMaterial);
    cone.raycast = () => undefined;
    this.ring.raycast = () => undefined;
    this.aim.add(cone, this.ring);
    this.root.add(this.aim);
    this.applyTokens();
  }

  /** `towards`: world point the beam points at (the camera). */
  update(time: number, motion: boolean, towards: Vector3): void {
    this.root.lookAt(towards);
    this.aim.rotation.y = motion ? Math.sin((time / SWEEP_PERIOD) * Math.PI * 2) * SWEEP : 0;
    const phase = motion ? (time / this.period) % 1 : 0.45;
    this.ring.scale.setScalar(0.3 + phase * 2.7);
    this.ring.position.z = phase * 0.8;
    this.ringMaterial.opacity = (1 - phase) * 0.6;
  }

  applyTokens(): void {
    const color = tokenColor('--color-beacon');
    this.coneMaterial.color.copy(color);
    this.ringMaterial.color.copy(color);
  }

  dispose(): void {
    this.coneGeometry.dispose();
    this.ringGeometry.dispose();
    this.coneMaterial.dispose();
    this.ringMaterial.dispose();
  }
}
