import { Vector3 } from 'three';

export interface BeatPose {
  offset: Vector3;
  scale: number;
  tip: number;
}

export type BeatPlace = (age: number, gentle: boolean, pose: BeatPose) => void;

const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);

export function easeOut(t: number): number {
  const x = 1 - clamp01(t);
  return 1 - x * x;
}

function easeOutBack(t: number): number {
  const x = clamp01(t) - 1;
  return 1 + 2.4 * x * x * x + 1.4 * x * x;
}

function popScale(age: number, gentle: boolean): number {
  return gentle ? 1 : Math.max(0.001, easeOutBack(age / 0.32));
}

export function floatUp(from: Vector3, to: Vector3, seconds: number): BeatPlace {
  return (age, gentle, pose) => {
    pose.offset.lerpVectors(from, to, gentle ? 1 : easeOut(age / seconds));
    pose.scale = gentle ? 1 : Math.min(1, 0.35 + 0.65 * easeOutBack(age / 0.4));
    pose.tip = 0;
  };
}

export function popIn(at: Vector3): BeatPlace {
  return (age, gentle, pose) => {
    pose.offset.copy(at);
    pose.scale = popScale(age, gentle);
    pose.tip = 0;
  };
}

const EMERGE = 0.45;
const HOLD = 0.9;
const FALL = 1.35;

export function ticketDrop(slot: Vector3, rise: number, floor: Vector3): BeatPlace {
  const top = slot.clone().setY(slot.y + rise);
  return (age, gentle, pose) => {
    pose.scale = 1;
    if (gentle || age >= FALL) {
      pose.offset.copy(floor);
      pose.offset.y +=
        age < FALL + 0.2 && !gentle ? 0.004 * Math.sin(((age - FALL) / 0.2) * Math.PI) : 0;
      pose.tip = Math.PI / 2;
      return;
    }
    if (age < HOLD) {
      pose.offset.lerpVectors(slot, top, easeOut(age / EMERGE));
      pose.tip = 0.06 * Math.sin(age * 9) * clamp01((age - EMERGE) / 0.2);
      return;
    }
    const fall = (age - HOLD) / (FALL - HOLD);
    pose.offset.lerpVectors(top, floor, fall * fall);
    pose.offset.y += 0.012 * Math.sin(fall * Math.PI) * (1 - fall);
    pose.tip = (Math.PI / 2) * fall * fall;
  };
}

export interface StackStep {
  at: number;
  height: number;
}

export function stackedBubble(
  at: Vector3,
  born: number,
  later: StackStep[],
  gap: number
): BeatPlace {
  const pop = popIn(at);
  return (age, gentle, pose) => {
    pop(age, gentle, pose);
    const now = born + age;
    for (const step of later) {
      if (now < step.at) continue;
      pose.offset.y += (step.height + gap) * (gentle ? 1 : easeOut((now - step.at) / 0.28));
    }
  };
}
