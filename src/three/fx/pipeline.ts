import {
  DepthTexture,
  HalfFloatType,
  LinearFilter,
  NoBlending,
  RGBAFormat,
  ShaderMaterial,
  UnsignedIntType,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  type IUniform,
  type PerspectiveCamera,
  type Scene,
  type WebGLRenderer
} from 'three';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import type { FxPipeline, PointerField } from '../contracts';
import { motionAllowed, readMotion, watchMotion, type MotionState } from '../motion';
import type { Tier } from '../tier';
import {
  FLUID_IDLE_TEXTURE,
  FLUID_MAX_SCREEN_PX,
  FLUID_MAX_WORLD_PX,
  FluidField,
  FluidPointerInput,
  fluidUniforms
} from './fluid';
import { GpuTimer } from './gpuTimer';
import { guessTier, readFxTokens, tierProfile, type FxTokens, type TierProfile } from './settings';
import { ToneCompensation } from './toneCompensation';
import { BLOOM_DOWN_FRAG, BLOOM_UP_FRAG, COMPOSITE_FRAG, dofFrag, FULLSCREEN_VERT } from './shaders';

export type FxFeature = 'fluid' | 'dof' | 'chromatic';

/** Snapshot for the debug overlay and the docs (`window.__fx.stats()` with `?debug`). */
export interface FxStats {
  tier: Tier;
  gpuTimer: boolean;
  /** False on ANGLE Metal: timings are shown but the budget rule is off. */
  gpuTimerTrusted: boolean;
  /** Smoothed GPU ms per pass: fluid, scene, dof, bloom, composite. */
  ms: Record<string, number>;
  /** GPU ms of the effects alone (everything but `scene`). */
  effectsMs: number;
  disabled: FxFeature[];
  fluidAwake: boolean;
  dofAmount: number;
  buffer: { width: number; height: number };
}

/** The pipeline plus what the Stage can read back. */
export interface CinematicFx extends FxPipeline {
  /** True while the fluid or the focus transition still moves: OR it into the Stage's `settling`. */
  readonly settling: boolean;
  stats(): FxStats;
}

export interface FxOptions {
  tier?: Tier;
}

const CUT_ORDER: readonly FxFeature[] = ['fluid', 'dof', 'chromatic'];
const FOCUS_TAU = 0.15;
const EVALUATE_EVERY_MS = 1000;
const MIN_SAMPLES = 20;

function material(fragmentShader: string, uniforms: Record<string, IUniform>, toneMapped = false): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: FULLSCREEN_VERT,
    fragmentShader,
    uniforms,
    blending: NoBlending,
    depthTest: false,
    depthWrite: false,
    toneMapped
  });
}

function colorTarget(width: number, height: number): WebGLRenderTarget {
  return new WebGLRenderTarget(Math.max(1, width), Math.max(1, height), {
    type: HalfFloatType,
    format: RGBAFormat,
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    depthBuffer: false,
    stencilBuffer: false
  });
}

interface Targets {
  width: number;
  height: number;
  scene: WebGLRenderTarget;
  dof: WebGLRenderTarget | null;
  down: WebGLRenderTarget[];
  up: WebGLRenderTarget[];
}

class CinematicPipeline implements CinematicFx {
  private tier: Tier;
  private profile: TierProfile;
  private readonly tokens: FxTokens = readFxTokens();
  private readonly quad = new FullScreenQuad();
  private readonly tone = new ToneCompensation();
  private readonly bufferSize = new Vector2();
  private targets: Targets | null = null;
  private fluid: FluidField | null = null;
  private timer: GpuTimer | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private readonly input: FluidPointerInput;
  private pointer: PointerField | null = null;
  private motion: MotionState = readMotion();
  private readonly disabled = new Set<FxFeature>();
  private readonly focusPoint = new Vector3();
  private hasFocus = false;
  private focusDistance = 5;
  private dofAmount = 0;
  private roomTarget = 1;
  private roomWeight = 1;
  private cssHeight = 0;
  private time = 0;
  private lastEvaluation = 0;
  private strikes = 0;
  private readonly forward = new Vector3();
  private readonly toPoint = new Vector3();
  private readonly cleanups: Array<() => void> = [];

  private readonly down = material(BLOOM_DOWN_FRAG, {
    tInput: { value: null },
    uTexel: { value: new Vector2() },
    uThreshold: { value: 1 },
    uSmoothing: { value: 0.1 },
    uPrefilter: { value: false }
  });
  private readonly up = material(BLOOM_UP_FRAG, {
    tLow: { value: null },
    tHigh: { value: null },
    uTexel: { value: new Vector2() },
    uRadius: { value: 0.45 }
  });
  private dof: ShaderMaterial | null = null;
  private readonly composite = material(
    COMPOSITE_FRAG,
    {
      tScene: { value: null },
      tDepth: { value: null },
      tDof: { value: null },
      tBloom: { value: null },
      tFluid: fluidUniforms.uFluidVelocity,
      uNear: { value: 0.1 },
      uFar: { value: 60 },
      uFocus: { value: 5 },
      uRange: { value: 2.5 },
      uDofAmount: { value: 0 },
      uBloomStrength: { value: 0.32 },
      uFluidOn: fluidUniforms.uFluidActive,
      uFluidScale: fluidUniforms.uFluidScale,
      uDistortMax: { value: FLUID_MAX_SCREEN_PX / 900 },
      uChromatic: { value: 0.0006 },
      uVignetteDarkness: { value: 0.3 },
      uVignetteOffset: { value: 0.32 },
      uGrain: { value: 0.035 },
      uSeed: { value: 0 }
    },
    true
  );

  constructor(options: FxOptions) {
    this.tier = options.tier ?? guessTier();
    this.profile = tierProfile(this.tier);
    this.input = new FluidPointerInput(() => this.canvas, this.tokens.pointerDamping);
    this.cleanups.push(() => this.input.dispose());
    this.cleanups.push(watchMotion(state => (this.motion = state)));
    const onEnter = (event: Event) => this.station((event as CustomEvent<{ id: string }>).detail?.id, 0);
    const onProgress = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string; progress: number }>).detail;
      this.station(detail?.id, detail?.progress ?? 0);
    };
    window.addEventListener('station:enter', onEnter);
    window.addEventListener('station:progress', onProgress);
    this.cleanups.push(() => {
      window.removeEventListener('station:enter', onEnter);
      window.removeEventListener('station:progress', onProgress);
    });
  }

  get settling(): boolean {
    if (!this.profile.enabled) return false;
    const fluid = this.fluidRunning && Boolean(this.fluid?.awake);
    const focusTarget = this.hasFocus && this.dofEnabled ? 1 : 0;
    return fluid || Math.abs(this.dofAmount - focusTarget) > 0.01;
  }

  private get frozen(): boolean {
    return !motionAllowed(this.motion) || (this.pointer !== null && !this.pointer.enabled);
  }

  private get fluidRunning(): boolean {
    return this.profile.fluidSize > 0 && !this.disabled.has('fluid') && !this.frozen;
  }

  private get dofEnabled(): boolean {
    return this.profile.dof !== 'off' && !this.disabled.has('dof');
  }

  private station(id: string | undefined, progress: number): void {
    if (!id) return;
    this.roomTarget = id === 'hero' ? 1 - Math.min(Math.max(progress, 0), 1) : 0;
  }

  attachPointer(pointer: PointerField): void {
    this.pointer = pointer;
  }

  setFocus(point: Vector3 | null): void {
    this.hasFocus = point !== null;
    if (point) this.focusPoint.copy(point);
  }

  resize(width: number, height: number, pixelRatio: number): void {
    void width;
    void pixelRatio;
    this.cssHeight = height;
    this.input.invalidateRect();
  }

  setTier(tier: Tier): void {
    if (tier === this.tier) return;
    this.tier = tier;
    this.profile = tierProfile(tier);
    this.disabled.clear();
    this.strikes = 0;
    this.timer?.reset();
    this.releaseTargets();
    this.fluid?.dispose();
    this.fluid = null;
    this.dof?.dispose();
    this.dof = null;
    fluidUniforms.uFluidActive.value = 0;
    fluidUniforms.uFluidVelocity.value = FLUID_IDLE_TEXTURE;
  }

  render(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, dt: number): void {
    if (!this.profile.enabled) {
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
      return;
    }
    this.canvas = renderer.domElement;
    this.timer ??= new GpuTimer(renderer.getContext() as WebGL2RenderingContext);
    this.timer.poll();
    const targets = this.ensureTargets(renderer);
    this.time += dt;

    this.stepFluid(renderer, dt);

    this.timer.begin('scene');
    renderer.setRenderTarget(targets.scene);
    this.tone.begin(renderer, scene);
    renderer.render(scene, camera);
    this.tone.end(renderer, scene);
    this.timer.end();

    this.updateFocus(camera, dt);
    this.roomWeight += (this.roomTarget - this.roomWeight) * (this.frozen ? 1 : 1 - Math.exp(-dt / 0.25));
    const room = this.roomWeight;

    if (targets.dof && this.dofAmount > 0.001) this.renderDof(renderer, targets, camera, room);
    this.renderBloom(renderer, targets);

    const u = this.composite.uniforms;
    const { tokens } = this;
    u.tScene!.value = targets.scene.texture;
    u.tDepth!.value = targets.scene.depthTexture;
    u.tDof!.value = targets.dof?.texture ?? targets.scene.texture;
    u.tBloom!.value = (targets.up[0] ?? targets.down[0])!.texture;
    u.uNear!.value = camera.near;
    u.uFar!.value = camera.far;
    u.uFocus!.value = this.focusDistance;
    u.uRange!.value = lerp(tokens.focusRangeSpace, tokens.focusRangeRoom, room);
    u.uDofAmount!.value = targets.dof ? this.dofAmount : 0;
    u.uBloomStrength!.value = tokens.bloomStrength;
    u.uDistortMax!.value = FLUID_MAX_SCREEN_PX / this.viewportHeight(renderer);
    u.uChromatic!.value = this.disabled.has('chromatic') ? 0 : tokens.chromaticOffset;
    u.uVignetteDarkness!.value = lerp(tokens.vignetteDarknessSpace, tokens.vignetteDarknessRoom, room);
    u.uVignetteOffset!.value = tokens.vignetteOffset;
    u.uGrain!.value = tokens.grain;
    u.uSeed!.value = this.frozen ? 0 : Math.floor(this.time * 24) % 997;

    this.timer.begin('composite');
    this.quad.material = this.composite;
    renderer.setRenderTarget(null);
    this.quad.render(renderer);
    this.timer.end();

    this.adapt();
  }

  private viewportHeight(renderer: WebGLRenderer): number {
    if (this.cssHeight > 0) return this.cssHeight;
    return Math.max(1, renderer.domElement.clientHeight || this.bufferSize.y / renderer.getPixelRatio());
  }

  private stepFluid(renderer: WebGLRenderer, dt: number): void {
    if (!this.fluidRunning) {
      this.input.consume(dt);
      if (this.fluid) this.fluid.clear(renderer);
      fluidUniforms.uFluidActive.value = 0;
      return;
    }
    this.fluid ??= new FluidField({
      size: this.profile.fluidSize,
      iterations: this.profile.pressureIterations,
      vorticity: this.profile.vorticity
    });
    const stroke = this.input.consume(dt);
    if (!stroke && !this.fluid.awake) {
      fluidUniforms.uFluidActive.value = 0;
      return;
    }
    this.timer?.begin('fluid');
    this.fluid.step(renderer, dt, this.bufferSize.x / Math.max(1, this.bufferSize.y), stroke);
    this.timer?.end();
    fluidUniforms.uFluidVelocity.value = this.fluid.texture;
    fluidUniforms.uFluidActive.value = this.fluid.awake ? 1 : 0;
    fluidUniforms.uFluidMax.value = FLUID_MAX_WORLD_PX / this.viewportHeight(renderer);
  }

  private updateFocus(camera: PerspectiveCamera, dt: number): void {
    const target = this.hasFocus && this.dofEnabled ? 1 : 0;
    const k = this.frozen ? 1 : 1 - Math.exp(-dt / FOCUS_TAU);
    if (this.hasFocus) {
      camera.getWorldDirection(this.forward);
      const distance = Math.max(this.toPoint.subVectors(this.focusPoint, camera.position).dot(this.forward), camera.near);
      this.focusDistance = this.dofAmount < 0.001 ? distance : this.focusDistance + (distance - this.focusDistance) * k;
    }
    this.dofAmount += (target - this.dofAmount) * k;
    if (Math.abs(target - this.dofAmount) < 0.001) this.dofAmount = target;
  }

  private renderDof(renderer: WebGLRenderer, targets: Targets, camera: PerspectiveCamera, room: number): void {
    const dofTarget = targets.dof!;
    this.dof ??= material(dofFrag(this.profile.dofTaps), {
      tColor: { value: null },
      tDepth: { value: null },
      uNear: { value: 0.1 },
      uFar: { value: 60 },
      uFocus: { value: 5 },
      uRange: { value: 2.5 },
      uTexel: { value: new Vector2() },
      uMaxRadius: { value: 4 }
    });
    const u = this.dof.uniforms;
    u.tColor!.value = targets.scene.texture;
    u.tDepth!.value = targets.scene.depthTexture;
    u.uNear!.value = camera.near;
    u.uFar!.value = camera.far;
    u.uFocus!.value = this.focusDistance;
    u.uRange!.value = lerp(this.tokens.focusRangeSpace, this.tokens.focusRangeRoom, room);
    (u.uTexel!.value as Vector2).set(1 / dofTarget.width, 1 / dofTarget.height);
    const bokeh = lerp(this.tokens.bokehSpace, this.tokens.bokehRoom, room);
    u.uMaxRadius!.value = (bokeh * 3 * (targets.height / 1080)) / this.profile.dofDivisor;
    this.timer?.begin('dof');
    this.quad.material = this.dof;
    renderer.setRenderTarget(dofTarget);
    this.quad.render(renderer);
    this.timer?.end();
  }

  private renderBloom(renderer: WebGLRenderer, targets: Targets): void {
    const { down, up } = targets;
    const d = this.down.uniforms;
    d.uThreshold!.value = this.tokens.bloomThreshold;
    d.uSmoothing!.value = this.tokens.bloomSmoothing;
    this.timer?.begin('bloom');
    this.quad.material = this.down;
    for (let i = 0; i < down.length; i++) {
      const source = i === 0 ? targets.scene : down[i - 1]!;
      const spread = i === 0 ? this.profile.bloomDivisor / 2 : 1;
      d.tInput!.value = source.texture;
      d.uPrefilter!.value = i === 0;
      (d.uTexel!.value as Vector2).set(spread / source.width, spread / source.height);
      renderer.setRenderTarget(down[i]!);
      this.quad.render(renderer);
    }
    const u = this.up.uniforms;
    u.uRadius!.value = this.tokens.bloomRadius;
    this.quad.material = this.up;
    for (let i = up.length - 1; i >= 0; i--) {
      const low = i === up.length - 1 ? down[i + 1]! : up[i + 1]!;
      u.tLow!.value = low.texture;
      u.tHigh!.value = down[i]!.texture;
      (u.uTexel!.value as Vector2).set(1 / low.width, 1 / low.height);
      renderer.setRenderTarget(up[i]!);
      this.quad.render(renderer);
    }
    this.timer?.end();
  }

  private ensureTargets(renderer: WebGLRenderer): Targets {
    renderer.getDrawingBufferSize(this.bufferSize);
    const width = Math.max(1, Math.floor(this.bufferSize.x));
    const height = Math.max(1, Math.floor(this.bufferSize.y));
    const current = this.targets;
    const wantsDof = this.dofEnabled;
    if (current && current.width === width && current.height === height && Boolean(current.dof) === wantsDof) {
      return current;
    }
    this.releaseTargets();
    const depthTexture = new DepthTexture(width, height, UnsignedIntType);
    const scene = new WebGLRenderTarget(width, height, {
      type: HalfFloatType,
      format: RGBAFormat,
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      depthBuffer: true,
      stencilBuffer: false,
      samples: this.profile.msaa,
      depthTexture
    });
    const divisor = this.profile.dofDivisor;
    const dof = wantsDof ? colorTarget(Math.ceil(width / divisor), Math.ceil(height / divisor)) : null;
    const down: WebGLRenderTarget[] = [];
    let w = Math.ceil(width / this.profile.bloomDivisor);
    let h = Math.ceil(height / this.profile.bloomDivisor);
    for (let i = 0; i < this.profile.bloomLevels; i++) {
      down.push(colorTarget(w, h));
      w = Math.max(1, Math.ceil(w / 2));
      h = Math.max(1, Math.ceil(h / 2));
    }
    const up = down.slice(0, -1).map(t => colorTarget(t.width, t.height));
    this.targets = { width, height, scene, dof, down, up };
    return this.targets;
  }

  private releaseTargets(): void {
    const t = this.targets;
    if (!t) return;
    t.scene.depthTexture?.dispose();
    t.scene.dispose();
    t.dof?.dispose();
    for (const target of [...t.down, ...t.up]) target.dispose();
    this.targets = null;
  }

  /** Budget rule of docs/design/desk.md §7: cut fluid → DoF → aberration; bloom stays. */
  private adapt(): void {
    const timer = this.timer;
    if (!timer?.trusted || timer.sampleCount < MIN_SAMPLES) return;
    const now = performance.now();
    if (now - this.lastEvaluation < EVALUATE_EVERY_MS) return;
    this.lastEvaluation = now;
    const { budgetMs, dofCeilingMs } = this.profile;
    if (dofCeilingMs > 0 && (timer.ms.get('dof') ?? 0) > dofCeilingMs && !this.disabled.has('dof')) {
      this.cut('dof');
      return;
    }
    if (budgetMs <= 0) return;
    if (this.effectsMs() <= budgetMs) {
      this.strikes = 0;
      return;
    }
    if (++this.strikes < 2) return;
    const next = CUT_ORDER.find(feature => !this.disabled.has(feature));
    if (next) this.cut(next);
  }

  private cut(feature: FxFeature): void {
    this.disabled.add(feature);
    this.strikes = 0;
    this.timer?.reset();
    if (feature === 'fluid') fluidUniforms.uFluidActive.value = 0;
  }

  private effectsMs(): number {
    let total = 0;
    for (const [label, ms] of this.timer?.ms ?? []) if (label !== 'scene') total += ms;
    return total;
  }

  stats(): FxStats {
    return {
      tier: this.tier,
      gpuTimer: Boolean(this.timer?.supported),
      gpuTimerTrusted: Boolean(this.timer?.trusted),
      ms: Object.fromEntries(this.timer?.ms ?? []),
      effectsMs: this.effectsMs(),
      disabled: [...this.disabled],
      fluidAwake: Boolean(this.fluid?.awake),
      dofAmount: this.dofAmount,
      buffer: { width: this.bufferSize.x, height: this.bufferSize.y }
    };
  }

  dispose(): void {
    for (const cleanup of this.cleanups) cleanup();
    this.cleanups.length = 0;
    this.releaseTargets();
    this.fluid?.dispose();
    this.fluid = null;
    this.timer?.dispose();
    this.timer = null;
    this.down.dispose();
    this.up.dispose();
    this.dof?.dispose();
    this.composite.dispose();
    this.quad.dispose();
    this.tone.dispose();
    fluidUniforms.uFluidActive.value = 0;
    fluidUniforms.uFluidVelocity.value = FLUID_IDLE_TEXTURE;
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Creates the cinematic post pipeline (selective bloom, DoF on `setFocus`, fluid refraction,
 * edge chromatic aberration, ACES via the renderer, vignette, grain). GPU resources are built
 * lazily on the first `render`, so it can be created before the renderer exists.
 */
export function createFxPipeline(options: FxOptions = {}): CinematicFx {
  return new CinematicPipeline(options);
}
