import { LANDING, TAKEOFF } from './beats';
import { ease, easeOut, hold, pulse, span } from './curves';
import type { BattleFrame } from './frame';

export const HOVER = 0.032;
const HOVER_FLAP = 0.34;
const GLIDE_FLAP = 0.56;
const BOB = 0.003;

export function flapPhase(t: number): number {
  const hover = (Math.min(t, LANDING.glide) - TAKEOFF.flaps) / HOVER_FLAP;
  return hover + Math.max(t - LANDING.glide, 0) / GLIDE_FLAP;
}

function takeoff(t: number, frame: BattleFrame): number {
  const dip = pulse(t, TAKEOFF.dip[0], TAKEOFF.dip[1]);
  frame.charizard.squash += 0.1 * dip;
  frame.charizard.wings += 0.5 * dip;
  frame.charizard.lean += 0.05 * dip;
  const lift = HOVER * easeOut(span(t, TAKEOFF.launch[0], TAKEOFF.launch[1])) * (1 - ease(span(t, LANDING.descend[0], LANDING.descend[1])));
  frame.charizard.lift += lift;
  return lift;
}

function flaps(t: number, frame: BattleFrame, lift: number): void {
  const air = hold(t, [TAKEOFF.flaps - 0.05, TAKEOFF.flaps + 0.15], LANDING.rest);
  if (air <= 0) return;
  const turn = flapPhase(t) * Math.PI * 2;
  const stroke = Math.sin(turn);
  const rising = Math.cos(turn);
  const amplitude = 0.55 - 0.2 * span(t, LANDING.glide, LANDING.glide + 0.3);
  frame.charizard.wings += air * (0.3 + amplitude * stroke);
  frame.charizard.fold += air * 0.7 * Math.max(0, rising);
  frame.charizard.lift -= BOB * rising * Math.min(1, lift / 0.01) * air;
  frame.charizard.lean += air * (0.06 + 0.04 * rising);
}

export function addFlight(t: number, frame: BattleFrame): void {
  const lift = takeoff(t, frame);
  flaps(t, frame, lift);
  frame.charizard.squash += 0.12 * pulse(t, LANDING.touch[0], LANDING.touch[1]);
}
