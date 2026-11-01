import { Group, Quaternion, Vector3, type Mesh, type MeshStandardMaterial, type Object3D } from 'three';
import { acquireGltf, release } from '../assets';
import type { ChapterId } from '../contracts';
import { DESK, HERO_EYE } from './layout';

/** CC0 "Alarm Clock 01" from Poly Haven (public/models/alarm-clock/CREDITS.txt). */
const URL = `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}models/alarm-clock/alarm-clock.gltf`;
/** A faint luminous dial: the clock sits outside the lamp's cone and would read as a black disc. */
const DIAL_GLOW = 0.22;
/** Back right, between the monitor and the lamp: in the wide shots, below the frame in the close ones. */
export const CLOCK_POSITION = new Vector3(0.57, DESK.top, -0.41);
const CLOCK_SCALE = 0.8;

/** The story clock, in minutes after 22:00, per chapter and sub-shot (matches the HUD beats). */
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

/** By day, minutes after 10:00 (same 12-hour dial): a morning at the office until nightfall. */
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
  /** Unit direction the hand points to at rest, in the clock's space. */
  restDirection: Vector3;
  turnsPerHour: number;
}

/** An analog desk clock whose hands show the story hour; the hands sweep forward between chapters. */
export class StoryClock {
  readonly group = new Group();
  private hands: Hand[] = [];
  private faceNormal = new Vector3(1, 0, 0);
  private disposed = false;

  /** `prepare` compiles the model's shaders before it joins the scene (no first-frame link stall). */
  constructor(onReady: () => void, prepare?: (model: Object3D) => Promise<void>) {
    this.group.name = 'desk-clock';
    this.group.position.copy(CLOCK_POSITION);
    this.group.scale.setScalar(CLOCK_SCALE);
    acquireGltf(URL)
      .then(gltf => {
        if (this.disposed) return;
        const body = gltf.scene.getObjectByName('alarm_clock_01');
        if (body) this.faceNormal = new Vector3(1, 0, 0).applyQuaternion(body.quaternion).normalize();
        const toEye = HERO_EYE.clone().sub(CLOCK_POSITION);
        this.group.rotation.y = Math.atan2(toEye.x, toEye.z) - Math.atan2(this.faceNormal.x, this.faceNormal.z);
        const handOf = (name: string, turnsPerHour: number): Hand | null => {
          const node = gltf.scene.getObjectByName(name);
          if (!node) return null;
          const restDirection = new Vector3(-1, 0, 0).applyQuaternion(node.quaternion).normalize();
          return { node, rest: node.quaternion.clone(), restDirection, turnsPerHour };
        };
        this.hands = [handOf('houd_hand', 1 / 12), handOf('minute_hand', 1)].filter((hand): hand is Hand => hand !== null);
        gltf.scene.traverse(object => {
          object.castShadow = true;
          object.receiveShadow = true;
          const materials = (object as Mesh).material;
          for (const material of (Array.isArray(materials) ? materials : [materials]) as Array<MeshStandardMaterial | undefined>) {
            if (!material?.isMeshStandardMaterial) continue;
            if (material.name.endsWith('_Glass')) {
              /* The glass ships with an opaque JPG as base colour, which would paint the dial black. */
              material.map = null;
              material.color.setScalar(1);
              material.opacity = 0.08;
              material.transparent = true;
              material.roughness = 0.05;
              material.depthWrite = false;
              material.needsUpdate = true;
              continue;
            }
            if (!material.map) continue;
            material.emissiveMap = material.map;
            material.emissive.setScalar(1);
            material.emissiveIntensity = DIAL_GLOW;
          }
        });
        const show = () => {
          if (this.disposed) return;
          this.group.add(gltf.scene);
          onReady();
        };
        void (prepare?.(gltf.scene) ?? Promise.resolve()).catch(() => undefined).then(show);
      })
      .catch(() => undefined);
  }

  /** Points the hands at `minutes` after 22:00. */
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

  dispose(): void {
    this.disposed = true;
    release(URL);
  }
}
