import { CORKBOARD, type FaceRect } from '../layout';
import type { PrintFonts } from '../paper';

export const INK = '#1c2230';
export const MARKER = '#1d1a1f';

/** The cork print's canvas, addressed in board-face metres (x right, y up from the board's bottom-left). */
export interface BoardCanvas {
  context: CanvasRenderingContext2D;
  /** Canvas pixels per metre. */
  scale: number;
  fonts: PrintFonts;
}

export function corkArea(): { width: number; height: number } {
  return { width: CORKBOARD.width - 2 * CORKBOARD.frame, height: CORKBOARD.height - 2 * CORKBOARD.frame };
}

export function toCanvas(board: BoardCanvas, x: number, y: number): [number, number] {
  return [(x - CORKBOARD.frame) * board.scale, (corkArea().height - (y - CORKBOARD.frame)) * board.scale];
}

/**
 * Runs `draw` with the canvas origin at the rect's centre, turned by its rotation, so it can draw
 * a `width` × `height` pixel piece from (−width/2, −height/2).
 */
export function inRect(board: BoardCanvas, rect: FaceRect, draw: (width: number, height: number) => void): void {
  const { context, scale } = board;
  const [cx, cy] = toCanvas(board, rect.x + rect.width / 2, rect.y + rect.height / 2);
  context.save();
  context.translate(cx, cy);
  context.rotate(-(rect.rotation ?? 0));
  draw(rect.width * scale, rect.height * scale);
  context.restore();
}

/** Largest font size (px) from `largest` down to `smallest` metres at which `text` fits in `width` px. */
export function fitFont(board: BoardCanvas, text: string, style: string, width: number, largest: number, smallest: number): number {
  const { context, scale } = board;
  let size = largest * scale;
  const floor = smallest * scale;
  for (;;) {
    context.font = `${style} ${size}px ${board.fonts.hand}`;
    if (context.measureText(text).width <= width || size <= floor) return size;
    size = Math.max(floor, size * 0.94);
  }
}

export function withShadow(context: CanvasRenderingContext2D, blur: number, offsetX: number, offsetY: number, alpha: number, draw: () => void): void {
  context.save();
  context.shadowColor = `rgba(20, 12, 4, ${alpha})`;
  context.shadowBlur = blur;
  context.shadowOffsetX = offsetX;
  context.shadowOffsetY = offsetY;
  draw();
  context.restore();
}
