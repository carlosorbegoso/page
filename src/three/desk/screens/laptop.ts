import { Frustum, Matrix4, Mesh, MeshBasicMaterial, PlaneGeometry, type Camera, type Group, type Material } from 'three';
import { clockText, storyMinutes } from '../../../lib/story-time';
import { LAPTOP } from '../layout';
import { LAPTOP_LID } from '../props';
import type { DeskFrame } from '../set/frame';
import type { LaptopDesktop } from './desktop';
import { LaptopDisplay, type LaptopPicture } from './laptopDisplay';
import { LaptopKeycaps } from './keycaps';
import { LaptopLid } from './laptopLid';
import type { listenForTyping, TypedKey } from './typing';

const WAKE_SECONDS = 1.3;

export interface LaptopOptions {
  room: Group;
  material: Material;
  depthMaterial: Material | undefined;
  camera: Camera;
  shadows: boolean;
  high: boolean;
  invalidate: () => void;
}

export class DeskLaptop {
  readonly lid: LaptopLid;
  private readonly glass: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private readonly display: LaptopDisplay;
  private readonly keycaps: LaptopKeycaps;
  private readonly frustum = new Frustum();
  private readonly viewProjection = new Matrix4();
  private readonly frameInterval: number;
  private stopTyping: (() => void) | null = null;
  swinging = false;
  private picture: LaptopPicture | null = null;
  private drawnAt = -Infinity;
  private wokeAt = -Infinity;
  private dirty = true;
  private visible = false;
  private motion = true;
  private time = 0;
  private clock = '';
  private clockKey = Number.NaN;

  constructor(private readonly options: LaptopOptions) {
    this.lid = new LaptopLid(options.material, options.depthMaterial, options.shadows);
    this.display = new LaptopDisplay(options.high);
    this.frameInterval = 1 / (options.high ? 24 : 15);
    this.glass = new Mesh(new PlaneGeometry(LAPTOP.screen.width, LAPTOP.screen.height), new MeshBasicMaterial({ map: this.display.texture }));
    this.glass.name = 'desk-laptop-screen';
    this.glass.position.copy(LAPTOP_LID.glass);
    this.glass.raycast = () => undefined;
    this.lid.panel.add(this.glass);
    this.keycaps = new LaptopKeycaps(options.material, options.shadows);
    options.room.add(this.lid.pivot, this.keycaps.mesh);
  }

  toggleLid(time: number): void {
    if (this.lid.toggle()) this.wokeAt = time + 0.25;
    this.options.invalidate();
  }

  setHover(hovered: boolean): void {
    this.lid.setHover(hovered);
  }

  attachDesktop(desktop: LaptopDesktop, listen: typeof listenForTyping): void {
    this.display.attachDesktop(desktop);
    this.stopTyping = listen(typed => this.onType(typed));
    this.dirty = true;
    this.options.invalidate();
  }

  private onType(typed: TypedKey): boolean {
    if (!this.visible || !this.lid.open) return false;
    if (this.motion) this.keycaps.press(typed.code, this.time);
    this.display.type(typed.key, this.time);
    this.dirty = true;
    this.options.invalidate();
    return true;
  }

  update(frame: DeskFrame, standby: boolean): boolean {
    this.time = frame.time;
    this.motion = frame.motion;
    const swinging = this.lid.update(frame.step);
    this.swinging = swinging;
    const typing = this.keycaps.update(frame.time);
    this.visible = this.inFrame();
    const picture = this.pictureFor(frame, standby);
    this.updateClock(frame);
    const due = picture === 'live' && frame.motion && frame.time - this.drawnAt >= this.frameInterval;
    if (this.visible && (due || this.dirty || picture !== this.picture)) {
      this.display.render(picture, frame.time, this.clock);
      this.picture = picture;
      this.drawnAt = frame.time;
      this.dirty = false;
    }
    return swinging || typing || (this.visible && frame.motion && picture !== 'off');
  }

  private pictureFor(frame: DeskFrame, standby: boolean): LaptopPicture {
    if (this.lid.glow < 0.02) return 'off';
    if (standby || frame.time - this.wokeAt < WAKE_SECONDS) return 'lock';
    return 'live';
  }

  private updateClock(frame: DeskFrame): void {
    const minutes = storyMinutes(frame.chapter, frame.subIndex, frame.day);
    const key = frame.day ? -1 - minutes : minutes;
    if (key === this.clockKey) return;
    this.clockKey = key;
    this.clock = clockText(minutes, frame.day);
    this.dirty = true;
  }

  private inFrame(): boolean {
    const camera = this.options.camera;
    this.viewProjection.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    this.frustum.setFromProjectionMatrix(this.viewProjection);
    return this.frustum.intersectsObject(this.glass) || this.frustum.intersectsObject(this.keycaps.mesh);
  }

  apply(brightness: number): void {
    this.glass.material.color.setScalar(brightness * this.lid.glow);
  }

  dispose(): void {
    this.stopTyping?.();
    this.lid.dispose();
    this.keycaps.dispose();
    this.display.dispose();
    this.glass.geometry.dispose();
    this.glass.material.dispose();
  }
}
