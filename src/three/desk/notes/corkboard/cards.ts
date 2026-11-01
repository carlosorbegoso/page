import type { CompanyPrint } from '../content';
import { BOARD_LAYOUT } from '../layout';
import { wrap } from '../paper';
import { INK, inRect, MARKER, withShadow, type BoardCanvas } from './surface';

const CARD_WHITE = '#f6f2e8';
const RULE_BLUE = 'rgba(96, 128, 176, 0.32)';
const RULE_RED = 'rgba(196, 70, 62, 0.75)';
const KRAFT = '#c7a374';
const TEXT = { role: 0.0098, phrase: 0.0104, brand: 0.0118 } as const;
const PAD = 0.008;

function cardShadow(board: BoardCanvas, draw: () => void): void {
  const s = board.scale;
  withShadow(board.context, s * 0.003, s * 0.0008, s * 0.0016, 0.4, draw);
}

function drawRules(board: BoardCanvas, width: number, height: number, top: number, step: number): void {
  const { context, scale } = board;
  const left = -width / 2;
  context.lineWidth = Math.max(1, scale * 0.00025);
  context.strokeStyle = RULE_RED;
  context.beginPath();
  context.moveTo(left, top - step);
  context.lineTo(width / 2, top - step);
  context.stroke();
  context.strokeStyle = RULE_BLUE;
  for (let y = top; y < height / 2 - scale * 0.003; y += step) {
    context.beginPath();
    context.moveTo(left, y);
    context.lineTo(width / 2, y);
    context.stroke();
  }
}

function writeLines(context: CanvasRenderingContext2D, lines: string[], x: number, firstBaseline: number, step: number): number {
  lines.forEach((line, index) => context.fillText(line, x, firstBaseline + index * step));
  return firstBaseline + (lines.length - 1) * step;
}

export function drawNote(board: BoardCanvas, company: CompanyPrint): void {
  const { context, scale, fonts } = board;
  inRect(board, BOARD_LAYOUT.note, (width, height) => {
    const left = -width / 2 + PAD * scale;
    const textWidth = width - 2 * PAD * scale;
    cardShadow(board, () => {
      context.fillStyle = CARD_WHITE;
      context.fillRect(-width / 2, -height / 2, width, height);
    });
    context.textAlign = 'left';
    context.textBaseline = 'alphabetic';
    context.fillStyle = INK;
    context.font = `600 ${TEXT.role * scale}px ${fonts.body}`;
    const roleStep = TEXT.role * scale * 1.25;
    const roleLines = wrap(context, company.role, textWidth);
    const roleEnd = writeLines(context, roleLines, left, -height / 2 + PAD * scale + TEXT.role * scale, roleStep);
    const step = TEXT.phrase * scale * 1.42;
    const firstRule = roleEnd + step * 1.2;
    drawRules(board, width, height, firstRule + step * 0.12, step);
    context.fillStyle = INK;
    context.font = `400 ${TEXT.phrase * scale}px ${fonts.body}`;
    writeLines(context, wrap(context, company.phrase, textWidth), left, firstRule, step);
  });
}

function drawArrow(context: CanvasRenderingContext2D, from: number, to: number, y: number, size: number): void {
  context.beginPath();
  context.moveTo(from, y + size * 0.15);
  context.quadraticCurveTo((from + to) / 2, y - size * 0.35, to, y);
  context.moveTo(to - size * 0.42, y - size * 0.32);
  context.lineTo(to, y);
  context.lineTo(to - size * 0.36, y + size * 0.36);
  context.stroke();
}

export function drawAlfaCard(board: BoardCanvas, company: CompanyPrint): void {
  const { context, scale, fonts } = board;
  inRect(board, BOARD_LAYOUT.alfa, (width, height) => {
    cardShadow(board, () => {
      context.fillStyle = KRAFT;
      context.fillRect(-width / 2, -height / 2, width, height);
    });
    const arrowSpan = 0.024 * scale;
    const left = -width / 2 + arrowSpan + 0.009 * scale;
    context.fillStyle = MARKER;
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.font = `700 ${TEXT.brand * scale}px ${fonts.hand}`;
    const lines = wrap(context, company.parentBrand, width - arrowSpan - 0.012 * scale);
    const step = TEXT.brand * scale * 1.2;
    writeLines(context, lines, left, -((lines.length - 1) * step) / 2 + 0.001 * scale, step);
    context.strokeStyle = MARKER;
    context.lineWidth = scale * 0.0011;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.scale(-1, 1);
    drawArrow(context, width / 2 - arrowSpan, width / 2 - 0.005 * scale, 0, 0.012 * scale);
  });
}
