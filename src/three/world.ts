import { AmbientLight, DirectionalLight, Scene, Vector3, type Object3D } from 'three';
import type { ChapterId, ChapterState, PlateAnchor, Shot, ShotProvider, StationModule, StationPick, SurfaceName } from './contracts';
import { acquireGlow, releaseGlow } from './scenes/common';
import { Sky } from './scenes/Sky';

const FALLBACK_SHOT: Shot = { position: new Vector3(0, 1.3, 3.2), target: new Vector3(0, 1, 0) };
const MINIMAL_SKY_STARS = 900;

/**
 * Adapts the pre-migration desk (a legacy `StationModule` registered for `hero`) to the chapter
 * director: its reading pose is the hero shot, `about` pushes in 0.4 m, the other chapters hold
 * the hero shot until the desk provides real ones through `ShotProvider`.
 */
class LegacyDeskShots {
  constructor(private readonly module: StationModule) {}

  getShot(chapter: ChapterId): Shot | null {
    const pose = this.module.getCameraPose?.(0);
    if (!pose) return null;
    const shot = { position: pose.position.clone(), target: pose.target.clone() };
    if (chapter === 'about') {
      const direction = shot.target.clone().sub(shot.position).normalize();
      shot.position.addScaledVector(direction, 0.4);
    }
    return shot;
  }

  getSurface(name: SurfaceName): PlateAnchor | null {
    return name === 'monitor' ? (this.module.getPlateAnchor?.('hero') ?? null) : null;
  }
}

/**
 * The single scene: the desk set (shot provider or legacy module), a minimal night sky that only
 * shows through the window, and a fallback light rig when no set is registered.
 */
export class World {
  readonly scene = new Scene();
  private sky: Sky | undefined;
  private provider: ShotProvider | null = null;
  private legacy: StationModule | null = null;
  private legacyShots: LegacyDeskShots | null = null;
  private readonly fallbackLights: Object3D[] = [new AmbientLight(0xffffff, 0.4), new DirectionalLight(0xffffff, 1.2)];

  async load(): Promise<void> {
    const glow = await acquireGlow();
    this.sky = new Sky(MINIMAL_SKY_STARS, 0, glow);
    this.scene.background = this.sky.background;
    this.fallbackLights[1]!.position.set(1, 3, 2);
    this.scene.add(this.sky.root, ...this.fallbackLights);
  }

  setProvider(provider: ShotProvider | null): void {
    this.provider = provider;
    this.updateFallbackLights();
  }

  setLegacy(module: StationModule | null): void {
    this.legacy = module;
    this.legacyShots = module ? new LegacyDeskShots(module) : null;
    this.updateFallbackLights();
  }

  private updateFallbackLights(): void {
    const hasSet = Boolean(this.provider || this.legacy);
    for (const light of this.fallbackLights) light.visible = !hasSet;
  }

  shot(chapter: ChapterId, subIndex: number): Shot {
    return (
      this.provider?.getShot(chapter, subIndex) ??
      this.legacyShots?.getShot(chapter) ??
      this.provider?.getShot('hero', 0) ??
      FALLBACK_SHOT
    );
  }

  subShotCount(chapter: ChapterId, fallback: number): number {
    return this.provider?.subShotCount?.(chapter) ?? fallback;
  }

  surface(name: SurfaceName): PlateAnchor | null {
    return this.provider?.getSurface?.(name) ?? this.legacyShots?.getSurface(name) ?? null;
  }

  anchor(name: string): Vector3 | null {
    return this.provider?.getAnchor?.(name) ?? null;
  }

  focus(chapter: ChapterId, subIndex: number): Vector3 | null {
    return this.provider?.getFocus?.(chapter, subIndex) ?? null;
  }

  picks(): readonly StationPick[] {
    return [...(this.provider?.picks ?? []), ...(this.legacy?.picks ?? [])];
  }

  resolvePick(object: Object3D): StationPick | null {
    return this.provider?.resolvePick?.(object) ?? this.legacy?.resolvePick?.(object) ?? null;
  }

  setHover(object: Object3D | null): void {
    this.provider?.setHover?.(object);
    this.legacy?.setHover?.(object);
  }

  update(dt: number, time: number, state: ChapterState, motion: boolean, camera: Vector3, pixelRatio: number): boolean {
    let settling = false;
    if (this.provider && this.provider.update(dt, time, state)) settling = true;
    if (this.legacy && this.legacy.update(dt, time, 0)) settling = true;
    this.sky?.update(time, motion, camera, pixelRatio);
    return settling;
  }

  applyTokens(): void {
    this.sky?.applyTokens();
    if (this.sky) this.scene.background = this.sky.background;
  }

  dispose(): void {
    this.sky?.dispose();
    releaseGlow();
    this.scene.clear();
  }
}
