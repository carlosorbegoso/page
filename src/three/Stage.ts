import {
  ACESFilmicToneMapping,
  PerspectiveCamera,
  PMREMGenerator,
  SRGBColorSpace,
  WebGLRenderer,
  type Material,
  type Mesh,
  type Texture
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { acquire, bindRenderer, release } from './assets';
import { DebugOverlay } from './debug';
import { yieldToMain } from './idle';
import { setupInteraction } from './interaction';
import { motionAllowed, readMotion, watchMotion, type MotionState } from './motion';
import { damp, smoothstep, type Pointer, type SceneContext } from './scenes/common';
import {
  onRegistryChange,
  registeredFx,
  registeredStations,
  type FxPipeline,
  type StationContext,
  type StationModule
} from './contracts';
import { Plates } from './plates';
import { StagePointer } from './pointer';
import { isProductId, WorldScene, type WorldHit } from './scenes/WorldScene';
import { STATIONS, stationElement, stationIndex, type StationId, type StationTracker } from './sections';
import { calibrateRefreshInterval, dprPolicy, DprController, FrameSampler, type Tier, type TierResult } from './tier';
import { tokenColor, tokenNumber } from './tokens';

export interface CaptureOptions {
  station: StationId;
  progress: number;
}

export interface StageOptions {
  container: HTMLElement;
  tier: TierResult;
  tracker: StationTracker;
  capture?: CaptureOptions;
  debug?: boolean;
}

const RESIZE_HEIGHT_THRESHOLD = 150;
const ENV_KEY = 'env:room';
const IDLE_WINDOW_MS = 8000;
const FADE_MS = 260;

declare global {
  interface Window {
    __captureReady?: boolean;
    __stage?: Stage;
  }
}

/**
 * The single WebGL renderer and canvas (PLAN §3.2 + continuous world). Owns the loop, resize,
 * adaptive resolution, motion preferences, interaction and the fallback hand-off.
 */
export class Stage {
  readonly camera = new PerspectiveCamera(30, 1, 0.05, 60);
  private renderer!: WebGLRenderer;
  private canvas!: HTMLCanvasElement;
  private world!: WorldScene;
  private plates: Plates | undefined;
  private fx: FxPipeline | null = null;
  private readonly loadedModules = new Map<StationId, StationModule>();
  private readonly pointerField = new StagePointer();
  private nearestStation: StationId | null = null;
  private lastPublishedProgress = Number.NaN;
  private ready = false;
  private tier: Tier;
  private running = false;
  private failed = false;
  private motion: MotionState = readMotion();
  private pointer: Pointer = { x: 0, y: 0 };
  private readonly finePointer = matchMedia('(pointer: fine)').matches;
  private size = { width: 0, height: 0 };
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
  private station = 0;
  private debug: DebugOverlay | undefined;
  private readonly cleanups: Array<() => void> = [];
  private readonly layoutListeners = new Set<() => void>();
  private baseExposure = 1;
  private touchStartX: number | null = null;
  private touchYawTarget = 0;
  private touchYaw = 0;
  private readonly motionListeners = new Set<(state: MotionState) => void>();
  private fadeTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(private readonly options: StageOptions) {
    this.tier = options.tier.tier;
  }

  get tierName(): Tier {
    return this.tier;
  }

  get motionState(): MotionState {
    return this.motion;
  }

  /** True when scroll may drive the camera continuously (no reduced-motion, no pause). */
  get scrubAllowed(): boolean {
    return motionAllowed(this.motion) && !this.options.capture;
  }

  /** Boots the renderer and the world in small chunks so no task exceeds ~50 ms. */
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
    this.applyTokens();
    bindRenderer(this.renderer);
    container.appendChild(this.canvas);
    this.measure(true);
    await yieldToMain();

    await this.loadExtensions();
    this.world = new WorldScene(this.context());
    await this.world.load();
    await yieldToMain();
    await this.syncModules();
    this.cleanups.push(onRegistryChange(() => void this.syncModules()));
    this.attachFx();
    this.station = capture ? Math.max(0, stationIndex(capture.station) + capture.progress - 1) : this.initialStation();
    this.world.setStation(this.station);
    this.world.resize(this.size.width, this.size.height);
    this.world.update(0, 0);
    await this.renderer.compileAsync(this.world.scene, this.camera);
    await yieldToMain();
    this.initTextures();
    if (!capture) this.mountPlates();
    this.ready = true;

    this.listen();
    if (this.options.debug) this.debug = new DebugOverlay(this.renderer, this);
    if (capture) this.options.tracker.force(capture.station);
    this.cleanups.push(this.options.tracker.subscribe(active => this.onStation(active)));
    this.invalidate();
  }

  private mountPlates(): void {
    const plates = new Plates({
      camera: this.camera,
      readingPose: id => this.world.readingPose(id),
      stationValue: () => this.station,
      instant: () => !this.scrubAllowed,
      motion: () => this.context().motion(),
      time: () => (performance.now() - this.clockStart) / 1000,
      pointer: () => (this.finePointer && this.idleMotion() ? this.pointer : { x: 0, y: 0 }),
      anchorFor: (station, plateId) => this.world.plateAnchor(station, plateId),
      bodyFor: plateId => this.world.plateBody(plateId),
      onActivePlate: (station, plate) => this.onActivePlate(station, plate),
      onLayoutChange: () => {
        for (const listener of this.layoutListeners) listener();
      },
      invalidate: () => this.invalidate()
    });
    if (!plates.mount()) return;
    this.plates = plates;
    plates.setSize(this.size.width, this.size.height);
  }

  private onActivePlate(station: StationId, plate: HTMLElement): void {
    const id = plate.dataset.plateId ?? '';
    if (station === 'products') {
      const product = id.startsWith('product-') ? id.slice('product-'.length) : null;
      const value = isProductId(product) ? product : null;
      this.world.focusProduct(value);
      window.dispatchEvent(new CustomEvent('product:focus', { detail: { id: value, source: 'scene' } }));
    }
    if (station === 'experience' && id.startsWith('exp-')) {
      const experience = id.slice('exp-'.length);
      this.world.focusExperience(experience);
      window.dispatchEvent(new CustomEvent('experience:focus', { detail: { id: experience, source: 'scene' } }));
    }
    this.invalidate();
  }

  /** Scene navigation: scroll to the hit's plate (or section) and focus it, without a second scroll. */
  private navigate(hit: WorldHit): void {
    const behavior: ScrollBehavior = this.scrubAllowed ? 'smooth' : 'auto';
    const plateId = hit.product ? `product-${hit.product}` : hit.experience ? `exp-${hit.experience}` : null;
    const plateTop = plateId ? this.plates?.scrollTargetFor(plateId) : null;
    if (plateTop !== null && plateTop !== undefined) {
      if (Math.abs(plateTop - scrollY) > 4) scrollTo({ top: plateTop, behavior });
    } else {
      const station = hit.target.replace('#', '') as StationId;
      const section = stationElement(station) ?? document.querySelector(hit.target);
      section?.scrollIntoView({ behavior });
    }
    if (hit.product) {
      this.world.focusProduct(hit.product);
      window.dispatchEvent(new CustomEvent('product:focus', { detail: { id: hit.product, source: 'scene' } }));
    }
    if (hit.experience) {
      this.world.focusExperience(hit.experience);
      window.dispatchEvent(new CustomEvent('experience:focus', { detail: { id: hit.experience, source: 'scene' } }));
    }
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
      motion: () => this.context().motion(),
      readingPose: id => {
        const pose = this.world.readingPose(id);
        return { position: pose.position, target: pose.target, fov: pose.fov, roll: pose.roll };
      },
      invalidate: () => this.invalidate()
    };
  }

  /** Loads newly registered station modules, removes unregistered ones. */
  private async syncModules(): Promise<void> {
    const registered = registeredStations();
    for (const [id, module] of this.loadedModules) {
      if (registered.get(id) === module) continue;
      module.object3D.removeFromParent();
      module.dispose();
      this.loadedModules.delete(id);
    }
    for (const [id, module] of registered) {
      if (this.loadedModules.get(id) === module) continue;
      try {
        await module.load(this.stationContext());
        this.world.scene.add(module.object3D);
        this.loadedModules.set(id, module);
      } catch (error) {
        console.error('[stage] station module failed', id, error);
      }
    }
    this.world.setModules(this.loadedModules);
    this.attachFx();
    this.invalidate();
  }

  private attachFx(): void {
    const fx = registeredFx();
    if (fx === this.fx) return;
    this.fx = fx;
    if (!fx) {
      this.world.setHdrBoost(1);
      return;
    }
    this.world.setHdrBoost(1.6);
    fx.attachPointer?.(this.pointerField);
    fx.setTier(this.tier);
    fx.resize(this.size.width, this.size.height, this.renderer.getPixelRatio());
  }

  /** Publishes station:enter / station:progress for audio and other listeners. */
  private publishStation(): void {
    const nearest = STATIONS[Math.max(0, Math.min(STATIONS.length - 1, Math.round(this.station)))]!;
    const progress = Math.max(-1, Math.min(1, this.station - stationIndex(nearest)));
    if (nearest !== this.nearestStation) {
      const previous = this.nearestStation ? this.loadedModules.get(this.nearestStation) : undefined;
      previous?.leave();
      this.loadedModules.get(nearest)?.enter();
      this.nearestStation = nearest;
      window.dispatchEvent(new CustomEvent('station:enter', { detail: { id: nearest } }));
    }
    if (progress !== this.lastPublishedProgress) {
      this.lastPublishedProgress = progress;
      window.dispatchEvent(new CustomEvent('station:progress', { detail: { id: nearest, progress } }));
    }
  }

  /** The desk is lit for ACES at 1.1; the exposure eases to the space value on the way out. */
  private roomExposure(): number {
    if (!this.loadedModules.has('hero')) return 1;
    return 1.1 - 0.1 * smoothstep(0.5, 0.85, this.station);
  }

  private initialStation(): number {
    const active = this.options.tracker.active;
    return active ? stationIndex(active) : 0;
  }

  /** Continuous station coordinate from the ScrollTrigger bridge. */
  setStation(value: number): void {
    if (this.options.capture) return;
    this.station = value;
    this.world?.setStation(value);
    this.bump();
  }

  /** Requests a render; starts the loop if it is allowed to run. */
  invalidate(): void {
    if (!this.canRun() || this.running) return;
    this.running = true;
    this.lastFrame = -1;
    this.renderer.setAnimationLoop(now => this.frame(now));
  }

  /** Called when plate heights change the page layout (debounce on the listener side). */
  onLayoutChange(listener: () => void): () => void {
    this.layoutListeners.add(listener);
    return () => this.layoutListeners.delete(listener);
  }

  onMotionChange(listener: (state: MotionState) => void): () => void {
    this.motionListeners.add(listener);
    return () => this.motionListeners.delete(listener);
  }

  stationValue(): number {
    return this.station;
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

  private context(): SceneContext {
    return {
      tier: this.tier,
      camera: this.camera,
      capture: Boolean(this.options.capture),
      motion: () => this.idleMotion() && performance.now() - this.lastInteraction < IDLE_WINDOW_MS,
      pointer: () => (this.finePointer && this.idleMotion() ? this.pointer : { x: 0, y: 0 }),
      environment: () => this.environment(),
      releaseEnvironment: () => release(ENV_KEY)
    };
  }

  private idleMotion(): boolean {
    return !this.options.capture && motionAllowed(this.motion) && (this.tier === 'high' || this.tier === 'mid');
  }

  private environment(): Promise<Texture | null> {
    if (this.tier !== 'high' && !this.options.capture) return Promise.resolve(null);
    return acquire(
      ENV_KEY,
      async () => {
        const pmrem = new PMREMGenerator(this.renderer);
        const room = new RoomEnvironment();
        const texture = pmrem.fromScene(room, 0.04).texture;
        room.dispose();
        pmrem.dispose();
        return texture;
      },
      texture => texture.dispose()
    );
  }

  private initTextures(): void {
    this.world.scene.traverse(object => {
      const mesh = object as Mesh;
      if (!mesh.isMesh) return;
      const materials: Material[] = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of materials) {
        for (const value of Object.values(material)) {
          if (value && typeof value === 'object' && (value as Texture).isTexture) this.renderer.initTexture(value as Texture);
        }
      }
    });
  }

  /** Without scrub (reduced motion or paused) the camera jumps between stations behind a fade. */
  private onStation(active: StationId | null): void {
    if (!active || this.scrubAllowed || this.options.capture) return;
    const target = stationIndex(active);
    if (target === this.station) return;
    const { container } = this.options;
    container.dataset.ready = 'false';
    clearTimeout(this.fadeTimer);
    this.fadeTimer = setTimeout(() => {
      this.station = target;
      this.world.setStation(target);
      this.invalidate();
    }, this.motion.reduced ? 0 : FADE_MS);
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
    const recent = now - this.lastInteraction;
    const continuous = this.idleMotion() && recent < IDLE_WINDOW_MS;
    const scrolling = recent < 300;
    this.frameCount++;
    if (continuous && !scrolling && this.frameDivisor > 1 && this.frameCount % this.frameDivisor !== 0) return;

    const workStart = performance.now();
    this.renderer.info.reset();
    this.pointerField.enabled = this.idleMotion();
    this.pointerField.settle(dt);
    this.renderer.toneMappingExposure = this.baseExposure * this.roomExposure();
    this.touchYaw = this.scrubAllowed ? damp(this.touchYaw, this.touchYawTarget, 8, dt) : 0;
    this.world.setTouchYaw(this.touchYaw);
    let settling = this.world.update(dt, (now - this.clockStart) / 1000);
    settling ||= Math.abs(this.touchYaw - this.touchYawTarget) > 0.001;
    if (this.plates) settling = this.plates.update(dt) || settling;
    this.publishStation();
    if (this.fx) {
      this.fx.setFocus(this.world.focusPoint());
      this.fx.render(this.renderer, this.world.scene, this.camera, dt);
      settling ||= this.fx.settling ?? false;
    } else {
      this.renderer.render(this.world.scene, this.camera);
    }
    this.plates?.render(this.camera);
    const work = performance.now() - workStart;
    if (this.options.container.dataset.ready !== 'true') this.reveal();
    this.debug?.frame(now);

    if (continuous) this.adapt(now, work, scrolling);
    else if (!settling) this.stop();
  }

  private reveal(): void {
    this.options.container.dataset.ready = 'true';
    if (this.options.capture) {
      requestAnimationFrame(() => {
        window.__captureReady = true;
      });
    }
  }

  private adapt(now: number, work: number, scrolling: boolean): void {
    if (this.lastRendered >= 0) {
      this.sampler.push(now - this.lastRendered);
      this.workSampler.push(work);
    }
    this.lastRendered = now;
    if (!this.sampler.ready || now - this.lastEvaluation < 1000) return;
    this.lastEvaluation = now;
    const target = this.refreshMs * (scrolling ? 1 : this.frameDivisor);
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

  /** Stops 3D and leaves the static fallback visible (slow device or lost context). */
  degrade(reason: 'low' | 'context-lost'): void {
    if (reason === 'low') this.tier = 'low';
    this.fx?.setTier(this.tier);
    this.failed = reason === 'context-lost';
    this.stop();
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
    this.renderer.setSize(width, height, false);
    this.world?.resize(width, height);
    this.world?.setPixelRatio(this.renderer.getPixelRatio());
    this.plates?.setSize(width, height);
    this.fx?.resize(width, height, this.renderer.getPixelRatio());
    this.invalidate();
  }

  private applyTokens(): void {
    this.renderer.setClearColor(tokenColor('--color-scene-bg', '#0a0e14'), 1);
    this.baseExposure = tokenNumber('--scene-tone-exposure', 1);
    this.renderer.toneMappingExposure = this.baseExposure;
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
    on('touchstart', event => {
      this.touchStartX = event.touches[0]?.clientX ?? null;
      this.bump();
    });
    on('touchmove', event => {
      const x = event.touches[0]?.clientX;
      if (this.touchStartX === null || x === undefined || this.station > 0.25) return;
      this.touchYawTarget = Math.max(-1, Math.min(1, (x - this.touchStartX) / (window.innerWidth * 0.5)));
      this.bump();
    });
    on('touchend', () => {
      this.touchStartX = null;
      this.touchYawTarget = 0;
      this.bump();
    });
    if (this.finePointer && !this.options.capture) {
      on('pointermove', event => {
        this.pointer = { x: (event.clientX / window.innerWidth) * 2 - 1, y: (event.clientY / window.innerHeight) * 2 - 1 };
        const rect = this.canvas.getBoundingClientRect();
        this.pointerField.move(event.clientX - rect.left, event.clientY - rect.top, rect.width, rect.height, this.camera, this.world.focusPoint());
        if (this.idleMotion()) this.bump();
      });
    }
    on('product:focus' as keyof WindowEventMap, event => {
      const detail = (event as CustomEvent<{ id?: unknown; source?: string }>).detail;
      if (detail?.source === 'scene') return;
      this.world.focusProduct(isProductId(detail?.id) ? detail.id : null);
      this.bump();
    });
    on('experience:focus' as keyof WindowEventMap, event => {
      const detail = (event as CustomEvent<{ id?: unknown; source?: string }>).detail;
      if (detail?.source === 'scene') return;
      this.world.focusExperience(typeof detail?.id === 'string' ? detail.id : null);
      this.bump();
    });

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
        for (const listener of this.motionListeners) listener(state);
        if (!this.scrubAllowed) this.onStation(this.options.tracker.active);
        this.bump();
      })
    );

    if (!this.options.capture) {
      this.cleanups.push(
        setupInteraction({
          world: this.world,
          camera: this.camera,
          canvas: this.canvas,
          navigate: hit => this.navigate(hit),
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
    this.plates?.dispose();
    for (const module of this.loadedModules.values()) module.dispose();
    this.fx?.dispose();
    this.world?.dispose();
    this.debug?.dispose();
    this.renderer.dispose();
    this.canvas.remove();
  }
}
