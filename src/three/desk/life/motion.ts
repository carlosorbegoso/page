/** 0 → 1 → 0 over t ∈ [0, 1] (half sine); 0 outside. */
export function bump(t: number): number {
  return t <= 0 || t >= 1 ? 0 : Math.sin(Math.PI * t);
}

/** Progress 0..1 of a one-shot started at `since` (−1 = idle), or −1 once it is over. */
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
