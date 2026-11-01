import type { ProductPrint } from '../content';
import type { ProductId } from '../layout';
import { printFonts, wrap, type PrintFonts, type PrintedFace } from '../paper';

const PAPER = '#ece5d3';
const INK = '#1c2230';
const MUTED = '#5b6172';

/** Each product's colour, for the card's top band, its status dot and its link. */
export const PRODUCT_COLOR: Record<ProductId, string> = {
  skymek: '#f0a43c',
  parati: '#f28ba0',
  ventixs: '#3fcf8e'
};

/**
 * Type sizes in millimetres on the card. A product shot shows the card at about 2900 px per metre,
 * so 5 mm is the smallest body text that still reads (15 px) and the name stays above 11 mm.
 */
const MM = {
  margin: 7,
  band: 3.5,
  pill: 5,
  name: 12,
  description: [6.5, 6, 5.5, 5],
  role: 5,
  visit: 5.5
} as const;
const LEADING = 1.38;

interface Pen {
  context: CanvasRenderingContext2D;
  fonts: PrintFonts;
  /** Canvas pixels per millimetre. */
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
  const width = context.measureText(label).width + size * 1.4;
  context.fillStyle = `${pen.color}40`;
  context.beginPath();
  context.roundRect(pen.left, top, width, height, height / 2);
  context.fill();
  context.fillStyle = INK;
  context.fillText(label, pen.left + size * 0.7, top + height / 2 + size * 0.36);
  return top + height;
}

/** Largest description size whose wrapped lines fit in `room` pixels (the floor size if none does). */
function fitDescription(pen: Pen, description: string, room: number): { size: number; lines: string[] } {
  let fit = { size: 0, lines: [] as string[] };
  for (const mm of MM.description) {
    const size = mm * pen.px;
    pen.context.font = `400 ${size}px ${pen.fonts.body}`;
    fit = { size, lines: wrap(pen.context, description, pen.text) };
    if (fit.lines.length * size * LEADING <= room) break;
  }
  return fit;
}

function drawDescription(pen: Pen, description: string, top: number, bottom: number): void {
  const { size, lines } = fitDescription(pen, description, bottom - top);
  pen.context.font = `400 ${size}px ${pen.fonts.body}`;
  pen.context.fillStyle = INK;
  let y = top;
  for (const line of lines) pen.context.fillText(line, pen.left, (y += size * LEADING));
}

/** The rule, the role line and the underlined link at the foot; returns the rule's top. */
function drawFooter(pen: Pen, product: ProductPrint, bottom: number): number {
  const { context, px } = pen;
  const visitSize = MM.visit * px;
  const visitBaseline = bottom;
  context.font = `600 ${visitSize}px ${pen.fonts.body}`;
  context.fillStyle = pen.color;
  const visit = `${product.visit} ↗`;
  context.fillText(visit, pen.left, visitBaseline);
  context.fillRect(pen.left, visitBaseline + visitSize * 0.18, context.measureText(visit).width, Math.max(2, visitSize * 0.07));
  const roleSize = MM.role * px;
  const roleBaseline = visitBaseline - visitSize * 1.9;
  context.font = `600 ${roleSize}px ${pen.fonts.body}`;
  context.fillStyle = MUTED;
  const label = `${product.roleLabel}: `;
  context.fillText(label, pen.left, roleBaseline);
  context.font = `400 ${roleSize}px ${pen.fonts.body}`;
  context.fillStyle = INK;
  context.fillText(product.role, pen.left + context.measureText(label).width, roleBaseline, pen.text);
  const rule = roleBaseline - roleSize * 1.9;
  context.fillStyle = `${MUTED}55`;
  context.fillRect(pen.left, rule, pen.text, Math.max(1, px * 0.25));
  return rule;
}

/**
 * Prints a product's card on its face: a band in the product's colour, the status pill, the name,
 * the whole description (shrunk step by step down to the legibility floor), the role and the link.
 */
export function drawProductCard(face: PrintedFace, product: ProductPrint): void {
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
  const pillEnd = drawPill(pen, product.status, (MM.band + 4.5) * px);
  const nameBaseline = pillEnd + MM.name * px * 1.05;
  context.font = `700 ${MM.name * px}px ${pen.fonts.display}`;
  context.fillStyle = INK;
  context.fillText(product.name, left, nameBaseline, pen.text);
  const rule = drawFooter(pen, product, canvas.height - MM.margin * px);
  drawDescription(pen, product.description, nameBaseline + 1.5 * px, rule - 2.5 * px);
  face.texture.needsUpdate = true;
}
