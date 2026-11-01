import { PRODUCT_COLOR } from '../cards/print';
import type { ProductPrint } from '../content';
import { printFonts, wrap, type PrintFonts, type PrintSurface } from '../paper';

const PAPER = '#ece5d3';
const INK = '#1c2230';
const MUTED = '#5b6172';

const MM = {
  margin: 6.5,
  band: 4,
  pill: 5.2,
  name: 13,
  description: [6.2, 5.8, 5.4, 5],
  role: 5,
  visit: 5.6,
  button: 14
} as const;
const LEADING = 1.3;

interface Pen {
  context: CanvasRenderingContext2D;
  fonts: PrintFonts;
  px: number;
  color: string;
  left: number;
  text: number;
}

function drawPill(pen: Pen, status: string, top: number): number {
  const { context, px } = pen;
  const size = MM.pill * px;
  context.font = `600 ${size}px ${pen.fonts.body}`;
  const label = `● ${status}`;
  const height = size * 1.7;
  context.fillStyle = `${pen.color}40`;
  context.beginPath();
  context.roundRect(pen.left, top, context.measureText(label).width + size * 1.4, height, height / 2);
  context.fill();
  context.fillStyle = INK;
  context.fillText(label, pen.left + size * 0.7, top + height / 2 + size * 0.36);
  return top + height;
}

function drawDescription(pen: Pen, description: string, top: number, bottom: number): void {
  const { context, px } = pen;
  let size = 0;
  let lines: string[] = [];
  for (const mm of MM.description) {
    size = mm * px;
    context.font = `400 ${size}px ${pen.fonts.body}`;
    lines = wrap(context, description, pen.text);
    if (lines.length * size * LEADING <= bottom - top) break;
  }
  context.fillStyle = INK;
  let y = top;
  for (const line of lines) {
    if (y + size * LEADING > bottom + size * 0.3) break;
    context.fillText(line, pen.left, (y += size * LEADING));
  }
}

function drawVisitButton(pen: Pen, product: ProductPrint, bottom: number): number {
  const { context, px } = pen;
  const height = MM.button * px;
  const top = bottom - height;
  const size = MM.visit * px;
  context.font = `600 ${size}px ${pen.fonts.body}`;
  const label = `${product.visit} ↗`;
  context.strokeStyle = INK;
  context.lineWidth = Math.max(2, px * 0.45);
  context.beginPath();
  context.roundRect(pen.left, top, Math.min(pen.text, context.measureText(label).width + size * 2.4), height, px * 2);
  context.stroke();
  context.fillStyle = INK;
  context.fillText(label, pen.left + size * 1.2, top + height / 2 + size * 0.36);
  return top;
}

function drawFooter(pen: Pen, product: ProductPrint, bottom: number): number {
  const { context, px } = pen;
  const buttonTop = drawVisitButton(pen, product, bottom);
  const roleSize = MM.role * px;
  const roleBaseline = buttonTop - roleSize * 1.1;
  context.font = `600 ${roleSize}px ${pen.fonts.body}`;
  context.fillStyle = MUTED;
  const label = `${product.roleLabel}: `;
  context.fillText(label, pen.left, roleBaseline);
  const labelWidth = context.measureText(label).width;
  context.font = `400 ${roleSize}px ${pen.fonts.body}`;
  context.fillStyle = INK;
  context.fillText(product.role, pen.left + labelWidth, roleBaseline, pen.text - labelWidth);
  const rule = roleBaseline - roleSize * 1.7;
  context.fillStyle = `${MUTED}55`;
  context.fillRect(pen.left, rule, pen.text, Math.max(1, px * 0.25));
  return rule;
}

export function drawStackedCard(face: PrintSurface, product: ProductPrint, description: string): void {
  const { context, canvas } = face;
  const px = face.scale / 1000;
  const left = MM.margin * px;
  const pen: Pen = { context, fonts: printFonts(), px, color: PRODUCT_COLOR[product.id], left, text: canvas.width - left * 2 };
  context.textBaseline = 'alphabetic';
  context.textAlign = 'left';
  context.fillStyle = PAPER;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = pen.color;
  context.fillRect(0, 0, canvas.width, MM.band * px);
  const pillEnd = drawPill(pen, product.status, (MM.band + 4) * px);
  const nameBaseline = pillEnd + MM.name * px * 1.05;
  context.font = `700 ${MM.name * px}px ${pen.fonts.display}`;
  context.fillStyle = INK;
  context.fillText(product.name, left, nameBaseline, pen.text);
  const rule = drawFooter(pen, product, canvas.height - MM.margin * px);
  drawDescription(pen, description, nameBaseline + 1.5 * px, rule - 2.5 * px);
  face.texture.needsUpdate = true;
}
