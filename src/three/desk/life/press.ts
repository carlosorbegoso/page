import { bump, progress } from './motion';

const SECONDS = 0.5;
const GLOW = 0.24;

export class PressPulse {
  private readonly startedAt = new Map<string, number>();
  private readonly introduced = new Set<string>();

  pulse(id: string, time: number): void {
    this.startedAt.set(id, time);
  }

  introduce(id: string, time: number): void {
    if (this.introduced.has(id)) return;
    this.introduced.add(id);
    this.pulse(id, time + 0.35);
  }

  glow(id: string, time: number): number {
    const t = progress(this.startedAt.get(id) ?? -1, time, SECONDS);
    return t < 0 ? 0 : GLOW * bump(t);
  }

  update(time: number): boolean {
    for (const [id, since] of this.startedAt) if (progress(since, time, SECONDS) < 0 && time > since) this.startedAt.delete(id);
    return this.startedAt.size > 0;
  }
}
