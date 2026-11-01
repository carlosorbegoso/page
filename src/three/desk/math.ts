/** Frame-rate independent exponential approach of `current` towards `goal`. */
export function damp(current: number, goal: number, rate: number, dt: number): number {
  return current + (goal - current) * (1 - Math.exp(-rate * dt));
}

/** Moves `current` towards `goal` by at most `maxStep`. */
export function towards(current: number, goal: number, maxStep: number): number {
  return current + Math.max(-maxStep, Math.min(maxStep, goal - current));
}

/** Deterministic 0..1 generator (mulberry32), so procedural props look the same on every load. */
export function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
