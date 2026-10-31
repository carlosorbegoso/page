import {
  AdditiveBlending,
  AmbientLight,
  CanvasTexture,
  SRGBColorSpace,
  Sprite,
  SpriteMaterial,
  BufferGeometry,
  DirectionalLight,
  Float32BufferAttribute,
  HemisphereLight,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  MeshBasicMaterial,
  OctahedronGeometry,
  Quaternion,
  Vector3,
  type Light,
  type Object3D,
  type PerspectiveCamera,
  type Scene,
  type Texture
} from 'three';
import { acquire, release } from '../assets';
import type { Tier } from '../tier';
import { tokenColor } from '../tokens';

export interface Pointer {
  x: number;
  y: number;
}

/** What the Stage hands to the world. */
export interface SceneContext {
  readonly tier: Tier;
  readonly camera: PerspectiveCamera;
  readonly capture: boolean;
  /** True when idle motion is allowed (tier, reduced-motion, pause and capture considered). */
  motion(): boolean;
  /** Normalised pointer (-1..1); stays at 0 unless `pointer: fine` and motion is allowed. */
  pointer(): Pointer;
  /** PMREM room environment (high tier only), shared and refcounted. */
  environment(): Promise<Texture | null>;
  releaseEnvironment(): void;
}

export function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

export type LayoutKind = 'desktop' | 'tablet' | 'phone';

export function layoutKind(width: number): LayoutKind {
  if (width >= 1024) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'phone';
}

export function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Physical-units lighting: PMREM room env + one key light on high; hemisphere + key otherwise. */
export async function addLights(scene: Scene, context: SceneContext): Promise<void> {
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(2.5, 4, 3);
  scene.add(key, key.target);
  const environment = await context.environment();
  if (environment) {
    scene.environment = environment;
    scene.environmentIntensity = 0.75;
    return;
  }
  scene.add(new HemisphereLight(0xdfe8ff, 0x1a2230, 1.6), new AmbientLight(0xffffff, 0.25));
}

export function disposeLights(scene: Scene): void {
  scene.traverse(object => {
    const light = object as Light;
    if (light.isLight) light.dispose();
  });
}

/** Abstract backend graph: instanced nodes plus their links, two draw calls in total. */
export class NodeNetwork {
  readonly nodes: InstancedMesh;
  readonly links: LineSegments;
  private readonly nodeMaterial = new MeshBasicMaterial({ toneMapped: false, transparent: true, opacity: 0.9 });
  private readonly linkMaterial = new LineBasicMaterial({ transparent: true, opacity: 0.7 });
  private readonly nodeGeometry = new OctahedronGeometry(0.016, 0);
  private readonly linkGeometry = new BufferGeometry();

  constructor(points: Vector3[], seed: number, maxLinkDistance = 0.95) {
    const random = mulberry32(seed);
    this.nodes = new InstancedMesh(this.nodeGeometry, this.nodeMaterial, points.length);
    this.nodes.raycast = () => undefined;
    const matrix = new Matrix4();
    const scale = new Vector3();
    const rotation = new Quaternion();
    points.forEach((point, index) => {
      const s = 0.6 + random() * 1.1;
      matrix.compose(point, rotation, scale.set(s, s, s));
      this.nodes.setMatrixAt(index, matrix);
    });
    const limit = maxLinkDistance * maxLinkDistance;
    const positions: number[] = [];
    points.forEach((point, i) => {
      const nearest = points
        .map((other, j) => ({ j, d: point.distanceToSquared(other) }))
        .filter(({ j, d }) => j > i && d < limit)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      for (const { j } of nearest) {
        const other = points[j]!;
        positions.push(point.x, point.y, point.z, other.x, other.y, other.z);
      }
    });
    this.linkGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    this.links = new LineSegments(this.linkGeometry, this.linkMaterial);
    this.links.raycast = () => undefined;
    this.applyTokens();
  }

  private boost = 1;

  /** With post-processing `toneMapped: false` is ignored: nodes need HDR intensity to stay bright. */
  setBoost(boost: number): void {
    this.boost = boost;
    this.applyTokens();
  }

  addTo(parent: Object3D): void {
    parent.add(this.links, this.nodes);
  }

  applyTokens(): void {
    this.nodeMaterial.color.copy(tokenColor('--color-scene-node')).multiplyScalar(this.boost ?? 1);
    this.linkMaterial.color.copy(tokenColor('--color-scene-line'));
  }

  dispose(): void {
    this.nodes.removeFromParent();
    this.links.removeFromParent();
    this.nodeGeometry.dispose();
    this.linkGeometry.dispose();
    this.nodeMaterial.dispose();
    this.linkMaterial.dispose();
    this.nodes.dispose();
  }
}

/** Random points in a squashed spherical shell around `centre`, biased behind it. */
export function shellPoints(count: number, seed: number, centre: Vector3, radius: [number, number]): Vector3[] {
  const random = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const r = radius[0] + random() * (radius[1] - radius[0]);
    const point = new Vector3().setFromSphericalCoords(r, phi, theta).multiply(new Vector3(1.4, 0.8, 0.9));
    if (point.z > 0.5) point.z *= -0.5;
    return point.add(centre);
  });
}

const GLOW_KEY = 'texture:glow';

function bakeGlow(): Texture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.18, 'rgba(255,255,255,0.55)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.12)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** Soft radial glow (halos, nebulae, star sprites), shared with refcount. */
export function acquireGlow(): Promise<Texture> {
  return acquire(GLOW_KEY, async () => bakeGlow(), texture => texture.dispose());
}

export function releaseGlow(): void {
  release(GLOW_KEY);
}

/** Additive camera-facing glow sprite. */
export function glowSprite(texture: Texture, size: number, opacity: number): Sprite {
  const sprite = new Sprite(
    new SpriteMaterial({ map: texture, blending: AdditiveBlending, depthWrite: false, transparent: true, opacity, fog: false })
  );
  sprite.scale.setScalar(size);
  sprite.raycast = () => undefined;
  return sprite;
}
