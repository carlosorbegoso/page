import { Mesh, MeshBasicMaterial, PlaneGeometry, type CanvasTexture, type Group } from 'three';
import { tokenColor } from '../../tokens';
import { LAPTOP, MONITOR } from '../layout';
import { createPhoneTexture, createScreenTexture, drawPhone, drawScreen } from '../materials';
import { laptopScreenFrame } from '../props';
import { monitorFrame, type SurfaceFrame } from '../shots';
import type { LightLevels } from './levels';

/** HDR gain of the screen pictures so they stay luminous through ACES / the FX composer. */
const SCREEN_HDR = 1.8;
/** The MacBook never goes fully dark: at dawn it keeps a dim standby glow so it reads as a screen, not a black slab. */
const LAPTOP_STANDBY = 0.32;

/** The monitor, phone and laptop glass: canvas pictures whose brightness follows the chapter light. */
export class DeskScreens {
  readonly screen: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private readonly phoneScreen: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private readonly phoneTexture: CanvasTexture;
  private readonly laptopScreen: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private phoneNotified = false;

  constructor(room: Group, phone: SurfaceFrame, disposables: Array<{ dispose(): void }>) {
    const monitor = monitorFrame();
    const screenTexture = createScreenTexture();
    drawScreen(screenTexture, MONITOR.screen.width / MONITOR.screen.height, tokenColor('--color-monitor-glow', '#7fb8ff'));
    const screenMaterial = new MeshBasicMaterial({ map: screenTexture });
    this.screen = new Mesh(new PlaneGeometry(MONITOR.screen.width, MONITOR.screen.height), screenMaterial);
    this.screen.name = 'desk-screen';
    this.screen.position.copy(monitor.centre);
    this.screen.quaternion.copy(monitor.quaternion);
    room.add(this.screen);

    this.phoneTexture = createPhoneTexture();
    drawPhone(this.phoneTexture, false, tokenColor('--color-accent', '#5aa9ff'));
    const phoneMaterial = new MeshBasicMaterial({ map: this.phoneTexture });
    this.phoneScreen = new Mesh(new PlaneGeometry(phone.width, phone.height), phoneMaterial);
    this.phoneScreen.name = 'desk-phone-screen';
    this.phoneScreen.position.copy(phone.centre);
    this.phoneScreen.quaternion.copy(phone.quaternion);
    room.add(this.phoneScreen);
    disposables.push(screenMaterial, screenTexture, this.screen.geometry, phoneMaterial, this.phoneTexture, this.phoneScreen.geometry);

    const laptopTexture = createScreenTexture();
    drawScreen(laptopTexture, LAPTOP.screen.width / LAPTOP.screen.height, tokenColor('--color-monitor-glow', '#7fb8ff'));
    const laptopMaterial = new MeshBasicMaterial({ map: laptopTexture });
    const laptopGlass = new Mesh(new PlaneGeometry(LAPTOP.screen.width, LAPTOP.screen.height), laptopMaterial);
    const glassFrame = laptopScreenFrame();
    laptopGlass.name = 'desk-laptop-screen';
    laptopGlass.position.copy(glassFrame.centre);
    laptopGlass.quaternion.copy(glassFrame.quaternion);
    laptopGlass.raycast = () => undefined;
    this.laptopScreen = laptopGlass;
    room.add(laptopGlass);
    disposables.push(laptopTexture, laptopMaterial, laptopGlass.geometry);
  }

  /** Redraws the phone lock screen when the notification card appears or leaves. */
  update(level: LightLevels): void {
    const notify = level.phone > 0.5;
    if (notify === this.phoneNotified) return;
    this.phoneNotified = notify;
    drawPhone(this.phoneTexture, notify, tokenColor('--color-accent', '#5aa9ff'));
  }

  apply(level: LightLevels): void {
    this.screen.material.color.setScalar(SCREEN_HDR * Math.min(level.monitor / 5, 1.2));
    this.phoneScreen.material.color.setScalar(0.06 + level.phone * SCREEN_HDR * 0.9);
    this.laptopScreen.material.color.setScalar(SCREEN_HDR * 0.55 * Math.max(Math.min(level.monitor / 5, 1), LAPTOP_STANDBY));
  }
}
