import { Color, Vector3 } from 'three';
import type { BattleEffects } from '../timeline';
import type { ParticlePool, ParticleSpec } from './particles';

export interface BattleAnchors {
  mouth: Vector3;
  fireEnd: Vector3;
  cheeks: [Vector3, Vector3];
  chest: Vector3;
  facing: Vector3;
}

const EMBER: ParticleSpec = { size: 0.0024, life: 0.45, drag: 2.2, gravity: -0.04, grow: -0.5 };
const SPLASH: ParticleSpec = { size: 0.0019, life: 0.5, drag: 1.5, gravity: 0.18, grow: -0.3 };
const CRACKLE: ParticleSpec = { size: 0.0013, life: 0.16, drag: 6, gravity: 0, grow: -0.6 };
const SPARK: ParticleSpec = { size: 0.0017, life: 0.38, drag: 2.5, gravity: 0.35, grow: -0.6 };
const SMOKE: ParticleSpec = { size: 0.008, life: 1.05, drag: 1.2, gravity: -0.012, grow: 2 };
const PUFF: ParticleSpec = { size: 0.006, life: 0.9, drag: 2, gravity: -0.02, grow: 2.5 };
const EMBER_COLORS = [new Color('#ffcf5a'), new Color('#ff8a2a'), new Color('#ff5a1a')];
const SPARK_COLORS = [new Color('#ffffff'), new Color('#fff0a0'), new Color('#a8d0ff')];
const SMOKE_COLOR = new Color('#2e2a28');
const PUFF_COLOR = new Color('#4a4644');
const STRIKE_SPARKS = 18;

const at = new Vector3();
const velocity = new Vector3();
const scatter = (out: Vector3, amount: number) => out.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(amount * 2);
const pick = (colors: Color[]) => colors[Math.floor(Math.random() * colors.length)]!;

export class BattleBursts {
  private readonly owed = new Map<string, number>();
  private strike = -1;

  constructor(
    private readonly glow: ParticlePool,
    private readonly smoke: ParticlePool
  ) {}

  emit(effects: BattleEffects, anchors: BattleAnchors, dt: number): void {
    this.fire(effects.fire, anchors, dt);
    this.every('crackle', 55 * effects.crackle, dt, () => {
      at.copy(anchors.cheeks[Math.random() < 0.5 ? 0 : 1]).add(scatter(velocity, 0.002));
      this.glow.emit(at, scatter(velocity, 0.14), pick(SPARK_COLORS), CRACKLE);
    });
    this.every('smoke', 14 * effects.smoke, dt, () => {
      at.copy(anchors.chest).add(scatter(velocity, 0.006));
      this.smoke.emit(at, scatter(velocity, 0.01).add(new Vector3(0, 0.03, 0)), SMOKE_COLOR, SMOKE);
    });
    this.every('puff', 24 * effects.puff, dt, () => {
      velocity.copy(anchors.facing).multiplyScalar(0.035).add(scatter(at, 0.01));
      velocity.y += 0.02;
      this.smoke.emit(anchors.mouth, velocity, PUFF_COLOR, PUFF);
    });
    if (effects.strike !== this.strike && effects.strike >= 0) this.burst(anchors.chest);
    this.strike = effects.strike;
  }

  private fire(amount: number, anchors: BattleAnchors, dt: number): void {
    if (amount < 0.1) return;
    this.every('ember', 110 * amount, dt, () => {
      at.lerpVectors(anchors.mouth, anchors.fireEnd, Math.random() * Math.min(1, amount * 1.6));
      velocity.subVectors(anchors.fireEnd, anchors.mouth).normalize().multiplyScalar(0.08).add(scatter(at.clone(), 0.03));
      this.glow.emit(at.add(scatter(velocity.clone(), 0.002)), velocity, pick(EMBER_COLORS), EMBER);
    });
    this.every('splash', 45 * Math.max(0, amount * 1.6 - 0.6), dt, () => {
      scatter(velocity, 0.12);
      velocity.y = Math.abs(velocity.y) + 0.05;
      this.glow.emit(anchors.fireEnd, velocity, pick(EMBER_COLORS), SPLASH);
    });
  }

  private burst(origin: Vector3): void {
    for (let i = 0; i < STRIKE_SPARKS; i++) {
      scatter(velocity, 1).normalize().multiplyScalar(0.15 + Math.random() * 0.18);
      this.glow.emit(origin, velocity, pick(SPARK_COLORS), SPARK);
    }
  }

  private every(key: string, rate: number, dt: number, spawn: () => void): void {
    let owed = (this.owed.get(key) ?? 0) + rate * dt;
    for (; owed >= 1; owed--) spawn();
    this.owed.set(key, rate > 0 ? owed : 0);
  }

  reset(): void {
    this.owed.clear();
    this.strike = -1;
  }
}
