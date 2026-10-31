import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Quaternion,
  RingGeometry,
  SphereGeometry,
  Vector3
} from 'three';
import { tokenColor, tokenNumber } from '../tokens';
import { damp } from './common';

export interface Milestone {
  id: string;
  label: string;
  current: boolean;
}

const SEMI_X = 3.2;
const SEMI_Z = 2.0;
const ANGLES = [200, 250, 300, 350].map(deg => (deg * Math.PI) / 180);
const PULSE_PERIOD = 3.2;

function ellipse(angle: number, scale = 1): Vector3 {
  return new Vector3(Math.cos(angle) * SEMI_X * scale, 0, -Math.sin(angle) * SEMI_Z * scale);
}

/**
 * Experience station (constellation.md §7): a 3.2 × 2.0 elliptical orbit with the jobs at
 * 200°–350° in chronological order, graduation ticks, the current job glowing in the live colour
 * with a pulsing ring, and the last stretch of orbit lit.
 */
export class OrbitMilestones {
  readonly root = new Group();
  readonly markers: InstancedMesh;
  private readonly positions: Vector3[];
  private readonly orbitGeometry = new BufferGeometry();
  private readonly arcGeometry = new BufferGeometry();
  private readonly tickGeometry = new BufferGeometry();
  private readonly markerGeometry = new SphereGeometry(0.05, 16, 12);
  private readonly pulseGeometry = new RingGeometry(0.9, 1, 48);
  private readonly orbitMaterial = new LineBasicMaterial({ transparent: true });
  private readonly arcMaterial = new LineBasicMaterial({ transparent: true });
  private readonly markerMaterial = new MeshStandardMaterial({ roughness: 0.4, metalness: 0.2 });
  private readonly pulseMaterial = new MeshBasicMaterial({ transparent: true, blending: AdditiveBlending, depthWrite: false, side: DoubleSide });
  private readonly pulse = new Mesh(this.pulseGeometry, this.pulseMaterial);
  private readonly pulsePosition = new Vector3();
  private focusIndex: number;
  private hovered = -1;

  /** `milestones` arrive newest first (content order); the orbit runs oldest → newest. */
  constructor(readonly milestones: Milestone[]) {
    const count = milestones.length;
    this.positions = milestones.map((_, i) => ellipse(ANGLES[Math.max(0, count - 1 - i)] ?? ANGLES[0]!));
    this.orbitGeometry.setFromPoints(Array.from({ length: 257 }, (_, i) => ellipse((i / 256) * Math.PI * 2)));
    const latest = ANGLES[Math.min(count - 1, ANGLES.length - 1)]!;
    const previous = ANGLES[Math.max(0, Math.min(count - 2, ANGLES.length - 1))]!;
    this.arcGeometry.setFromPoints(
      Array.from({ length: 33 }, (_, i) => ellipse(previous + ((latest - previous) * i) / 32))
    );
    const ticks: Vector3[] = [];
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      ticks.push(ellipse(a, 0.985), ellipse(a, 1.015));
    }
    this.positions.forEach(p => {
      const angle = Math.atan2(-p.z / SEMI_Z, p.x / SEMI_X);
      ticks.push(ellipse(angle, 0.94), ellipse(angle, 1.06));
    });
    this.tickGeometry.setFromPoints(ticks);
    const orbit = new Line(this.orbitGeometry, this.orbitMaterial);
    const arc = new Line(this.arcGeometry, this.arcMaterial);
    const tickLines = new LineSegments(this.tickGeometry, this.orbitMaterial);
    for (const object of [orbit, arc, tickLines, this.pulse]) object.raycast = () => undefined;

    this.markers = new InstancedMesh(this.markerGeometry, this.markerMaterial, count);
    const matrix = new Matrix4();
    this.positions.forEach((p, i) => {
      const scale = milestones[i]!.current ? 1.6 : 1;
      this.markers.setMatrixAt(i, matrix.compose(p, new Quaternion(), new Vector3(scale, scale, scale)));
    });
    this.focusIndex = this.currentIndex();
    this.pulsePosition.copy(this.positions[this.focusIndex] ?? new Vector3());
    this.root.add(orbit, tickLines, arc, this.markers, this.pulse);
    this.applyTokens();
  }

  private currentIndex(): number {
    return Math.max(0, this.milestones.findIndex(m => m.current));
  }

  worldPosition(id: string): Vector3 | null {
    const index = this.milestones.findIndex(m => m.id === id);
    const position = this.positions[index];
    return position ? this.root.localToWorld(position.clone()) : null;
  }

  focus(id: string | null): void {
    const index = this.milestones.findIndex(m => m.id === id);
    this.focusIndex = index >= 0 ? index : this.currentIndex();
    this.applyTokens();
  }

  hover(index: number): void {
    if (index === this.hovered) return;
    this.hovered = index;
    this.applyTokens();
  }

  update(dt: number, time: number, motion: boolean, instant: boolean, camera: Vector3): boolean {
    const target = this.positions[this.focusIndex]!;
    if (instant) this.pulsePosition.copy(target);
    else {
      this.pulsePosition.set(
        damp(this.pulsePosition.x, target.x, 6, dt),
        damp(this.pulsePosition.y, target.y, 6, dt),
        damp(this.pulsePosition.z, target.z, 6, dt)
      );
    }
    this.pulse.position.copy(this.pulsePosition);
    this.pulse.lookAt(this.root.worldToLocal(camera.clone()));
    const phase = motion ? (time / PULSE_PERIOD) % 1 : 0.5;
    this.pulse.scale.setScalar(0.08 + phase * 0.22);
    this.pulseMaterial.opacity = (1 - phase) * 0.9;
    return this.pulsePosition.distanceToSquared(target) > 1e-6;
  }

  applyTokens(): void {
    const current = tokenColor('--color-milestone-current');
    const past = tokenColor('--color-milestone');
    const active = tokenColor('--color-orbit-active');
    const color = new Color();
    this.milestones.forEach((m, i) => {
      color.copy(m.current ? current : past);
      if (i === this.hovered || (i === this.focusIndex && !m.current)) color.lerp(active, 0.7);
      this.markers.setColorAt(i, color);
    });
    if (this.markers.instanceColor) this.markers.instanceColor.needsUpdate = true;
    this.markerMaterial.emissive.copy(current);
    this.markerMaterial.emissiveIntensity = 0;
    const focusCurrent = this.milestones[this.focusIndex]?.current ?? true;
    this.pulseMaterial.color.copy(focusCurrent ? current : active);
    this.orbitMaterial.color.copy(tokenColor('--color-orbit'));
    this.orbitMaterial.opacity = tokenNumber('--orbit-opacity', 0.45);
    this.arcMaterial.color.copy(active);
    this.arcMaterial.opacity = tokenNumber('--orbit-active-opacity', 0.9);
  }

  dispose(): void {
    this.markers.dispose();
    for (const g of [this.orbitGeometry, this.arcGeometry, this.tickGeometry, this.markerGeometry, this.pulseGeometry]) g.dispose();
    for (const m of [this.orbitMaterial, this.arcMaterial, this.markerMaterial, this.pulseMaterial]) m.dispose();
  }
}
