import type { Object3D, PerspectiveCamera, WebGLRenderer } from 'three';
import { registeredFx, registeredShotProvider, registeredStations, type FxPipeline, type ShotProvider, type StationContext, type StationModule } from '../contracts';
import type { StagePointer } from '../pointer';
import type { Tier } from '../tier';
import type { World } from '../world';

type Loadable = ShotProvider | StationModule;

/** Swaps the loaded module for `next`: disposes the old one, loads the new one into the scene, returns what is now loaded. */
async function swapModule<T extends Loadable>(current: T | null, next: T | null, world: World, context: () => StationContext, label: string): Promise<T | null> {
  if (next === current) return current;
  if (current) {
    current.object3D.removeFromParent();
    current.dispose();
  }
  if (!next) return null;
  try {
    await next.load(context());
    world.scene.add(next.object3D);
    return next;
  } catch (error) {
    console.error(`[stage] ${label} failed`, error);
    return null;
  }
}

export interface ModulesHost {
  world(): World;
  renderer(): WebGLRenderer;
  camera: PerspectiveCamera;
  pointer: StagePointer;
  tier(): Tier;
  size(): { width: number; height: number };
  context(): StationContext;
  ready(): boolean;
  refreshShot(): void;
  invalidate(): void;
}

/** The registered desk set (or legacy hero module) and FX pipeline, swapped in as they register. */
export class StageModules {
  fx: FxPipeline | null = null;
  private provider: ShotProvider | null = null;
  private legacy: StationModule | null = null;

  constructor(private readonly host: ModulesHost) {}

  async sync(): Promise<void> {
    const world = this.host.world();
    const provider = registeredShotProvider();
    if (provider !== this.provider) {
      const previous = this.provider;
      this.provider = null;
      this.provider = await swapModule(previous, provider, world, () => this.host.context(), 'shot provider');
      world.setProvider(this.provider);
    }
    const legacy = this.provider ? null : (registeredStations().get('hero') ?? null);
    if (legacy !== this.legacy) {
      const previous = this.legacy;
      this.legacy = null;
      this.legacy = await swapModule(previous, legacy, world, () => this.host.context(), 'legacy station');
      world.setLegacy(this.legacy);
    }
    this.attachFx();
    if (this.host.ready()) this.host.refreshShot();
    this.host.invalidate();
  }

  attachFx(): void {
    const fx = registeredFx();
    if (fx === this.fx) return;
    this.fx = fx;
    if (!fx) return;
    const { width, height } = this.host.size();
    fx.attachPointer?.(this.host.pointer);
    fx.setTier(this.host.tier());
    fx.resize(width, height, this.host.renderer().getPixelRatio());
  }

  async precompile(object?: Object3D): Promise<void> {
    /* A model can finish loading while the desk set is still loading, before the pipeline is attached. */
    if (!this.fx) this.attachFx();
    const renderer = this.host.renderer();
    const { scene } = this.host.world();
    const { camera } = this.host;
    if (this.fx?.precompile) {
      await this.fx.precompile(renderer, scene, camera, object);
      return;
    }
    await (object ? renderer.compileAsync(object, camera, scene) : renderer.compileAsync(scene, camera));
  }

  /** Draws the scene through the FX pipeline when there is one; returns whether the pipeline still moves. */
  render(dt: number): boolean {
    const renderer = this.host.renderer();
    const { scene } = this.host.world();
    if (!this.fx) {
      renderer.render(scene, this.host.camera);
      return false;
    }
    this.fx.render(renderer, scene, this.host.camera, dt);
    return this.fx.settling ?? false;
  }

  dispose(): void {
    this.provider?.dispose();
    this.legacy?.dispose();
    this.fx?.dispose();
  }
}
