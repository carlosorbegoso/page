import type { PaneRect } from './editor';
import { INK, TERMINAL_LINES } from './laptopScript';

const LINE_HEIGHT = 13;
const TITLE_HEIGHT = 22;
const LINES_PER_SECOND = 0.9;

/** The terminal pane: the dev-mode log scrolls up slowly, line by line, in a loop. */
export function drawTerminal(ctx: CanvasRenderingContext2D, pane: PaneRect, time: number): void {
  ctx.fillStyle = '#18191c';
  ctx.fillRect(pane.x, pane.y, pane.width, pane.height);
  ctx.fillStyle = INK.panel;
  ctx.fillRect(pane.x, pane.y, pane.width, TITLE_HEIGHT);
  ctx.fillStyle = INK.dim;
  ctx.fillText('zsh — ventixs-api', pane.x + 10, pane.y + 15);

  const scroll = time * LINES_PER_SECOND;
  const first = Math.floor(scroll);
  const offset = (scroll - first) * LINE_HEIGHT;
  const rows = Math.ceil((pane.height - TITLE_HEIGHT) / LINE_HEIGHT) + 1;
  const total = TERMINAL_LINES.length;
  ctx.save();
  ctx.beginPath();
  ctx.rect(pane.x, pane.y + TITLE_HEIGHT, pane.width, pane.height - TITLE_HEIGHT);
  ctx.clip();
  for (let row = 0; row < rows; row++) {
    const line = TERMINAL_LINES[(first + row) % total]!;
    ctx.fillStyle = line.color;
    ctx.fillText(line.text, pane.x + 8, pane.y + TITLE_HEIGHT + LINE_HEIGHT * (row + 1) - offset);
  }
  ctx.restore();
}
