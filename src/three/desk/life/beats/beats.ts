import {
  Group,
  PerspectiveCamera,
  Quaternion,
  Vector2,
  Vector3,
  type Camera,
  type WebGLRenderer
} from 'three';
import { BeatPlane } from './plane';
import type { BeatPose } from './paths';
import { scriptFor, type BeatSpec, type BeatToy } from './scripts';

const FADE_IN = 0.18;
const FADE_OUT = 0.4;
const DISMISS = 0.25;
const FOLLOW_TIMEOUT = 5;
const UP = new Vector3(0, 1, 0);
const AXIS_X = new Vector3(1, 0, 0);
const MIN_WIDTH_SHARE = { wide: 0.2, tall: 0.62 } as const;
const MAX_GROWTH = { camera: 4, yaw: 1.8 } as const;
const EDGE = { side: 0.05, top: 0.16, bottom: 0.06 } as const;

interface LiveBeat {
  toy: BeatToy;
  spec: BeatSpec;
  plane: BeatPlane;
  anchor: Vector3;
  startedAt: number;
  gentle: boolean;
  spawned: boolean;
  endsAt: number;
  pose: BeatPose;
}

function fadeIn(age: number, gentle: boolean): number {
  return Math.min(1, age / (gentle ? FADE_IN * 2 : FADE_IN));
}

export class StoryBeats {
  readonly object3D = new Group();
  private live: LiveBeat[] = [];
  private readonly variants = new Map<BeatToy, number>();
  private following: { toy: BeatToy; since: number } | null = null;
  private shot = '';
  private readonly world = new Vector3();
  private readonly towards = new Vector3();
  private readonly facing = new Quaternion();
  private readonly tip = new Quaternion();
  private readonly size = new Vector3();
  private readonly viewport = new Vector2();

  constructor() {
    this.object3D.name = 'desk-beats';
  }

  play(
    toy: BeatToy,
    time: number,
    motion: boolean,
    anchor: Vector3,
    focused: string | null
  ): number {
    this.clear(toy);
    const variant = this.variants.get(toy) ?? 0;
    this.variants.set(toy, variant + 1);
    const script = scriptFor(toy, variant, anchor);
    if (!script) return 0;
    for (const spec of script.beats) this.spawn(toy, spec, anchor, time, !motion);
    this.following = focused === toy ? null : { toy, since: time };
    return script.busy;
  }

  private spawn(
    toy: BeatToy,
    spec: BeatSpec,
    anchor: Vector3,
    time: number,
    gentle: boolean
  ): void {
    const plane = new BeatPlane(spec.size, spec.paper, spec.draw);
    const beat: LiveBeat = {
      toy,
      spec,
      plane,
      anchor: anchor.clone(),
      startedAt: time,
      gentle,
      spawned: false,
      endsAt: time + spec.until,
      pose: { offset: new Vector3(), scale: 1, tip: 0 }
    };
    plane.opacity = 0;
    plane.mesh.frustumCulled = false;
    plane.mesh.onBeforeRender = (renderer, _scene, camera) => this.compose(beat, camera, renderer);
    this.object3D.add(plane.mesh);
    this.live.push(beat);
  }

  private growth(spec: BeatSpec, camera: Camera, renderer: WebGLRenderer): number {
    if (!(camera instanceof PerspectiveCamera)) return 1;
    renderer.getSize(this.viewport);
    const distance = camera.getWorldPosition(this.towards).distanceTo(this.world);
    const visibleWidth = 2 * distance * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect;
    const share = spec.size.width / Math.max(visibleWidth, 1e-6);
    const wanted =
      MIN_WIDTH_SHARE[this.viewport.x < this.viewport.y ? 'tall' : 'wide'] / Math.max(share, 1e-6);
    return Math.min(Math.max(wanted, 1), MAX_GROWTH[spec.face]);
  }

  private keepOnScreen(spec: BeatSpec, scale: number, camera: PerspectiveCamera): void {
    const view = this.world.applyMatrix4(camera.matrixWorldInverse);
    const halfHeight = -view.z * Math.tan((camera.fov * Math.PI) / 360);
    const halfWidth = halfHeight * camera.aspect;
    const clamp = (value: number, low: number, high: number) =>
      low > high ? (low + high) / 2 : Math.min(Math.max(value, low), high);
    const w = (spec.size.width * scale) / 2;
    const h = (spec.size.height * scale) / 2;
    view.x = clamp(
      view.x,
      -halfWidth * (1 - EDGE.side * 2) + w,
      halfWidth * (1 - EDGE.side * 2) - w
    );
    view.y = clamp(
      view.y,
      -halfHeight * (1 - EDGE.bottom * 2) + h,
      halfHeight * (1 - EDGE.top * 2) - h
    );
    this.world.applyMatrix4(camera.matrixWorld);
  }

  private compose(beat: LiveBeat, camera: Camera, renderer: WebGLRenderer): void {
    const { pose, plane } = beat;
    this.world.copy(beat.anchor);
    const grow = this.growth(beat.spec, camera, renderer);
    this.world.addScaledVector(pose.offset, beat.spec.face === 'camera' ? grow : 1);
    if (beat.spec.face === 'camera') {
      camera.getWorldQuaternion(this.facing);
      if (camera instanceof PerspectiveCamera)
        this.keepOnScreen(beat.spec, pose.scale * grow, camera);
    } else {
      camera.getWorldPosition(this.towards).sub(this.world);
      this.facing.setFromAxisAngle(UP, Math.atan2(this.towards.x, this.towards.z));
    }
    this.facing.multiply(this.tip.setFromAxisAngle(AXIS_X, -pose.tip));
    plane.mesh.matrixWorld.compose(this.world, this.facing, this.size.setScalar(pose.scale * grow));
    plane.mesh.modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, plane.mesh.matrixWorld);
    plane.mesh.normalMatrix.getNormalMatrix(plane.mesh.modelViewMatrix);
  }

  update(time: number, shot: string, focused: string | null): boolean {
    this.followShot(time, shot, focused);
    for (const beat of this.live) this.advance(beat, time);
    const done = this.live.filter(beat => time >= beat.endsAt);
    for (const beat of done) this.remove(beat);
    return this.live.length > 0;
  }

  private followShot(time: number, shot: string, focused: string | null): void {
    if (
      this.following &&
      (focused === this.following.toy || time - this.following.since > FOLLOW_TIMEOUT)
    )
      this.following = null;
    if (shot === this.shot) return;
    this.shot = shot;
    for (const beat of this.live) {
      if (beat.toy === focused || beat.toy === this.following?.toy) continue;
      beat.endsAt = Math.min(beat.endsAt, time + DISMISS);
    }
  }

  private advance(beat: LiveBeat, time: number): void {
    const age = time - beat.startedAt - beat.spec.at;
    if (age < 0) {
      beat.plane.opacity = 0;
      return;
    }
    if (!beat.spawned) {
      beat.spawned = true;
      if (beat.spec.sound)
        window.dispatchEvent(new CustomEvent('desk:beat', { detail: { sound: beat.spec.sound } }));
    }
    beat.spec.place(age, beat.gentle, beat.pose);
    const left = beat.endsAt - time;
    beat.plane.opacity = fadeIn(age, beat.gentle) * Math.min(1, left / FADE_OUT);
  }

  private clear(toy: BeatToy): void {
    for (const beat of this.live.filter(item => item.toy === toy)) this.remove(beat);
  }

  private remove(beat: LiveBeat): void {
    this.object3D.remove(beat.plane.mesh);
    beat.plane.dispose();
    this.live = this.live.filter(item => item !== beat);
  }

  dispose(): void {
    for (const beat of [...this.live]) this.remove(beat);
  }
}
