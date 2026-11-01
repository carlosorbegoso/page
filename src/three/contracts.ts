import type { Object3D, PerspectiveCamera, Quaternion, Scene, Vector2, Vector3, WebGLRenderer } from 'three';
import type { Tier } from './tier';

export type { Tier } from './tier';

export const CHAPTERS = ['intro', 'hero', 'about', 'experience', 'company', 'products', 'contact', 'outro'] as const;
export type ChapterId = (typeof CHAPTERS)[number];

export type StationId = ChapterId;

export function isChapterId(value: unknown): value is ChapterId {
  return typeof value === 'string' && (CHAPTERS as readonly string[]).includes(value);
}

export interface Shot {
  position: Vector3;
  target: Vector3;
  fov?: number;
}

export interface PlateAnchor {
  position: Vector3;
  quaternion: Quaternion;
  scale?: number;
  size?: { width: number; height: number };
}

export type SurfaceName = 'monitor' | 'phone';


export type PlateMode = 'surface-monitor' | 'surface-phone' | 'anchored';

export interface ChapterState {
  id: ChapterId;
  subIndex: number;
  from: ChapterId | null;
  transition: number;
  settled: boolean;
}

export interface StationPick {
  readonly object3D: Object3D;
  readonly key: string;
  readonly label: string | { es: string; en: string };
  readonly target: string;
  readonly product?: 'skymek' | 'parati' | 'ventixs';
  readonly experience?: string;
  readonly sub?: number;
  readonly action?: 'lamp' | 'blind' | 'plant' | 'laptop' | 'battle' | 'visit' | 'portrait';
}

export interface PointerSample {
  ndc: Vector2;
  screen: Vector2;
  velocity: Vector2;
  world: Vector3 | null;
}

export interface PointerField extends Readonly<PointerSample> {
  readonly active: boolean;
  readonly enabled: boolean;
  onPointer(listener: (sample: Readonly<PointerSample>) => void): () => void;
}

export interface StationContext {
  readonly tier: Tier;
  readonly renderer: WebGLRenderer;
  readonly camera: PerspectiveCamera;
  readonly scene: Scene;
  readonly pointer: PointerField;
  readonly capture: boolean;
  motion(): boolean;
  fov?(): number;
  readingPose(id: ChapterId): StationCameraPose;
  invalidate(): void;
  precompile?(object: Object3D): Promise<void>;
}

export interface ShotProvider {
  readonly object3D: Object3D;
  load(context: StationContext): Promise<void>;
  update(dt: number, time: number, state: ChapterState): boolean | void;
  getShot(chapter: ChapterId, subIndex?: number): Shot | null;
  subShotCount?(chapter: ChapterId): number;
  getSurface?(name: SurfaceName): PlateAnchor | null;
  getAnchor?(name: string): Vector3 | null;
  getFocus?(chapter: ChapterId, subIndex: number): Vector3 | null;
  readonly picks?: readonly StationPick[];
  resolvePick?(object: Object3D): StationPick | null;
  setHover?(object: Object3D | null): void;
  dispose(): void;
}

export interface FxPipeline {
  render(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, dt: number): void;
  precompile?(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, object?: Object3D): Promise<void>;
  setFocus(point: Vector3 | null): void;
  resize(width: number, height: number, pixelRatio: number): void;
  setTier(tier: Tier): void;
  readonly settling?: boolean;
  attachPointer?(pointer: PointerField): void;
  dispose(): void;
}

export interface StageEventMap {
  'chapter:enter': CustomEvent<{ id: ChapterId; subIndex: number; duration: number }>;
  'chapter:settled': CustomEvent<{ id: ChapterId; subIndex: number }>;
  'desk:focus': CustomEvent<{ point: Vector3 | null }>;
  'chapter:progress': CustomEvent<{ id: ChapterId; progress: number }>;
  'scene:hover': CustomEvent<{ label: string | null }>;
  'story:progress': CustomEvent<{ value: number; index: number; total: number }>;
  'story:ready': CustomEvent<{ total: number }>;
  'story:disposed': CustomEvent<undefined>;
  'story:goto': CustomEvent<{ chapter: ChapterId; sub?: number } | { step: 1 | -1 } | { edge: 'start' | 'end' }>;
  'story:tour': CustomEvent<{ action?: 'toggle' | 'start' | 'stop' }>;
  'story:tour-state': CustomEvent<{ state: 'playing' | 'paused' | 'finished' }>;
}

export interface StationCameraPose {
  position: Vector3;
  target: Vector3;
  fov?: number;
  roll?: number;
}

type Listener = () => void;
let shotProvider: ShotProvider | null = null;
let fx: FxPipeline | null = null;
const listeners = new Set<Listener>();

function notify(): void {
  for (const listener of listeners) listener();
}

export function registerShotProvider(provider: ShotProvider): () => void {
  shotProvider = provider;
  notify();
  return () => {
    if (shotProvider === provider) shotProvider = null;
    notify();
  };
}

export function registerFx(pipeline: FxPipeline): () => void {
  fx = pipeline;
  notify();
  return () => {
    if (fx === pipeline) fx = null;
    notify();
  };
}

export function registeredShotProvider(): ShotProvider | null {
  return shotProvider;
}

export function registeredFx(): FxPipeline | null {
  return fx;
}

export function onRegistryChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
