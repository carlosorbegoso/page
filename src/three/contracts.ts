/**
 * Extension contracts of the 3D stage — direction "Una noche en el escritorio" (PLAN, final section).
 *
 * One environment (the desk at night), split into chapters. The camera director holds one almost
 * still shot per chapter (or per sub-shot) and only moves between shots, under hard anti-motion-
 * sickness limits. The desk (`src/three/desk/**`) provides the shots, surfaces and anchors through
 * a `ShotProvider`; FX (`src/three/fx/**`) renders through an `FxPipeline`; audio, motion and UI
 * listen to the `chapter:*` window events.
 *
 * Loading: the Stage imports `src/three/desk/index.ts` and `src/three/fx/index.ts` (if they exist)
 * right after the renderer is created; they register on import or export a default `install()`.
 * This file only holds types and tiny registries: importing it never pulls three into a bundle.
 *
 * Coordinates: 1 unit = 1 metre, +Y up (camera roll is always 0).
 */
import type { Object3D, PerspectiveCamera, Quaternion, Scene, Vector2, Vector3, WebGLRenderer } from 'three';
import type { Tier } from './tier';

export type { Tier } from './tier';

/** Chapters in story order (must match the DOM order of the sections). `intro` (power-on) has no section; the rest map to `section[data-station="<id>"]`. */
export const CHAPTERS = ['intro', 'hero', 'about', 'experience', 'company', 'products', 'contact', 'outro'] as const;
export type ChapterId = (typeof CHAPTERS)[number];

/** @deprecated Legacy name kept while the desk migrates to `ShotProvider`. */
export type StationId = ChapterId;

export function isChapterId(value: unknown): value is ChapterId {
  return typeof value === 'string' && (CHAPTERS as readonly string[]).includes(value);
}

/** A fixed camera shot. FOV is decided by the director per device (30 desktop / 40 mobile). */
export interface Shot {
  position: Vector3;
  target: Vector3;
  /** Ignored by the director unless it equals the device FOV; kept for previews. */
  fov?: number;
}

/** Where a CSS3D text surface sits (front-facing, 1:1). `scale` = world units per CSS pixel. */
export interface PlateAnchor {
  position: Vector3;
  quaternion: Quaternion;
  /** Omit to get 1 CSS px = 1 screen px at the chapter's shot distance. */
  scale?: number;
  /** Physical surface size in metres; with `scale` the engine sets `--surface-width/height` (CSS px) on the plate. */
  size?: { width: number; height: number };
}

export type SurfaceName = 'monitor' | 'phone';

/**
 * Text plates declare how they are shown in 3D mode (`html.is-3d`):
 * - `data-plate-mode="surface-monitor" | "surface-phone"` — CSS3D on that desk surface, frontal, 1:1,
 *   never animated by the engine.
 * - `data-plate-mode="anchored"` + `data-plate-anchor="<anchor name>"` — HTML panel in a fixed 2D
 *   layer, translated to the screen projection of `getAnchor(name)`; it never rotates or scales.
 * Optional `data-plate-side="left|right"` places an anchored panel beside its anchor point.
 * `data-plate-stacked` makes a surface plate an anchored panel on upright phones (`stackedLayout`),
 * docked under the room; it then needs a `data-plate-anchor` too.
 * Plates without a mode stay in the normal page flow.
 */
export type PlateMode = 'surface-monitor' | 'surface-phone' | 'anchored';

/** Live chapter state handed to the shot provider every frame. */
export interface ChapterState {
  id: ChapterId;
  /** Sub-shot inside the chapter (products: 0 SkyMek, 1 Parati, 2 Ventixs; experience: 0 the shelf, then the folders in story order). */
  subIndex: number;
  /** Previous chapter while a transition runs, else null. */
  from: ChapterId | null;
  /** 0 → 1 over the camera transition; 1 once settled. */
  transition: number;
  settled: boolean;
}

/** A navigable object (raycast proxy). */
export interface StationPick {
  readonly object3D: Object3D;
  readonly key: string;
  readonly label: string | { es: string; en: string };
  /** CSS selector of the section to navigate to. */
  readonly target: string;
  readonly product?: 'skymek' | 'parati' | 'ventixs';
  readonly experience?: string;
  /** Sub-shot to land on inside `target` (defaults to the product index, else 0). */
  readonly sub?: number;
  /** A toy instead of a destination: clicking plays with the object (`desk:action`) and stays put. */
  readonly action?: 'lamp';
}

export interface PointerSample {
  /** Normalised device coordinates over the canvas (-1..1, +Y up). */
  ndc: Vector2;
  /** CSS pixels from the canvas top-left. */
  screen: Vector2;
  /** CSS pixels per second, smoothed. */
  velocity: Vector2;
  /** Pointer ray hit on the plane through the current camera target, facing the camera. */
  world: Vector3 | null;
}

/** Live pointer state shared by scenes and FX. Read it every frame; do not mutate it. */
export interface PointerField extends Readonly<PointerSample> {
  /** True for `pointer: fine` devices while the pointer is over the page. */
  readonly active: boolean;
  /** False under reduced motion / pause / camera transitions: do not animate from the pointer then. */
  readonly enabled: boolean;
  onPointer(listener: (sample: Readonly<PointerSample>) => void): () => void;
}

/** Services the Stage gives a set / module. */
export interface StationContext {
  readonly tier: Tier;
  readonly renderer: WebGLRenderer;
  readonly camera: PerspectiveCamera;
  readonly scene: Scene;
  readonly pointer: PointerField;
  readonly capture: boolean;
  /** True when idle motion is allowed (tier, reduced motion, pause, idle window). */
  motion(): boolean;
  /** Current device FOV (30 desktop, 40 below 1024 px). */
  fov?(): number;
  /** @deprecated Legacy station framing; returns the chapter shot. */
  readingPose(id: ChapterId): StationCameraPose;
  invalidate(): void;
  /**
   * Compiles the shaders of an object that is not in the scene yet, with the scene's lights and the
   * render state the next frame will use, so adding it does not stall that frame.
   */
  precompile?(object: Object3D): Promise<void>;
}

/**
 * The desk set: geometry, lights, shots, surfaces and anchors for every chapter.
 * Register with `registerShotProvider(provider)`.
 */
export interface ShotProvider {
  readonly object3D: Object3D;
  load(context: StationContext): Promise<void>;
  /** Called every rendered frame with the director's state. Return true while still settling. */
  update(dt: number, time: number, state: ChapterState): boolean | void;
  /** Fixed shot of a chapter (and sub-shot). Null → the director keeps the previous shot. */
  getShot(chapter: ChapterId, subIndex?: number): Shot | null;
  /** Number of sub-shots of a chapter (default 1). */
  subShotCount?(chapter: ChapterId): number;
  /** Front-facing CSS3D surface (monitor, phone). */
  getSurface?(name: SurfaceName): PlateAnchor | null;
  /** World point a 2D panel is pinned to (`data-plate-anchor`). */
  getAnchor?(name: string): Vector3 | null;
  /** World point to keep in focus for a chapter (rack focus); default: the shot target. */
  getFocus?(chapter: ChapterId, subIndex: number): Vector3 | null;
  readonly picks?: readonly StationPick[];
  resolvePick?(object: Object3D): StationPick | null;
  setHover?(object: Object3D | null): void;
  dispose(): void;
}

/** Post-processing pipeline. When none is registered the Stage renders directly. */
export interface FxPipeline {
  render(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, dt: number): void;
  /**
   * Compiles every program `render` will use (scene into the pipeline's own target, and its passes).
   * `object` compiles only that object, lit by `scene`, for meshes that are added later.
   */
  precompile?(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, object?: Object3D): Promise<void>;
  /** World point to keep in focus (rack focus ≤ 600 ms), or null. */
  setFocus(point: Vector3 | null): void;
  resize(width: number, height: number, pixelRatio: number): void;
  setTier(tier: Tier): void;
  /** Optional: true while the pipeline still animates; keeps the loop awake. */
  readonly settling?: boolean;
  attachPointer?(pointer: PointerField): void;
  dispose(): void;
}

/** Window events. Audio, motion and UI listen to these. */
export interface StageEventMap {
  /** A chapter (or sub-shot) was requested: the camera starts moving towards its shot. */
  'chapter:enter': CustomEvent<{ id: ChapterId; subIndex: number; duration: number }>;
  /** The camera has settled on the chapter's shot: text may enter now. */
  'chapter:settled': CustomEvent<{ id: ChapterId; subIndex: number }>;
  /** Scroll progress inside the chapter (0..1), at most once per frame. */
  'chapter:progress': CustomEvent<{ id: ChapterId; progress: number }>;
  /** Label of the scene object under the pointer, or null. */
  'scene:hover': CustomEvent<{ label: string | null }>;
  /** Overall story progress (0 at the first sub-shot, 1 at the last) and the active sub-shot index. */
  'story:progress': CustomEvent<{ value: number; index: number; total: number }>;
  /** Shot navigation is live (3D mode): keyboard, settle and tour are available. */
  'story:ready': CustomEvent<{ total: number }>;
  'story:disposed': CustomEvent<undefined>;
  /** Request: go to a sub-shot, one step forward / back, or an edge of the story. */
  'story:goto': CustomEvent<{ chapter: ChapterId; sub?: number } | { step: 1 | -1 } | { edge: 'start' | 'end' }>;
  /** Request: start, stop or toggle the auto tour. */
  'story:tour': CustomEvent<{ action?: 'toggle' | 'start' | 'stop' }>;
  'story:tour-state': CustomEvent<{ state: 'playing' | 'paused' | 'finished' }>;
}

/** @deprecated Legacy camera pose (desk before the migration). */
export interface StationCameraPose {
  position: Vector3;
  target: Vector3;
  fov?: number;
  roll?: number;
}

/** @deprecated Legacy per-station module. Still honoured for picks, surfaces and `update`. */
export interface StationModule {
  readonly object3D: Object3D;
  load(context: StationContext): Promise<void>;
  enter(): void;
  leave(): void;
  update(dt: number, time: number, progress: number): boolean | void;
  getPlateAnchor?(plateId: string): PlateAnchor | null;
  getCameraPose?(progress: number): StationCameraPose | null;
  readonly picks?: readonly StationPick[];
  resolvePick?(object: Object3D): StationPick | null;
  setHover?(object: Object3D | null): void;
  dispose(): void;
}

type Listener = () => void;
let shotProvider: ShotProvider | null = null;
let fx: FxPipeline | null = null;
const stations = new Map<ChapterId, StationModule>();
const listeners = new Set<Listener>();

function notify(): void {
  for (const listener of listeners) listener();
}

/** Registers the desk set (one at a time). Returns an unregister function. */
export function registerShotProvider(provider: ShotProvider): () => void {
  shotProvider = provider;
  notify();
  return () => {
    if (shotProvider === provider) shotProvider = null;
    notify();
  };
}

/** Registers the post-processing pipeline (one at a time). Returns an unregister function. */
export function registerFx(pipeline: FxPipeline): () => void {
  fx = pipeline;
  notify();
  return () => {
    if (fx === pipeline) fx = null;
    notify();
  };
}

/** @deprecated Use `registerShotProvider`. */
export function registerStation(id: ChapterId, module: StationModule): () => void {
  stations.set(id, module);
  notify();
  return () => {
    if (stations.get(id) === module) stations.delete(id);
    notify();
  };
}

export function registeredShotProvider(): ShotProvider | null {
  return shotProvider;
}

export function registeredFx(): FxPipeline | null {
  return fx;
}

export function registeredStations(): ReadonlyMap<ChapterId, StationModule> {
  return stations;
}

/** Stage-side: called whenever the shot provider, FX or a legacy module is (un)registered. */
export function onRegistryChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
