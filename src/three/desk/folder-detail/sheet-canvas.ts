import { SHEET } from './constants';
import type { SheetContent } from './sheet-content';
import { wrap } from './wrap';

export const CANVAS = { width: 1024, height: Math.round((1024 * SHEET.height) / SHEET.width) } as const;
const MARGIN = 72;
const INK = '#1c2230';
const MUTED = '#5b6172';
const PAPER = '#ece5d3';
const MARK = '#8a5a2b';
const BULLET_INDENT = 40;
const HIGHLIGHT_SIZES = [38, 34, 31, 28, 25];
const STACK_BLOCK = 200;

export interface SheetFonts {
  display: string;
  mono: string;
}

export function sheetFonts(): SheetFonts {
  const root = getComputedStyle(document.documentElement);
  return {
    display: root.getPropertyValue('--font-display').trim() || 'system-ui, sans-serif',
    mono: root.getPropertyValue('--font-mono').trim() || 'ui-monospace, monospace'
  };
}

export function fillPaper(context: CanvasRenderingContext2D): void {
  context.fillStyle = PAPER;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  context.textBaseline = 'alphabetic';
  context.textAlign = 'left';
}

/** Dates, company, role and client; returns the baseline of the rule that closes the heading. */
export function drawHeading(context: CanvasRenderingContext2D, content: SheetContent, fonts: SheetFonts, text: number): number {
  const width = context.canvas.width;
  context.fillStyle = MUTED;
  context.font = `500 30px ${fonts.mono}`;
  context.textAlign = 'right';
  context.fillText(content.years, width - MARGIN, 104);
  context.textAlign = 'left';
  context.fillStyle = INK;
  context.font = `600 ${content.company.length > 18 ? 64 : 84}px ${fonts.display}`;
  context.fillText(content.company, MARGIN, 190, text);
  let y = 190;
  if (content.role) {
    context.font = `500 40px ${fonts.display}`;
    for (const line of wrap(context, content.role, text).slice(0, 2)) context.fillText(line, MARGIN, (y += 56));
  }
  if (content.client) {
    context.fillStyle = MUTED;
    context.font = `400 32px ${fonts.display}`;
    for (const line of wrap(context, content.client, text).slice(0, 2)) context.fillText(line, MARGIN, (y += 46));
    context.fillStyle = INK;
  }
  y += 34;
  context.fillRect(MARGIN, y, text, 3);
  return y;
}

interface HighlightLayout {
  size: number;
  lines: string[][];
}

/** Largest highlight size at which every highlight fits whole in `room` pixels. */
function fitHighlights(context: CanvasRenderingContext2D, highlights: string[], fonts: SheetFonts, text: number, room: number): HighlightLayout {
  let layout: HighlightLayout = { size: HIGHLIGHT_SIZES[0]!, lines: [] };
  for (const size of HIGHLIGHT_SIZES) {
    context.font = `400 ${size}px ${fonts.display}`;
    const lines = highlights.map(highlight => wrap(context, highlight, text - BULLET_INDENT));
    const height = lines.reduce((sum, block) => sum + block.length * size * 1.36 + size * 0.6, 0);
    layout = { size, lines };
    if (height <= room) break;
  }
  return layout;
}

/** Bulleted highlights between the heading and `bottom`; returns the next free baseline. */
function drawHighlights(context: CanvasRenderingContext2D, content: SheetContent, fonts: SheetFonts, top: number, text: number, bottom: number): number {
  let y = top + 72;
  context.fillStyle = MUTED;
  context.font = `500 28px ${fonts.mono}`;
  context.fillText(content.highlightsTitle.toUpperCase(), MARGIN, y);
  y += 20;
  const { size, lines } = fitHighlights(context, content.highlights, fonts, text, bottom - y);
  const leading = Math.round(size * 1.36);
  context.font = `400 ${size}px ${fonts.display}`;
  for (const block of lines) {
    if (y + leading > bottom) break;
    context.fillStyle = MARK;
    context.fillRect(MARGIN + 4, y + leading - size * 0.62, 12, 12);
    context.fillStyle = INK;
    for (const line of block) context.fillText(line, MARGIN + BULLET_INDENT, (y += leading));
    y += Math.round(size * 0.6);
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

/** The whole job on one page: heading, every highlight (shrunk to fit) and the stack at the foot. */
export function drawSheet(canvas: HTMLCanvasElement, content: SheetContent): void {
  const context = canvas.getContext('2d')!;
  const fonts = sheetFonts();
  const text = canvas.width - MARGIN * 2;
  const stackTop = canvas.height - STACK_BLOCK;
  fillPaper(context);
  const headingEnd = drawHeading(context, content, fonts, text);
  drawHighlights(context, content, fonts, headingEnd, text, stackTop - 40);
  if (content.stack.length) drawStack(context, content, fonts, stackTop, text);
}

/** A cover letter: heading and the job's summary as a paragraph, for the sheet tucked in the pocket. */
export function drawSummarySheet(canvas: HTMLCanvasElement, content: SheetContent): void {
  const context = canvas.getContext('2d')!;
  const fonts = sheetFonts();
  const text = canvas.width - MARGIN * 2;
  fillPaper(context);
  let y = drawHeading(context, content, fonts, text) + 30;
  context.fillStyle = INK;
  context.font = `400 36px ${fonts.display}`;
  for (const line of wrap(context, content.summary, text)) {
    if (y + 52 > canvas.height - 40) break;
    context.fillText(line, MARGIN, (y += 52));
  }
}
