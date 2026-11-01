import { CanvasTexture, SRGBColorSpace } from 'three';
import { LAPTOP } from '../layout';
import { LaptopDashboard } from './dashboard';
import { LaptopEditor, type PaneRect } from './editor';
import { drawLockScreen } from './lockScreen';
import { drawTerminal } from './terminal';

/** Logical canvas size; the backing store is scaled down on lighter tiers. */
const WIDTH = 768;
const HEIGHT = Math.round(WIDTH / (LAPTOP.screen.width / LAPTOP.screen.height));
const MENU_HEIGHT = 16;
const CODE_SECONDS = 16;
const BOARD_SECONDS = 9;
/** After a real key, the editor stays up at least this long instead of cycling to the dashboard. */
const TYPING_HOLD = 12;
const MONO = '11px ui-monospace, "SF Mono", Menlo, Consolas, monospace';
const MENU = '600 10px ui-sans-serif, system-ui, -apple-system, sans-serif';

export type LaptopPicture = 'live' | 'lock' | 'off';

/**
 * The MacBook's picture on a canvas texture: IntelliJ with the Quarkus resource typing itself next
 * to the dev-mode terminal, alternating with a Grafana board; a lock screen in standby; black when
 * the lid is shut.
 */
export class LaptopDisplay {
  readonly texture: CanvasTexture;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly scale: number;
  private readonly editor = new LaptopEditor();
  private readonly dashboard = new LaptopDashboard();
  /** The editor takes the right side: the hero shot crops the laptop's left edge, and typed text must stay in view. */
  private readonly codePane: PaneRect = { x: WIDTH - Math.round(WIDTH * 0.6), y: MENU_HEIGHT, width: Math.round(WIDTH * 0.6), height: HEIGHT - MENU_HEIGHT };
  private readonly terminalPane: PaneRect = { x: 0, y: MENU_HEIGHT, width: WIDTH - Math.round(WIDTH * 0.6) - 2, height: HEIGHT - MENU_HEIGHT };
  private readonly boardPane: PaneRect = { x: 0, y: MENU_HEIGHT, width: WIDTH, height: HEIGHT - MENU_HEIGHT };
  private readonly charWidth: number;
  private typedAt = -100;

  constructor(fullResolution: boolean) {
    this.scale = fullResolution ? 1 : 0.6;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(WIDTH * this.scale);
    canvas.height = Math.round(HEIGHT * this.scale);
    this.ctx = canvas.getContext('2d')!;
    this.ctx.font = MONO;
    this.charWidth = this.ctx.measureText('M').width;
    this.texture = new CanvasTexture(canvas);
    this.texture.colorSpace = SRGBColorSpace;
    this.texture.anisotropy = 4;
  }

  /** A key typed on the real keyboard: it lands in the editor, which comes to the front. */
  type(key: string, time: number): void {
    this.editor.type(key, time);
    this.typedAt = time;
  }

  render(picture: LaptopPicture, time: number, clock: string): void {
    const ctx = this.ctx;
    ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    if (picture === 'off') {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    } else if (picture === 'lock') {
      drawLockScreen(ctx, WIDTH, HEIGHT, clock);
    } else {
      this.renderDesktop(time, clock);
    }
    this.texture.needsUpdate = true;
  }

  private renderDesktop(time: number, clock: string): void {
    const ctx = this.ctx;
    const board = time - this.typedAt > TYPING_HOLD && time % (CODE_SECONDS + BOARD_SECONDS) >= CODE_SECONDS;
    ctx.textBaseline = 'alphabetic';
    ctx.font = MONO;
    if (board) {
      this.dashboard.draw(ctx, this.boardPane, time);
    } else {
      this.editor.draw(ctx, this.codePane, time, this.charWidth);
      drawTerminal(ctx, this.terminalPane, time);
    }
    this.drawMenuBar(board ? 'Grafana' : 'IntelliJ IDEA', clock);
  }

  private drawMenuBar(app: string, clock: string): void {
    const ctx = this.ctx;
    ctx.fillStyle = '#26282d';
    ctx.fillRect(0, 0, WIDTH, MENU_HEIGHT);
    ctx.font = MENU;
    ctx.fillStyle = '#e6e6ea';
    ctx.fillText(app, 12, 12);
    ctx.fillStyle = '#a9abb3';
    ctx.fillText(clock, WIDTH - 40, 12);
    ctx.font = MONO;
  }

  dispose(): void {
    this.texture.dispose();
  }
}
