export function bump(t: number): number {
  return t <= 0 || t >= 1 ? 0 : Math.sin(Math.PI * t);
}

export function progress(since: number, time: number, seconds: number): number {
  if (since < 0) return -1;
  const t = (time - since) / seconds;
  return t >= 1 ? -1 : Math.max(t, 0);
}

export interface FigureOffset {
  lift: number;
  yaw: number;
}

export const STILL: FigureOffset = { lift: 0, yaw: 0 };
