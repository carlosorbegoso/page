import { SHEET } from './constants';
import type { SheetContent } from './sheet-content';
import { wrap } from './wrap';

export const CANVAS = { width: 1024, height: Math.round((1024 * SHEET.height) / SHEET.width) } as const;
const MARGIN = 72;
const INK = '#1c2230';
const MUTED = '#5b6172';
const PAPER = '#ece5d3';
const MARK = '#8a5a2b';

interface SheetFonts {
  display: string;
  mono: string;
}

const BULLET_INDENT = 40;

function sheetFonts(): SheetFonts {
  const root = getComputedStyle(document.documentElement);
  return {
    display: root.getPropertyValue('--font-display').trim() || 'system-ui, sans-serif',
    mono: root.getPropertyValue('--font-mono').trim() || 'ui-monospace, monospace'
  };
}

/** Years, company and role; returns the baseline below the rule that closes the heading. */
function drawHeading(context: CanvasRenderingContext2D, content: SheetContent, fonts: SheetFonts, width: number, text: number): number {
  context.fillStyle = PAPER;
  context.fillRect(0, 0, width, context.canvas.height);
  context.textBaseline = 'alphabetic';
  context.fillStyle = MUTED;
  context.font = `500 32px ${fonts.mono}`;
  context.textAlign = 'right';
  context.fillText(content.years, width - MARGIN, 104);
  context.textAlign = 'left';
  context.fillStyle = INK;
  context.font = `600 84px ${fonts.display}`;
  context.fillText(content.company, MARGIN, 190, text);
  let y = 190;
  if (content.role) {
    context.font = `500 40px ${fonts.display}`;
    for (const line of wrap(context, content.role, text).slice(0, 2)) context.fillText(line, MARGIN, (y += 56));
  }
  y += 34;
  context.fillRect(MARGIN, y, text, 3);
  return y;
}

/** Bulleted highlights that stop before `stackReserve`; returns the next free baseline. */
function drawHighlights(context: CanvasRenderingContext2D, content: SheetContent, fonts: SheetFonts, top: number, text: number, stackReserve: number): number {
  let y = top + 72;
  context.fillStyle = MUTED;
  context.font = `500 28px ${fonts.mono}`;
  context.fillText(content.highlightsTitle.toUpperCase(), MARGIN, y);
  y += 20;
  context.font = `400 38px ${fonts.display}`;
  for (const highlight of content.highlights) {
    const lines = wrap(context, highlight, text - BULLET_INDENT);
    if (y + 56 > stackReserve) break;
    context.fillStyle = MARK;
    context.fillRect(MARGIN + 4, y + 56 - 24, 12, 12);
    context.fillStyle = INK;
    for (const line of lines) {
      if (y + 56 > stackReserve) break;
      context.fillText(line, MARGIN + BULLET_INDENT, (y += 52));
    }
    y += 22;
  }
  return y;
}

function drawStack(context: CanvasRenderingContext2D, content: SheetContent, fonts: SheetFonts, top: number, text: number): void {
  let y = top;
  context.fillStyle = MUTED;
  context.font = `500 28px ${fonts.mono}`;
  context.fillText(content.stackTitle.toUpperCase(), MARGIN, y);
  context.fillStyle = INK;
  context.font = `500 32px ${fonts.mono}`;
  for (const line of wrap(context, content.stack.join(' · '), text).slice(0, 3)) context.fillText(line, MARGIN, (y += 48));
}

export function drawSheet(canvas: HTMLCanvasElement, content: SheetContent): void {
  const context = canvas.getContext('2d')!;
  const fonts = sheetFonts();
  const { width, height } = canvas;
  const text = width - MARGIN * 2;
  const stackReserve = height - 250;
  const headingEnd = drawHeading(context, content, fonts, width, text);
  const highlightsEnd = drawHighlights(context, content, fonts, headingEnd, text, stackReserve);
  if (!content.stack.length) return;
  drawStack(context, content, fonts, Math.max(highlightsEnd + 30, stackReserve), text);
}
