import {
  DataTexture,
  HalfFloatType,
  LinearFilter,
  NoBlending,
  RGBAFormat,
  ShaderMaterial,
  Vector2,
  WebGLRenderTarget,
  type IUniform,
  type Material,
  type Texture,
  type WebGLRenderer
} from 'three';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { FULLSCREEN_VERT } from './shaders';

const NEIGHBOURS = /* glsl */ `
uniform vec2 uTexel;
varying vec2 vUv;
#define LEFT (vUv - vec2(uTexel.x, 0.0))
#define RIGHT (vUv + vec2(uTexel.x, 0.0))
#define TOP (vUv + vec2(0.0, uTexel.y))
#define BOTTOM (vUv - vec2(0.0, uTexel.y))
`;

const SPLAT_FRAG = /* glsl */ `
uniform sampler2D tVelocity;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform vec2 uForce;
uniform float uRadius;
uniform float uAspect;
varying vec2 vUv;
float segmentDistance(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-8), 0.0, 1.0);
  return length(pa - ba * h);
}
void main() {
  vec2 aspect = vec2(uAspect, 1.0);
  float d = segmentDistance(vUv * aspect, uFrom * aspect, uTo * aspect);
  vec2 v = texture2D(tVelocity, vUv).xy + uForce * exp(-d * d / uRadius);
  gl_FragColor = vec4(v, 0.0, 1.0);
}
`;

const ADVECT_FRAG = /* glsl */ `
uniform sampler2D tVelocity;
uniform float uDt;
uniform float uDissipation;
varying vec2 vUv;
void main() {
  vec2 back = vUv - uDt * texture2D(tVelocity, vUv).xy;
  gl_FragColor = vec4(uDissipation * texture2D(tVelocity, back).xy, 0.0, 1.0);
}
`;

const DIVERGENCE_FRAG = /* glsl */ `
${NEIGHBOURS}
uniform sampler2D tVelocity;
void main() {
  float l = texture2D(tVelocity, LEFT).x;
  float r = texture2D(tVelocity, RIGHT).x;
  float t = texture2D(tVelocity, TOP).y;
  float b = texture2D(tVelocity, BOTTOM).y;
  gl_FragColor = vec4(0.5 * (r - l + t - b), 0.0, 0.0, 1.0);
}
`;

const CURL_FRAG = /* glsl */ `
${NEIGHBOURS}
uniform sampler2D tVelocity;
void main() {
  float l = texture2D(tVelocity, LEFT).y;
  float r = texture2D(tVelocity, RIGHT).y;
  float t = texture2D(tVelocity, TOP).x;
  float b = texture2D(tVelocity, BOTTOM).x;
  gl_FragColor = vec4(0.5 * (r - l - t + b), 0.0, 0.0, 1.0);
}
`;

// Vorticity confinement: pushes velocity along the gradient of |curl| to keep small swirls alive.
const VORTICITY_FRAG = /* glsl */ `
${NEIGHBOURS}
uniform sampler2D tVelocity;
uniform sampler2D tCurl;
uniform float uStrength;
uniform float uDt;
void main() {
  float l = texture2D(tCurl, LEFT).x;
  float r = texture2D(tCurl, RIGHT).x;
  float t = texture2D(tCurl, TOP).x;
  float b = texture2D(tCurl, BOTTOM).x;
  float c = texture2D(tCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(t) - abs(b), abs(r) - abs(l));
  force /= length(force) + 1e-4;
  force *= uStrength * c;
  force.y *= -1.0;
  vec2 v = texture2D(tVelocity, vUv).xy + force * uDt;
  gl_FragColor = vec4(v, 0.0, 1.0);
}
`;

const SCALE_FRAG = /* glsl */ `
uniform sampler2D tInput;
uniform float uScale;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(texture2D(tInput, vUv).xy * uScale, 0.0, 1.0);
}
`;

const PRESSURE_FRAG = /* glsl */ `
${NEIGHBOURS}
uniform sampler2D tPressure;
uniform sampler2D tDivergence;
void main() {
  float l = texture2D(tPressure, LEFT).x;
  float r = texture2D(tPressure, RIGHT).x;
  float t = texture2D(tPressure, TOP).x;
  float b = texture2D(tPressure, BOTTOM).x;
  float div = texture2D(tDivergence, vUv).x;
  gl_FragColor = vec4((l + r + t + b - div) * 0.25, 0.0, 0.0, 1.0);
}
`;

const GRADIENT_FRAG = /* glsl */ `
${NEIGHBOURS}
uniform sampler2D tPressure;
uniform sampler2D tVelocity;
void main() {
  float l = texture2D(tPressure, LEFT).x;
  float r = texture2D(tPressure, RIGHT).x;
  float t = texture2D(tPressure, TOP).x;
  float b = texture2D(tPressure, BOTTOM).x;
  vec2 v = texture2D(tVelocity, vUv).xy - vec2(r - l, t - b);
  gl_FragColor = vec4(v, 0.0, 1.0);
}
`;

/** Velocity is stored in UV units per second; this maps it to a UV displacement before clamping. */
export const FLUID_DISPLACEMENT_SCALE = 0.006;
/** Maximum displacement of desk materials (rain on the glass, cup steam, window glass), in CSS px. */
export const FLUID_MAX_PX = 6;

/** Neutral 1×1 velocity bound while the field sleeps or is disabled. */
export const FLUID_IDLE_TEXTURE = new DataTexture(new Uint8Array(4), 1, 1, RGBAFormat);
FLUID_IDLE_TEXTURE.needsUpdate = true;

/**
 * Shared uniforms of the fluid field. Desk materials reference these objects (never copies),
 * so they follow the ping-pong texture without re-binding. See docs/3d/fx.md.
 */
export const fluidUniforms: {
  uFluidVelocity: IUniform<Texture>;
  uFluidScale: IUniform<number>;
  uFluidMax: IUniform<number>;
  uFluidActive: IUniform<number>;
  uFluidViewport: IUniform<Vector2>;
} = {
  uFluidVelocity: { value: FLUID_IDLE_TEXTURE },
  uFluidScale: { value: FLUID_DISPLACEMENT_SCALE },
  uFluidMax: { value: FLUID_MAX_PX / 900 },
  uFluidActive: { value: 0 },
  uFluidViewport: { value: new Vector2(1, 1) }
};

let consumers = 0;

/**
 * Declares that a material samples the field. The simulation only runs while at least one
 * consumer exists, so a page without rain/steam/glass pays nothing. Returns the release function.
 */
export function registerFluidConsumer(): () => void {
  consumers++;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    consumers--;
  };
}

export function fluidConsumerCount(): number {
  return consumers;
}

/** GLSL declarations shared by vertex and fragment use. */
export const FLUID_PARS = /* glsl */ `
uniform sampler2D uFluidVelocity;
uniform float uFluidScale;
uniform float uFluidMax;
uniform float uFluidActive;
uniform vec2 uFluidViewport;
vec2 fluidOffsetAt(vec2 screenUv) {
  if (uFluidActive < 0.5) return vec2(0.0);
  vec2 shift = texture2D(uFluidVelocity, screenUv).xy * uFluidScale;
  return shift * min(1.0, uFluidMax / max(length(shift), 1e-6));
}
`;

/** @deprecated Kept for existing imports; same as `FLUID_PARS`. */
export const FLUID_VERTEX_PARS = FLUID_PARS;

/** GLSL block to place after `gl_Position` is written: shifts the vertex in screen space by the clamped flow. */
export const FLUID_VERTEX_DISPLACE = /* glsl */ `
gl_Position.xy += fluidOffsetAt(gl_Position.xy / gl_Position.w * 0.5 + 0.5) * 2.0 * gl_Position.w;
`;

/**
 * GLSL for a fragment shader (rain refraction on the glass, steam wobble): after `FLUID_PARS`,
 * `fluidOffset()` returns this pixel's clamped UV offset; add it to the UVs you sample.
 */
export const FLUID_FRAGMENT_OFFSET = /* glsl */ `
vec2 fluidOffset() { return fluidOffsetAt(gl_FragCoord.xy / uFluidViewport); }
`;

function patch(material: Material, kind: 'vertex' | 'fragment'): void {
  const release = registerFluidConsumer();
  material.addEventListener('dispose', release);
  const previous = material.onBeforeCompile.bind(material);
  material.onBeforeCompile = (shader, renderer) => {
    previous(shader, renderer);
    Object.assign(shader.uniforms, fluidUniforms);
    if (kind === 'vertex') {
      const end = shader.vertexShader.lastIndexOf('}');
      shader.vertexShader = `${FLUID_PARS}\n${shader.vertexShader.slice(0, end)}\n${FLUID_VERTEX_DISPLACE}\n}`;
    } else {
      shader.fragmentShader = `${FLUID_PARS}\n${FLUID_FRAGMENT_OFFSET}\n${shader.fragmentShader}`;
    }
  };
  const key = material.customProgramCacheKey.bind(material);
  material.customProgramCacheKey = () => `${key()}|fluid-${kind}`;
  material.needsUpdate = true;
}

/**
 * Patches a material (built-in or ShaderMaterial) so its vertices drift with the fluid field.
 * Only for the window glass, the rain sheet and the cup steam — never for text or plates.
 */
export function withFluidDisplacement<T extends Material>(material: T): T {
  patch(material, 'vertex');
  return material;
}

/**
 * Makes `fluidOffset()` available in a ShaderMaterial's fragment shader (call it where you sample
 * your textures, e.g. the rain normal map on the glass). Registers the material as a consumer.
 */
export function withFluidFragment<T extends Material>(material: T): T {
  patch(material, 'fragment');
  return material;
}

function pass(fragmentShader: string, uniforms: Record<string, IUniform>): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: FULLSCREEN_VERT,
    fragmentShader,
    uniforms,
    blending: NoBlending,
    depthTest: false,
    depthWrite: false
  });
}

function target(size: number): WebGLRenderTarget {
  return new WebGLRenderTarget(size, size, {
    type: HalfFloatType,
    format: RGBAFormat,
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    depthBuffer: false,
    stencilBuffer: false
  });
}

class PingPong {
  read: WebGLRenderTarget;
  write: WebGLRenderTarget;
  constructor(size: number) {
    this.read = target(size);
    this.write = target(size);
  }
  swap(): void {
    [this.read, this.write] = [this.write, this.read];
  }
  dispose(): void {
    this.read.dispose();
    this.write.dispose();
  }
}

export interface FluidSettings {
  size: number;
  iterations: number;
  vorticity: boolean;
}

export interface FluidStroke {
  from: Vector2;
  to: Vector2;
  /** UV units per second. */
  force: Vector2;
}

/** Stable-fluids velocity field (splat → curl/vorticity → projection → advection) on a small square grid. */
export class FluidField {
  private readonly quad = new FullScreenQuad();
  private readonly velocity: PingPong;
  private readonly pressure: PingPong;
  private readonly divergence: WebGLRenderTarget;
  private readonly curl: WebGLRenderTarget;
  private readonly texel: Vector2;
  private readonly splat: ShaderMaterial;
  private readonly advect: ShaderMaterial;
  private readonly divergenceMaterial: ShaderMaterial;
  private readonly curlMaterial: ShaderMaterial;
  private readonly vorticityMaterial: ShaderMaterial;
  private readonly scale: ShaderMaterial;
  private readonly pressureMaterial: ShaderMaterial;
  private readonly gradient: ShaderMaterial;
  private energy = 0;
  private dirty = false;

  constructor(readonly settings: FluidSettings) {
    const { size } = settings;
    this.texel = new Vector2(1 / size, 1 / size);
    this.velocity = new PingPong(size);
    this.pressure = new PingPong(size);
    this.divergence = target(size);
    this.curl = target(size);
    this.splat = pass(SPLAT_FRAG, {
      tVelocity: { value: null },
      uFrom: { value: new Vector2() },
      uTo: { value: new Vector2() },
      uForce: { value: new Vector2() },
      uRadius: { value: 0.0022 },
      uAspect: { value: 1 }
    });
    this.advect = pass(ADVECT_FRAG, { tVelocity: { value: null }, uDt: { value: 0 }, uDissipation: { value: 1 } });
    this.divergenceMaterial = pass(DIVERGENCE_FRAG, { tVelocity: { value: null }, uTexel: { value: this.texel } });
    this.curlMaterial = pass(CURL_FRAG, { tVelocity: { value: null }, uTexel: { value: this.texel } });
    this.vorticityMaterial = pass(VORTICITY_FRAG, {
      tVelocity: { value: null },
      tCurl: { value: null },
      uStrength: { value: 6 },
      uDt: { value: 0 },
      uTexel: { value: this.texel }
    });
    this.scale = pass(SCALE_FRAG, { tInput: { value: null }, uScale: { value: 0.8 } });
    this.pressureMaterial = pass(PRESSURE_FRAG, {
      tPressure: { value: null },
      tDivergence: { value: null },
      uTexel: { value: this.texel }
    });
    this.gradient = pass(GRADIENT_FRAG, {
      tPressure: { value: null },
      tVelocity: { value: null },
      uTexel: { value: this.texel }
    });
  }

  get texture(): Texture {
    return this.velocity.read.texture;
  }

  /** True while the field still carries visible motion. */
  get awake(): boolean {
    return this.energy > 0.01;
  }

  private draw(renderer: WebGLRenderer, material: ShaderMaterial, output: WebGLRenderTarget): void {
    this.quad.material = material;
    renderer.setRenderTarget(output);
    this.quad.render(renderer);
  }

  /** Advances the field. `aspect` is the canvas width / height, so splats stay round on screen. */
  step(renderer: WebGLRenderer, dt: number, aspect: number, stroke: FluidStroke | null): void {
    const step = Math.min(Math.max(dt, 1 / 240), 1 / 30);
    if (stroke) {
      const u = this.splat.uniforms;
      u.tVelocity!.value = this.velocity.read.texture;
      (u.uFrom!.value as Vector2).copy(stroke.from);
      (u.uTo!.value as Vector2).copy(stroke.to);
      (u.uForce!.value as Vector2).copy(stroke.force);
      u.uAspect!.value = aspect;
      this.draw(renderer, this.splat, this.velocity.write);
      this.velocity.swap();
      this.energy = Math.max(this.energy, stroke.force.length());
    }
    if (!this.awake) return;
    this.dirty = true;

    if (this.settings.vorticity) {
      this.curlMaterial.uniforms.tVelocity!.value = this.velocity.read.texture;
      this.draw(renderer, this.curlMaterial, this.curl);
      const v = this.vorticityMaterial.uniforms;
      v.tVelocity!.value = this.velocity.read.texture;
      v.tCurl!.value = this.curl.texture;
      v.uDt!.value = step;
      this.draw(renderer, this.vorticityMaterial, this.velocity.write);
      this.velocity.swap();
    }

    this.divergenceMaterial.uniforms.tVelocity!.value = this.velocity.read.texture;
    this.draw(renderer, this.divergenceMaterial, this.divergence);

    this.scale.uniforms.tInput!.value = this.pressure.read.texture;
    this.draw(renderer, this.scale, this.pressure.write);
    this.pressure.swap();

    const p = this.pressureMaterial.uniforms;
    p.tDivergence!.value = this.divergence.texture;
    for (let i = 0; i < this.settings.iterations; i++) {
      p.tPressure!.value = this.pressure.read.texture;
      this.draw(renderer, this.pressureMaterial, this.pressure.write);
      this.pressure.swap();
    }

    const g = this.gradient.uniforms;
    g.tPressure!.value = this.pressure.read.texture;
    g.tVelocity!.value = this.velocity.read.texture;
    this.draw(renderer, this.gradient, this.velocity.write);
    this.velocity.swap();

    const dissipation = Math.pow(0.965, step * 60);
    const a = this.advect.uniforms;
    a.tVelocity!.value = this.velocity.read.texture;
    a.uDt!.value = step;
    a.uDissipation!.value = dissipation;
    this.draw(renderer, this.advect, this.velocity.write);
    this.velocity.swap();
    this.energy *= dissipation;
  }

  /** Zeroes the field (used when motion gets frozen). */
  clear(renderer: WebGLRenderer): void {
    this.energy = 0;
    if (!this.dirty) return;
    this.dirty = false;
    const previous = renderer.getRenderTarget();
    for (const t of [this.velocity.read, this.velocity.write, this.pressure.read, this.pressure.write]) {
      renderer.setRenderTarget(t);
      renderer.clear(true, false, false);
    }
    renderer.setRenderTarget(previous);
  }

  dispose(): void {
    this.velocity.dispose();
    this.pressure.dispose();
    this.divergence.dispose();
    this.curl.dispose();
    for (const m of [
      this.splat,
      this.advect,
      this.divergenceMaterial,
      this.curlMaterial,
      this.vorticityMaterial,
      this.scale,
      this.pressureMaterial,
      this.gradient
    ]) {
      m.dispose();
    }
    this.quad.dispose();
  }
}

/**
 * Pointer and finger-drag input for the fluid. The splat point eases towards the pointer
 * (`--fx-pointer-damping` per 60 Hz frame), which turns raw mouse jitter into a slow liquid wake.
 */
export class FluidPointerInput {
  private readonly target = new Vector2();
  private readonly eased = new Vector2();
  private readonly previous = new Vector2();
  private readonly stroke: FluidStroke = { from: new Vector2(), to: new Vector2(), force: new Vector2() };
  private rect: DOMRect | null = null;
  private hasTarget = false;
  private snap = true;
  private readonly cleanups: Array<() => void> = [];

  constructor(
    private readonly canvas: () => HTMLElement | null,
    private readonly damping: number
  ) {
    const on = <K extends keyof WindowEventMap>(type: K, handler: (event: WindowEventMap[K]) => void) => {
      window.addEventListener(type, handler, { passive: true });
      this.cleanups.push(() => window.removeEventListener(type, handler));
    };
    on('pointermove', event => {
      if (event.pointerType === 'touch') return;
      this.point(event.clientX, event.clientY);
    });
    on('touchstart', event => {
      const touch = event.touches[0];
      if (!touch) return;
      this.snap = true;
      this.point(touch.clientX, touch.clientY);
    });
    on('touchmove', event => {
      const touch = event.touches[0];
      if (touch) this.point(touch.clientX, touch.clientY);
    });
    on('touchend', () => this.release());
    on('touchcancel', () => this.release());
    on('blur', () => this.release());
    on('resize', () => {
      this.rect = null;
    });
    const leave = () => this.release();
    document.documentElement.addEventListener('pointerleave', leave);
    this.cleanups.push(() => document.documentElement.removeEventListener('pointerleave', leave));
  }

  private point(x: number, y: number): void {
    const element = this.canvas();
    if (!element) return;
    this.rect ??= element.getBoundingClientRect();
    if (!this.rect.width || !this.rect.height) return;
    this.target.set((x - this.rect.left) / this.rect.width, 1 - (y - this.rect.top) / this.rect.height);
    if (!this.hasTarget) this.snap = true;
    this.hasTarget = true;
  }

  private release(): void {
    this.hasTarget = false;
  }

  invalidateRect(): void {
    this.rect = null;
  }

  /** Returns this frame's stroke, or null when the pointer is idle. */
  consume(dt: number): FluidStroke | null {
    if (!this.hasTarget) return null;
    if (this.snap) {
      this.snap = false;
      this.eased.copy(this.target);
      this.previous.copy(this.target);
      return null;
    }
    const k = 1 - Math.pow(1 - this.damping, Math.max(dt, 1 / 240) * 60);
    this.previous.copy(this.eased);
    this.eased.lerp(this.target, k);
    const { from, to, force } = this.stroke;
    from.copy(this.previous);
    to.copy(this.eased);
    force.subVectors(to, from).divideScalar(Math.max(dt, 1 / 240));
    if (force.lengthSq() < 1e-6) return null;
    if (force.length() > 4) force.setLength(4);
    return this.stroke;
  }

  dispose(): void {
    for (const cleanup of this.cleanups) cleanup();
    this.cleanups.length = 0;
  }
}
