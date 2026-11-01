import { ACESFilmicToneMapping, PerspectiveCamera, SRGBColorSpace, Vector3, WebGLRenderer, type Object3D } from 'three';
import { bindRenderer } from './assets';
import {
  onRegistryChange,
  registeredFx,
  registeredShotProvider,
  registeredStations,
  type ChapterId,
  type Shot,
  type FxPipeline,
  type ShotProvider,
  type StationContext,
  type StationModule,
  type StationPick
} from './contracts';
import { DebugOverlay } from './debug';
import { CAMERA_LIMITS, CameraDirector } from './director';
import { yieldToMain } from './idle';
import { setupInteraction } from './interaction';
import { motionAllowed, readMotion, watchMotion, type MotionState } from './motion';
import { Plates } from './plates';
import { StagePointer } from './pointer';
import { layoutKind, stackedLayout, type LayoutKind } from './scenes/common';
import { setupChapterScroll, type ChapterScroll } from './scroll';
import { chapterElement, SECTION_CHAPTERS } from './sections';
import { calibrateRefreshInterval, dprPolicy, DprController, FrameSampler, type Tier, type TierResult } from './tier';
import { tokenColor, tokenNumber } from './tokens';
import { World } from './world';

export interface CaptureOptions {
  chapter: ChapterId;
  sub: number;
}

export interface StageOptions {
  container: HTMLElement;
  tier: TierResult;
  capture?: CaptureOptions;
  /** Fixes one chapter without scroll (`?chapter=`). */
  forcedChapter?: ChapterId;
  /** Sub-shot of the forced chapter (`?sub=`). */
  forcedSub?: number;
  debug?: boolean;
}

const RESIZE_HEIGHT_THRESHOLD = 150;
const IDLE_WINDOW_MS = 8000;
const DISSOLVE_HALF_MS = 150;
const INTRO_SECONDS = 2.4;
const PHONE_MONITOR_PUSH = 0.1;
/** The intro holds 4 % further back on the same axis, so leaving it is a short dolly-in onto the hero. */
const INTRO_PULLBACK = 0.04;
/** Sub-shots when neither the desk nor the plates say otherwise. */
const DEFAULT_SUBS: Partial<Record<ChapterId, number>> = { products: 3 };
/**
 * Chapters whose text lives in anchored 2D panels: the camera breathes there. The CSS3D chapters
 * (monitor, phone) stay still, because their 1:1 text would shimmer or slide on the glass.
 */
const BREATHING_CHAPTERS: ReadonlySet<ChapterId> = new Set(['company', 'products', 'experience', 'outro']);
/** Stacked phones read the monitor chapters from 2D panels too, so those shots breathe as well. */
const BREATHING_STACKED: ReadonlySet<ChapterId> = new Set([...BREATHING_CHAPTERS, 'hero', 'about']);
/** `data-plate-stacked` plates switch to this mode on stacked phones; `data-plate-wide` keeps the authored one. */
const STACKED_MODE = 'anchored';

/** Boot milestones for the pre-three loader in StageCanvas (0…1). */
function progress(value: number): void {
  window.dispatchEvent(new CustomEvent('stage:progress', { detail: { value } }));
}

declare global {
  interface Window {
    __captureReady?: boolean;
    __stage?: Stage;
  }
}

/**
 * The single WebGL renderer and canvas, driven by chapters (PLAN, final direction): the camera
 * director holds one fixed shot per chapter, scroll only selects the chapter, and text lives on
 * desk surfaces (CSS3D) or in anchored 2D panels.
 */
export class Stage {
  readonly camera = new PerspectiveCamera(CAMERA_LIMITS.fovDesktop, 1, 0.05, 60);
  private renderer!: WebGLRenderer;
  private canvas!: HTMLCanvasElement;
  private world!: World;
  private plates: Plates | undefined;
  private scroll: ChapterScroll | undefined;
  private fx: FxPipeline | null = null;
  private provider: ShotProvider | null = null;
  private legacy: StationModule | null = null;
  private readonly director: CameraDirector;
  private readonly pointerField = new StagePointer();
  private ready = false;
  private tier: Tier;
  private running = false;
  private failed = false;
  private motion: MotionState = readMotion();
  private pointer = { x: 0, y: 0 };
  private readonly finePointer = matchMedia('(pointer: fine)').matches;
  private size = { width: 0, height: 0 };
  private layout: LayoutKind = 'desktop';
  private stacked = false;
  private refreshMs = 1000 / 60;
  private readonly sampler = new FrameSampler(60);
  private readonly workSampler = new FrameSampler(60);
  private dpr!: DprController;
  private frameDivisor = 1;
  private frameCount = 0;
  private lastFrame = -1;
  private lastRendered = -1;
  private lastEvaluation = 0;
  private lastInteraction = performance.now();
  private readonly clockStart = performance.now();
  private readonly progress = new Map<ChapterId, number>();
  private introUntil = 0;
  private pendingChapter: { id: ChapterId; sub: number } | null = null;
  private debug: DebugOverlay | undefined;
  private readonly cleanups: Array<() => void> = [];

  constructor(private readonly options: StageOptions) {
    this.tier = options.tier.tier;
    this.director = new CameraDirector({
      onEnter: (id, subIndex, duration) => {
        window.dispatchEvent(new CustomEvent('chapter:enter', { detail: { id, subIndex, duration } }));
        this.fx?.setFocus(this.world.focus(id, subIndex));
      },
      onSettled: (id, subIndex) => {
        window.dispatchEvent(new CustomEvent('chapter:settled', { detail: { id, subIndex } }));
        this.fx?.setFocus(this.world.focus(id, subIndex));
        this.invalidate();
      },
      dissolve: cut => this.dissolve(cut)
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
    const { container, capture } = this.options;
    if (!capture) this.refreshMs = await calibrateRefreshInterval(500);
    await yieldToMain();

    const policy = dprPolicy(this.tier);
    this.dpr = new DprController(policy);
    this.frameDivisor = policy.frameDivisor;
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('aria-hidden', 'true');
    this.canvas.dataset.stageCanvas = '';
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: false,
      antialias: this.tier === 'high' || Boolean(capture),
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: Boolean(capture)
    });
    this.renderer.info.autoReset = false;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setPixelRatio(capture ? window.devicePixelRatio || 1 : this.dpr.value);
    bindRenderer(this.renderer);
    container.appendChild(this.canvas);
    progress(0.55);
    await yieldToMain();

    await this.loadExtensions();
    progress(0.7);
    this.world = new World();
    await this.world.load();
    progress(0.78);
    this.applyTokens();
    this.measure(true);
    await this.syncRegistry();
    progress(0.88);
    this.cleanups.push(onRegistryChange(() => void this.syncRegistry()));
    await yieldToMain();

    /* Read before the plates move into their layers: afterwards scrollY would force that whole re-layout synchronously. */
    const atTop = scrollY < 4;
    if (!capture) this.mountPlates();
    const first = this.firstChapter(atTop);
    this.director.request({ id: first.id, subIndex: first.sub, shot: this.shotFor(first.id, first.sub) }, 'instant');
    this.director.update(this.camera, 0, this.fov(), { x: 0, y: 0 }, true);
    await this.precompile();
    progress(0.96);
    await yieldToMain();
    // The idle window starts when the scene is first seen: a long boot would otherwise skip the power-on.
    this.lastInteraction = performance.now();
    this.ready = true;

    this.listen();
    if (this.options.debug) this.debug = new DebugOverlay(this.renderer, this);
    if (!capture && !this.options.forcedChapter) {
      this.scroll = await setupChapterScroll({
        subCount: id => this.subCount(id),
        onChapter: (id, sub) => this.requestChapter(id, sub),
        onProgress: (id, progress) => {
          this.progress.set(id, progress);
          window.dispatchEvent(new CustomEvent('chapter:progress', { detail: { id, progress } }));
          this.bump();
        }
      });
    }
    this.invalidate();
  }

  /** Capture / forced chapter, else `intro` when the page starts at the top, else the hero. */
  private firstChapter(atTop: boolean): { id: ChapterId; sub: number } {
    const fixed = this.options.capture ?? (this.options.forcedChapter ? { chapter: this.options.forcedChapter, sub: this.options.forcedSub ?? 0 } : null);
    if (fixed) return { id: fixed.chapter, sub: fixed.sub };
    if (atTop && this.movesAllowed) {
      this.introUntil = Number.POSITIVE_INFINITY;
      return { id: 'intro', sub: 0 };
    }
    return { id: 'hero', sub: 0 };
  }

  /**
   * Chapter shot for the current layout. Landscape phones push the hero (and intro) in 10 % towards
   * the target so the screen text is not tiny (a straight dolly: roll and FOV are unchanged).
   */
  private shotFor(id: ChapterId, sub: number): Shot {
    const shot = this.world.shot(id, sub);
    const readsMonitor = this.layout === 'phone' && !this.stacked && (id === 'hero' || id === 'intro');
    const push = (readsMonitor ? PHONE_MONITOR_PUSH : 0) - (id === 'intro' ? INTRO_PULLBACK : 0);
    if (!push) return shot;
    const position = shot.position.clone().lerp(shot.target, push);
    return { ...shot, position };
  }

  private fov(): number {
    if (this.stacked) return CAMERA_LIMITS.fovStacked;
    return this.layout === 'desktop' ? CAMERA_LIMITS.fovDesktop : CAMERA_LIMITS.fovTouch;
  }

  subCount(chapter: ChapterId): number {
    const fromPlates = this.plates?.subCount(chapter) ?? 1;
    return Math.max(1, this.world.subShotCount(chapter, Math.max(fromPlates, DEFAULT_SUBS[chapter] ?? 1)));
  }

  /** Scroll selected a chapter (or sub-shot): the director moves, or cuts under reduced motion. */
  private requestChapter(id: ChapterId, sub: number): void {
    if (performance.now() < this.introUntil) {
      this.pendingChapter = { id, sub };
      return;
    }
    this.director.request({ id, subIndex: sub, shot: this.shotFor(id, sub) }, this.movesAllowed ? 'move' : 'cut');
    this.bump();
  }

  /** Reduced motion / pause: 300 ms dissolve (WAAPI, so the global transition kill-switch does not flatten it). */
  private dissolve(cut: () => void): void {
    const layers = [this.canvas, this.plates?.css3d.domElement, this.plates?.panels].filter(Boolean) as HTMLElement[];
    const out = layers.map(el => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: DISSOLVE_HALF_MS, fill: 'forwards' }));
    void Promise.all(out.map(a => a.finished)).then(() => {
      cut();
      this.invalidate();
      requestAnimationFrame(() => {
        for (const el of layers) el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: DISSOLVE_HALF_MS, fill: 'none' });
        for (const a of out) a.cancel();
      });
    });
  }

  /** Sets each switchable plate's `data-plate-mode` for the current layout, before the plates mount. */
  private applyPlateModes(): void {
    for (const plate of document.querySelectorAll<HTMLElement>('[data-plate-stacked]')) {
      plate.dataset.plateWide ??= plate.dataset.plateMode ?? '';
      plate.dataset.plateMode = this.stacked ? STACKED_MODE : plate.dataset.plateWide;
    }
  }

  /** Plates choose their layer at mount, so crossing the stacked breakpoint remounts them. */
  private remountPlates(): void {
    if (!this.plates) return;
    this.plates.unmount();
    this.plates = undefined;
    this.mountPlates();
  }

  private mountPlates(): void {
    this.applyPlateModes();
    const plates = new Plates({
      surface: name => this.world.surface(name),
      anchor: name => this.world.anchor(name),
      scrollTo: (chapter, sub) => this.scrollToChapter(chapter, sub),
      reduced: () => !this.movesAllowed,
      invalidate: () => this.invalidate()
    });
    if (!plates.mount()) return;
    this.plates = plates;
    plates.setSize(this.size.width, this.size.height);
  }

  private scrollToChapter(chapter: ChapterId, sub: number): void {
    const target = this.scroll?.positionOf(chapter, sub);
    const behavior: ScrollBehavior = this.movesAllowed ? 'smooth' : 'auto';
    if (target !== null && target !== undefined) {
      if (Math.abs(target - scrollY) > 4) scrollTo({ top: target, behavior });
      return;
    }
    chapterElement(chapter)?.scrollIntoView({ behavior });
  }

  private navigate(pick: StationPick): void {
    const figure = pick.key.startsWith('desk:') ? pick.key.slice(5) : '';
    if (pick.product || figure === 'alfa') window.dispatchEvent(new CustomEvent('desk:action', { detail: { action: 'play', id: figure } }));
    if (pick.action) {
      window.dispatchEvent(new CustomEvent('desk:action', { detail: { action: pick.action } }));
      return;
    }
    const chapter = pick.target.replace('#', '') as ChapterId;
    const sub = pick.sub ?? (pick.product ? ['skymek', 'parati', 'ventixs'].indexOf(pick.product) : 0);
    if (SECTION_CHAPTERS.includes(chapter)) this.scrollToChapter(chapter, Math.max(0, sub));
    else document.querySelector(pick.target)?.scrollIntoView({ behavior: this.movesAllowed ? 'smooth' : 'auto' });
    if (pick.product) window.dispatchEvent(new CustomEvent('product:focus', { detail: { id: pick.product, source: 'scene' } }));
    if (pick.experience) window.dispatchEvent(new CustomEvent('experience:focus', { detail: { id: pick.experience, source: 'scene' } }));
  }

  /** Imports the optional desk / FX entry points (they register through contracts.ts). */
  private async loadExtensions(): Promise<void> {
    const entries = import.meta.glob<{ default?: () => unknown }>(['./desk/index.ts', './fx/index.ts']);
    for (const [path, load] of Object.entries(entries)) {
      try {
        const module = await load();
        if (typeof module.default === 'function') await module.default();
      } catch (error) {
        console.error('[stage] extension failed', path, error);
      }
      await yieldToMain();
    }
  }

  private stationContext(): StationContext {
    return {
      tier: this.tier,
      renderer: this.renderer,
      camera: this.camera,
      scene: this.world.scene,
      pointer: this.pointerField,
      capture: Boolean(this.options.capture),
      motion: () => this.idleMotion(),
      fov: () => this.fov(),
      readingPose: id => this.world.shot(id, 0),
      invalidate: () => this.invalidate(),
      precompile: object => this.precompile(object)
    };
  }

  private async precompile(object?: Object3D): Promise<void> {
    /* A model can finish loading while the desk set is still loading, before the pipeline is attached. */
    if (!this.fx) this.attachFx();
    if (this.fx?.precompile) {
      await this.fx.precompile(this.renderer, this.world.scene, this.camera, object);
      return;
    }
    await (object ? this.renderer.compileAsync(object, this.camera, this.world.scene) : this.renderer.compileAsync(this.world.scene, this.camera));
  }

  /** Loads the registered desk set (or legacy hero module) and the FX pipeline. */
  private async syncRegistry(): Promise<void> {
    const provider = registeredShotProvider();
    if (provider !== this.provider) {
      if (this.provider) {
        this.provider.object3D.removeFromParent();
        this.provider.dispose();
      }
      this.provider = null;
      if (provider) {
        try {
          await provider.load(this.stationContext());
          this.world.scene.add(provider.object3D);
          this.provider = provider;
        } catch (error) {
          console.error('[stage] shot provider failed', error);
        }
      }
      this.world.setProvider(this.provider);
    }
    const legacy = this.provider ? null : (registeredStations().get('hero') ?? null);
    if (legacy !== this.legacy) {
      if (this.legacy) {
        this.legacy.object3D.removeFromParent();
        this.legacy.dispose();
      }
      this.legacy = null;
      if (legacy) {
        try {
          await legacy.load(this.stationContext());
          this.world.scene.add(legacy.object3D);
          this.legacy = legacy;
        } catch (error) {
          console.error('[stage] legacy station failed', error);
        }
      }
      this.world.setLegacy(this.legacy);
    }
    this.attachFx();
    if (this.ready) this.refreshShot();
    this.invalidate();
  }

  private attachFx(): void {
    const fx = registeredFx();
    if (fx === this.fx) return;
    this.fx = fx;
    if (!fx) return;
    fx.attachPointer?.(this.pointerField);
    fx.setTier(this.tier);
    fx.resize(this.size.width, this.size.height, this.renderer.getPixelRatio());
  }

  private refreshShot(): void {
    const id = this.director.chapter;
    if (id) this.director.refresh(this.shotFor(id, this.director.subIndex));
  }

  /** Requests a render; starts the loop if it is allowed to run. */
  invalidate(): void {
    if (!this.canRun() || this.running) return;
    this.running = true;
    this.lastFrame = -1;
    this.renderer.setAnimationLoop(now => this.frame(now));
  }

  chapterLabel(): string {
    const state = this.director.state();
    return state.subIndex ? `${state.id}:${state.subIndex}` : state.id;
  }

  dprValue(): number {
    return this.renderer.getPixelRatio();
  }

  p75FrameMs(): number {
    return this.sampler.p75();
  }

  refreshIntervalMs(): number {
    return this.refreshMs;
  }

  private bump(): void {
    this.lastInteraction = performance.now();
    this.invalidate();
  }

  private idleMotion(): boolean {
    return (
      !this.options.capture &&
      motionAllowed(this.motion) &&
      (this.tier === 'high' || this.tier === 'mid') &&
      performance.now() - this.lastInteraction < IDLE_WINDOW_MS
    );
  }

  private canRun(): boolean {
    return this.ready && !this.failed && this.tier !== 'none' && this.tier !== 'low' && document.visibilityState === 'visible';
  }

  private stop(): void {
    if (!this.running) return;
    this.running = false;
    this.renderer.setAnimationLoop(null);
    this.lastRendered = -1;
    this.sampler.reset();
    this.workSampler.reset();
  }

  private frame(now: number): void {
    if (!this.canRun()) {
      this.stop();
      return;
    }
    const dt = this.lastFrame < 0 ? 1 / 60 : Math.min((now - this.lastFrame) / 1000, 0.1);
    this.lastFrame = now;
    if (this.introUntil && now >= this.introUntil) this.finishIntro();
    const continuous = this.idleMotion() || !this.director.isSettled || this.introUntil > 0;
    this.frameCount++;
    const recentlyActive = now - this.lastInteraction < 300;
    if (continuous && this.director.isSettled && !recentlyActive && this.frameDivisor > 1 && this.frameCount % this.frameDivisor !== 0) return;

    const workStart = performance.now();
    this.renderer.info.reset();
    const pointerAllowed = this.finePointer && this.idleMotion() && this.director.isSettled;
    this.pointerField.enabled = pointerAllowed;
    this.pointerField.settle(dt);
    let settling = this.director.update(this.camera, dt, this.fov(), pointerAllowed ? this.pointer : { x: 0, y: 0 }, !this.movesAllowed);
    const state = this.director.state();
    if (this.world.update(dt, (now - this.clockStart) / 1000, state, this.idleMotion(), this.camera.position, this.renderer.getPixelRatio())) settling = true;
    this.plates?.update(this.camera, state, this.progress.get(state.id) ?? 0);
    const steady = this.director.breathe(this.camera, dt, this.idleMotion() && (this.stacked ? BREATHING_STACKED : BREATHING_CHAPTERS).has(state.id));
    settling ||= this.director.breathing;
    if (this.fx) {
      this.fx.render(this.renderer, this.world.scene, this.camera, dt);
      settling ||= this.fx.settling ?? false;
    } else {
      this.renderer.render(this.world.scene, this.camera);
    }
    steady();
    this.plates?.render(this.camera);
    const work = performance.now() - workStart;
    if (this.options.container.dataset.ready !== 'true') this.reveal();
    this.debug?.frame(now);

    if (continuous) this.adapt(now, work);
    else if (!settling) this.stop();
  }

  private finishIntro(): void {
    this.introUntil = 0;
    const next = this.pendingChapter ?? { id: 'hero' as ChapterId, sub: 0 };
    this.pendingChapter = null;
    this.requestChapter(next.id, next.sub);
  }

  private reveal(): void {
    const intro = this.introUntil === Number.POSITIVE_INFINITY;
    if (intro) this.introUntil = performance.now() + INTRO_SECONDS * 1000;
    window.dispatchEvent(new CustomEvent('stage:reveal', { detail: { intro, lamp: this.screenPoint('lamp') } }));
    this.options.container.dataset.ready = 'true';
    if (this.options.capture) {
      requestAnimationFrame(() => {
        window.__captureReady = true;
      });
    }
  }

  /** Where a desk anchor lands on screen (CSS px), clamped near the frame for anchors outside it. */
  private screenPoint(name: string): { x: number; y: number } | null {
    const anchor = this.world.anchor(name);
    if (!anchor) return null;
    const ndc = new Vector3().copy(anchor).project(this.camera);
    if (ndc.z > 1) return null;
    const clampNdc = (v: number) => Math.min(Math.max(v, -1.3), 1.3);
    return { x: ((clampNdc(ndc.x) + 1) / 2) * this.size.width, y: ((1 - clampNdc(ndc.y)) / 2) * this.size.height };
  }

  private adapt(now: number, work: number): void {
    if (this.lastRendered >= 0) {
      this.sampler.push(now - this.lastRendered);
      this.workSampler.push(work);
    }
    this.lastRendered = now;
    if (!this.sampler.ready || now - this.lastEvaluation < 1000) return;
    this.lastEvaluation = now;
    const target = this.refreshMs * (this.director.isSettled ? this.frameDivisor : 1);
    const decision = this.dpr.evaluate(this.sampler.p75(), this.workSampler.p75(), target, now);
    if (decision === 'keep') return;
    if (decision === 'fail') {
      this.degrade('low');
      return;
    }
    this.renderer.setPixelRatio(this.dpr.value);
    this.measure(true);
    this.sampler.reset();
    this.workSampler.reset();
    this.debug?.note(`dpr ${decision} → ${this.dpr.value}`);
  }

  /** Stops 3D and leaves the static fallback and the normal page flow (slow device or lost context). */
  degrade(reason: 'low' | 'context-lost'): void {
    if (reason === 'low') this.tier = 'low';
    this.fx?.setTier(this.tier);
    this.failed = reason === 'context-lost';
    this.stop();
    this.scroll?.dispose();
    this.scroll = undefined;
    this.plates?.unmount();
    this.plates = undefined;
    this.options.container.dataset.degraded = reason;
    this.debug?.note(`degraded: ${reason}`);
  }

  private measure(force = false): void {
    const rect = this.options.container.getBoundingClientRect();
    const width = Math.round(rect.width) || window.innerWidth;
    const height = Math.round(rect.height) || window.innerHeight;
    const changed = force || width !== this.size.width || Math.abs(height - this.size.height) > RESIZE_HEIGHT_THRESHOLD;
    if (!changed) return;
    this.size = { width, height };
    this.layout = layoutKind(width);
    const stacked = stackedLayout(this.size);
    const restack = stacked !== this.stacked;
    this.stacked = stacked;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    if (restack) this.remountPlates();
    this.plates?.setSize(width, height);
    this.fx?.resize(width, height, this.renderer.getPixelRatio());
    if (this.ready) {
      this.refreshShot();
      this.scroll?.refresh();
    }
    this.invalidate();
  }

  private applyTokens(): void {
    this.renderer.setClearColor(tokenColor('--color-sky-horizon', '#0a0e14'), 1);
    this.renderer.toneMappingExposure = tokenNumber('--scene-tone-exposure', 1);
    this.world?.applyTokens();
  }

  private listen(): void {
    const on = <K extends keyof WindowEventMap>(type: K, handler: (event: WindowEventMap[K]) => void) => {
      window.addEventListener(type, handler, { passive: true });
      this.cleanups.push(() => window.removeEventListener(type, handler));
    };
    on('resize', () => this.measure());
    on('orientationchange', () => this.measure(true));
    on('scroll', () => this.bump());
    on('keydown', () => this.bump());
    on('touchstart', () => this.bump());
    if (this.finePointer && !this.options.capture) {
      on('pointermove', event => {
        this.pointer = { x: (event.clientX / window.innerWidth) * 2 - 1, y: (event.clientY / window.innerHeight) * 2 - 1 };
        const rect = this.canvas.getBoundingClientRect();
        this.pointerField.move(event.clientX - rect.left, event.clientY - rect.top, rect.width, rect.height, this.camera, this.director.focus);
        this.bump();
      });
    }

    const onVisibility = () => (document.visibilityState === 'visible' ? this.bump() : this.stop());
    document.addEventListener('visibilitychange', onVisibility);
    this.cleanups.push(() => document.removeEventListener('visibilitychange', onVisibility));

    this.canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      this.degrade('context-lost');
    });

    this.cleanups.push(
      watchMotion(state => {
        this.motion = state;
        this.pointer = { x: 0, y: 0 };
        this.bump();
      })
    );

    if (!this.options.capture) {
      this.cleanups.push(
        setupInteraction({
          source: this.world,
          camera: this.camera,
          canvas: this.canvas,
          navigate: pick => this.navigate(pick),
          invalidate: () => this.bump()
        })
      );
    }

    const themeObserver = new MutationObserver(() => {
      this.applyTokens();
      this.invalidate();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    this.cleanups.push(() => themeObserver.disconnect());
  }

  dispose(): void {
    this.stop();
    for (const cleanup of this.cleanups) cleanup();
    this.scroll?.dispose();
    this.plates?.dispose();
    this.provider?.dispose();
    this.legacy?.dispose();
    this.fx?.dispose();
    this.world?.dispose();
    this.debug?.dispose();
    this.renderer.dispose();
    this.canvas.remove();
  }
}
