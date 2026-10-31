/**
 * Extension contracts of the 3D stage. Desk (`src/three/desk/**`), FX (`src/three/fx/**`) and
 * audio (`src/audio/**`) plug in through these types and registries without touching the engine.
 *
 * Loading: the Stage imports `src/three/desk/index.ts` and `src/three/fx/index.ts` (if they exist)
 * right after the renderer is created. Those entry files register themselves on import
 * (`registerStation(...)`, `registerFx(...)`) or export a default `install()` the Stage awaits.
 * This file only holds types and tiny registries: importing it never pulls three into a bundle.
 *
 * Coordinates: 1 unit = 1 metre, +Y up. Alfa sits at (0, 0.6, -14); the default station targets
 * live in `scenes/stations.ts`.
 */
import type { Object3D, PerspectiveCamera, Quaternion, Scene, Vector2, Vector3, WebGLRenderer } from 'three';
import type { StationId } from './sections';
import type { Tier } from './tier';

export type { StationId } from './sections';
export type { Tier } from './tier';


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
  /** False under reduced motion / pause: consumers should not animate from the pointer then. */
  readonly enabled: boolean;
  /** Called on every pointer move (already rAF-throttled). Returns an unsubscribe function. */
  onPointer(listener: (sample: Readonly<PointerSample>) => void): () => void;
}


/** Where a text plate (CSS3DObject) sits. `scale` = world units per CSS pixel. */
export interface PlateAnchor {
  position: Vector3;
  quaternion: Quaternion;
  /** Omit to get 1 CSS px = 1 screen px at the station's reading distance. */
  scale?: number;
}

export interface StationCameraPose {
  position: Vector3;
  target: Vector3;
  /** Vertical FOV in degrees (default 30). */
  fov?: number;
  /** Camera roll in radians around the view axis (default 0). */
  roll?: number;
}

/** Services the Stage gives a station module. */
export interface StationContext {
  readonly tier: Tier;
  readonly renderer: WebGLRenderer;
  readonly camera: PerspectiveCamera;
  /** The world scene the module's `object3D` is added to. */
  readonly scene: Scene;
  readonly pointer: PointerField;
  readonly capture: boolean;
  /** True when idle motion is allowed (tier, reduced motion, pause, idle window). */
  motion(): boolean;
  /** Default reading pose of any station for the current viewport (to start/end custom flights). */
  readingPose(id: StationId): StationCameraPose;
  /** Requests a frame (the loop sleeps when nothing changes). */
  invalidate(): void;
}

/**
 * A station's content. `progress` is local: `s - stationIndex`, clamped to [-1, 1] —
 * negative while the camera arrives, 0 at the reading point, positive while it leaves.
 */
export interface StationModule {
  readonly object3D: Object3D;
  load(context: StationContext): Promise<void>;
  enter(): void;
  leave(): void;
  /** Return true while something is still settling so on-demand rendering keeps going. */
  update(dt: number, time: number, progress: number): boolean | void;
  /** Anchor for one of this station's plates (`data-plate-id`), or null for the default placement. */
  getPlateAnchor?(plateId: string): PlateAnchor | null;
  /**
   * Camera pose for a local progress, or null to use the default framing/blend. A module that
   * answers for progress in (0, 1] owns the flight to the next station and must end at the next
   * station's `readingPose`; answering for [-1, 0) owns the arrival.
   */
  getCameraPose?(progress: number): StationCameraPose | null;
  dispose(): void;
}


/** Post-processing pipeline. When none is registered the Stage renders directly. */
export interface FxPipeline {
  render(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, dt: number): void;
  /** World point to keep in focus (the active plate or celestial body), or null. */
  setFocus(point: Vector3 | null): void;
  resize(width: number, height: number, pixelRatio: number): void;
  setTier(tier: Tier): void;
  /** Optional: true while the pipeline still animates (fluid, focus transition); keeps the loop awake. */
  readonly settling?: boolean;
  /** Optional: receives the shared pointer field once. */
  attachPointer?(pointer: PointerField): void;
  dispose(): void;
}


export interface StageEventMap {
  /** The camera reached a station (nearest station changed). */
  'station:enter': CustomEvent<{ id: StationId }>;
  /** Local progress of the nearest station (-1..1), at most once per rendered frame. */
  'station:progress': CustomEvent<{ id: StationId; progress: number }>;
  /** Label of the scene object under the pointer, or null. */
  'scene:hover': CustomEvent<{ label: string | null }>;
}


type Listener = () => void;
const stations = new Map<StationId, StationModule>();
let fx: FxPipeline | null = null;
const listeners = new Set<Listener>();

function notify(): void {
  for (const listener of listeners) listener();
}

/** Registers (or replaces) the module of a station. Returns an unregister function. */
export function registerStation(id: StationId, module: StationModule): () => void {
  stations.set(id, module);
  notify();
  return () => {
    if (stations.get(id) === module) stations.delete(id);
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

export function registeredStations(): ReadonlyMap<StationId, StationModule> {
  return stations;
}

export function registeredFx(): FxPipeline | null {
  return fx;
}

/** Stage-side: called whenever a station or the FX pipeline is (un)registered. */
export function onRegistryChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
