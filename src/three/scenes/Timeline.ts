import {
  BufferGeometry,
  Color,
  CylinderGeometry,
  Group,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  Matrix4,
  MeshStandardMaterial,
  OctahedronGeometry,
  Quaternion,
  TorusGeometry,
  Mesh,
  Vector3
} from 'three';
import { tokenColor, tokenNumber } from '../tokens';
import { damp } from './common';

export interface Milestone {
  id: string;
  label: string;
  current: boolean;
}

const HEIGHTS = [0.95, 0.78, 0.62, 0.48];

/** Experience station: milestones on a path, the current job highlighted with the live colour. */
export class Timeline {
  readonly root = new Group();
  readonly tops: InstancedMesh;
  readonly pillars: InstancedMesh;
  readonly positions: Vector3[];
  private readonly pillarGeometry = new CylinderGeometry(0.022, 0.03, 1, 10);
  private readonly topGeometry = new OctahedronGeometry(0.085, 0);
  private readonly ringGeometry = new TorusGeometry(0.15, 0.008, 6, 40);
  private readonly pillarMaterial = new MeshStandardMaterial({ roughness: 0.4, metalness: 0.7 });
  private readonly topMaterial = new MeshStandardMaterial({ roughness: 0.35, metalness: 0.4, flatShading: true });
  private readonly ringMaterial = new MeshStandardMaterial();
  private readonly pathMaterial = new LineBasicMaterial({ transparent: true, opacity: 0.9 });
  private readonly pathGeometry = new BufferGeometry();
  private readonly ring = new Mesh(this.ringGeometry, this.ringMaterial);
  private ringIndex: number;
  private ringPosition = new Vector3();
  private hovered = -1;

  constructor(readonly milestones: Milestone[]) {
    const count = milestones.length;
    this.positions = milestones.map((_, i) => {
      const t = count > 1 ? i / (count - 1) : 0;
      return new Vector3(-1.3 + t * 2.6, HEIGHTS[i] ?? 0.4, Math.sin(t * Math.PI) * -0.45);
    });
    this.pillars = new InstancedMesh(this.pillarGeometry, this.pillarMaterial, count);
    this.tops = new InstancedMesh(this.topGeometry, this.topMaterial, count);
    const matrix = new Matrix4();
    const identity = new Quaternion();
    this.positions.forEach((p, i) => {
      this.pillars.setMatrixAt(i, matrix.compose(new Vector3(p.x, p.y / 2, p.z), identity, new Vector3(1, p.y, 1)));
      this.tops.setMatrixAt(i, matrix.compose(new Vector3(p.x, p.y + 0.1, p.z), identity, new Vector3(1, 1.25, 1)));
    });
    const path = new Line(
      this.pathGeometry.setFromPoints([
        new Vector3(-1.7, 0.01, 0.1),
        ...this.positions.map(p => new Vector3(p.x, 0.01, p.z)),
        new Vector3(1.7, 0.01, 0.1)
      ]),
      this.pathMaterial
    );
    path.raycast = () => undefined;
    this.ring.raycast = () => undefined;
    this.ringIndex = Math.max(0, milestones.findIndex(m => m.current));
    this.ringPosition.copy(this.ringTarget());
    this.ring.position.copy(this.ringPosition);
    this.root.add(path, this.pillars, this.tops, this.ring);
    this.applyTokens();
  }

  private ringTarget(): Vector3 {
    const p = this.positions[this.ringIndex]!;
    return new Vector3(p.x, p.y + 0.1, p.z);
  }

  /** Highlights a milestone by id (from `experience:focus`); unknown ids fall back to the current job. */
  focus(id: string | null): void {
    const index = this.milestones.findIndex(m => m.id === id);
    this.ringIndex = index >= 0 ? index : Math.max(0, this.milestones.findIndex(m => m.current));
    this.applyTokens();
  }

  hover(index: number): void {
    if (index === this.hovered) return;
    this.hovered = index;
    this.applyTokens();
  }

  update(dt: number, time: number, motion: boolean, instant: boolean): boolean {
    const target = this.ringTarget();
    if (instant) this.ringPosition.copy(target);
    else {
      this.ringPosition.x = damp(this.ringPosition.x, target.x, 6, dt);
      this.ringPosition.y = damp(this.ringPosition.y, target.y, 6, dt);
      this.ringPosition.z = damp(this.ringPosition.z, target.z, 6, dt);
    }
    this.ring.position.copy(this.ringPosition);
    this.ring.rotation.x = Math.PI / 2 + (motion ? Math.sin(time * 0.8) * 0.15 : 0);
    return this.ringPosition.distanceToSquared(target) > 1e-6;
  }

  applyTokens(): void {
    this.pillarMaterial.color.copy(tokenColor('--color-tool-body'));
    this.topMaterial.color.set(0xffffff);
    const live = tokenColor('--color-status-live');
    const node = tokenColor('--color-scene-node');
    const body = tokenColor('--color-alfa-body');
    const color = new Color();
    this.milestones.forEach((m, i) => {
      const base = m.current ? live : body;
      color.copy(base);
      if (i === this.hovered || i === this.ringIndex) color.lerp(m.current ? live : node, 0.6);
      this.tops.setColorAt(i, color);
    });
    if (this.tops.instanceColor) this.tops.instanceColor.needsUpdate = true;
    const ringColor = this.milestones[this.ringIndex]?.current ? live : node;
    this.ringMaterial.color.copy(ringColor).multiplyScalar(0.25);
    this.ringMaterial.emissive.copy(ringColor);
    this.ringMaterial.emissiveIntensity = tokenNumber('--alfa-signal-intensity', 1.6);
    this.pathMaterial.color.copy(tokenColor('--color-border-strong'));
  }

  dispose(): void {
    this.pillars.dispose();
    this.tops.dispose();
    for (const g of [this.pillarGeometry, this.topGeometry, this.ringGeometry, this.pathGeometry]) g.dispose();
    for (const m of [this.pillarMaterial, this.topMaterial, this.ringMaterial, this.pathMaterial]) m.dispose();
  }
}
