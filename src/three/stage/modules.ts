import type { Object3D, PerspectiveCamera, WebGLRenderer } from 'three';
import { registeredFx, registeredShotProvider, type FxPipeline, type ShotProvider, type StationContext } from '../contracts';
import type { StagePointer } from '../pointer';
import type { Tier } from '../tier';
import type { World } from '../world';

async function swapProvider(current: ShotProvider | null, next: ShotProvider | null, world: World, context: () => StationContext): Promise<ShotProvider | null> {
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
    console.error('[stage] shot provider failed', error);
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

export class StageModules {
  fx: FxPipeline | null = null;
  private provider: ShotProvider | null = null;

  constructor(private readonly host: ModulesHost) {}

  async sync(): Promise<void> {
    const world = this.host.world();
    const provider = registeredShotProvider();
    if (provider !== this.provider) {
      const previous = this.provider;
      this.provider = null;
      this.provider = await swapProvider(previous, provider, world, () => this.host.context());
      world.setProvider(this.provider);
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
    this.fx?.dispose();
  }
}
