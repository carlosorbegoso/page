import type { ChapterId } from '../../contracts';
import { damp, towards } from '../math';
import { BlindTravel } from './blind-travel';
import type { DeskFrame } from './frame';
import { LATENESS } from './story';

interface ChapterLight {
  lamp: number;
  monitor: number;
  moon: number;
  shelf: number;
}

const CHAPTER_LIGHT: Record<ChapterId, ChapterLight> = {
  intro: { lamp: 28, monitor: 5, moon: 0.7, shelf: 0 },
  hero: { lamp: 28, monitor: 5, moon: 0.7, shelf: 0 },
  about: { lamp: 18, monitor: 6, moon: 0.6, shelf: 0 },
  company: { lamp: 30, monitor: 1.5, moon: 0.6, shelf: 0 },
  products: { lamp: 26, monitor: 1.5, moon: 0.55, shelf: 0 },
  experience: { lamp: 5, monitor: 6, moon: 1.1, shelf: 1.25 },
  contact: { lamp: 20, monitor: 1, moon: 0.5, shelf: 0 },
  outro: { lamp: 0, monitor: 0.6, moon: 1.2, shelf: 0 }
};

const CHAPTER_LIGHT_DAY: Record<ChapterId, ChapterLight> = {
  intro: { lamp: 0, monitor: 5, moon: 2.2, shelf: 0 },
  hero: { lamp: 0, monitor: 5, moon: 2.2, shelf: 0 },
  about: { lamp: 0, monitor: 5, moon: 2.2, shelf: 0 },
  experience: { lamp: 0, monitor: 5, moon: 2.6, shelf: 1.6 },
  company: { lamp: 0, monitor: 1.5, moon: 1.7, shelf: 0 },
  products: { lamp: 0, monitor: 1.5, moon: 1.6, shelf: 0 },
  contact: { lamp: 0, monitor: 1, moon: 1.3, shelf: 0 },
  outro: { lamp: 22, monitor: 0.6, moon: 0.6, shelf: 0 }
};
const LAMP_SWITCH_DAY: Partial<Record<ChapterId, number>> = { outro: 0.4 };

const LAMP_SWITCH: Partial<Record<ChapterId, number>> = { company: 0.3, outro: 0.4 };
const ALFA_TURN = 20 * (Math.PI / 180);
export const MAX_TURN_SPEED = 0.05;

const USER_LAMP_FLOOR = 22;
const MODE_RATE = 4.5;
const CHAPTER_AMBIENT_RATE = 1.6;

function filamentRamp(since: number): number {
  if (since < 0.03) return 0.4;
  if (since < 0.055) return 0.12;
  const rise = Math.min((since - 0.055) / 0.12, 1);
  return rise * rise * (3 - 2 * rise) * (1 + 0.05 * Math.sin(since * 140) * (1 - rise));
}

function filamentSwitch(current: number, goal: number, since: number, dt: number): number {
  if (goal > current && since < 0.18) return goal * filamentRamp(since);
  return damp(current, goal, goal < current ? 22 : 16, dt);
}

function introLevels(t: number): { lamp: number; monitor: number } {
  const flash = (start: number) => (t >= start && t < start + 0.06 ? 0.7 : 0);
  const ramp = Math.min(Math.max((t - 0.45) / 0.5, 0), 1);
  const lamp = Math.max(flash(0.15), flash(0.33), ramp * ramp * (3 - 2 * ramp));
  const monitor = Math.min(Math.max((t - 0.95) / 0.3, 0), 1);
  return { lamp, monitor };
}

export interface LightLevels {
  lamp: number;
  monitor: number;
  moon: number;
  shelf: number;
  dawn: number;
  phone: number;
  alfaSignal: number;
  alfaYaw: number;
  late: number;
  day: number;
  blind: number;
}

type LampOverride = 'story' | 'on' | 'off';

export class DeskLevels {
  readonly level: LightLevels = { lamp: 0, monitor: 0, moon: 0.45, shelf: 0, dawn: 0, phone: 0, alfaSignal: 1, alfaYaw: 0, late: 0, day: 0, blind: 0 };
  readonly blind = new BlindTravel();
  private introStart = -1;
  private lampUser: LampOverride = 'story';
  private lampToggledAt = -1;
  private lampGoal = 0;
  private storySwitched = false;
  private modeSwitchPending = false;

  enterShot(next: ChapterId, previous: ChapterId): void {
    if (next === 'intro' && previous !== 'intro') this.introStart = -1;
    if (next !== previous) this.lampUser = 'story';
    this.lampToggledAt = -1;
    this.storySwitched = false;
  }

  get lampOn(): boolean {
    return this.lampGoal > 0.5;
  }

  toggleLamp(time: number): boolean {
    this.lampUser = this.lampGoal > 0.5 ? 'off' : 'on';
    this.lampToggledAt = time;
    return this.lampUser === 'on';
  }

  followMode(time: number): void {
    this.lampUser = 'story';
    this.lampToggledAt = time;
    this.modeSwitchPending = true;
  }

  private announceModeSwitch(goal: number, motion: boolean): void {
    if (!this.modeSwitchPending) return;
    this.modeSwitchPending = false;
    const lamp = this.level.lamp;
    const crossing = goal > lamp ? lamp < goal * 0.4 : goal === 0 && lamp > 2;
    if (motion && crossing) window.dispatchEvent(new CustomEvent('desk:switch', { detail: { on: goal > lamp } }));
  }

  toggleBlind(time: number, animate: boolean): boolean {
    return this.blind.toggle(time, animate);
  }

  private goalFor(chapter: ChapterId, light: ChapterLight): number {
    if (this.lampUser === 'off') return 0;
    if (this.lampUser === 'on') return Math.max(CHAPTER_LIGHT[chapter].lamp, USER_LAMP_FLOOR);
    return light.lamp;
  }

  private updateLamp(frame: DeskFrame, light: ChapterLight): boolean {
    const { chapter, motion, step, time, settledAt, day } = frame;
    const level = this.level;
    const goal = this.goalFor(chapter, light);
    this.lampGoal = goal;
    const switchDelay = (day ? LAMP_SWITCH_DAY : LAMP_SWITCH)[chapter];
    if (this.lampToggledAt >= 0) {
      this.announceModeSwitch(goal, motion);
      level.lamp = motion ? filamentSwitch(level.lamp, goal, time - this.lampToggledAt, step) : goal;
      return Math.abs(level.lamp - goal) > 0.05;
    }
    if (switchDelay === undefined || !motion) {
      level.lamp = damp(level.lamp, goal, 4, step);
      return Math.abs(level.lamp - goal) > 0.05;
    }
    if (settledAt >= 0 && time - settledAt >= switchDelay) {
      if (!this.storySwitched) {
        this.storySwitched = true;
        if (goal > level.lamp ? level.lamp < goal * 0.4 : goal === 0 && level.lamp > 2) window.dispatchEvent(new CustomEvent('desk:switch', { detail: { on: goal > level.lamp } }));
      }
      level.lamp = filamentSwitch(level.lamp, goal, time - settledAt - switchDelay, step);
    }
    return Math.abs(level.lamp - goal) > 0.05;
  }

  private updateIntro(frame: DeskFrame, light: ChapterLight): boolean {
    if (this.introStart < 0) this.introStart = frame.time;
    const intro = introLevels(frame.time - this.introStart);
    this.level.lamp = intro.lamp * light.lamp;
    this.level.monitor = intro.monitor * light.monitor;
    return frame.time - this.introStart < 1.4;
  }

  update(frame: DeskFrame): boolean {
    const { chapter, motion, step } = frame;
    const light = (frame.day ? CHAPTER_LIGHT_DAY : CHAPTER_LIGHT)[chapter];
    const level = this.level;
    let settling: boolean;
    if (chapter === 'intro' && motion) settling = this.updateIntro(frame, light);
    else {
      settling = this.updateLamp(frame, light);
      level.monitor = damp(level.monitor, light.monitor, 5, step);
    }
    const ambient = this.updateAmbient(frame, light);
    const story = this.updateStoryProps(frame);
    return settling || ambient || story;
  }

  private updateAmbient(frame: DeskFrame, light: ChapterLight): boolean {
    const { chapter, step, day } = frame;
    const level = this.level;
    level.late = damp(level.late, LATENESS[chapter], 1.2, step);
    const dayGoal = day ? 1 : 0;
    const modeChanging = level.day !== dayGoal;
    level.day = damp(level.day, dayGoal, MODE_RATE, step);
    if (Math.abs(level.day - dayGoal) < 0.002) level.day = dayGoal;
    level.moon = damp(level.moon, light.moon, modeChanging ? MODE_RATE : CHAPTER_AMBIENT_RATE, step);
    level.shelf = damp(level.shelf, light.shelf, 3, step);
    const travelling = this.blind.update(frame.time);
    level.blind = this.blind.value;
    level.dawn = damp(level.dawn, chapter === 'outro' ? 1 : 0, 1.6, step);
    let settling = level.day !== dayGoal || travelling;
    settling ||= Math.abs(level.late - LATENESS[chapter]) > 0.002 || Math.abs(level.shelf - light.shelf) > 0.005;
    settling ||= Math.abs(level.dawn - (chapter === 'outro' ? 1 : 0)) > 0.002;
    return settling;
  }

  private updateStoryProps(frame: DeskFrame): boolean {
    const { chapter, motion, step, dt } = frame;
    const level = this.level;
    level.phone = damp(level.phone, chapter === 'contact' ? 1 : 0, 6, step);
    level.alfaSignal = damp(level.alfaSignal, chapter === 'company' ? 1.6 : 1, 2, step);
    const alfaGoal = chapter === 'company' || chapter === 'products' ? ALFA_TURN : 0;
    level.alfaYaw = motion ? towards(level.alfaYaw, alfaGoal, MAX_TURN_SPEED * dt * 2) : alfaGoal;
    return Math.abs(level.alfaYaw - alfaGoal) > 1e-3 || Math.abs(level.phone - (chapter === 'contact' ? 1 : 0)) > 0.002;
  }
}
