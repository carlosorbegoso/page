const CHECKPOINTS = [0.04, 0.12, 0.3, 0.55, 0.7, 0.78, 0.88, 0.96, 1];

export const FIRST_CHECKPOINT = CHECKPOINTS[0]!;

/** Load progress that only moves forward and creeps towards the next checkpoint while waiting. */
export class LoadProgress {
  private checkpoint = 0;
  private checkpointAt = performance.now();

  set(value: number): void {
    if (value <= this.checkpoint) return;
    this.checkpoint = value;
    this.checkpointAt = performance.now();
  }

  goal(now: number): number {
    const next = CHECKPOINTS.find(c => c > this.checkpoint + 1e-3) ?? 1;
    return this.checkpoint + (next - this.checkpoint) * 0.85 * (1 - Math.exp(-(now - this.checkpointAt) / 3000));
  }
}
