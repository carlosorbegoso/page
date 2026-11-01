import {
  HalfFloatType,
  LinearFilter,
  NoBlending,
  RGBAFormat,
  ShaderMaterial,
  Vector2,
  WebGLRenderTarget,
  type IUniform,
  type Texture,
  type WebGLRenderer
} from 'three';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { FULLSCREEN_VERT } from '../shaders';
import {
  ADVECT_FRAG,
  CURL_FRAG,
  DIVERGENCE_FRAG,
  GRADIENT_FRAG,
  PRESSURE_FRAG,
  SCALE_FRAG,
  SPLAT_FRAG,
  VORTICITY_FRAG
} from './simulation.glsl';

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
  force: Vector2;
}

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

  get awake(): boolean {
    return this.energy > 0.01;
  }

  private draw(renderer: WebGLRenderer, material: ShaderMaterial, output: WebGLRenderTarget): void {
    this.quad.material = material;
    renderer.setRenderTarget(output);
    this.quad.render(renderer);
  }

  step(renderer: WebGLRenderer, dt: number, aspect: number, stroke: FluidStroke | null): void {
    const step = Math.min(Math.max(dt, 1 / 240), 1 / 30);
    if (stroke) this.splatStroke(renderer, aspect, stroke);
    if (!this.awake) return;
    this.dirty = true;
    if (this.settings.vorticity) this.confineVorticity(renderer, step);
    this.project(renderer);
    this.advectVelocity(renderer, step);
  }

  private splatStroke(renderer: WebGLRenderer, aspect: number, stroke: FluidStroke): void {
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

  private confineVorticity(renderer: WebGLRenderer, step: number): void {
    this.curlMaterial.uniforms.tVelocity!.value = this.velocity.read.texture;
    this.draw(renderer, this.curlMaterial, this.curl);
    const v = this.vorticityMaterial.uniforms;
    v.tVelocity!.value = this.velocity.read.texture;
    v.tCurl!.value = this.curl.texture;
    v.uDt!.value = step;
    this.draw(renderer, this.vorticityMaterial, this.velocity.write);
    this.velocity.swap();
  }

  private project(renderer: WebGLRenderer): void {
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
  }

  private advectVelocity(renderer: WebGLRenderer, step: number): void {
    const dissipation = Math.pow(0.965, step * 60);
    const a = this.advect.uniforms;
    a.tVelocity!.value = this.velocity.read.texture;
    a.uDt!.value = step;
    a.uDissipation!.value = dissipation;
    this.draw(renderer, this.advect, this.velocity.write);
    this.velocity.swap();
    this.energy *= dissipation;
  }

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
