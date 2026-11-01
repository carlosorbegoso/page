import type { Group, Vector3 } from 'three';
import type { ChapterId, Tier } from '../../contracts';
import { tokenColor, tokenNumber } from '../../tokens';
import { createBackdrop, createRainGlass, createSteam, type Backdrop, type RainGlass, type Steam } from '../atmosphere';
import { createLampBeam, type LampBeam } from '../beam';
import { LAMP } from '../layout';
import type { DeskLife } from '../life';
import type { LightLevels } from './levels';

type Disposables = Array<{ dispose(): void }>;
/** An additive shaft vanishes against a daylit room: by day it is drawn denser so a lit lamp still shows its cone. */
const DAY_BEAM_GAIN = 2.5;

function steamStrength(chapter: ChapterId): number {
  if (chapter === 'contact') return 0.9;
  return chapter === 'hero' || chapter === 'about' || chapter === 'intro' ? 0.7 : 0.45;
}

/** Everything beyond the furniture that moves with time: city and sky, rain on the glass, cup steam, the lamp's beam. */
export class DeskWeather {
  private backdrop!: Backdrop;
  private glass!: RainGlass;
  private steam: Steam | null = null;
  private beam!: LampBeam;

  addWindow(room: Group, disposables: Disposables): void {
    this.backdrop = createBackdrop();
    this.glass = createRainGlass();
    room.add(this.backdrop.mesh, this.glass.mesh);
    disposables.push(this.backdrop, this.glass);
  }

  /** Steam only on `high` and `mid`: fewer wisps and octaves on `mid`. */
  addSteam(room: Group, tier: Tier, disposables: Disposables): void {
    const high = tier === 'high';
    if (!high && tier !== 'mid') return;
    this.steam = createSteam(high ? { wisps: 6, octaves: 3 } : { wisps: 4, octaves: 2 });
    room.add(this.steam.mesh);
    disposables.push(this.steam);
  }

  addBeam(room: Group, apex: Vector3, high: boolean, disposables: Disposables): void {
    this.beam = createLampBeam({
      apex: apex.clone(),
      aim: LAMP.aim.clone(),
      angle: tokenNumber('--lamp-angle', 0.62) * 0.55,
      color: tokenColor('--color-lamp', '#ffb566'),
      motes: high ? 160 : 0
    });
    room.add(this.beam.group);
    disposables.push(this.beam);
  }

  setTime(time: number): void {
    this.glass.setTime(time);
    this.backdrop.setTime(time);
    this.steam?.setTime(time);
    this.beam.setTime(time);
  }

  apply(level: LightLevels, chapter: ChapterId, life: DeskLife | null, canvasHeight: number, fov: number): void {
    this.backdrop.setDawn(level.dawn);
    this.backdrop.setLateness(level.late);
    this.backdrop.setDay(level.day);
    this.glass.setDay(level.day);
    this.glass.setLampReflection(Math.min(level.lamp / 28, 1));
    this.beam.setLevel(Math.min(level.lamp / 28, 1.2) * (1 + DAY_BEAM_GAIN * level.day));
    this.beam.setPixelScale(canvasHeight, fov);
    this.steam?.setStrength(steamStrength(chapter) * (life?.steamGain() ?? 1), level.day);
  }
}
