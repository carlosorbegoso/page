import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, ShaderMaterial, Vector3, type Color } from 'three';
import { SPARKS_FRAGMENT, SPARKS_VERTEX } from './sparks.glsl';

const LIFE = 1.15;

function tintsFor(count: number, colors: Color[]): Float32Array {
  const tint = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const color = colors[i % colors.length]!;
    tint.set([color.r, color.g, color.b], i * 3);
  }
  return tint;
}

function sparksMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: { uScale: { value: 600 } },
    vertexShader: SPARKS_VERTEX,
    fragmentShader: SPARKS_FRAGMENT,
    transparent: true,
    depthWrite: true,
    blending: AdditiveBlending
  });
}

export class Sparks {
  readonly points: Points<BufferGeometry, ShaderMaterial>;
  private readonly positions: Float32Array;
  private readonly fades: Float32Array;
  private readonly velocity: Vector3[] = [];
  private readonly origin = new Vector3();
  private startedAt = -1;

  constructor(count: number, colors: Color[]) {
    this.positions = new Float32Array(count * 3);
    this.fades = new Float32Array(count);
    for (let i = 0; i < count; i++) this.velocity.push(new Vector3());
    this.points = new Points(this.geometry(tintsFor(count, colors)), sparksMaterial());
    this.points.name = 'desk-sparks';
    this.points.frustumCulled = false;
    this.points.visible = false;
    this.points.raycast = () => undefined;
  }

  private geometry(tint: Float32Array): BufferGeometry {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(this.positions, 3));
    geometry.setAttribute('tint', new BufferAttribute(tint, 3));
    geometry.setAttribute('fade', new BufferAttribute(this.fades, 1));
    return geometry;
  }

  burst(origin: Vector3, time: number, spread: number): void {
    this.origin.copy(origin);
    this.startedAt = time;
    this.velocity.forEach((v, i) => {
      const angle = i * 2.399 + Math.random() * 0.6;
      const out = (0.4 + Math.random() * 0.6) * spread;
      v.set(Math.cos(angle) * out, 0.11 + Math.random() * 0.09, Math.sin(angle) * out);
    });
  }

  update(time: number, pixelScale: number): boolean {
    if (this.startedAt < 0) return false;
    const age = time - this.startedAt;
    if (age >= LIFE) {
      this.startedAt = -1;
      this.points.visible = false;
      return false;
    }
    this.points.visible = true;
    this.points.material.uniforms.uScale!.value = pixelScale;
    this.velocity.forEach((v, i) => {
      const delay = (i % 5) * 0.03;
      const t = Math.max(0, age - delay);
      const drag = 1 - Math.exp(-2.6 * t);
      const sway = Math.sin(t * 9 + i) * 0.004 * t;
      this.positions[i * 3] = this.origin.x + (v.x / 2.6) * drag + sway;
      this.positions[i * 3 + 1] = this.origin.y + (v.y / 2.6) * drag - 0.02 * t * t;
      this.positions[i * 3 + 2] = this.origin.z + (v.z / 2.6) * drag;
      const life = t / (LIFE - delay);
      this.fades[i] = age < delay ? 0 : Math.min(1, life * 8) * Math.pow(1 - Math.min(life, 1), 1.4);
    });
    this.points.geometry.getAttribute('position').needsUpdate = true;
    this.points.geometry.getAttribute('fade').needsUpdate = true;
    return true;
  }

  dispose(): void {
    this.points.geometry.dispose();
    this.points.material.dispose();
  }
}
