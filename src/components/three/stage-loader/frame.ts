export interface Point {
  x: number;
  y: number;
}

export interface PosterFrame {
  media: string;
  width: number;
  height: number;
  lamp: Point;
  cone: Point;
  monitor: [left: number, right: number, bottom: number];
}

export interface RevealDetail {
  intro: boolean;
  lamp: Point | null;
}

export const POSTERS: PosterFrame[] = [
  { media: '(min-width: 1024px)', width: 1440, height: 900, lamp: { x: 0.925, y: 0.385 }, cone: { x: -0.12, y: 1 }, monitor: [0.17, 0.665, 0.69] },
  { media: '(min-width: 768px)', width: 768, height: 1024, lamp: { x: 1.04, y: 0.6 }, cone: { x: -0.6, y: 1 }, monitor: [0.195, 0.805, 0.547] },
  { media: 'all', width: 375, height: 667, lamp: { x: 1.12, y: 0.55 }, cone: { x: -0.6, y: 1 }, monitor: [0.165, 0.835, 0.742] }
];

export const CANVAS_FADE_S = 0.4;
export const LAMP_RAMP: [number, number] = [0.45, 0.95];

export const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function posterToScreen(p: Point, poster: PosterFrame, width: number, height: number): Point {
  const cover = Math.max(width / poster.width, height / poster.height);
  return { x: (width - poster.width * cover) / 2 + p.x * poster.width * cover, y: (height - poster.height * cover) / 2 + p.y * poster.height * cover };
}
