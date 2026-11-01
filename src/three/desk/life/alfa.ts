import { AdditiveBlending, BoxGeometry, Color, Group, Matrix4, Mesh, MeshBasicMaterial, Quaternion, SphereGeometry, Vector3, type BufferGeometry, type Camera, type Object3D } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { aroundPivot, placeInFrame, poseInFrame, type RigPart } from './rig';
import { bump, type FigureOffset } from './motion';

const UP = new Vector3(0, 1, 0);
const HAPPY_SECONDS = 1.6;
const BLINK_SECONDS = 0.16;
const LOOK_YAW = (25 * Math.PI) / 180;
const BREATH_RATE = 1.7;
const BREATH_RISE = 0.0005;
const LOOK_PITCH = 0.22;

export interface AlfaParts {
  head: RigPart;
  eyes?: RigPart;
  antenna?: RigPart;
  neck: Vector3;
  signal: Color;
}

function happyEyeGeometry(): BufferGeometry {
  const length = 0.0046;
  const stroke = (angle: number) => new BoxGeometry(length, 0.0012, 0.0006).translate(length / 2, 0, 0).applyMatrix4(new Matrix4().makeRotationZ(angle)).translate(0, 0.0014, 0);
  return mergeGeometries([stroke(-0.68), stroke(Math.PI + 0.68)], false)!;
}

function overlayMesh<T extends Mesh>(mesh: T, name: string): T {
  mesh.name = name;
  mesh.matrixAutoUpdate = false;
  mesh.visible = false;
  mesh.raycast = () => undefined;
  return mesh;
}

export class AlfaLife {
  readonly overlays = new Group();
  private readonly headCentre: Vector3;
  private readonly forwardYaw: number;
  private readonly forwardPitch: number;
  private readonly side: Vector3;
  private readonly forward: Vector3;
  private readonly eyeSpots: Matrix4[] = [];
  private readonly happyEyes: Mesh<BufferGeometry, MeshBasicMaterial>[] = [];
  private readonly antennaGlow: Mesh<SphereGeometry, MeshBasicMaterial> | null = null;
  private readonly antennaSpot = new Matrix4();
  private readonly disposables: Array<{ dispose(): void }> = [];
  private yaw = 0;
  private pitch = 0;
  private happyAt = -1;
  private motion = true;
  private readonly breath = new Vector3();
  private happyGentle = false;
  private nextBlink = 2.5;
  private blinkAt = -1;
  private readonly head = new Matrix4();
  private readonly local = new Matrix4();
  private readonly rotation = new Matrix4();
  private readonly quaternion = new Quaternion();
  private readonly roll = new Quaternion();
  private readonly tilt = new Quaternion();
  private readonly inverse = new Matrix4();
  private readonly target = new Vector3();
  private readonly ray = new Vector3();

  constructor(private readonly parts: AlfaParts) {
    const { head, eyes, antenna } = parts;
    this.headCentre = head.centre.clone();
    const ahead = eyes ? eyes.centre.clone().sub(this.headCentre) : new Vector3(0, 0, 1);
    this.forwardYaw = Math.atan2(ahead.x, ahead.z);
    this.forwardPitch = Math.atan2(ahead.y, Math.hypot(ahead.x, ahead.z));
    this.forward = new Vector3(Math.sin(this.forwardYaw), 0, Math.cos(this.forwardYaw));
    this.side = new Vector3().crossVectors(UP, this.forward).normalize();
    const color = parts.signal.clone().multiplyScalar(2.4);
    if (eyes) this.addHappyEyes(eyes, color);
    if (antenna) this.antennaGlow = this.addAntennaGlow(antenna, color);
  }

  private eyeCentres(eyes: RigPart): Vector3[] {
    return [-1, 1].map(sign => {
      const points = eyes.centroids.filter(point => Math.sign(point.clone().sub(eyes.centre).dot(this.side)) === sign);
      return points.reduce((sum, point) => sum.add(point), new Vector3()).multiplyScalar(1 / Math.max(points.length, 1));
    });
  }

  private addHappyEyes(eyes: RigPart, color: Color): void {
    const geometry = happyEyeGeometry();
    const material = new MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false });
    this.disposables.push(geometry, material);
    for (const spot of this.eyeCentres(eyes)) {
      const out = spot.clone().sub(this.headCentre).normalize();
      const facing = new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), out);
      this.eyeSpots.push(new Matrix4().compose(spot.clone().addScaledVector(out, 0.0012), facing, new Vector3(1, 1, 1)));
      const mark = overlayMesh(new Mesh(geometry, material), 'desk-alfa-happy-eye');
      this.happyEyes.push(mark);
      this.overlays.add(mark);
    }
  }

  private addAntennaGlow(antenna: RigPart, color: Color): Mesh<SphereGeometry, MeshBasicMaterial> {
    const geometry = new SphereGeometry(0.0068, 12, 8);
    const material = new MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending });
    this.disposables.push(geometry, material);
    const glow = overlayMesh(new Mesh(geometry, material), 'desk-alfa-antenna-glow');
    this.antennaSpot.makeTranslation(antenna.centre.x, antenna.centre.y, antenna.centre.z);
    this.overlays.add(glow);
    return glow;
  }

  get meshes(): Object3D[] {
    return [this.parts.head.mesh, this.parts.eyes?.mesh, this.parts.antenna?.mesh].filter((node): node is Mesh => Boolean(node));
  }

  play(time: number, motion: boolean): void {
    this.happyAt = time;
    this.happyGentle = !motion;
  }

  offset(time: number): FigureOffset {
    const t = this.happyT(time);
    if (t < 0 || this.happyGentle) return { lift: 0, yaw: 0 };
    const lift = bump(t / 0.3) * 0.018 + bump((t - 0.32) / 0.2) * 0.006;
    return { lift, yaw: 0.16 * Math.sin(t * Math.PI * 3) * (1 - t) };
  }

  signalGain(time: number): number {
    const t = this.happyT(time);
    return t < 0 ? 1 : 1 + 1.1 * bump(t);
  }

  update(dt: number, time: number, motion: boolean, look: { ndc: { x: number; y: number }; camera: Camera; frame: Matrix4 } | null): boolean {
    this.motion = motion;
    let moving = false;
    let goalYaw = 0;
    let goalPitch = 0;
    if (look && motion) {
      this.ray.set(look.ndc.x, look.ndc.y, 0.5).unproject(look.camera).sub(look.camera.position).normalize();
      const eye = look.camera.position;
      const headNow = this.target.copy(this.headCentre).applyMatrix4(look.frame);
      const reach = headNow.distanceTo(eye);
      this.target.copy(eye).addScaledVector(this.ray, reach).applyMatrix4(this.inverse.copy(look.frame).invert()).sub(this.headCentre);
      goalYaw = clampAngle(Math.atan2(this.target.x, this.target.z) - this.forwardYaw, LOOK_YAW);
      goalPitch = Math.max(-LOOK_PITCH, Math.min(LOOK_PITCH, Math.atan2(this.target.y, Math.hypot(this.target.x, this.target.z)) - this.forwardPitch));
    }
    const rate = 1 - Math.exp(-(motion ? 5 : 20) * dt);
    this.yaw += (goalYaw - this.yaw) * rate;
    this.pitch += (goalPitch - this.pitch) * rate;
    moving ||= Math.abs(goalYaw - this.yaw) > 1e-3 || Math.abs(goalPitch - this.pitch) > 1e-3;
    if (motion) {
      if (this.blinkAt < 0 && time >= this.nextBlink) this.blinkAt = time;
      if (this.blinkAt >= 0 && time - this.blinkAt > BLINK_SECONDS) {
        this.blinkAt = -1;
        this.nextBlink = time + 2.8 + Math.random() * 3.4 + (Math.random() < 0.25 ? -2.4 : 0);
      }
    } else this.blinkAt = -1;
    const t = this.happyT(time);
    if (this.happyAt >= 0 && t < 0) this.happyAt = -1;
    moving ||= t >= 0 || this.blinkAt >= 0;
    return moving;
  }

  pose(time: number, frame: Matrix4): void {
    const t = this.happyT(time);
    const wave = t >= 0 && !this.happyGentle ? 0.26 * Math.sin(t * Math.PI * 4) * Math.pow(1 - t, 1.2) : 0;
    this.quaternion.setFromAxisAngle(UP, this.yaw);
    this.tilt.setFromAxisAngle(this.side, -this.pitch);
    this.roll.setFromAxisAngle(this.forward, wave);
    this.quaternion.multiply(this.tilt).multiply(this.roll);
    const breathing = this.motion ? Math.sin(time * BREATH_RATE) : 0;
    this.quaternion.multiply(this.tilt.setFromAxisAngle(this.side, 0.025 * breathing));
    aroundPivot(this.head, this.parts.neck, this.rotation.makeRotationFromQuaternion(this.quaternion), this.breath.set(0, BREATH_RISE * (breathing + 1) * 0.5, 0));
    poseInFrame(this.parts.head.mesh, frame, this.head);
    if (this.parts.antenna) poseInFrame(this.parts.antenna.mesh, frame, this.head);
    const happy = t >= 0 && t < 0.92;
    const eyes = this.parts.eyes;
    if (eyes) {
      const blink = this.blinkAt >= 0 ? 1 - 0.9 * bump((time - this.blinkAt) / BLINK_SECONDS) : 1;
      const squash = happy ? 0.0001 : blink;
      const centre = eyes.centre;
      this.local.makeTranslation(centre.x, centre.y, centre.z).multiply(this.rotation.makeScale(1, squash, 1)).multiply(this.inverse.makeTranslation(-centre.x, -centre.y, -centre.z));
      poseInFrame(eyes.mesh, frame, this.local.premultiply(this.head));
    }
    const fade = happy ? Math.min(1, t / 0.06, (0.92 - t) / 0.12) : 0;
    this.happyEyes.forEach((mark, index) => {
      mark.visible = fade > 0;
      mark.material.opacity = fade;
      if (mark.visible) placeInFrame(mark, frame, this.head, this.eyeSpots[index]!);
    });
    const glow = this.antennaGlow;
    if (glow) {
      const on = t >= 0 ? (Math.floor(t * 9) % 2 === 0 ? 0.9 : 0.12) * (1 - t * 0.6) : 0;
      glow.visible = on > 0;
      glow.material.opacity = on;
      if (glow.visible) placeInFrame(glow, frame, this.head, this.antennaSpot);
    }
  }

  poseKey(): string {
    return `${Math.round(this.yaw * 60)},${Math.round(this.pitch * 60)}`;
  }

  private happyT(time: number): number {
    if (this.happyAt < 0) return -1;
    const t = (time - this.happyAt) / HAPPY_SECONDS;
    return t >= 1 ? -1 : t;
  }

  dispose(): void {
    for (const item of this.disposables) item.dispose();
  }
}

function clampAngle(angle: number, limit: number): number {
  const wrapped = Math.atan2(Math.sin(angle), Math.cos(angle));
  return Math.max(-limit, Math.min(limit, wrapped));
}
