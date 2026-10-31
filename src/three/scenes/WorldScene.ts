import {
  Fog,
  Group,
  InstancedMesh,
  Matrix4,
  Quaternion,
  Scene,
  TetrahedronGeometry,
  Vector3,
  type MeshStandardMaterial,
  type Object3D
} from 'three';
import experienceEn from '../../content/experience/en.json';
import experienceEs from '../../content/experience/es.json';
import { createMascot, type Mascot, type MascotId } from '../mascots';
import { applyMaterialTokens, surfaceMaterial } from '../mascots/materials';
import { STATIONS, type StationId } from '../sections';
import { yieldToMain } from '../idle';
import { tokenColor } from '../tokens';
import {
  addLights,
  damp,
  disposeLights,
  layoutKind,
  NodeNetwork,
  shellPoints,
  smoothstep,
  type SceneContext
} from './common';
import { StackBlocks } from './StackBlocks';
import { applyPose, blendPoses, STATION_SPECS, stationPose, type CameraPose } from './stations';
import { Timeline, type Milestone } from './Timeline';

export type ProductId = 'skymek' | 'parati' | 'ventixs';

const PRODUCT_MASCOT: Record<ProductId, MascotId> = { skymek: 'tool', parati: 'gift', ventixs: 'burbu' };
const PRODUCTS = Object.keys(PRODUCT_MASCOT) as ProductId[];
const PRODUCT_LABEL: Record<ProductId, string> = { skymek: 'SkyMek', parati: 'Parati', ventixs: 'Ventixs' };

const TRIANGLE: Record<ProductId, Vector3> = {
  skymek: new Vector3(-0.82, 0, 0.05),
  parati: new Vector3(0.82, 0, 0.05),
  ventixs: new Vector3(0, -0.2, 0.5)
};
const ROW: Record<ProductId, Vector3> = {
  skymek: new Vector3(-0.78, 0, 0),
  ventixs: new Vector3(0, 0, 0.22),
  parati: new Vector3(0.78, 0, 0)
};
const ALFA_SPLIT_POSITION = new Vector3(0, 0.62, -0.6);
const ALFA_SPLIT_SCALE = 0.58;

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

function readFocusedProduct(): ProductId | null {
  const value = document.querySelector<HTMLElement>('#products')?.dataset.activeProduct;
  return isProductId(value) ? value : null;
}

/**
 * The continuous 3D world: one scene, six stations along a path. `setStation(s)` takes a
 * continuous coordinate (0 = hero … 5 = contact) and the camera flies between station poses.
 */
export class WorldScene {
  readonly scene = new Scene();
  private readonly fog = new Fog(0x0a0e14, 8, 20);
  private readonly world = new Group();
  private network: NodeNetwork | undefined;
  private readonly alfas: Partial<Record<'hero' | 'company' | 'contact', Mascot>> = {};
  private readonly products = new Map<ProductId, Mascot>();
  private stack: StackBlocks | undefined;
  private timeline: Timeline | undefined;
  private readonly shardGeometry = new TetrahedronGeometry(0.16, 0);
  private shardMaterial: MeshStandardMaterial | undefined;
  private shards: InstancedMesh | undefined;
  private readonly focusWeights: Record<ProductId, number> = { skymek: 0, parati: 0, ventixs: 0 };
  private focusedProduct: ProductId | null = readFocusedProduct();
  private readonly focusTarget = new Vector3();
  private focusTargetReady = false;
  private hoveredKey: string | null = null;
  private station = 0;
  private width = 1;
  private height = 1;
  private orbit = { x: 0, y: 0 };
  private readonly pickMap = new Map<Object3D, (instanceId?: number) => WorldHit | null>();

  constructor(private readonly context: SceneContext) {}

  async load(): Promise<void> {
    await addLights(this.scene, this.context);
    const tier = this.context.tier;
    const [heroAlfa, companyAlfa, contactAlfa, ...products] = await Promise.all([
      createMascot('alfa', tier),
      createMascot('alfa', tier),
      createMascot('alfa', tier),
      ...PRODUCTS.map(id => createMascot(PRODUCT_MASCOT[id], tier))
    ]);
    await yieldToMain();
    this.alfas.hero = heroAlfa!;
    this.alfas.company = companyAlfa!;
    this.alfas.contact = contactAlfa!;
    PRODUCTS.forEach((id, index) => this.products.set(id, products[index]!));

    const anchor = (id: StationId) => STATION_SPECS[id].anchor;
    heroAlfa!.root.position.copy(anchor('hero'));
    contactAlfa!.root.position.copy(anchor('contact'));
    contactAlfa!.root.rotation.y = -0.5;

    const points = [
      ...shellPoints(46, 7, anchor('hero').clone().setY(0.6), [0.9, 1.8]),
      ...shellPoints(18, 11, anchor('about').clone().setY(0.6), [1.2, 2]),
      ...shellPoints(26, 19, anchor('company').clone().setY(0.5), [1.4, 2.3]),
      ...shellPoints(18, 23, anchor('experience').clone().setY(0.5), [1.6, 2.4]),
      ...shellPoints(24, 29, anchor('contact').clone().setY(0.6), [1, 1.9])
    ];
    for (let i = 0; i < STATIONS.length - 1; i++) {
      const a = anchor(STATIONS[i]!);
      const b = anchor(STATIONS[i + 1]!);
      if (a.equals(b)) continue;
      for (let k = 1; k < 5; k++) points.push(a.clone().lerp(b, k / 5).add(new Vector3(((k * 37) % 7) / 3 - 1, 1.2 + (k % 2) * 0.6, 0)));
    }
    this.network = new NodeNetwork(points, 5);
    this.network.addTo(this.world);

    this.stack = new StackBlocks();
    this.stack.root.position.copy(anchor('about'));
    this.timeline = new Timeline(milestones());
    this.timeline.root.position.copy(anchor('experience'));
    this.timeline.root.rotation.y = -0.35;

    this.shardMaterial = surfaceMaterial({
      color: '--color-alfa-body',
      roughness: '--alfa-roughness',
      metalness: '--alfa-metalness',
      flatShading: true
    });
    this.shards = new InstancedMesh(this.shardGeometry, this.shardMaterial, PRODUCTS.length);
    this.shards.raycast = () => undefined;
    this.shards.frustumCulled = false;

    this.world.add(
      heroAlfa!.root,
      companyAlfa!.root,
      contactAlfa!.root,
      this.shards,
      this.stack.root,
      this.timeline.root,
      ...[...this.products.values()].map(m => m.root)
    );
    this.scene.add(this.world);
    this.scene.fog = this.fog;
    this.applyTokens();
    this.registerPicks();
  }

  private registerPicks(): void {
    const alfaHit = (): WorldHit => ({ key: 'alfa', label: 'Alfa · TUSOCIO IA', target: '#company' });
    for (const alfa of Object.values(this.alfas)) if (alfa) this.pickMap.set(alfa.root, alfaHit);
    for (const [id, mascot] of this.products) {
      this.pickMap.set(mascot.root, () => ({ key: id, label: PRODUCT_LABEL[id], target: '#products', product: id }));
    }
    const timeline = this.timeline!;
    const milestoneHit = (instanceId?: number): WorldHit | null => {
      const milestone = instanceId === undefined ? undefined : timeline.milestones[instanceId];
      if (!milestone) return null;
      return { key: `experience:${milestone.id}`, label: milestone.label, target: '#experience', experience: milestone.id };
    };
    this.pickMap.set(timeline.tops, milestoneHit);
    this.pickMap.set(timeline.pillars, milestoneHit);
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
    this.timeline?.hover(hit?.experience ? this.timeline.milestones.findIndex(m => m.id === hit.experience) : -1);
  }

  focusProduct(id: ProductId | null): void {
    this.focusedProduct = id;
  }

  focusExperience(id: string | null): void {
    this.timeline?.focus(id);
  }

  /** Continuous station coordinate: 0 = hero … STATIONS.length - 1 = contact. */
  setStation(value: number): void {
    this.station = Math.min(Math.max(value, 0), STATIONS.length - 1);
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  /** Returns true while something is still settling (focus, hover, pointer parallax). */
  update(dt: number, time: number): boolean {
    const motion = this.context.motion();
    const instant = !motion || this.context.capture;
    const s = this.station;
    const layout = layoutKind(this.width) === 'desktop' ? TRIANGLE : ROW;
    const companyAnchor = STATION_SPECS.company.anchor;
    let settling = false;

    const split = smoothstep(1.55, 2.7, s);
    const morph = smoothstep(2.0, 2.85, s);
    const companyAlfa = this.alfas.company!;
    companyAlfa.root.position.copy(companyAnchor).addScaledVector(ALFA_SPLIT_POSITION, split);
    companyAlfa.root.scale.setScalar(1 + (ALFA_SPLIT_SCALE - 1) * split);

    const hoverBoost = (key: string) => (this.hoveredKey === key ? 1.5 : 1);
    for (const alfa of Object.values(this.alfas)) {
      alfa!.setSignal((this.focusedProduct && s > 2.5 ? 0.6 : 1) * hoverBoost('alfa'));
      alfa!.update(time, motion);
    }

    const matrix = new Matrix4();
    const rotation = new Quaternion();
    const position = new Vector3();
    const shardOrigin = companyAnchor.clone().setY(0.6);
    const spinAxis = new Vector3(0.3, 1, 0.2).normalize();
    PRODUCTS.forEach((id, index) => {
      const home = companyAnchor.clone().add(layout[id]);
      position.lerpVectors(shardOrigin, home.clone().setY(home.y + 0.3), split);
      position.y += Math.sin(split * Math.PI) * 0.3;
      const size = smoothstep(1.55, 1.75, s) * (1 - morph);
      rotation.setFromAxisAngle(spinAxis, split * 4 + index * 2.1);
      this.shards!.setMatrixAt(index, matrix.compose(position, rotation, new Vector3(size, size, size)));

      const weightTarget = this.focusedProduct === id ? 1 : 0;
      const weight = instant ? weightTarget : damp(this.focusWeights[id], weightTarget, 6, dt);
      settling ||= Math.abs(weight - weightTarget) > 0.002;
      this.focusWeights[id] = weight;
      const mascot = this.products.get(id)!;
      mascot.root.visible = morph > 0.001;
      mascot.root.position.set(home.x, home.y + (1 - morph) * 0.3, home.z + weight * 0.18);
      mascot.root.scale.setScalar(Math.max(morph, 0.001) * (1 + weight * 0.15) * (this.hoveredKey === id ? 1.04 : 1));
      mascot.root.rotation.y = (1 - morph) * 1.8;
      mascot.setFocus(weight);
      mascot.setSignal((this.focusedProduct && this.focusedProduct !== id ? 0.45 : 1) * hoverBoost(id));
      mascot.update(time, motion);
    });
    this.shards!.instanceMatrix.needsUpdate = true;
    this.shards!.visible = split > 0 && morph < 1;

    this.stack!.update(time, motion);
    settling ||= this.timeline!.update(dt, time, motion, instant);

    const pointer = this.context.pointer();
    this.orbit.x = damp(this.orbit.x, pointer.x, 4, dt);
    this.orbit.y = damp(this.orbit.y, pointer.y, 4, dt);
    settling ||= Math.abs(this.orbit.x - pointer.x) > 0.001 || Math.abs(this.orbit.y - pointer.y) > 0.001;

    settling = this.updateFocusTarget(dt, instant, layout) || settling;
    const index = Math.min(Math.floor(s), STATIONS.length - 2);
    const t = smoothstep(0, 1, s - index);
    const pose = blendPoses(this.poseFor(STATIONS[index]!), this.poseFor(STATIONS[index + 1]!), t);
    applyPose(this.context.camera, pose, this.width, this.height);
    const distance = pose.position.distanceTo(pose.target);
    this.fog.near = distance + 1.5;
    this.fog.far = distance + 14;
    return settling;
  }

  private updateFocusTarget(dt: number, instant: boolean, layout: Record<ProductId, Vector3>): boolean {
    const spec = STATION_SPECS.products;
    const goal = this.focusedProduct
      ? spec.anchor.clone().add(layout[this.focusedProduct]).setY(layout[this.focusedProduct].y + 0.35)
      : spec.anchor.clone().add(spec.centre);
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
    return this.focusTarget.distanceToSquared(goal) > 1e-6;
  }

  private poseFor(id: StationId): CameraPose {
    const spec = STATION_SPECS[id];
    const camera = this.context.camera;
    if (id === 'products') {
      const focused = this.focusedProduct !== null;
      return stationPose(spec, camera, this.width, this.height, {
        target: this.focusTarget,
        subject: focused ? [0.85, 0.95] : spec.subject,
        orbit: this.orbit
      });
    }
    return stationPose(spec, camera, this.width, this.height, { orbit: this.orbit });
  }

  applyTokens(): void {
    this.fog.color.copy(tokenColor('--color-scene-bg', '#0a0e14'));
    for (const alfa of Object.values(this.alfas)) alfa?.applyTokens();
    for (const mascot of this.products.values()) mascot.applyTokens();
    if (this.shardMaterial) applyMaterialTokens(this.shardMaterial);
    this.network?.applyTokens();
    this.stack?.applyTokens();
    this.timeline?.applyTokens();
  }

  dispose(): void {
    for (const alfa of Object.values(this.alfas)) alfa?.dispose();
    for (const mascot of this.products.values()) mascot.dispose();
    this.products.clear();
    this.shards?.dispose();
    this.shardGeometry.dispose();
    this.shardMaterial?.dispose();
    this.network?.dispose();
    this.stack?.dispose();
    this.timeline?.dispose();
    disposeLights(this.scene);
    if (this.scene.environment) this.context.releaseEnvironment();
    this.scene.clear();
  }
}
