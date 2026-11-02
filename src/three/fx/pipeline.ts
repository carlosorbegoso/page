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
import { fluidConsumerCount, fluidUniforms } from './fluid';
import { FluidDriver } from './fluid/driver';
import { RackFocus } from './focus';
import { ChapterGrading, type Grade } from './grading';
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
  private timer: GpuTimer | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private readonly fluid: FluidDriver;
  private pointer: PointerField | null = null;
  private motion: MotionState = readMotion();
  private readonly budget = new FxBudget();
  private readonly focus = new RackFocus();
  private readonly capture = new URLSearchParams(location.search).has('capture');
  private chapterEvents = false;
  private chapter = '';
  private exploring = false;
  private readonly grading = new ChapterGrading();
  private time = 0;
  private readonly cleanups: Array<() => void> = [];
  private readonly bloom = new BloomPass();
  private readonly streak = new StreakPass();
  private readonly dof = new DofPass();
  private readonly composite = new CompositePass();

  constructor(options: FxOptions) {
    this.tier = options.tier ?? guessTier();
    this.profile = tierProfile(this.tier);
    this.fluid = new FluidDriver(() => this.canvas, this.tokens.pointerDamping);
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
      if (this.chapter) this.grading.enter(this.exploring ? 'explore' : this.chapter, this.frozen, true);
    };
    window.addEventListener('time:toggle', onTime);
    this.cleanups.push(() => window.removeEventListener('time:toggle', onTime));
    const onExplore = (event: Event) => this.explore(Boolean((event as CustomEvent<{ active?: boolean }>).detail?.active));
    window.addEventListener('explore:change', onExplore);
    this.cleanups.push(() => window.removeEventListener('explore:change', onExplore));
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
    if (!this.exploring) this.grading.enter(id, this.frozen);
  }

  private explore(active: boolean): void {
    this.exploring = active;
    this.grading.enter(active ? 'explore' : this.chapter, this.frozen);
  }

  get settling(): boolean {
    if (!this.profile.enabled) return false;
    const fluid = this.fluidRunning && this.fluid.awake;
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
    return this.profile.dof !== 'off' && !this.budget.has('dof') && !this.exploring;
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
    this.fluid.resize(height);
  }

  setTier(tier: Tier): void {
    if (tier === this.tier) return;
    this.tier = tier;
    this.profile = tierProfile(tier);
    this.budget.reset();
    this.timer?.reset();
    this.releaseTargets();
    this.fluid.reset();
    this.dof.dispose();
  }

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
      this.renderDirect(renderer, scene, camera);
      return;
    }
    this.canvas = renderer.domElement;
    this.timer ??= new GpuTimer(renderer.getContext() as WebGL2RenderingContext);
    this.timer.poll();
    const targets = this.ensureTargets(renderer);
    this.time += dt;
    this.fluid.step(renderer, dt, this.fluidRunning, this.profile, this.bufferSize, this.timer);
    this.renderScene(renderer, scene, camera, targets);
    this.focus.update(camera, dt, this.dofEnabled, this.frozen, this.grading.value.focusRange);
    const grade = this.grading.update(this.frozen ? Number.POSITIVE_INFINITY : dt);
    this.renderEffects(renderer, camera, targets, grade);
    renderLateLayer(renderer, scene, camera, targets.scene.depthTexture);
    if (this.budget.evaluate(this.timer, this.profile) === 'fluid') fluidUniforms.uFluidActive.value = 0;
  }

  private renderDirect(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera): void {
    renderer.setRenderTarget(null);
    camera.layers.enable(LATE_LAYER);
    renderer.render(scene, camera);
    camera.layers.disable(LATE_LAYER);
  }

  private renderScene(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, targets: Targets): void {
    this.timer?.begin('scene');
    renderer.setRenderTarget(targets.scene);
    this.tone.begin(renderer, scene);
    renderer.render(scene, camera);
    this.tone.end(renderer, scene);
    this.timer?.end();
  }

  private renderEffects(renderer: WebGLRenderer, camera: PerspectiveCamera, targets: Targets, grade: Grade): void {
    const { quad, tokens, profile, timer, focus } = this;
    if (targets.dof && focus.amount > 0.001) this.dof.render(renderer, quad, targets, camera, focus.distance, this.grading.value, tokens.bokeh, profile, timer);
    this.bloom.render(renderer, quad, targets, tokens, profile, timer);
    this.streak.render(renderer, quad, targets, tokens.streakThreshold, timer);
    const frame = { camera, grade, focusDistance: focus.distance, dofAmount: focus.amount, frozen: this.frozen, time: this.time };
    this.composite.render(renderer, quad, targets, tokens, frame, timer);
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
      fluidAwake: this.fluid.awake,
      dofAmount: this.focus.amount,
      chapter: this.chapter,
      buffer: { width: this.bufferSize.x, height: this.bufferSize.y }
    };
  }

  dispose(): void {
    for (const cleanup of this.cleanups) cleanup();
    this.cleanups.length = 0;
    this.releaseTargets();
    this.fluid.dispose();
    this.timer?.dispose();
    this.timer = null;
    this.bloom.dispose();
    this.streak.dispose();
    this.dof.dispose();
    this.composite.dispose();
    this.quad.dispose();
    this.tone.dispose();
  }
}

export function createFxPipeline(options: FxOptions = {}): CinematicFx {
  return new CinematicPipeline(options);
}
