import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Points, ShaderMaterial, Vector3 } from 'three';

const LIFE = 1.15;

/**
 * A small burst of confetti-like sparks that rise, drift and fade (Parati's gift opening).
 * The sparks write depth: the depth-of-field pass reads it, and without it a spark would take the
 * blur of the far wall behind it and vanish.
 */
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
    const tint = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const color = colors[i % colors.length]!;
      tint.set([color.r, color.g, color.b], i * 3);
      this.velocity.push(new Vector3());
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(this.positions, 3));
    geometry.setAttribute('tint', new BufferAttribute(tint, 3));
    geometry.setAttribute('fade', new BufferAttribute(this.fades, 1));
    const material = new ShaderMaterial({
      uniforms: { uScale: { value: 600 } },
      vertexShader: `
        attribute vec3 tint;
        attribute float fade;
        uniform float uScale;
        varying vec3 vTint;
        varying float vFade;
        void main() {
          vTint = tint;
          vFade = fade;
          vec4 view = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * view;
          gl_PointSize = max(1.0, 0.0055 * uScale / max(-view.z, 0.01)) * step(0.001, fade);
        }`,
      fragmentShader: `
        varying vec3 vTint;
        varying float vFade;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float a = clamp(1.0 - d, 0.0, 1.0);
          if (a * vFade < 0.04) discard;
          gl_FragColor = vec4(vTint * 2.2 * a * vFade, a * vFade);
        }`,
      transparent: true,
      depthWrite: true,
      blending: AdditiveBlending
    });
    this.points = new Points(geometry, material);
    this.points.name = 'desk-sparks';
    this.points.frustumCulled = false;
    this.points.visible = false;
    this.points.raycast = () => undefined;
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

  /** Moves the sparks; `pixelScale` is the drawing buffer height over 2·tan(fov/2). Returns true while alive. */
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
