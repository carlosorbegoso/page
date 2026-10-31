import {
  AdditiveBlending,
  BufferGeometry,
  Group,
  Line,
  LineDashedMaterial,
  Points,
  PointsMaterial,
  Vector3,
  type Sprite,
  type Texture
} from 'three';
import { tokenColor } from '../tokens';
import { glowSprite, mulberry32, smoothstep } from './common';

const STARS = 9;
const ARC = (280 * Math.PI) / 180;
const DRAW_SECONDS = 1.6;

/**
 * Hero constellation (constellation.md §8): nine stars on a 280° arc open to the right (the "C"
 * of the monogram), dashed strokes drawn once on load, and the node star in the opening.
 */
export class Monogram {
  readonly root = new Group();
  readonly radius: number;
  private readonly starGeometry = new BufferGeometry();
  private readonly lineGeometry = new BufferGeometry();
  private readonly starMaterial: PointsMaterial;
  private readonly lineMaterial = new LineDashedMaterial({ dashSize: 0.12, gapSize: 0.08, transparent: true, opacity: 0.5, fog: false });
  private readonly node: Sprite;
  private readonly nodeCore: Sprite;
  private drawStart = -1;

  constructor(radius: number, glow: Texture) {
    this.radius = radius;
    const random = mulberry32(7);
    const start = (Math.PI * 2 - ARC) / 2;
    const stars = Array.from({ length: STARS }, (_, i) => {
      const a = start + (ARC * i) / (STARS - 1);
      const r = radius * (1 + (random() - 0.5) * 0.07);
      return new Vector3(Math.cos(a) * r, Math.sin(a) * r, (random() - 0.5) * 0.25);
    });
    this.starGeometry.setFromPoints(stars);
    this.starMaterial = new PointsMaterial({
      size: 7,
      sizeAttenuation: false,
      map: glow,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      fog: false
    });
    const points = new Points(this.starGeometry, this.starMaterial);
    points.raycast = () => undefined;
    this.lineGeometry.setFromPoints(stars);
    const line = new Line(this.lineGeometry, this.lineMaterial);
    line.computeLineDistances();
    line.raycast = () => undefined;
    this.node = glowSprite(glow, radius * 0.22, 0.9);
    this.nodeCore = glowSprite(glow, radius * 0.08, 1);
    this.node.position.set(radius * 0.92, 0, 0);
    this.nodeCore.position.copy(this.node.position);
    this.root.add(line, points, this.node, this.nodeCore);
    this.applyTokens();
  }

  /** Draws the strokes once (1.6 s) when motion is allowed; otherwise shows them complete. Returns true while drawing. */
  update(time: number, motion: boolean): boolean {
    const count = STARS;
    if (!motion) {
      this.lineGeometry.setDrawRange(0, count);
      return false;
    }
    if (this.drawStart < 0) this.drawStart = time;
    const progress = smoothstep(0, 1, (time - this.drawStart) / DRAW_SECONDS);
    this.lineGeometry.setDrawRange(0, Math.max(1, Math.ceil(progress * count)));
    return progress < 1;
  }

  /** Small pointer-driven tilt (±3°), fine pointers only (the caller passes 0 otherwise). */
  tilt(x: number, y: number): void {
    this.root.rotation.set(-y * 0.05, x * 0.05, 0);
  }

  applyTokens(): void {
    this.starMaterial.color.copy(tokenColor('--color-star-white'));
    this.lineMaterial.color.copy(tokenColor('--color-constellation-line'));
    this.node.material.color.copy(tokenColor('--color-alfa-corona'));
    this.nodeCore.material.color.copy(tokenColor('--color-star-white'));
  }

  dispose(): void {
    this.starGeometry.dispose();
    this.lineGeometry.dispose();
    this.starMaterial.dispose();
    this.lineMaterial.dispose();
    this.node.material.dispose();
    this.nodeCore.material.dispose();
  }
}
