import { PerspectiveCamera, type WebGLRenderer } from 'three';
import { bindRenderer } from './assets';
import { onRegistryChange, type ChapterId } from './contracts';
import { DebugOverlay } from './debug';
import { CAMERA_LIMITS, CameraDirector } from './director';
import { yieldToMain } from './idle';
import { motionAllowed, readMotion, type MotionState } from './motion';
import { StagePointer } from './pointer';
import { StageChapters } from './stage/chapters';
import { loadExtensions } from './stage/extensions';
import { StageLoop } from './stage/frame-loop';
import { listenStage } from './stage/listen';
import { StageModules } from './stage/modules';
import { announceReveal, screenPoint } from './stage/reveal';
import { applyStageTokens, createStageRenderer } from './stage/renderer';
import { breathes, fixedChapter, StageLayout } from './stage/shots';
import { stationContext } from './stage/station-context';
import { reportProgress, type StageOptions } from './stage/types';
import { calibrateRefreshInterval, dprPolicy, type Tier } from './tier';
import { World } from './world';

export type { CaptureOptions, StageOptions } from './stage/types';

const INTRO_SECONDS = 2.4;

declare global {
  interface Window {
    __captureReady?: boolean;
    __stage?: Stage;
  }
}

/**
 * The single WebGL renderer and canvas, driven by chapters (PLAN, final direction): the camera
 * director holds one fixed shot per chapter, scroll only selects the chapter, and text lives on
 * desk surfaces (CSS3D) or in anchored 2D panels. The pieces live in `stage/*`; this class wires them.
 */
export class Stage {
  readonly camera = new PerspectiveCamera(CAMERA_LIMITS.fovDesktop, 1, 0.05, 60);
  renderer!: WebGLRenderer;
  private canvas!: HTMLCanvasElement;
  private world!: World;
  private readonly director: CameraDirector;
  private readonly pointerField = new StagePointer();
  private ready = false;
  private tier: Tier;
  private failed = false;
  private motion: MotionState = readMotion();
  private pointer = { x: 0, y: 0 };
  private readonly finePointer = matchMedia('(pointer: fine)').matches;
  private readonly layout = new StageLayout();
  private debug: DebugOverlay | undefined;
  private readonly cleanups: Array<() => void> = [];
  private readonly loop: StageLoop;
  private readonly modules: StageModules = new StageModules({
    world: () => this.world,
    renderer: () => this.renderer,
    camera: this.camera,
    pointer: this.pointerField,
    tier: () => this.tier,
    size: () => this.layout.size,
    context: () => {
      const { tier, renderer, camera, world, pointerField: pointer } = this;
      const host = { tier, renderer, camera, world, pointer, capture: Boolean(this.options.capture) };
      return stationContext({ ...host, motion: () => this.loop.idleMotion(), fov: () => this.layout.fov(), invalidate: () => this.invalidate(), precompile: object => this.modules.precompile(object) });
    },
    ready: () => this.ready,
    refreshShot: () => this.refreshShot(),
    invalidate: () => this.invalidate()
  });
  private readonly chapters: StageChapters;

  constructor(private readonly options: StageOptions) {
    this.tier = options.tier.tier;
    this.director = new CameraDirector({
      onEnter: (id, subIndex, duration) => {
        window.dispatchEvent(new CustomEvent('chapter:enter', { detail: { id, subIndex, duration } }));
        this.modules.fx?.setFocus(this.world.focus(id, subIndex));
      },
      onSettled: (id, subIndex) => {
        window.dispatchEvent(new CustomEvent('chapter:settled', { detail: { id, subIndex } }));
        this.modules.fx?.setFocus(this.world.focus(id, subIndex));
        this.invalidate();
      },
      dissolve: cut => this.chapters.dissolve(cut)
    });
    this.loop = this.createLoop();
    const { director, layout, loop } = this;
    this.chapters = new StageChapters({ director, layout, loop, world: () => this.world, canvas: () => this.canvas, movesAllowed: () => this.movesAllowed, invalidate: () => this.invalidate() });
  }

  private createLoop(): StageLoop {
    return new StageLoop({
      renderer: () => this.renderer,
      capture: Boolean(this.options.capture),
      tier: () => this.tier,
      canRun: () => this.canRun(),
      motionAllowed: () => motionAllowed(this.motion),
      settled: () => this.director.isSettled,
      render: (dt, now) => this.renderFrame(dt, now),
      afterRender: now => {
        if (this.options.container.dataset.ready !== 'true') this.reveal();
        this.debug?.frame(now);
      },
      finishIntro: () => this.chapters.finishIntro(),
      resolutionChanged: decision => {
        this.measure(true);
        this.debug?.note(`dpr ${decision} → ${this.loop.dpr.value}`);
      },
      degrade: () => this.degrade('low')
    });
  }

  get tierName(): Tier {
    return this.tier;
  }

  /** True when chapter changes animate the camera (no reduced motion, no pause, no capture). */
  get movesAllowed(): boolean {
    return motionAllowed(this.motion) && !this.options.capture;
  }

  async start(): Promise<void> {
    await this.bootRenderer();
    await this.bootScene();
    await this.enterFirstShot();
    this.listen();
    if (this.options.debug) this.debug = new DebugOverlay(this.renderer, this);
    if (!this.options.capture && !this.options.forcedChapter) await this.chapters.startScroll();
    this.invalidate();
  }

  private async bootRenderer(): Promise<void> {
    const { container, capture } = this.options;
    if (!capture) this.loop.refreshMs = await calibrateRefreshInterval(500);
    await yieldToMain();
    this.loop.usePolicy(dprPolicy(this.tier));
    ({ canvas: this.canvas, renderer: this.renderer } = createStageRenderer(this.tier, Boolean(capture), capture ? window.devicePixelRatio || 1 : this.loop.dpr.value));
    bindRenderer(this.renderer);
    container.appendChild(this.canvas);
    reportProgress(0.55);
    await yieldToMain();
  }

  private async bootScene(): Promise<void> {
    await loadExtensions();
    reportProgress(0.7);
    this.world = new World();
    await this.world.load();
    reportProgress(0.78);
    applyStageTokens(this.renderer, this.world);
    this.measure(true);
    await this.modules.sync();
    reportProgress(0.88);
    this.cleanups.push(onRegistryChange(() => void this.modules.sync()));
    await yieldToMain();
  }

  /** Capture / forced chapter, else `intro` when the page starts at the top, else the hero. */
  private async enterFirstShot(): Promise<void> {
    /* Read before the plates move into their layers: afterwards scrollY would force that whole re-layout synchronously. */
    const atTop = scrollY < 4;
    if (!this.options.capture) this.chapters.mountPlates();
    let first = fixedChapter(this.options);
    if (!first && atTop && this.movesAllowed) this.loop.introUntil = Number.POSITIVE_INFINITY;
    first ??= this.loop.introUntil ? { id: 'intro', sub: 0 } : { id: 'hero', sub: 0 };
    this.director.request({ id: first.id, subIndex: first.sub, shot: this.layout.shot(this.world, first.id, first.sub) }, 'instant');
    this.director.update(this.camera, 0, this.layout.fov(), { x: 0, y: 0 }, true);
    await this.modules.precompile();
    reportProgress(0.96);
    await yieldToMain();
    /* The idle window starts when the scene is first seen: a long boot would otherwise skip the power-on. */
    this.loop.lastInteraction = performance.now();
    this.ready = true;
  }

  subCount(chapter: ChapterId): number {
    return this.chapters.subCount(chapter);
  }

  private refreshShot(): void {
    const id = this.director.chapter;
    if (id) this.director.refresh(this.layout.shot(this.world, id, this.director.subIndex));
  }

  /** Requests a render; starts the loop if it is allowed to run. */
  invalidate(): void {
    this.loop.invalidate();
  }

  chapterLabel(): string {
    const state = this.director.state();
    return state.subIndex ? `${state.id}:${state.subIndex}` : state.id;
  }

  dprValue(): number {
    return this.renderer.getPixelRatio();
  }

  p75FrameMs(): number {
    return this.loop.p75();
  }

  refreshIntervalMs(): number {
    return this.loop.refreshMs;
  }

  private canRun(): boolean {
    return this.ready && !this.failed && this.tier !== 'none' && this.tier !== 'low' && document.visibilityState === 'visible';
  }

  private renderFrame(dt: number, now: number): boolean {
    this.renderer.info.reset();
    const idle = () => this.loop.idleMotion();
    const pointerAllowed = this.finePointer && idle() && this.director.isSettled;
    this.pointerField.enabled = pointerAllowed;
    this.pointerField.settle(dt);
    let settling = this.director.update(this.camera, dt, this.layout.fov(), pointerAllowed ? this.pointer : { x: 0, y: 0 }, !this.movesAllowed);
    const state = this.director.state();
    if (this.world.update(dt, (now - this.loop.clockStart) / 1000, state, idle(), this.camera.position, this.renderer.getPixelRatio())) settling = true;
    this.chapters.plates?.update(this.camera, state, this.chapters.progress.get(state.id) ?? 0);
    const steady = this.director.breathe(this.camera, dt, idle() && breathes(this.layout.stacked, state.id));
    settling ||= this.director.breathing;
    const filtering = this.modules.render(dt);
    settling ||= filtering;
    steady();
    this.chapters.plates?.render(this.camera);
    return settling;
  }

  private reveal(): void {
    const intro = this.loop.introUntil === Number.POSITIVE_INFINITY;
    if (intro) this.loop.introUntil = performance.now() + INTRO_SECONDS * 1000;
    announceReveal(this.options.container, intro, screenPoint(this.world.anchor('lamp'), this.camera, this.layout.size), Boolean(this.options.capture));
  }

  /** Stops 3D and leaves the static fallback and the normal page flow (slow device or lost context). */
  degrade(reason: 'low' | 'context-lost'): void {
    if (reason === 'low') this.tier = 'low';
    this.modules.fx?.setTier(this.tier);
    this.failed = reason === 'context-lost';
    this.loop.stop();
    this.chapters.teardown();
    this.options.container.dataset.degraded = reason;
    document.documentElement.classList.remove('stage-pending');
    this.debug?.note(`degraded: ${reason}`);
  }

  private measure(force = false): void {
    const change = this.layout.measure(this.options.container, force);
    if (!change) return;
    const { width, height } = this.layout.size;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    if (change.restack) this.chapters.remountPlates();
    this.chapters.plates?.setSize(width, height);
    this.modules.fx?.resize(width, height, this.renderer.getPixelRatio());
    if (this.ready) {
      this.refreshShot();
      this.chapters.refreshScroll();
    }
    this.invalidate();
  }

  private listen(): void {
    const { canvas, camera, pointerField, finePointer } = this;
    listenStage(
      {
        ...{ canvas, camera, pointerField, finePointer, source: this.world, capture: Boolean(this.options.capture) },
        focus: () => this.director.focus,
        measure: force => this.measure(force),
        bump: () => this.loop.bump(),
        stop: () => this.loop.stop(),
        degrade: reason => this.degrade(reason),
        setPointer: pointer => (this.pointer = pointer),
        setMotion: state => (this.motion = state),
        navigate: pick => this.chapters.navigate(pick),
        refocus: point => this.modules.fx?.setFocus(point ?? (this.director.chapter ? this.world.focus(this.director.chapter, this.director.subIndex) : null)),
        themeChanged: () => {
          applyStageTokens(this.renderer, this.world);
          this.invalidate();
        }
      },
      this.cleanups
    );
  }

  dispose(): void {
    this.loop.stop();
    for (const cleanup of this.cleanups) cleanup();
    this.chapters.dispose();
    this.modules.dispose();
    this.world?.dispose();
    this.debug?.dispose();
    this.renderer.dispose();
    this.canvas.remove();
  }
}
