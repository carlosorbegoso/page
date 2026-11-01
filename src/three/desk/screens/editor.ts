import { EDITOR_LINES, INK } from './laptopScript';

const CHARS_PER_SECOND = 15;
const HOLD_SECONDS = 4;
const LINE_HEIGHT = 15;
const TAB_HEIGHT = 22;
const GUTTER = 34;
/** The visitor's text stays on screen this long after their last key before the editor plays again. */
const USER_SECONDS = 14;
const USER_LINES = 4;
const USER_LINE_CHARS = 44;
const LINE_NUMBERS = Array.from({ length: 40 }, (_, i) => String(i + 1));
const SNIPPET_CHARS = EDITOR_LINES.reduce((sum, line) => sum + line.length + 1, 0);
const CYCLE = SNIPPET_CHARS / CHARS_PER_SECOND + HOLD_SECONDS;

export interface PaneRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * The Quarkus resource in the laptop's editor: it types itself character by character in a slow
 * loop. Keys from the real keyboard (`type`) append below it and pause the loop for a while.
 */
export class LaptopEditor {
  private readonly user: string[] = [];
  private typedAt = -100;
  /** Starts most of the way through the snippet, so the first look already finds code on screen. */
  private origin = -CYCLE * 0.6;

  type(key: string, time: number): void {
    if (this.user.length === 0) this.user.push('    ');
    const last = this.user.length - 1;
    if (key === 'Backspace') this.user[last] = this.user[last]!.slice(0, -1);
    else if (key === 'Enter' || this.user[last]!.length >= USER_LINE_CHARS) this.user.push(key === 'Enter' ? '    ' : `    ${key}`);
    else this.user[last] += key;
    if (this.user.length > USER_LINES) this.user.shift();
    this.typedAt = time;
  }

  draw(ctx: CanvasRenderingContext2D, pane: PaneRect, time: number, charWidth: number): void {
    if (this.user.length > 0 && time - this.typedAt > USER_SECONDS) {
      this.user.length = 0;
      this.origin = time;
    }
    const typing = this.user.length > 0;
    const shown = typing ? SNIPPET_CHARS : Math.min(SNIPPET_CHARS, (((time - this.origin) % CYCLE) + CYCLE) % CYCLE * CHARS_PER_SECOND);
    drawFrame(ctx, pane);
    const left = pane.x + GUTTER + 8;
    let y = pane.y + TAB_HEIGHT + LINE_HEIGHT;
    let remaining = Math.floor(shown);
    let cursorX = left;
    let cursorY = y;
    for (let i = 0; i < EDITOR_LINES.length && remaining >= 0; i++) {
      const line = EDITOR_LINES[i]!;
      drawLineNumber(ctx, pane, i, y);
      const visible = Math.min(line.length, remaining);
      for (const token of line.tokens) {
        if (token.column >= visible) break;
        ctx.fillStyle = token.color;
        ctx.fillText(token.text, left + token.column * charWidth, y);
      }
      ctx.fillStyle = INK.background;
      ctx.fillRect(left + visible * charWidth, y - LINE_HEIGHT + 3, pane.width, LINE_HEIGHT);
      cursorX = left + visible * charWidth;
      cursorY = y;
      remaining -= line.length + 1;
      y += LINE_HEIGHT;
    }
    if (typing) {
      cursorY = this.drawUser(ctx, pane, left, y);
      cursorX = left + this.user[this.user.length - 1]!.length * charWidth;
    }
    if (Math.floor(time * 2) % 2 === 0 || !typing) drawCursor(ctx, cursorX, cursorY);
  }

  /** Draws the visitor's lines below the snippet; returns the baseline of the last one. */
  private drawUser(ctx: CanvasRenderingContext2D, pane: PaneRect, left: number, top: number): number {
    let y = top;
    for (let i = 0; i < this.user.length; i++) {
      drawLineNumber(ctx, pane, EDITOR_LINES.length + i, y);
      ctx.fillStyle = INK.type;
      ctx.fillText(this.user[i]!, left, y);
      y += LINE_HEIGHT;
    }
    return y - LINE_HEIGHT;
  }
}

function drawFrame(ctx: CanvasRenderingContext2D, pane: PaneRect): void {
  ctx.fillStyle = INK.background;
  ctx.fillRect(pane.x, pane.y, pane.width, pane.height);
  ctx.fillStyle = INK.panel;
  ctx.fillRect(pane.x, pane.y, pane.width, TAB_HEIGHT);
  ctx.fillStyle = INK.background;
  ctx.fillRect(pane.x + 6, pane.y + 4, 150, TAB_HEIGHT - 4);
  ctx.fillStyle = INK.method;
  ctx.fillRect(pane.x + 6, pane.y + TAB_HEIGHT - 2, 150, 2);
  ctx.fillStyle = INK.plain;
  ctx.fillText('PaymentResource.java', pane.x + 14, pane.y + 16);
}

function drawLineNumber(ctx: CanvasRenderingContext2D, pane: PaneRect, index: number, y: number): void {
  ctx.fillStyle = INK.gutter;
  ctx.fillText(LINE_NUMBERS[index] ?? '', pane.x + 8, y);
}

function drawCursor(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = INK.type;
  ctx.fillRect(x, y - LINE_HEIGHT + 4, 2, LINE_HEIGHT - 2);
}
