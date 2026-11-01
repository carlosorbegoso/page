import { readCompany, type CompanyPrint } from '../content';
import { cardShadow, drawRules, writeLines } from '../corkboard/cards';
import { drawCork, drawPinShadows } from '../corkboard/cork';
import { drawPostits, drawTitle } from '../corkboard/postits';
import { inRect, INK, MARKER, type BoardCanvas } from '../corkboard/surface';
import type { FaceRect } from '../layout';
import { printFonts, wrap, type PrintSurface } from '../paper';

const NOTE: FaceRect = { x: 0.117, y: 0.02, width: 0.21, height: 0.208, rotation: -0.01 };
const CARD_WHITE = '#f6f2e8';
const PAD = 0.009;
const SIZES = [0.019, 0.018, 0.017, 0.0165];
const TITLE_SMALLEST = 0.029;
const LEADING = { role: 1.25, phrase: 1.34, brand: 1.2 } as const;

interface NotePlan {
  size: number;
  role: string[];
  phrase: string[];
  brand: string[];
}

function planHeight(plan: NotePlan, scale: number): number {
  const s = plan.size * scale;
  const brand = plan.brand.length ? s * 0.7 + plan.brand.length * s * LEADING.brand : 0;
  return 2 * PAD * scale + plan.role.length * s * LEADING.role + s * 1.2 + plan.phrase.length * s * LEADING.phrase + brand;
}

function planNote(board: BoardCanvas, company: CompanyPrint, textWidth: number, room: number): NotePlan {
  const { context, scale, fonts } = board;
  let plan: NotePlan = { size: SIZES[0]!, role: [], phrase: [], brand: [] };
  for (const size of SIZES) {
    const px = size * scale;
    context.font = `600 ${px}px ${fonts.body}`;
    const role = wrap(context, company.role, textWidth);
    context.font = `400 ${px}px ${fonts.body}`;
    const phrase = wrap(context, company.phrase, textWidth);
    context.font = `700 ${px}px ${fonts.hand}`;
    plan = { size, role, phrase, brand: wrap(context, company.parentBrand, textWidth) };
    if (planHeight(plan, scale) <= room) return plan;
  }
  return { ...plan, brand: [] };
}

function drawStackedNote(board: BoardCanvas, company: CompanyPrint): void {
  const { context, scale, fonts } = board;
  inRect(board, NOTE, (width, height) => {
    const left = -width / 2 + PAD * scale;
    const plan = planNote(board, company, width - 2 * PAD * scale, height);
    const size = plan.size * scale;
    cardShadow(board, () => {
      context.fillStyle = CARD_WHITE;
      context.fillRect(-width / 2, -height / 2, width, height);
    });
    context.textAlign = 'left';
    context.textBaseline = 'alphabetic';
    context.fillStyle = INK;
    context.font = `600 ${size}px ${fonts.body}`;
    const roleEnd = writeLines(context, plan.role, left, -height / 2 + PAD * scale + size, size * LEADING.role);
    const step = size * LEADING.phrase;
    const firstRule = roleEnd + size * 1.2 + size * 0.2;
    drawRules(board, width, height, firstRule + step * 0.12, step);
    context.fillStyle = INK;
    context.font = `400 ${size}px ${fonts.body}`;
    const phraseEnd = writeLines(context, plan.phrase, left, firstRule, step);
    context.fillStyle = MARKER;
    context.font = `700 ${size}px ${fonts.hand}`;
    writeLines(context, plan.brand, left, phraseEnd + size * 0.7 + size * LEADING.brand, size * LEADING.brand);
  });
}

export function drawStackedBoard(face: PrintSurface): void {
  const board: BoardCanvas = { context: face.context, scale: face.scale, fonts: printFonts() };
  const company = readCompany();
  drawCork(board);
  drawTitle(board, company.title, TITLE_SMALLEST);
  drawStackedNote(board, company);
  drawPostits(board);
  drawPinShadows(board);
  face.texture.needsUpdate = true;
}
