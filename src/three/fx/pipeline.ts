import {
  BufferGeometry,
  Float32BufferAttribute,
  Mesh,
  OrthographicCamera,
  Vector2,
  type Object3D,
  type PerspectiveCamera,
  type Scene,
  type Vector3,
  type WebGLRenderer
} from 'three';
import { LATE_LAYER, renderLateLayer } from './late';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import type { PointerField } from '../contracts';
import { motionAllowed, readMotion, watchMotion, type MotionState } from '../motion';
import type { Tier } from '../tier';
import { effectsMs, FxBudget } from './adapt';
import { FLUID_IDLE_TEXTURE, FLUID_MAX_PX, fluidConsumerCount, FluidField, FluidPointerInput, fluidUniforms } from './fluid';
import { RackFocus } from './focus';
import { ChapterGrading } from './grading';
import { GpuTimer } from './gpuTimer';
import { BloomPass } from './passes/bloom';
import { CompositePass } from './passes/composite';
import { DofPass } from './passes/dof';
import { StreakPass } from './passes/streak';
import { guessTier, readFxTokens, tierProfile, type FxTokens, type TierProfile } from './settings';
import { createTargets, disposeTargets, type Targets } from './targets';
import { ToneCompensation } from './toneCompensation';
import type { CinematicFx, FxOptions, FxStats } from './types';

export type { FxFeature } from './adapt';
export type { CinematicFx, FxOptions, FxStats } from './types';

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
  private readonly budget = new FxBudget();
  private readonly focus = new RackFocus();
  private readonly capture = new URLSearchParams(location.search).has('capture');
  private chapterEvents = false;
  private chapter = '';
  private readonly grading = new ChapterGrading();
  private cssHeight = 0;
  private time = 0;
  private readonly cleanups: Array<() => void> = [];
  private readonly bloom = new BloomPass();
  private readonly streak = new StreakPass();
  private readonly dof = new DofPass();
  private readonly composite = new CompositePass();

  constructor(options: FxOptions) {
    this.tier = options.tier ?? guessTier();
    this.profile = tierProfile(this.tier);
    this.input = new FluidPointerInput(() => this.canvas, this.tokens.pointerDamping);
    this.cleanups.push(() => this.input.dispose());
    this.cleanups.push(watchMotion(state => (this.motion = state)));
    const listen = (type: string, handler: (id: string, detail: { duration?: number }) => void) => {
      const listener = (event: Event) => {
        const detail = (event as CustomEvent<{ id?: string; duration?: number }>).detail;
        if (typeof detail?.id === 'string') handler(detail.id, detail);
      };
      window.addEventListener(type, listener);
      this.cleanups.push(() => window.removeEventListener(type, listener));
    };
    const onTime = () => {
      if (this.chapter) this.grading.enter(this.chapter, this.frozen, true);
    };
    window.addEventListener('time:toggle', onTime);
    this.cleanups.push(() => window.removeEventListener('time:toggle', onTime));
    listen('chapter:enter', (id, detail) => {
      this.chapterEvents = true;
      this.enterChapter(id);
      this.focus.hold(detail.duration);
    });
    listen('chapter:settled', id => {
      this.chapterEvents = true;
      this.enterChapter(id);
      this.focus.settle();
    });
    listen('station:enter', id => {
      if (!this.chapterEvents) this.enterChapter(id);
    });
  }

  private enterChapter(id: string): void {
    this.chapter = id;
    this.grading.enter(id, this.frozen);
  }

  get settling(): boolean {
    if (!this.profile.enabled) return false;
    const fluid = this.fluidRunning && Boolean(this.fluid?.awake);
    const focusTarget = this.focus.hasFocus && this.dofEnabled ? 1 : 0;
    return fluid || this.focus.racking || this.grading.moving || Math.abs(this.focus.amount - focusTarget) > 0.01;
  }

  private get frozen(): boolean {
    return this.capture || !motionAllowed(this.motion) || (this.pointer !== null && !this.pointer.enabled);
  }

  private get fluidRunning(): boolean {
    return this.profile.fluidSize > 0 && fluidConsumerCount() > 0 && !this.budget.has('fluid') && !this.frozen;
  }

  private get dofEnabled(): boolean {
    return this.profile.dof !== 'off' && !this.budget.has('dof');
  }

  attachPointer(pointer: PointerField): void {
    this.pointer = pointer;
  }

  setFocus(point: Vector3 | null): void {
    this.focus.set(point);
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
    this.budget.reset();
    this.timer?.reset();
    this.releaseTargets();
    this.fluid?.dispose();
    this.fluid = null;
    this.dof.dispose();
    fluidUniforms.uFluidActive.value = 0;
    fluidUniforms.uFluidVelocity.value = FLUID_IDLE_TEXTURE;
  }

  /**
   * Program cache keys depend on the bound render target (tone mapping, output colour space), so the
   * scene is compiled into `targets.scene` and each pass under the target it draws into; compiling
   * against the canvas would leave every program to be linked again in the first frame.
   */
  async precompile(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, object?: Object3D): Promise<void> {
    const previous = renderer.getRenderTarget();
    if (!this.profile.enabled) {
      renderer.setRenderTarget(null);
      const ready = object ? renderer.compileAsync(object, camera, scene) : renderer.compileAsync(scene, camera);
      renderer.setRenderTarget(previous);
      await ready;
      return;
    }
    const targets = this.ensureTargets(renderer);
    renderer.setRenderTarget(targets.scene);
    this.tone.begin(renderer, scene);
    const pending = [object ? renderer.compileAsync(object, camera, scene) : renderer.compileAsync(scene, camera)];
    this.tone.end(renderer, scene);
    if (!object) {
      /* Same attributes as FullScreenQuad's triangle (position + uv, no normal): attributes are part of the program key. */
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3));
      geometry.setAttribute('uv', new Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2));
      const quadCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const passes = [this.bloom.down, this.bloom.up, this.streak.material, ...(targets.dof ? [this.dof.material(this.profile.dofTaps)] : [])];
      const passTarget = targets.down[0] ?? targets.scene;
      renderer.setRenderTarget(passTarget);
      for (const pass of passes) pending.push(renderer.compileAsync(new Mesh(geometry, pass), quadCamera));
      renderer.setRenderTarget(null);
      pending.push(renderer.compileAsync(new Mesh(geometry, this.composite.material), quadCamera));
      void Promise.all(pending).finally(() => geometry.dispose());
    }
    renderer.setRenderTarget(previous);
    await Promise.all(pending);
  }

  render(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, dt: number): void {
    if (!this.profile.enabled) {
      renderer.setRenderTarget(null);
      camera.layers.enable(LATE_LAYER);
      renderer.render(scene, camera);
      camera.layers.disable(LATE_LAYER);
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

    this.focus.update(camera, dt, this.dofEnabled, this.frozen, this.grading.value.focusRange);
    const grade = this.grading.update(this.frozen ? Number.POSITIVE_INFINITY : dt);

    if (targets.dof && this.focus.amount > 0.001) {
      this.dof.render(renderer, this.quad, targets, camera, this.focus.distance, this.grading.value, this.tokens.bokeh, this.profile, this.timer);
    }
    this.bloom.render(renderer, this.quad, targets, this.tokens, this.profile, this.timer);
    this.streak.render(renderer, this.quad, targets, this.tokens.streakThreshold, this.timer);
    this.composite.render(
      renderer,
      this.quad,
      targets,
      this.tokens,
      { camera, grade, focusDistance: this.focus.distance, dofAmount: this.focus.amount, frozen: this.frozen, time: this.time },
      this.timer
    );
    renderLateLayer(renderer, scene, camera, targets.scene.depthTexture);

    if (this.budget.evaluate(this.timer, this.profile) === 'fluid') fluidUniforms.uFluidActive.value = 0;
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
    fluidUniforms.uFluidMax.value = FLUID_MAX_PX / this.viewportHeight(renderer);
    fluidUniforms.uFluidViewport.value.set(this.bufferSize.x, this.bufferSize.y);
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
    this.targets = createTargets(width, height, this.profile, wantsDof);
    return this.targets;
  }

  private releaseTargets(): void {
    if (!this.targets) return;
    disposeTargets(this.targets);
    this.targets = null;
  }

  stats(): FxStats {
    return {
      tier: this.tier,
      gpuTimer: Boolean(this.timer?.supported),
      gpuTimerTrusted: Boolean(this.timer?.trusted),
      ms: Object.fromEntries(this.timer?.ms ?? []),
      effectsMs: effectsMs(this.timer),
      disabled: this.budget.list(),
      fluidAwake: Boolean(this.fluid?.awake),
      dofAmount: this.focus.amount,
      chapter: this.chapter,
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
    this.bloom.dispose();
    this.streak.dispose();
    this.dof.dispose();
    this.composite.dispose();
    this.quad.dispose();
    this.tone.dispose();
    fluidUniforms.uFluidActive.value = 0;
    fluidUniforms.uFluidVelocity.value = FLUID_IDLE_TEXTURE;
  }
}

/**
 * Creates the cinematic post pipeline for the night desk: selective bloom with an anamorphic
 * streak, chapter rack focus, teal-orange chapter grading with contrast, ACES via the renderer,
 * corner fringe, vignette and grain, plus the fluid field that feeds the
 * rain, steam and window-glass materials. GPU resources are built
 * lazily on the first `render`, so it can be created before the renderer exists.
 */
export function createFxPipeline(options: FxOptions = {}): CinematicFx {
  return new CinematicPipeline(options);
}
