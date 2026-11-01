import { Group, Vector3, type BufferGeometry, type Matrix4, type PointLight } from 'three';
import type { BattleFrame } from '../timeline';
import { LightningBolt } from './bolt';
import { BattleBursts, type BattleAnchors } from './bursts';
import { FireStream } from './fire';
import { FlashLight } from './flash-light';
import { disposeGlow, glowBall, setGlow } from './glow';
import { ParticlePool } from './particles';
import { QuickTrail } from './trail';

export interface VisualsInput {
  frame: BattleFrame;
  anchors: BattleAnchors;
  boltFrom: Vector3;
  time: number;
  dt: number;
  pixelScale: number;
  ghostAt: (lag: number, out: Matrix4) => Matrix4;
}

const LIGHT_RISE = 0.03;
const fireMiddle = new Vector3();
const boltMiddle = new Vector3();

export class BattleVisuals {
  readonly object3D = new Group();
  private readonly fire = new FireStream();
  private readonly bolt = new LightningBolt();
  private readonly glowParticles = new ParticlePool(240, true);
  private readonly smoke = new ParticlePool(64, false);
  private readonly bursts = new BattleBursts(this.glowParticles, this.smoke);
  private readonly impact = glowBall(0.016, '#eaf4ff', 2);
  private readonly mouthGlow = glowBall(0.008, '#ffb060', 1.4);
  private readonly trail: QuickTrail;
  private readonly flash: FlashLight;
  private particlesAlive = false;

  constructor(ghostGeometries: BufferGeometry[], light: PointLight | null) {
    this.trail = new QuickTrail(ghostGeometries);
    this.flash = new FlashLight(light);
    this.object3D.add(this.trail.object3D, this.smoke.points, this.fire.object3D, this.bolt.object3D, this.glowParticles.points, this.impact, this.mouthGlow);
  }

  get moving(): boolean {
    return this.particlesAlive;
  }

  update(input: VisualsInput): void {
    const { frame, anchors, time } = input;
    const e = frame.effects;
    this.fire.update(time, e.fire, anchors.mouth, anchors.fireEnd);
    this.bolt.update(time, e.bolt, e.strike, input.boltFrom, anchors.chest);
    setGlow(this.impact, 0.6 * e.impact * (0.75 + 0.25 * Math.sin(time * 60)), anchors.chest, 1 + 0.6 * e.impact);
    setGlow(this.mouthGlow, e.mouthGlow, anchors.mouth);
    this.trail.update(e.trail, input.ghostAt);
    if (!frame.calm) this.bursts.emit(e, anchors, input.dt);
    this.particlesAlive = this.glowParticles.step(input.dt, input.pixelScale);
    this.particlesAlive = this.smoke.step(input.dt, input.pixelScale) || this.particlesAlive;
    fireMiddle.lerpVectors(anchors.mouth, anchors.fireEnd, 0.5);
    boltMiddle.lerpVectors(input.boltFrom, anchors.chest, 0.5);
    const share = e.fire + e.bolt > 0 ? e.bolt / (e.fire + e.bolt) : 0;
    fireMiddle.lerp(boltMiddle, share).y += LIGHT_RISE;
    this.flash.apply(frame.calm ? 0 : e.fire, frame.calm ? 0 : e.bolt, fireMiddle, time);
  }

  reset(): void {
    this.bursts.reset();
    this.glowParticles.clear();
    this.smoke.clear();
  }

  dispose(): void {
    this.fire.dispose();
    this.bolt.dispose();
    this.glowParticles.dispose();
    this.smoke.dispose();
    this.trail.dispose();
    disposeGlow(this.impact);
    disposeGlow(this.mouthGlow);
  }
}
