import { SHEET } from './constants';
import type { SheetContent } from './sheet-content';

export const CANVAS = { width: 1024, height: Math.round((1024 * SHEET.height) / SHEET.width) } as const;
const MARGIN = 72;
const INK = '#1c2230';
const MUTED = '#5b6172';
const PAPER = '#ece5d3';
const MARK = '#8a5a2b';


function wrap(context: CanvasRenderingContext2D, text: string, width: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (line && context.measureText(next).width > width) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

export function drawSheet(canvas: HTMLCanvasElement, content: SheetContent): void {
  const context = canvas.getContext('2d')!;
  const root = getComputedStyle(document.documentElement);
  const display = root.getPropertyValue('--font-display').trim() || 'system-ui, sans-serif';
  const mono = root.getPropertyValue('--font-mono').trim() || 'ui-monospace, monospace';
  const { width, height } = canvas;
  const text = width - MARGIN * 2;
  context.fillStyle = PAPER;
  context.fillRect(0, 0, width, height);
  context.textBaseline = 'alphabetic';
  context.fillStyle = MUTED;
  context.font = `500 32px ${mono}`;
  context.textAlign = 'right';
  context.fillText(content.years, width - MARGIN, 104);
  context.textAlign = 'left';
  context.fillStyle = INK;
  context.font = `600 84px ${display}`;
  context.fillText(content.company, MARGIN, 190, text);
  let y = 190;
  if (content.role) {
    context.font = `500 40px ${display}`;
    for (const line of wrap(context, content.role, text).slice(0, 2)) context.fillText(line, MARGIN, (y += 56));
  }
  y += 34;
  context.fillRect(MARGIN, y, text, 3);
  y += 72;
  context.fillStyle = MUTED;
  context.font = `500 28px ${mono}`;
  context.fillText(content.highlightsTitle.toUpperCase(), MARGIN, y);
  y += 20;
  const bulletIndent = 40;
  const stackReserve = height - 250;
  context.font = `400 38px ${display}`;
  for (const highlight of content.highlights) {
    const lines = wrap(context, highlight, text - bulletIndent);
    if (y + 56 > stackReserve) break;
    context.fillStyle = MARK;
    context.fillRect(MARGIN + 4, y + 56 - 24, 12, 12);
    context.fillStyle = INK;
    for (const line of lines) {
      if (y + 56 > stackReserve) break;
      context.fillText(line, MARGIN + bulletIndent, (y += 52));
    }
    y += 22;
  }
  if (!content.stack.length) return;
  y = Math.max(y + 30, stackReserve);
  context.fillStyle = MUTED;
  context.font = `500 28px ${mono}`;
  context.fillText(content.stackTitle.toUpperCase(), MARGIN, y);
  context.fillStyle = INK;
  context.font = `500 32px ${mono}`;
  for (const line of wrap(context, content.stack.join(' · '), text).slice(0, 3)) context.fillText(line, MARGIN, (y += 48));
}
