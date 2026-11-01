import { seeded } from '../../math';
import { pinSpots } from './pins';
import { toCanvas, type BoardCanvas } from './surface';

const CORK_BASE = '#b98d5c';
const SPECKLE = ['#8a5f34', '#9b6d3f', '#a77a49', '#c99d6a', '#d6b080', '#74502c'];
const GRANULE_DENSITY = 900_000;

function speckle(board: BoardCanvas): void {
  const { context, scale } = board;
  const { width, height } = context.canvas;
  const random = seeded(23);
  const count = Math.round(((width * height) / (scale * scale)) * GRANULE_DENSITY);
  const grain = Math.max(1, scale * 0.0004);
  for (let i = 0; i < count; i++) {
    context.globalAlpha = 0.35 + random() * 0.5;
    context.fillStyle = SPECKLE[Math.floor(random() * SPECKLE.length)]!;
    const size = grain * (0.6 + random() * 2.2);
    context.fillRect(random() * width, random() * height, size, size * (0.6 + random() * 0.8));
  }
  context.globalAlpha = 1;
}

function frameShade(context: CanvasRenderingContext2D, reach: number): void {
  const { width, height } = context.canvas;
  const edges: Array<[number, number, number, number, number, number, number, number]> = [
    [0, 0, 0, reach, 0, 0, width, reach],
    [0, height, 0, height - reach, 0, height - reach, width, reach],
    [0, 0, reach, 0, 0, 0, reach, height],
    [width, 0, width - reach, 0, width - reach, 0, reach, height]
  ];
  for (const [x0, y0, x1, y1, rx, ry, rw, rh] of edges) {
    const gradient = context.createLinearGradient(x0, y0, x1, y1);
    gradient.addColorStop(0, 'rgba(40, 22, 8, 0.45)');
    gradient.addColorStop(1, 'rgba(40, 22, 8, 0)');
    context.fillStyle = gradient;
    context.fillRect(rx, ry, rw, rh);
  }
}

export function drawCork(board: BoardCanvas): void {
  const { context, scale } = board;
  context.fillStyle = CORK_BASE;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  speckle(board);
  frameShade(context, scale * 0.01);
}

export function drawPinShadows(board: BoardCanvas): void {
  const { context, scale } = board;
  for (const pin of pinSpots()) {
    const [x, y] = toCanvas(board, pin.x, pin.y);
    const radius = scale * 0.006;
    const gradient = context.createRadialGradient(x + radius * 0.5, y + radius * 0.6, 0, x + radius * 0.5, y + radius * 0.6, radius);
    gradient.addColorStop(0, 'rgba(20, 12, 4, 0.45)');
    gradient.addColorStop(1, 'rgba(20, 12, 4, 0)');
    context.fillStyle = gradient;
    context.fillRect(x - radius, y - radius, radius * 3, radius * 3);
  }
}
