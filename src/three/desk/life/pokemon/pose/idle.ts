export interface IdleClock {
  t: number;
  clock: number;
  weight: number;
  alive: boolean;
  calm: boolean;
}

export function eventPhase(time: number, period: number, seconds: number, offset = 0): { t: number; index: number } {
  const shifted = time + offset;
  const index = Math.floor(shifted / period);
  const t = (shifted - index * period) / seconds;
  return { t: t < 1 ? t : -1, index };
}

export function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function flameNoise(t: number): number {
  return 0.5 * Math.sin(t * 13.1) + 0.3 * Math.sin(t * 21.7 + 1.3) + 0.2 * Math.sin(t * 34.3 + 2.1);
}
