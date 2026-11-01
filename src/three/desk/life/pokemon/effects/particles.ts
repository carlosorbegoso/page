import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, ShaderMaterial, type Color, type Vector3 } from 'three';
import { GLOW_PARTICLE_FRAGMENT, PARTICLE_VERTEX, SMOKE_FRAGMENT } from './particles.glsl';

export interface ParticleSpec {
  size: number;
  life: number;
  drag: number;
  gravity: number;
  grow: number;
}

function particleMaterial(glow: boolean): ShaderMaterial {
  const material = new ShaderMaterial({
    uniforms: { uScale: { value: 600 } },
    vertexShader: PARTICLE_VERTEX,
    fragmentShader: glow ? GLOW_PARTICLE_FRAGMENT : SMOKE_FRAGMENT,
    transparent: true,
    depthWrite: false
  });
  if (glow) material.blending = AdditiveBlending;
  return material;
}

export class ParticlePool {
  readonly points: Points<BufferGeometry, ShaderMaterial>;
  private readonly position: Float32Array;
  private readonly tint: Float32Array;
  private readonly alpha: Float32Array;
  private readonly size: Float32Array;
  private readonly velocity: Float32Array;
  private readonly age: Float32Array;
  private readonly specs: ParticleSpec[];
  private next = 0;
  private alive = 0;

  constructor(private readonly count: number, glow: boolean) {
    this.position = new Float32Array(count * 3);
    this.tint = new Float32Array(count * 3);
    this.alpha = new Float32Array(count);
    this.size = new Float32Array(count);
    this.velocity = new Float32Array(count * 3);
    this.age = new Float32Array(count).fill(Infinity);
    this.specs = Array.from({ length: count }, () => ({ size: 0, life: 1, drag: 0, gravity: 0, grow: 0 }));
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(this.position, 3));
    geometry.setAttribute('tint', new BufferAttribute(this.tint, 3));
    geometry.setAttribute('fade', new BufferAttribute(this.alpha, 1));
    geometry.setAttribute('extent', new BufferAttribute(this.size, 1));
    this.points = new Points(geometry, particleMaterial(glow));
    this.points.frustumCulled = false;
    this.points.visible = false;
    this.points.raycast = () => undefined;
  }

  emit(at: Vector3, velocity: Vector3, color: Color, spec: ParticleSpec): void {
    const i = this.next;
    this.next = (this.next + 1) % this.count;
    this.position.set([at.x, at.y, at.z], i * 3);
    this.velocity.set([velocity.x, velocity.y, velocity.z], i * 3);
    this.tint.set([color.r, color.g, color.b], i * 3);
    Object.assign(this.specs[i]!, spec);
    this.age[i] = 0;
  }

  step(dt: number, pixelScale: number): boolean {
    this.alive = 0;
    for (let i = 0; i < this.count; i++) this.stepOne(i, dt);
    this.points.visible = this.alive > 0;
    this.points.material.uniforms.uScale!.value = pixelScale;
    const attributes = this.points.geometry.attributes;
    attributes.position!.needsUpdate = attributes.tint!.needsUpdate = attributes.fade!.needsUpdate = attributes.extent!.needsUpdate = true;
    return this.alive > 0;
  }

  private stepOne(i: number, dt: number): void {
    const spec = this.specs[i]!;
    const age = (this.age[i] = this.age[i]! + dt);
    if (age >= spec.life) {
      this.alpha[i] = 0;
      return;
    }
    this.alive++;
    const keep = Math.exp(-spec.drag * dt);
    for (let axis = 0; axis < 3; axis++) {
      const k = i * 3 + axis;
      this.velocity[k] = this.velocity[k]! * keep - (axis === 1 ? spec.gravity * dt : 0);
      this.position[k] = this.position[k]! + this.velocity[k]! * dt;
    }
    const u = age / spec.life;
    this.alpha[i] = Math.min(1, age * 14) * (1 - u) * (1 - u);
    this.size[i] = spec.size * (1 + spec.grow * u);
  }

  clear(): void {
    this.age.fill(Infinity);
    this.alpha.fill(0);
    this.points.visible = false;
  }

  dispose(): void {
    this.points.geometry.dispose();
    this.points.material.dispose();
  }
}
