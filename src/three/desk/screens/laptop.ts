import { Frustum, Matrix4, Mesh, MeshBasicMaterial, PlaneGeometry, type Camera, type Group, type Material } from 'three';
import { storyMinutes } from '../clock';
import { LAPTOP } from '../layout';
import { LAPTOP_LID } from '../props';
import type { DeskFrame } from '../set/frame';
import { LaptopDisplay, type LaptopPicture } from './laptopDisplay';
import { LaptopKeycaps } from './keycaps';
import { LaptopLid } from './laptopLid';
import { listenForTyping, type TypedKey } from './typing';

/** How long the lock screen shows after the lid opens, before the desktop comes back. */
const WAKE_SECONDS = 1.3;

export interface LaptopOptions {
  room: Group;
  material: Material;
  depthMaterial: Material | undefined;
  camera: Camera;
  shadows: boolean;
  /** Full canvas resolution and 24 fps; otherwise 60 % resolution at 15 fps. */
  high: boolean;
  invalidate: () => void;
}

function clockText(minutes: number, day: boolean): string {
  const total = ((day ? 600 : 1320) + Math.round(minutes)) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/**
 * The MacBook as a working machine: its picture redraws only while it is in frame (and only at
 * 15–24 fps), the lid shuts and opens on click, and keys typed on the real keyboard sink the
 * matching keycaps and appear in its editor.
 */
export class DeskLaptop {
  readonly lid: LaptopLid;
  private readonly glass: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private readonly display: LaptopDisplay;
  private readonly keycaps: LaptopKeycaps;
  private readonly frustum = new Frustum();
  private readonly viewProjection = new Matrix4();
  private readonly frameInterval: number;
  private readonly stopTyping: () => void;
  /** True while the lid is moving, so the lamp's shadow map needs a new render. */
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
    this.stopTyping = listenForTyping(typed => this.onType(typed));
  }

  toggleLid(time: number): void {
    if (this.lid.toggle()) this.wokeAt = time + 0.25;
    this.options.invalidate();
  }

  setHover(hovered: boolean): void {
    this.lid.setHover(hovered);
  }

  private onType(typed: TypedKey): boolean {
    if (!this.visible || !this.lid.open) return false;
    if (this.motion) this.keycaps.press(typed.code, this.time);
    this.display.type(typed.key, this.time);
    this.dirty = true;
    this.options.invalidate();
    return true;
  }

  /** Advances lid and keys and redraws the picture when due; returns true while something moves. */
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

  /** Panel brightness: the chapter's screen level times how awake the lid is. */
  apply(brightness: number): void {
    this.glass.material.color.setScalar(brightness * this.lid.glow);
  }

  dispose(): void {
    this.stopTyping();
    this.lid.dispose();
    this.keycaps.dispose();
    this.display.dispose();
    this.glass.geometry.dispose();
    this.glass.material.dispose();
  }
}
