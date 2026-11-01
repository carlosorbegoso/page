import { Mesh, MeshBasicMaterial, PlaneGeometry, type CanvasTexture, type Group, type Material, type MeshStandardMaterial } from 'three';
import type { StationContext } from '../../contracts';
import { tokenColor } from '../../tokens';
import { MONITOR } from '../layout';
import { createPhoneTexture, createScreenTexture, drawPhone, drawScreen } from '../materials';
import { DeskLaptop } from '../screens/laptop';
import { MonitorGlass } from '../screens/monitorGlass';
import type { SurfaceFrame } from '../shots';
import type { DeskFrame } from './frame';
import type { LightLevels } from './levels';

const SCREEN_HDR = 1.8;
/** The MacBook never goes fully dark: at dawn it keeps a dim standby glow so it reads as a screen, not a black slab. */
const LAPTOP_STANDBY = 0.32;
const LAPTOP_HOVER_GAIN = 0.12;

export interface ScreensOptions {
  room: Group;
  phone: SurfaceFrame;
  material: MeshStandardMaterial;
  depthMaterial: Material | undefined;
  disposables: Array<{ dispose(): void }>;
}

/** The monitor, phone and laptop glass: pictures whose brightness follows the chapter light. */
export class DeskScreens {
  readonly screen: Mesh;
  private readonly monitor: MonitorGlass;
  private readonly phoneScreen: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private readonly phoneTexture: CanvasTexture;
  private readonly laptop: DeskLaptop;
  private phoneNotified = false;
  private laptopHover = 0;

  constructor(context: StationContext, options: ScreensOptions) {
    const { room, phone, disposables } = options;
    const screenTexture = createScreenTexture();
    drawScreen(screenTexture, MONITOR.screen.width / MONITOR.screen.height, tokenColor('--color-monitor-glow', '#7fb8ff'));
    this.monitor = new MonitorGlass(room, screenTexture, options.material.envMap);
    this.screen = this.monitor.mesh;

    this.phoneTexture = createPhoneTexture();
    drawPhone(this.phoneTexture, false, tokenColor('--color-accent', '#5aa9ff'));
    const phoneMaterial = new MeshBasicMaterial({ map: this.phoneTexture });
    this.phoneScreen = new Mesh(new PlaneGeometry(phone.width, phone.height), phoneMaterial);
    this.phoneScreen.name = 'desk-phone-screen';
    this.phoneScreen.position.copy(phone.centre);
    this.phoneScreen.quaternion.copy(phone.quaternion);
    room.add(this.phoneScreen);

    const high = context.tier === 'high';
    this.laptop = new DeskLaptop({
      room,
      material: options.material,
      depthMaterial: options.depthMaterial,
      camera: context.camera,
      shadows: high,
      high: high && !matchMedia('(pointer: coarse)').matches,
      invalidate: () => context.invalidate()
    });
    disposables.push(screenTexture, this.monitor, phoneMaterial, this.phoneTexture, this.phoneScreen.geometry, this.laptop);
  }

  toggleLaptop(time: number): void {
    this.laptop.toggleLid(time);
  }

  setHover(id: string | null): void {
    this.laptop.setHover(id === 'laptop');
    this.laptopHover = id === 'laptop' ? 1 : 0;
  }

  /** Redraws the phone lock screen on change and runs the laptop; returns true while one moves. */
  update(frame: DeskFrame, level: LightLevels): boolean {
    const notify = level.phone > 0.5;
    if (notify !== this.phoneNotified) {
      this.phoneNotified = notify;
      drawPhone(this.phoneTexture, notify, tokenColor('--color-accent', '#5aa9ff'));
    }
    this.monitor.update(frame.time, frame.motion);
    return this.laptop.update(frame, frame.chapter === 'outro');
  }

  apply(level: LightLevels): void {
    this.monitor.apply(level.monitor);
    this.phoneScreen.material.color.setScalar(0.06 + level.phone * SCREEN_HDR * 0.9);
    const laptopLevel = Math.max(Math.min(level.monitor / 5, 1), LAPTOP_STANDBY);
    this.laptop.apply(SCREEN_HDR * 0.55 * laptopLevel * (1 + LAPTOP_HOVER_GAIN * this.laptopHover));
  }
}
