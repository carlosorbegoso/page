import { printFonts, wrap, type PrintedFace } from '../notes/paper';

const PAPER = '#ece5d3';
const INK = '#1c2230';
const MUTED = '#5b6172';
const ACCENT = '#c9772f';

const MM = { margin: 13, band: 4, title: 21, lede: 12.5, label: 10.5, value: 12.5, rowGap: 8 } as const;
const LEDE_LEADING = 1.3;
const TITLE_LEADING = 1.12;
const LABEL_COLUMN = 0.3;

export interface BioPrint {
  title: string;
  lede: string;
  facts: { label: string; value: string }[];
}

function text(el: Element | null | undefined): string {
  if (!el) return '';
  const copy = el.cloneNode(true) as Element;
  for (const hidden of copy.querySelectorAll('[aria-hidden="true"]')) hidden.remove();
  return copy.textContent?.replace(/\s+/g, ' ').trim() ?? '';
}

export function readBio(): BioPrint {
  const plate = document.querySelector('[data-plate-id="about-bio"]');
  const facts = [...(plate?.querySelectorAll('.about-facts > div') ?? [])].map(row => ({
    label: text(row.querySelector('dt')),
    value: text(row.querySelector('.about-facts__value'))
  }));
  return { title: text(plate?.querySelector('header h2')), lede: text(plate?.querySelector('header > p:last-of-type')), facts };
}

function drawTitle(face: PrintedFace, title: string, left: number, width: number, top: number): number {
  const { context } = face;
  const px = face.scale / 1000;
  const size = MM.title * px;
  context.font = `600 ${size}px ${printFonts().display}`;
  context.fillStyle = INK;
  let y = top;
  for (const line of wrap(context, title, width)) context.fillText(line, left, (y += size * TITLE_LEADING));
  return y;
}

function drawLede(face: PrintedFace, lede: string, left: number, width: number, top: number): number {
  const { context } = face;
  const px = face.scale / 1000;
  const size = MM.lede * px;
  context.font = `400 ${size}px ${printFonts().body}`;
  context.fillStyle = MUTED;
  let y = top;
  for (const line of wrap(context, lede, width)) context.fillText(line, left, (y += size * LEDE_LEADING));
  return y;
}

function drawFacts(face: PrintedFace, facts: BioPrint['facts'], left: number, width: number, top: number): void {
  const { context } = face;
  const px = face.scale / 1000;
  const fonts = printFonts();
  const valueLeft = left + width * LABEL_COLUMN;
  let y = top;
  for (const [index, fact] of facts.entries()) {
    if (index > 0) {
      context.fillStyle = `${MUTED}44`;
      context.fillRect(left, y - MM.rowGap * px * 0.55, width, Math.max(1, px * 0.4));
    }
    y += MM.value * px;
    context.font = `500 ${MM.label * px}px ${fonts.body}`;
    context.fillStyle = MUTED;
    context.fillText(fact.label, left, y, width * LABEL_COLUMN - px * 3);
    context.font = `600 ${MM.value * px}px ${fonts.body}`;
    context.fillStyle = INK;
    context.fillText(fact.value, valueLeft, y, width - width * LABEL_COLUMN);
    y += MM.rowGap * px;
  }
}

export function drawBioCard(face: PrintedFace, bio: BioPrint): void {
  const { context, canvas } = face;
  const px = face.scale / 1000;
  const left = MM.margin * px;
  const width = canvas.width - left * 2;
  context.textBaseline = 'alphabetic';
  context.textAlign = 'left';
  context.fillStyle = PAPER;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = ACCENT;
  context.fillRect(0, 0, canvas.width, MM.band * px);
  const titleEnd = drawTitle(face, bio.title, left, width, (MM.band + MM.margin * 0.6) * px);
  const ledeEnd = drawLede(face, bio.lede, left, width, titleEnd + px * 2);
  drawFacts(face, bio.facts, left, width, ledeEnd + MM.rowGap * px * 1.2);
  face.texture.needsUpdate = true;
}
