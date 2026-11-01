import { readProduct } from '../content';
import { BOARD_LAYOUT, type ProductId } from '../layout';
import { fitFont, inRect, MARKER, withShadow, type BoardCanvas } from './surface';

const POSTIT_COLORS: Record<ProductId, string> = { skymek: '#f5a14a', parati: '#f28ba0', ventixs: '#5fcf96' };
const TITLE = { largest: 0.042, smallest: 0.026, rotation: -0.035 } as const;
const NAME = { largest: 0.022, smallest: 0.016 } as const;
const HINT = 0.0115;
const CURL = 0.016;

function stickyPath(context: CanvasRenderingContext2D, width: number, height: number, curl: number): void {
  const left = -width / 2;
  const top = -height / 2;
  context.beginPath();
  context.moveTo(left, top);
  context.lineTo(-left, top);
  context.lineTo(-left, -top - curl);
  context.quadraticCurveTo(-left - curl * 0.15, -top - curl * 0.1, -left - curl * 1.4, -top);
  context.lineTo(left, -top);
  context.closePath();
}

function drawSticky(board: BoardCanvas, color: string, width: number, height: number): void {
  const { context, scale } = board;
  const curl = CURL * scale;
  context.save();
  context.fillStyle = 'rgba(20, 12, 4, 0.5)';
  context.filter = `blur(${scale * 0.0022}px)`;
  context.beginPath();
  context.ellipse(width / 2 - curl * 0.7, height / 2 - curl * 0.1, curl * 0.9, curl * 0.35, -0.6, 0, Math.PI * 2);
  context.fill();
  context.restore();
  withShadow(context, scale * 0.0016, 0, scale * 0.0008, 0.3, () => {
    context.fillStyle = color;
    stickyPath(context, width, height, curl);
    context.fill();
  });
  const shade = context.createLinearGradient(0, -height / 2, 0, height / 2);
  shade.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
  shade.addColorStop(0.18, 'rgba(0, 0, 0, 0)');
  shade.addColorStop(0.8, 'rgba(255, 255, 255, 0.06)');
  shade.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
  context.fillStyle = shade;
  stickyPath(context, width, height, curl);
  context.fill();
}

function drawPostit(board: BoardCanvas, id: ProductId): void {
  const { context, scale, fonts } = board;
  inRect(board, BOARD_LAYOUT.postits[id], (width, height) => {
    drawSticky(board, POSTIT_COLORS[id], width, height);
    const name = readProduct(id).name;
    context.fillStyle = MARKER;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    fitFont(board, name, '700', width - 0.012 * scale, NAME.largest, NAME.smallest);
    context.fillText(name, 0, -height * 0.08);
    context.globalAlpha = 0.75;
    context.textAlign = 'right';
    context.font = `600 ${HINT * scale}px ${fonts.body}`;
    context.fillText('→', width / 2 - CURL * scale * 1.1, height / 2 - 0.009 * scale);
    context.globalAlpha = 1;
  });
}

export function drawTitle(board: BoardCanvas, title: string): void {
  const { context } = board;
  const rect = { ...BOARD_LAYOUT.title, rotation: TITLE.rotation };
  inRect(board, rect, width => {
    context.fillStyle = MARKER;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    fitFont(board, title, '700', width, TITLE.largest, TITLE.smallest);
    context.fillText(title, 0, 0);
  });
}

export function drawPostits(board: BoardCanvas): void {
  for (const id of Object.keys(POSTIT_COLORS) as ProductId[]) drawPostit(board, id);
}
