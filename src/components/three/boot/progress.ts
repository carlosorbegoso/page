const ROUTE: ReadonlyArray<readonly [value: number, position: number]> = [
  [0, 0],
  [0.12, 0.15],
  [0.3, 0.25],
  [0.55, 1 / 3],
  [0.7, 0.45],
  [0.88, 2 / 3],
  [0.96, 0.9],
  [1, 1]
];
const ASSET_PHASE: readonly [number, number] = [0.7, 0.88];

function along(value: number): number {
  for (let i = 1; i < ROUTE.length; i++) {
    const [v1, p1] = ROUTE[i]!;
    const [v0, p0] = ROUTE[i - 1]!;
    if (value <= v1) return p0 + ((value - v0) / (v1 - v0)) * (p1 - p0);
  }
  return 1;
}

export class RouteProgress {
  private value = 0;
  private loaded = 0;
  private total = 0;

  phase(value: number): void {
    this.value = Math.max(this.value, Math.min(value, 1));
  }

  assets(loaded: number, total: number): void {
    this.loaded = loaded;
    this.total = total;
  }

  position(): number {
    const [from, to] = ASSET_PHASE;
    let value = this.value;
    if (this.total > 0 && value >= from && value < to)
      value = Math.max(value, from + (to - from) * (this.loaded / this.total));
    return along(value);
  }

  assetCount(): string | null {
    return this.total > 1 ? `${this.loaded}/${this.total}` : null;
  }
}
