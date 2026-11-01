import { posterToScreen, type Point, type PosterFrame } from './frame';
import type { Painter } from './paint';

const LAMP_RGB = '255,181,102';
const MONITOR_RGB = '127,184,255';
const SUN_RGB = '255,241,220';

export interface LoaderFrame {
  width: number;
  height: number;
  time: number;
  moving: boolean;
  warm: number;
  scene: number;
  light: number;
}

export function paintDay(painter: Painter, f: LoaderFrame): void {
  const { ctx } = painter;
  const minSide = Math.min(f.width, f.height);
  ctx.fillStyle = `rgba(223,232,242,${(0.06 + (f.moving ? 0.3 : 0.12) * f.warm) * f.scene})`;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalCompositeOperation = 'lighter';
  const sun = { x: f.width * 0.9, y: -f.height * 0.08 };
  const beam = { x: -0.55, y: 1 };
  painter.cone({ origin: sun, direction: beam, length: f.height * 1.15, spread: minSide * 0.32 }, SUN_RGB, 0.12 * (0.4 + 0.6 * f.warm) * f.light);
  painter.motesAlong({ origin: sun, direction: beam, length: f.height * 1.1, spread: minSide * 0.3 }, SUN_RGB, 0.55 * f.light, f.moving ? f.time : 0);
}

export function paintNight(painter: Painter, f: LoaderFrame, veil: number, lamp: Point, cone: Point): void {
  const { ctx } = painter;
  const minSide = Math.min(f.width, f.height);
  ctx.fillStyle = `rgba(4,6,11,${veil * f.scene})`;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalCompositeOperation = 'lighter';
  const flicker = f.moving ? 0.9 + 0.1 * Math.sin(f.time * 23) * Math.sin(f.time * 3.1) : 1;
  const filament = (0.18 + 0.72 * f.warm) * flicker * f.light;
  painter.cone({ origin: lamp, direction: cone, length: minSide * 0.62, spread: minSide * 0.2 }, LAMP_RGB, 0.07 * filament);
  painter.glow(lamp, minSide * 0.17, LAMP_RGB, 0.16 * filament);
  painter.glow(lamp, minSide * (0.025 + 0.02 * f.warm), '255,214,160', 0.9 * filament);
  painter.motesAlong({ origin: lamp, direction: cone, length: minSide * 0.6, spread: minSide * 0.18 }, LAMP_RGB, 0.8 * filament, f.moving ? f.time : 0);
}

export function paintBootLine(painter: Painter, f: LoaderFrame, poster: PosterFrame, shown: number): void {
  const { ctx, scale } = painter;
  const [left, right, bottom] = poster.monitor;
  const start = posterToScreen({ x: left, y: bottom }, poster, f.width, f.height);
  const end = posterToScreen({ x: right, y: bottom }, poster, f.width, f.height);
  const y = (start.y - 5) * scale;
  const head = start.x + (end.x - start.x) * shown;
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = `rgba(${MONITOR_RGB},${0.12 * f.scene})`;
  ctx.fillRect(start.x * scale, y, (end.x - start.x) * scale, scale);
  ctx.fillStyle = `rgba(${MONITOR_RGB},${0.6 * f.scene})`;
  ctx.fillRect(start.x * scale, y - scale * 0.5, (head - start.x) * scale, scale * 2);
  painter.glow({ x: head, y: start.y - 5 }, 10, MONITOR_RGB, 0.7 * f.scene);
  ctx.globalCompositeOperation = 'source-over';
}
