import type { Mesh } from 'three';
import { OBJECT_ID } from '../builder';
import { FIGURE_HEIGHT, FIGURES, PRODUCT_FIGURES, type FigureId } from '../layout';
import type { DeskLife } from '../life';
import type { AtlasUniforms } from '../materials';
import { damp, towards } from '../math';
import type { DeskFrame } from './frame';
import { MAX_TURN_SPEED, type LightLevels } from './levels';
import { FIGURE_INTRO, storyRank } from './story';

export const FIGURE_ORDER: readonly FigureId[] = ['alfa', 'ventixs', 'parati', 'skymek'];
const DIM_PRESENCE = 0.18;
const DIM_PRESENCE_DAY = 0.5;
const PRESENCE_DELAY = 0.2;
const FIGURE_LIFT = 0.012;
const HOVER_LIFT = 0.003;
const FOCUS_BOUNCE = 0.03;

function neonStart(current: number, since: number, dt: number): number {
  if (since < 0.06) return 1;
  if (since < 0.18) return DIM_PRESENCE;
  return damp(current, 1, 9, dt);
}

export class DeskFigures {
  private readonly presence = new Map<FigureId, number>(FIGURE_ORDER.map(id => [id, 1]));
  private readonly neonSince = new Map<FigureId, number>();
  private readonly lift = new Map<FigureId, number>(FIGURE_ORDER.map(id => [id, 0]));
  private readonly yaw = new Map<FigureId, number>(FIGURE_ORDER.map(id => [id, 0]));

  setPivots(uniforms: AtlasUniforms): void {
    FIGURE_ORDER.forEach((id, index) => uniforms.uFigPivot.value[index]!.copy(FIGURES[id]));
  }

  update(frame: DeskFrame): boolean {
    const { chapter, rank, motion, time, settledAt, step, day } = frame;
    let settling = false;
    for (const id of FIGURE_ORDER) {
      const [introChapter, introSub] = FIGURE_INTRO[id];
      const introRank = storyRank(introChapter, introSub);
      const goal = chapter === 'outro' || rank >= introRank ? 1 : day ? DIM_PRESENCE_DAY : DIM_PRESENCE;
      const current = this.presence.get(id)!;
      const ready = settledAt >= 0 && time - settledAt >= PRESENCE_DELAY;
      if (motion && rank === introRank && ready && current < 0.5 && !this.neonSince.has(id)) this.neonSince.set(id, time);
      if (rank !== introRank) this.neonSince.delete(id);
      const started = this.neonSince.get(id);
      let next = current;
      if (started !== undefined) next = neonStart(current, time - started, step);
      else if (!motion || rank !== introRank || goal < current) next = damp(current, goal, motion ? 4 : 10, step);
      this.presence.set(id, next);
      settling ||= Math.abs(next - goal) > 0.003;
    }
    return settling;
  }

  updateLift(frame: DeskFrame, focused: FigureId | null, hoverId: number): boolean {
    const { motion, step, dt } = frame;
    let settling = false;
    for (const id of PRODUCT_FIGURES) {
      const hovered = OBJECT_ID[id] === hoverId;
      const goal = id === focused ? FIGURE_LIFT : hovered ? HOVER_LIFT : 0;
      const lift = damp(this.lift.get(id)!, goal, id !== focused && (hovered || this.lift.get(id)! <= HOVER_LIFT) ? 14 : 5, step);
      this.lift.set(id, lift);
      settling ||= Math.abs(lift - goal) > 1e-4;
      const yaw = this.yaw.get(id)!;
      this.yaw.set(id, id === focused && motion ? yaw + MAX_TURN_SPEED * dt : towards(yaw, 0, MAX_TURN_SPEED * step));
      if (id === focused && motion) settling = true;
    }
    return settling;
  }

  poseKey(level: LightLevels, life: DeskLife | null): string {
    const parts = [Math.round(level.alfaYaw * 200)];
    for (const id of FIGURE_ORDER) {
      const play = life?.offset(id);
      parts.push(Math.round(((this.lift.get(id) ?? 0) + (play?.lift ?? 0)) * 2000), Math.round(((this.yaw.get(id) ?? 0) + (play?.yaw ?? 0)) * 200));
    }
    return `${parts.join(',')}|${life?.poseKey() ?? ''}`;
  }

  apply(uniforms: AtlasUniforms, level: LightLevels, life: DeskLife | null): void {
    FIGURE_ORDER.forEach((id, index) => {
      const play = life?.offset(id) ?? { lift: 0, yaw: 0 };
      uniforms.uFigLift.value[index] = (this.lift.get(id) ?? 0) + play.lift;
      uniforms.uFigYaw.value[index] = (id === 'alfa' ? level.alfaYaw : (this.yaw.get(id) ?? 0)) + play.yaw;
    });
    uniforms.uSignal.value[OBJECT_ID.alfa] = level.alfaSignal * (life?.signalGain() ?? 1);
    uniforms.uGlow.value[OBJECT_ID.alfa] = life?.glow('alfa') ?? 0;
    uniforms.uGlow.value[OBJECT_ID.phone] = life?.glow('phone') ?? 0;
    for (const id of PRODUCT_FIGURES) uniforms.uGlow.value[OBJECT_ID[id]] = ((this.lift.get(id) ?? 0) / FIGURE_LIFT) * FOCUS_BOUNCE + (life?.glow(id) ?? 0);
    for (const id of FIGURE_ORDER) uniforms.uPresence.value[OBJECT_ID[id]] = this.presence.get(id) ?? 1;
  }

  applyProxies(proxies: Map<string, Mesh>): void {
    for (const id of PRODUCT_FIGURES) {
      const proxy = proxies.get(id);
      if (proxy) proxy.position.y = FIGURES[id].y + FIGURE_HEIGHT[id] / 2 + (this.lift.get(id) ?? 0);
    }
  }
}
