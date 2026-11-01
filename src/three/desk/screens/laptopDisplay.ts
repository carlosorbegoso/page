import { CanvasTexture, SRGBColorSpace } from 'three';
import { LAPTOP } from '../layout';
import type { LaptopDesktop } from './desktop';
import { drawLockScreen } from './lockScreen';

/** Logical canvas size; the backing store is scaled down on lighter tiers. */
const WIDTH = 768;
const HEIGHT = Math.round(WIDTH / (LAPTOP.screen.width / LAPTOP.screen.height));
const MENU_HEIGHT = 16;

export type LaptopPicture = 'live' | 'lock' | 'off';

/** The size the lazily loaded desktop draws at. */
export const DESKTOP_SIZE = { width: WIDTH, height: HEIGHT, menuHeight: MENU_HEIGHT } as const;

/**
 * The MacBook's picture on a canvas texture: the working desktop (`desktop.ts`, attached after the
 * first frame), a lock screen in standby — and in place of the desktop until it arrives — and black
 * when the lid is shut.
 */
export class LaptopDisplay {
  readonly texture: CanvasTexture;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly scale: number;
  private desktop: LaptopDesktop | null = null;

  constructor(fullResolution: boolean) {
    this.scale = fullResolution ? 1 : 0.6;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(WIDTH * this.scale);
    canvas.height = Math.round(HEIGHT * this.scale);
    this.ctx = canvas.getContext('2d')!;
    this.texture = new CanvasTexture(canvas);
    this.texture.colorSpace = SRGBColorSpace;
    this.texture.anisotropy = 4;
  }

  attachDesktop(desktop: LaptopDesktop): void {
    this.desktop = desktop;
  }

  type(key: string, time: number): void {
    this.desktop?.type(key, time);
  }

  render(picture: LaptopPicture, time: number, clock: string): void {
    const ctx = this.ctx;
    ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    if (picture === 'off') {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    } else if (picture === 'live' && this.desktop) {
      this.desktop.draw(ctx, time, clock);
    } else {
      drawLockScreen(ctx, WIDTH, HEIGHT, clock);
    }
    this.texture.needsUpdate = true;
  }

  dispose(): void {
    this.texture.dispose();
  }
}
