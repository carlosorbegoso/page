import { fillPaper, sheetFonts, type SheetFonts } from './sheet-canvas';
import type { SheetContent } from './sheet-content';
import { wrap } from './wrap';

const MARGIN = 64;
const INK = '#1c2230';
const MUTED = '#5b6172';
const MARK = '#8a5a2b';
const SIZE = { years: 50, company: 120, role: 58, body: 50 } as const;
const LEADING = 1.3;
const BULLET_INDENT = 44;
const STACK_LINES = 2;

interface Column {
  context: CanvasRenderingContext2D;
  fonts: SheetFonts;
  text: number;
}

function shortCompany(company: string): string {
  return company.split(' (')[0] ?? company;
}

function drawLines(column: Column, text: string, font: string, y: number, limit: number, x = MARGIN, width = column.text): number {
  const { context } = column;
  context.font = font;
  const size = Number.parseFloat(font.split(' ')[1]!);
  for (const line of wrap(context, text, width).slice(0, limit)) context.fillText(line, x, (y += Math.round(size * LEADING)));
  return y;
}

function drawHeading(column: Column, content: SheetContent): number {
  const { context, fonts } = column;
  context.fillStyle = MUTED;
  let y = drawLines(column, content.years, `500 ${SIZE.years}px ${fonts.mono}`, MARGIN - 10, 1);
  context.fillStyle = INK;
  context.font = `600 ${SIZE.company}px ${fonts.display}`;
  context.fillText(shortCompany(content.company), MARGIN, (y += SIZE.company), column.text);
  if (content.role) y = drawLines(column, content.role, `600 ${SIZE.role}px ${fonts.display}`, y + 6, 2);
  context.fillStyle = MUTED;
  if (content.client) y = drawLines(column, content.client, `400 ${SIZE.body}px ${fonts.display}`, y, 2);
  y += 36;
  context.fillStyle = INK;
  context.fillRect(MARGIN, y, column.text, 4);
  return y + 8;
}

function drawHighlights(column: Column, highlights: string[], top: number, bottom: number): void {
  const { context, fonts } = column;
  const step = Math.round(SIZE.body * LEADING);
  context.font = `400 ${SIZE.body}px ${fonts.display}`;
  let y = top;
  for (const highlight of highlights) {
    const lines = wrap(context, highlight, column.text - BULLET_INDENT);
    if (y + lines.length * step > bottom) break;
    context.fillStyle = MARK;
    context.fillRect(MARGIN + 4, y + step - SIZE.body * 0.62, 16, 16);
    context.fillStyle = INK;
    for (const line of lines) context.fillText(line, MARGIN + BULLET_INDENT, (y += step));
    y += Math.round(SIZE.body * 0.5);
  }
}

export function drawStackedSheet(canvas: HTMLCanvasElement, content: SheetContent): void {
  const context = canvas.getContext('2d')!;
  const column: Column = { context, fonts: sheetFonts(), text: canvas.width - MARGIN * 2 };
  fillPaper(context);
  const headingEnd = drawHeading(column, content);
  const stackTop = canvas.height - MARGIN - STACK_LINES * Math.round(SIZE.body * LEADING);
  drawHighlights(column, content.highlights, headingEnd, content.stack.length ? stackTop - 24 : canvas.height - MARGIN);
  if (!content.stack.length) return;
  context.fillStyle = MUTED;
  drawLines(column, content.stack.join(' · '), `500 ${SIZE.body}px ${column.fonts.mono}`, stackTop - Math.round(SIZE.body * 0.3), STACK_LINES);
}
