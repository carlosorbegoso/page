import {
  AdditiveBlending,
  Box3,
  BufferGeometry,
  CanvasTexture,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  SRGBColorSpace,
  Vector3,
  type Object3D
} from 'three';

const SKIP_KEYS = new Set(['desk:visit-skymek', 'desk:visit-parati', 'desk:visit-ventixs']);
const LIFT = 0.025;
const SIZE_PX = 16;
const PULSE_SECONDS = 2.4;
const FADE_RATE = 3;
const PEAK = 0.85;

export interface HotspotPick {
  object3D: Object3D;
  key: string;
}

function dotTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const context = canvas.getContext('2d')!;
  const glow = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, 'rgba(255,255,255,1)');
  glow.addColorStop(0.18, 'rgba(160,205,255,0.95)');
  glow.addColorStop(0.45, 'rgba(90,169,255,0.35)');
  glow.addColorStop(1, 'rgba(90,169,255,0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, 64, 64);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

function topsOf(picks: readonly HotspotPick[]): number[] {
  const seen = new Set<string>();
  const box = new Box3();
  const top = new Vector3();
  const positions: number[] = [];
  for (const pick of picks) {
    if (SKIP_KEYS.has(pick.key) || seen.has(pick.key)) continue;
    seen.add(pick.key);
    pick.object3D.updateWorldMatrix(true, false);
    box.setFromObject(pick.object3D).getCenter(top);
    top.y = box.max.y + LIFT;
    positions.push(top.x, top.y, top.z);
  }
  return positions;
}

export class Hotspots {
  readonly object3D: Points<BufferGeometry, PointsMaterial>;
  private level = 0;
  private goal = 0;

  constructor(picks: readonly HotspotPick[]) {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(topsOf(picks), 3));
    const material = new PointsMaterial({
      map: dotTexture(),
      size: SIZE_PX,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: AdditiveBlending
    });
    this.object3D = new Points(geometry, material);
    this.object3D.name = 'desk-hotspots';
    this.object3D.visible = false;
    this.object3D.raycast = () => undefined;
  }

  setActive(active: boolean): void {
    this.goal = active ? 1 : 0;
  }

  update(dt: number, time: number, motion: boolean): boolean {
    const step = FADE_RATE * dt;
    this.level += Math.max(-step, Math.min(step, this.goal - this.level));
    const visible = this.level > 0.001;
    this.object3D.visible = visible;
    if (!visible) return false;
    const breath = motion ? 0.55 + 0.45 * Math.sin((time / PULSE_SECONDS) * Math.PI * 2) : 0.8;
    this.object3D.material.opacity = this.level * PEAK * breath;
    this.object3D.material.size = SIZE_PX * (motion ? 0.85 + 0.25 * breath : 1);
    return true;
  }

  dispose(): void {
    this.object3D.geometry.dispose();
    this.object3D.material.map?.dispose();
    this.object3D.material.dispose();
  }
}
