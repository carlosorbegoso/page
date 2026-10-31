import {
  AmbientLight,
  BufferGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  PointLight,
  Scene,
  Vector3,
  type Mesh,
  type MeshStandardMaterial,
  type Object3D,
  type Sprite
} from 'three';
import experienceEn from '../../content/experience/en.json';
import experienceEs from '../../content/experience/es.json';
import { yieldToMain } from '../idle';
import { createMascot, type Mascot, type MascotId } from '../mascots';
import type { PlateAnchor, StationCameraPose, StationModule } from '../contracts';
import { STATIONS, stationIndex, type StationId } from '../sections';
import { tokenColor, tokenNumber } from '../tokens';
import { Beacon } from './Beacon';
import {
  acquireGlow,
  damp,
  disposeLights,
  glowSprite,
  releaseGlow,
  smoothstep,
  type SceneContext
} from './common';
import { Nebula } from './Nebula';
import { Monogram } from './Monogram';
import { OrbitMilestones, type Milestone } from './OrbitMilestones';
import { Sky } from './Sky';
import {
  ALFA_POSITION,
  applyPose,
  blendPoses,
  easeInOut,
  EXPERIENCE_CENTRE,
  EXPERIENCE_TILT,
  HERO_CENTRE,
  MONOGRAM_RADIUS,
  STATION_SPECS,
  stationPose,
  type CameraPose
} from './stations';

export type ProductId = 'skymek' | 'parati' | 'ventixs';

interface MoonSpec {
  mascot: MascotId;
  label: string;
  radius: number;
  tilt: number;
  phase: number;
  period: number;
}

const DEG = Math.PI / 180;
const MOONS: Record<ProductId, MoonSpec> = {
  skymek: { mascot: 'tool', label: 'SkyMek', radius: 1.6, tilt: 6 * DEG, phase: 200 * DEG, period: 90 },
  parati: { mascot: 'gift', label: 'Parati', radius: 2.2, tilt: -4 * DEG, phase: 320 * DEG, period: 120 },
  ventixs: { mascot: 'burbu', label: 'Ventixs', radius: 2.8, tilt: 9 * DEG, phase: 80 * DEG, period: 150 }
};
const PRODUCTS = Object.keys(MOONS) as ProductId[];
const ALFA_SCALE = 0.9;

export function isProductId(value: unknown): value is ProductId {
  return value === 'skymek' || value === 'parati' || value === 'ventixs';
}

/** What a pointer hit on the world means: a label for the tooltip and where it navigates. */
export interface WorldHit {
  key: string;
  label: string;
  target: string;
  product?: ProductId;
  experience?: string;
}

function milestones(): Milestone[] {
  const source = document.documentElement.lang.startsWith('en') ? experienceEn : experienceEs;
  return source.entries.map(entry => ({
    id: entry.id,
    label: entry.company.replace(/\s*\(.*\)$/, ''),
    current: entry.end === null
  }));
}

function fromModulePose(pose: StationCameraPose): CameraPose {
  return { position: pose.position, target: pose.target, cx: 0.5, cy: 0.5, fov: pose.fov, roll: pose.roll };
}

function orbitPoint(spec: MoonSpec, angle: number): Vector3 {
  return new Vector3(Math.cos(angle) * spec.radius, 0, Math.sin(angle) * spec.radius)
    .applyAxisAngle(new Vector3(1, 0, 0), spec.tilt)
    .add(ALFA_POSITION);
}

/**
 * "Constelación": deep space, the hero's monogram constellation, Alfa as the central star,
 * the three products as orbiting moons, the experience orbit and the contact beacon.
 * `setStation(s)` takes a continuous coordinate (0 = hero … 5 = contact).
 */
export class WorldScene {
  readonly scene = new Scene();
  private readonly world = new Group();
  private alfa: Mascot | undefined;
  private halo: Sprite | undefined;
  private coreGlow: Sprite | undefined;
  private readonly moons = new Map<ProductId, Mascot>();
  private readonly orbitGeometry = new BufferGeometry();
  private readonly orbitMaterial = new LineBasicMaterial({ transparent: true, opacity: 0.45 });
  private readonly activeOrbitGeometry = new BufferGeometry();
  private readonly activeOrbitMaterial = new LineBasicMaterial({ transparent: true, opacity: 0.9 });
  private activeOrbit: LineSegments | undefined;
  private activeOrbitFor: ProductId | null = null;
  private sky: Sky | undefined;
  private monogram: Monogram | undefined;
  private nebula: Nebula | undefined;
  private milestonesOrbit: OrbitMilestones | undefined;
  private beacon: Beacon | undefined;
  private readonly starLight = new PointLight(0xcfe4ff, 18, 0, 2);
  private readonly fill = new AmbientLight(0xffffff, 0.08);
  private readonly focusWeights: Record<ProductId, number> = { skymek: 0, parati: 0, ventixs: 0 };
  private focusedProduct: ProductId | null = null;
  private readonly focusTarget = new Vector3();
  private focusTargetReady = false;
  private hoveredKey: string | null = null;
  private station = 0;
  private orbitTime = 0;
  private width = 1;
  private height = 1;
  private orbit = { x: 0, y: 0 };
  private modules: ReadonlyMap<StationId, StationModule> = new Map();
  private readonly pickMap = new Map<Object3D, (instanceId?: number) => WorldHit | null>();

  constructor(private readonly context: SceneContext) {}

  async load(): Promise<void> {
    await this.addLights();
    const glow = await acquireGlow();
    const tier = this.context.tier;
    const [alfa, ...moons] = await Promise.all([
      createMascot('alfa', tier, { shadow: false }),
      ...PRODUCTS.map(id => createMascot(MOONS[id].mascot, tier, { shadow: false }))
    ]);
    await yieldToMain();
    this.alfa = alfa!;
    this.alfa.root.position.copy(ALFA_POSITION).add(new Vector3(0, -0.6 * ALFA_SCALE, 0));
    this.alfa.root.scale.setScalar(ALFA_SCALE);
    this.halo = glowSprite(glow, 0.45 * ALFA_SCALE * 2 * 4.5, 0.55);
    this.coreGlow = glowSprite(glow, 0.45 * ALFA_SCALE * 2 * 1.6, 0.35);
    this.halo.position.copy(ALFA_POSITION);
    this.coreGlow.position.copy(ALFA_POSITION);
    this.starLight.position.copy(ALFA_POSITION);
    PRODUCTS.forEach((id, index) => this.moons.set(id, moons[index]!));

    const orbitPoints: Vector3[] = [];
    for (const id of PRODUCTS) orbitPoints.push(...this.orbitSegments(MOONS[id]));
    this.orbitGeometry.setFromPoints(orbitPoints);
    const orbits = new LineSegments(this.orbitGeometry, this.orbitMaterial);
    this.activeOrbit = new LineSegments(this.activeOrbitGeometry, this.activeOrbitMaterial);
    orbits.raycast = this.activeOrbit.raycast = () => undefined;
    this.activeOrbit.visible = false;

    const stars = tokenNumber(tier === 'high' ? '--sky-stars-high' : '--sky-stars-mid', tier === 'high' ? 6000 : 2200);
    this.sky = new Sky(Math.round(stars), tier === 'high' ? 3 : 2, glow);
    this.scene.background = this.sky.background;
    this.monogram = new Monogram(MONOGRAM_RADIUS, glow);
    this.monogram.root.position.copy(HERO_CENTRE);
    this.nebula = new Nebula(glow);
    this.nebula.root.position.copy(STATION_SPECS.about.target).add(new Vector3(0, -0.8, 0));
    this.milestonesOrbit = new OrbitMilestones(milestones());
    this.milestonesOrbit.root.position.copy(EXPERIENCE_CENTRE);
    this.milestonesOrbit.root.rotation.x = EXPERIENCE_TILT;
    this.beacon = new Beacon();
    this.beacon.root.position.copy(ALFA_POSITION);

    this.world.add(
      this.sky.root,
      this.monogram.root,
      this.nebula.root,
      this.alfa.root,
      this.halo,
      this.coreGlow,
      this.starLight,
      this.fill,
      orbits,
      this.activeOrbit,
      this.milestonesOrbit.root,
      this.beacon.root,
      ...[...this.moons.values()].map(m => m.root)
    );
    this.scene.add(this.world);
    this.applyTokens();
    this.registerPicks();
  }

  private async addLights(): Promise<void> {
    const environment = await this.context.environment();
    if (environment) {
      this.scene.environment = environment;
      this.scene.environmentIntensity = 0.25;
    } else {
      this.fill.intensity = 0.18;
    }
  }

  private orbitSegments(spec: MoonSpec): Vector3[] {
    const points: Vector3[] = [];
    const segments = 256;
    for (let i = 0; i < segments; i++) {
      points.push(orbitPoint(spec, (i / segments) * Math.PI * 2), orbitPoint(spec, ((i + 1) / segments) * Math.PI * 2));
    }
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const inner = { ...spec, radius: spec.radius - 0.02 };
      const outer = { ...spec, radius: spec.radius + 0.02 };
      points.push(orbitPoint(inner, a), orbitPoint(outer, a));
    }
    return points;
  }

  /** Makes the Alfa body read as a star core (white, emissive) while keeping its facets. */
  private igniteAlfa(): void {
    const core = tokenColor('--color-alfa-core', '#eaf4ff');
    const intensity = tokenNumber('--alfa-core-intensity', 3.2);
    this.alfa?.root.traverse(object => {
      const mesh = object as Mesh;
      if (!mesh.isMesh) return;
      const material = mesh.material as MeshStandardMaterial;
      if (!(material.userData as { surface?: unknown }).surface) return;
      material.color.copy(core);
      material.emissive.copy(core);
      material.emissiveIntensity = intensity * 0.07;
      material.metalness = 0;
      material.roughness = 0.4;
    });
  }

  private registerPicks(): void {
    this.pickMap.set(this.alfa!.root, () => ({ key: 'alfa', label: 'Alfa · TUSOCIO IA', target: '#company' }));
    for (const [id, moon] of this.moons) {
      this.pickMap.set(moon.root, () => ({ key: id, label: MOONS[id].label, target: '#products', product: id }));
    }
    const orbit = this.milestonesOrbit!;
    this.pickMap.set(orbit.markers, instanceId => {
      const milestone = instanceId === undefined ? undefined : orbit.milestones[instanceId];
      if (!milestone) return null;
      return { key: `experience:${milestone.id}`, label: milestone.label, target: '#experience', experience: milestone.id };
    });
  }

  /** Objects the pointer can hit. */
  pickables(): Object3D[] {
    return [...this.pickMap.keys()];
  }

  /** Resolves a raycast hit to its meaning, walking up to the registered root. */
  resolve(object: Object3D, instanceId?: number): WorldHit | null {
    let node: Object3D | null = object;
    while (node) {
      const resolver = this.pickMap.get(node);
      if (resolver) return resolver(instanceId);
      node = node.parent;
    }
    return null;
  }

  setHover(hit: WorldHit | null): void {
    this.hoveredKey = hit?.key ?? null;
    const orbit = this.milestonesOrbit;
    orbit?.hover(hit?.experience ? orbit.milestones.findIndex(m => m.id === hit.experience) : -1);
  }

  focusProduct(id: ProductId | null): void {
    this.focusedProduct = id;
  }

  focusExperience(id: string | null): void {
    this.milestonesOrbit?.focus(id);
  }

  /** Continuous station coordinate: 0 = hero … STATIONS.length - 1 = contact. */
  setStation(value: number): void {
    this.station = Math.min(Math.max(value, 0), STATIONS.length - 1);
  }

  stationValue(): number {
    return this.station;
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  /** Reading pose of a station without parallax or focus (plates are placed against it). */
  readingPose(id: StationId): CameraPose {
    const custom = this.modules.get(id)?.getCameraPose?.(0);
    if (custom) return fromModulePose(custom);
    return stationPose(STATION_SPECS[id], this.context.camera, this.width, this.height);
  }

  /** Returns true while something is still settling (focus, hover, pointer parallax). */
  update(dt: number, time: number): boolean {
    const motion = this.context.motion();
    const instant = !motion || this.context.capture;
    const s = this.station;
    let settling = false;
    if (motion) this.orbitTime += dt;

    const hoverBoost = (key: string) => (this.hoveredKey === key ? 1.5 : 1);
    this.alfa!.setSignal((this.focusedProduct && s > 2.5 && s < 3.5 ? 0.7 : 1) * hoverBoost('alfa'));
    this.alfa!.update(time, motion);
    const breath = motion ? Math.sin((time / 8) * Math.PI * 2) * 0.05 : 0;
    this.halo!.material.opacity = tokenNumber('--alfa-halo-opacity', 0.55) + breath + (this.hoveredKey === 'alfa' ? 0.15 : 0);

    const emerge = smoothstep(1.4, 2.3, s);
    PRODUCTS.forEach(id => {
      const spec = MOONS[id];
      const moon = this.moons.get(id)!;
      const home = orbitPoint(spec, spec.phase + (this.orbitTime / spec.period) * Math.PI * 2);
      const weightTarget = this.focusedProduct === id ? 1 : 0;
      const weight = instant ? weightTarget : damp(this.focusWeights[id], weightTarget, 6, dt);
      settling ||= Math.abs(weight - weightTarget) > 0.002;
      this.focusWeights[id] = weight;
      moon.root.visible = emerge > 0.001;
      moon.root.position.lerpVectors(ALFA_POSITION, home, emerge);
      moon.root.position.y -= (moon.height * 0.5) * emerge;
      moon.root.scale.setScalar(Math.max(emerge, 0.001) * (1 + weight * 0.2) * (this.hoveredKey === id ? 1.06 : 1));
      moon.setFocus(weight);
      moon.setSignal((this.focusedProduct && this.focusedProduct !== id ? 0.57 : 1) * hoverBoost(id));
      moon.update(time, motion);
    });
    this.orbitMaterial.opacity = tokenNumber('--orbit-opacity', 0.45) * emerge;
    this.updateActiveOrbit(emerge);

    settling = this.monogram!.update(time, motion) || settling;
    const pointerTilt = this.context.pointer();
    this.monogram!.tilt(pointerTilt.x, pointerTilt.y);
    this.nebula!.update(time, motion);
    this.beacon!.update(time, motion, this.context.camera.position);
    this.beacon!.root.visible = s > 4.2;

    const pointer = this.context.pointer();
    this.orbit.x = damp(this.orbit.x, pointer.x, 4, dt);
    this.orbit.y = damp(this.orbit.y, pointer.y, 4, dt);
    settling ||= Math.abs(this.orbit.x - pointer.x) > 0.001 || Math.abs(this.orbit.y - pointer.y) > 0.001;

    settling = this.updateFocusTarget(dt, instant) || settling;
    for (const [id, module] of this.modules) {
      const progress = Math.max(-1, Math.min(1, s - stationIndex(id)));
      if (module.update(dt, time, progress)) settling = true;
    }
    applyPose(this.context.camera, this.cameraPose(s), this.width, this.height);
    settling ||= this.milestonesOrbit!.update(dt, time, motion, instant, this.context.camera.position);
    this.sky!.update(time, motion, this.context.camera.position, this.pixelRatio);
    return settling;
  }

  private updateActiveOrbit(emerge: number): void {
    const focused = this.focusedProduct;
    if (focused !== this.activeOrbitFor) {
      this.activeOrbitFor = focused;
      if (focused) this.activeOrbitGeometry.setFromPoints(this.orbitSegments(MOONS[focused]));
    }
    this.activeOrbit!.visible = Boolean(focused) && emerge > 0.5;
  }

  private pixelRatio = 1;

  setPixelRatio(value: number): void {
    this.pixelRatio = value;
  }

  private updateFocusTarget(dt: number, instant: boolean): boolean {
    const spec = STATION_SPECS.products;
    const goal = this.focusedProduct
      ? this.moons.get(this.focusedProduct)!.root.position.clone().add(new Vector3(0, 0.3, 0))
      : spec.target.clone();
    if (instant || !this.focusTargetReady) {
      this.focusTarget.copy(goal);
      this.focusTargetReady = true;
      return false;
    }
    this.focusTarget.set(
      damp(this.focusTarget.x, goal.x, 4, dt),
      damp(this.focusTarget.y, goal.y, 4, dt),
      damp(this.focusTarget.z, goal.z, 4, dt)
    );
    return this.focusTarget.distanceToSquared(goal) > 1e-5;
  }

  private cameraPose(s: number): CameraPose {
    const index = Math.min(Math.floor(s), STATIONS.length - 2);
    const local = s - index;
    const from = STATIONS[index]!;
    const to = STATIONS[index + 1]!;
    const leaving = this.modules.get(from)?.getCameraPose?.(local);
    if (leaving) return fromModulePose(leaving);
    const arriving = this.modules.get(to)?.getCameraPose?.(local - 1);
    if (arriving) return fromModulePose(arriving);
    return blendPoses(this.poseFor(from), this.poseFor(to), easeInOut(local), index % 2 === 0 ? 1 : -1);
  }

  /** World point FX should keep in focus: the camera target of the nearest station. */
  focusPoint(): Vector3 {
    const nearest = STATIONS[Math.max(0, Math.min(STATIONS.length - 1, Math.round(this.station)))]!;
    if (nearest === 'products' && this.focusedProduct) return this.focusTarget.clone();
    return this.readingPose(nearest).target.clone();
  }

  /** Station modules registered through contracts.ts (desk, …). */
  setModules(modules: ReadonlyMap<StationId, StationModule>): void {
    this.modules = modules;
  }

  /** Module-provided anchor for a plate, if its station module defines one. */
  plateAnchor(station: StationId, plateId: string): PlateAnchor | null {
    return this.modules.get(station)?.getPlateAnchor?.(plateId) ?? null;
  }

  private poseFor(id: StationId): CameraPose {
    const custom = this.modules.get(id)?.getCameraPose?.(0);
    if (custom) return fromModulePose(custom);
    const spec = STATION_SPECS[id];
    const camera = this.context.camera;
    if (id === 'products') {
      return stationPose(spec, camera, this.width, this.height, {
        target: this.focusTarget,
        subject: this.focusedProduct ? [1.3, 1.6] : spec.subject,
        orbit: this.orbit
      });
    }
    return stationPose(spec, camera, this.width, this.height, { orbit: this.orbit });
  }

  applyTokens(): void {
    this.alfa?.applyTokens();
    for (const moon of this.moons.values()) moon.applyTokens();
    this.igniteAlfa();
    this.halo?.material.color.copy(tokenColor('--color-alfa-corona'));
    this.coreGlow?.material.color.copy(tokenColor('--color-alfa-core'));
    this.orbitMaterial.color.copy(tokenColor('--color-orbit'));
    this.activeOrbitMaterial.color.copy(tokenColor('--color-orbit-active'));
    this.activeOrbitMaterial.opacity = tokenNumber('--orbit-active-opacity', 0.9);
    this.sky?.applyTokens();
    if (this.sky) this.scene.background = this.sky.background;
    this.monogram?.applyTokens();
    this.nebula?.applyTokens();
    this.milestonesOrbit?.applyTokens();
    this.beacon?.applyTokens();
  }

  dispose(): void {
    this.alfa?.dispose();
    for (const moon of this.moons.values()) moon.dispose();
    this.moons.clear();
    this.halo?.material.dispose();
    this.coreGlow?.material.dispose();
    this.orbitGeometry.dispose();
    this.orbitMaterial.dispose();
    this.activeOrbitGeometry.dispose();
    this.activeOrbitMaterial.dispose();
    this.sky?.dispose();
    this.monogram?.dispose();
    this.nebula?.dispose();
    this.milestonesOrbit?.dispose();
    this.beacon?.dispose();
    disposeLights(this.scene);
    releaseGlow();
    if (this.scene.environment) this.context.releaseEnvironment();
    this.scene.clear();
  }
}
