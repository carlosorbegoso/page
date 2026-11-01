import { Group, Quaternion, Vector3, type Mesh, type MeshStandardMaterial, type Object3D } from 'three';
import { acquireGltf, release } from '../assets';
import type { ChapterId } from '../contracts';
import { createClockParts, type ClockParts } from './clock/parts';
import { DESK, HERO_EYE } from './layout';

const URL = `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}models/alarm-clock/alarm-clock.gltf`;
const DIAL_GLOW = 0.22;
export const CLOCK_POSITION = new Vector3(0.57, DESK.top, -0.41);
const CLOCK_SCALE = 0.8;
export const CLOCK_RING_EVENT = 'desk:clock';
const RING_SECONDS = 1.2;
const CROWN_SPEED = 0.21;
const SECOND_STEP = Math.PI / 30;

const STORY_MINUTES: Record<ChapterId, number[]> = {
  intro: [60],
  hero: [60],
  about: [80, 90],
  experience: [100, 105, 110, 115, 120],
  company: [150],
  products: [210, 240, 270],
  contact: [330],
  outro: [478]
};

const STORY_MINUTES_DAY: Record<ChapterId, number[]> = {
  intro: [0],
  hero: [0],
  about: [20, 40],
  experience: [60, 65, 70, 75, 80],
  company: [490],
  products: [500, 510, 520],
  contact: [530],
  outro: [545]
};

export function storyMinutes(chapter: ChapterId, subIndex: number, day = false): number {
  const list = (day ? STORY_MINUTES_DAY : STORY_MINUTES)[chapter];
  return list[Math.min(Math.max(subIndex, 0), list.length - 1)]!;
}

interface Hand {
  node: Object3D;
  rest: Quaternion;
  restDirection: Vector3;
  turnsPerHour: number;
}

export class StoryClock {
  readonly group = new Group();
  private hands: Hand[] = [];
  private faceNormal = new Vector3(1, 0, 0);
  private disposed = false;
  private readonly body = new Group();
  private parts: ClockParts | null = null;
  private secondHand: { node: Object3D; rest: Quaternion; restDirection: Vector3 } | null = null;
  private secondShown = Number.NaN;
  private ringRequested = false;
  private ringStart = -1;
  private nudgeFrames = 0;
  private readonly turn = new Quaternion();
  private readonly target = new Vector3();
  private readonly onRing = () => {
    this.ringRequested = true;
    this.wake?.();
  };

  constructor(
    onReady: () => void,
    prepare?: (model: Object3D) => Promise<void>,
    private readonly wake?: () => void
  ) {
    this.group.name = 'desk-clock';
    this.group.add(this.body);
    window.addEventListener(CLOCK_RING_EVENT, this.onRing);
    this.group.position.copy(CLOCK_POSITION);
    this.group.scale.setScalar(CLOCK_SCALE);
    acquireGltf(URL)
      .then(gltf => {
        if (this.disposed) return;
        this.adoptModel(gltf.scene);
        const show = () => {
          if (this.disposed) return;
          this.parts = createClockParts();
          this.body.add(gltf.scene, this.parts.crown, this.parts.hammer);
          this.tickSeconds(Date.now() / 1000, false);
          onReady();
        };
        void (prepare?.(gltf.scene) ?? Promise.resolve()).catch(() => undefined).then(show);
      })
      .catch(() => undefined);
  }

  show(minutes: number): void {
    const up = new Vector3(0, 1, 0).projectOnPlane(this.faceNormal).normalize();
    const hours = 10 + minutes / 60;
    for (const hand of this.hands) {
      const angle = -(hours * hand.turnsPerHour * Math.PI * 2);
      const target = up.clone().applyAxisAngle(this.faceNormal, angle);
      const turn = new Quaternion().setFromUnitVectors(hand.restDirection, target);
      hand.node.quaternion.copy(turn).multiply(hand.rest);
    }
  }

  update(time: number, motion: boolean): boolean {
    if (!this.parts) return false;
    this.tickSeconds(Date.now() / 1000, motion);
    if (motion) this.parts.crownSpin.rotation.y = -time * CROWN_SPEED;
    if (this.ringRequested) {
      this.ringRequested = false;
      if (motion && !reducedMotion()) {
        this.ringStart = time;
      } else {
        this.ringStart = -1;
        this.nudgeFrames = 2;
      }
    }
    if (this.nudgeFrames > 0) {
      this.nudgeFrames--;
      this.pose(this.nudgeFrames === 1 ? 0.0012 : 0, this.nudgeFrames === 1 ? 0.02 : 0, 0, 0);
      return true;
    }
    if (this.ringStart < 0) return false;
    const t = time - this.ringStart;
    if (t >= RING_SECONDS || t < 0) {
      this.ringStart = -1;
      this.pose(0, 0, 0, 0);
      return true;
    }
    const envelope = Math.min(1, t / 0.06) * (t < 0.85 ? 1 : 1 - smooth((t - 0.85) / (RING_SECONDS - 0.85)));
    const hop = Math.abs(Math.sin(t * Math.PI * 9)) * 0.0035 * envelope;
    const roll = (Math.sin(t * 71) * 0.6 + Math.sin(t * 113) * 0.4) * 0.035 * envelope;
    const pitch = Math.sin(t * 89 + 1.3) * 0.02 * envelope;
    this.pose(hop, roll, pitch, Math.sin(t * Math.PI * 2 * 17) * 0.38 * envelope);
    return true;
  }

  dispose(): void {
    this.disposed = true;
    window.removeEventListener(CLOCK_RING_EVENT, this.onRing);
    this.parts?.dispose();
    release(URL);
  }

  private adoptModel(scene: Object3D): void {
    const body = scene.getObjectByName('alarm_clock_01');
    if (body) this.faceNormal = new Vector3(1, 0, 0).applyQuaternion(body.quaternion).normalize();
    const toEye = HERO_EYE.clone().sub(CLOCK_POSITION);
    this.group.rotation.y = Math.atan2(toEye.x, toEye.z) - Math.atan2(this.faceNormal.x, this.faceNormal.z);
    this.hands = [handOf(scene, 'houd_hand', 1 / 12), handOf(scene, 'minute_hand', 1)].filter((hand): hand is Hand => hand !== null);
    this.secondHand = secondHandOf(scene);
    scene.traverse(tuneClockSurface);
  }

  private pose(hop: number, roll: number, pitch: number, hammer: number): void {
    this.body.position.y = hop;
    this.body.rotation.set(pitch, 0, roll);
    if (this.parts) this.parts.hammer.rotation.z = hammer;
  }

  private tickSeconds(now: number, motion: boolean): void {
    const hand = this.secondHand;
    if (!hand) return;
    const whole = Math.floor(now);
    const since = now - whole;
    const step = motion ? whole - 1 + quartzStep(since) : whole;
    if (step === this.secondShown) return;
    this.secondShown = step;
    const up = this.target.set(0, 1, 0).projectOnPlane(this.faceNormal).normalize();
    up.applyAxisAngle(this.faceNormal, -(step % 60) * SECOND_STEP);
    hand.node.quaternion.copy(this.turn.setFromUnitVectors(hand.restDirection, up)).multiply(hand.rest);
  }
}

function handOf(scene: Object3D, name: string, turnsPerHour: number): Hand | null {
  const node = scene.getObjectByName(name);
  if (!node) return null;
  const restDirection = new Vector3(-1, 0, 0).applyQuaternion(node.quaternion).normalize();
  return { node, rest: node.quaternion.clone(), restDirection, turnsPerHour };
}

function secondHandOf(scene: Object3D): { node: Object3D; rest: Quaternion; restDirection: Vector3 } | null {
  const second = scene.getObjectByName('second_hand');
  if (!second) return null;
  const restDirection = new Vector3(0, 1, 0).applyQuaternion(second.quaternion).normalize();
  return { node: second, rest: second.quaternion.clone(), restDirection };
}

function clearGlass(material: MeshStandardMaterial): void {
  material.map = null;
  material.color.setScalar(1);
  material.opacity = 0.08;
  material.transparent = true;
  material.roughness = 0.05;
  material.depthWrite = false;
  material.needsUpdate = true;
}

function tuneClockSurface(object: Object3D): void {
  object.castShadow = true;
  object.receiveShadow = true;
  const materials = (object as Mesh).material;
  for (const material of (Array.isArray(materials) ? materials : [materials]) as Array<MeshStandardMaterial | undefined>) {
    if (!material?.isMeshStandardMaterial) continue;
    if (material.name.endsWith('_Glass')) {
      clearGlass(material);
      continue;
    }
    if (!material.map) continue;
    material.emissiveMap = material.map;
    material.emissive.setScalar(1);
    material.emissiveIntensity = DIAL_GLOW;
  }
}

function quartzStep(since: number): number {
  if (since > 0.18) return 1;
  return 1 - Math.exp(-since * 35) * Math.cos(since * 60);
}

function smooth(x: number): number {
  const t = Math.min(Math.max(x, 0), 1);
  return t * t * (3 - 2 * t);
}

function reducedMotion(): boolean {
  if (document.documentElement.dataset.motion === 'paused') return true;
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}
