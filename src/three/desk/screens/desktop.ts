import { LaptopDashboard } from './dashboard';
import { LaptopEditor, type PaneRect } from './editor';
import { drawTerminal } from './terminal';

const CODE_SECONDS = 16;
const BOARD_SECONDS = 9;
/** After a real key, the editor stays up at least this long instead of cycling to the dashboard. */
const TYPING_HOLD = 12;
const MONO = '11px ui-monospace, "SF Mono", Menlo, Consolas, monospace';
const MENU = '600 10px ui-sans-serif, system-ui, -apple-system, sans-serif';

export interface DesktopSize {
  width: number;
  height: number;
  menuHeight: number;
}

/**
 * The MacBook's working desktop: IntelliJ with the Quarkus resource typing itself next to the
 * dev-mode terminal, alternating with a Grafana board. Loaded after the first frame (`desk/late`).
 */
export class LaptopDesktop {
  private readonly editor = new LaptopEditor();
  private readonly dashboard = new LaptopDashboard();
  private readonly codePane: PaneRect;
  private readonly terminalPane: PaneRect;
  private readonly boardPane: PaneRect;
  private typedAt = -100;

  constructor(private readonly size: DesktopSize) {
    const { width, height, menuHeight } = size;
    const codeWidth = Math.round(width * 0.6);
    /* The editor takes the right side: the hero shot crops the laptop's left edge, and typed text must stay in view. */
    this.codePane = { x: width - codeWidth, y: menuHeight, width: codeWidth, height: height - menuHeight };
    this.terminalPane = { x: 0, y: menuHeight, width: width - codeWidth - 2, height: height - menuHeight };
    this.boardPane = { x: 0, y: menuHeight, width, height: height - menuHeight };
  }

  /** A key typed on the real keyboard: it lands in the editor, which comes to the front. */
  type(key: string, time: number): void {
    this.editor.type(key, time);
    this.typedAt = time;
  }

  draw(ctx: CanvasRenderingContext2D, time: number, clock: string): void {
    const board = time - this.typedAt > TYPING_HOLD && time % (CODE_SECONDS + BOARD_SECONDS) >= CODE_SECONDS;
    ctx.textBaseline = 'alphabetic';
    ctx.font = MONO;
    if (board) {
      this.dashboard.draw(ctx, this.boardPane, time);
    } else {
      this.editor.draw(ctx, this.codePane, time, ctx.measureText('M').width);
      drawTerminal(ctx, this.terminalPane, time);
    }
    this.drawMenuBar(ctx, board ? 'Grafana' : 'IntelliJ IDEA', clock);
  }

  private drawMenuBar(ctx: CanvasRenderingContext2D, app: string, clock: string): void {
    const { width, menuHeight } = this.size;
    ctx.fillStyle = '#26282d';
    ctx.fillRect(0, 0, width, menuHeight);
    ctx.font = MENU;
    ctx.fillStyle = '#e6e6ea';
    ctx.fillText(app, 12, 12);
    ctx.fillStyle = '#a9abb3';
    ctx.fillText(clock, width - 40, 12);
    ctx.font = MONO;
  }
}
