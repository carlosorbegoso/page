const STORAGE_KEY = 'desk:blind';
const DROP_SECONDS = 1.05;
const RAISE_SECONDS = 1.15;
const OVERSHOOT = 0.9;

function readStored(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'down';
  } catch {
    return false;
  }
}

function store(down: boolean): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, down ? 'down' : 'up');
  } catch {
    return;
  }
}

/** Soft start, then a back-out that overshoots a few percent and settles: a weighted bar on a spring roller. */
export function blindEase(t: number): number {
  const p = Math.min(Math.max(t, 0), 1);
  const u = p * p * (2 - p) - 1;
  return 1 + (OVERSHOOT + 1) * u * u * u + OVERSHOOT * u * u;
}

/** Eased blind position (0 rolled up, 1 down), driven by the clock so it finishes even after the idle-motion window closes. */
export class BlindTravel {
  down = readStored();
  value = this.down ? 1 : 0;
  private from = this.value;
  private startedAt = -1;
  private pending = false;

  /** The start is latched on the next frame: a click can arrive while the loop is asleep and the desk clock is stale. */
  toggle(animate: boolean): boolean {
    this.from = this.value;
    this.down = !this.down;
    store(this.down);
    this.pending = animate;
    this.startedAt = -1;
    return this.down;
  }

  update(time: number): boolean {
    const goal = this.down ? 1 : 0;
    if (this.pending) {
      this.pending = false;
      this.startedAt = time;
    }
    if (this.startedAt < 0) {
      this.value = goal;
      return false;
    }
    const t = (time - this.startedAt) / (this.down ? DROP_SECONDS : RAISE_SECONDS);
    if (t >= 1) {
      this.startedAt = -1;
      this.value = goal;
      return false;
    }
    this.value = Math.max(this.from + (goal - this.from) * blindEase(t), 0);
    return true;
  }
}
