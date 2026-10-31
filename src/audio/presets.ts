import type { StationId } from '../three/sections';

export interface StationPreset {
  /** MIDI notes of the pad chord, lowest first. */
  chord: readonly number[];
  /** Lowpass cutoff of the pad in Hz. */
  cutoff: number;
  /** 0..1 level of the room hum (desk only). */
  hum: number;
  /** 0..1 level of the soft high "air" noise and the octave shimmer. */
  air: number;
  /** 0..1 wet send to the short room reverb. */
  room: number;
  /** 0..1 wet send to the long space reverb. */
  space: number;
  /** MIDI notes the crystalline ping picks from. */
  bells: readonly number[];
}

export const PRESETS: Record<StationId, StationPreset> = {
  hero: {
    chord: [50, 57, 61, 64],
    cutoff: 620,
    hum: 1,
    air: 0,
    room: 0.55,
    space: 0.1,
    bells: [81, 85, 88]
  },
  about: {
    chord: [47, 54, 57, 62, 66],
    cutoff: 1250,
    hum: 0.15,
    air: 0.45,
    room: 0.2,
    space: 0.55,
    bells: [83, 86, 90]
  },
  company: {
    chord: [43, 50, 54, 61, 66],
    cutoff: 1700,
    hum: 0,
    air: 0.7,
    room: 0.1,
    space: 0.75,
    bells: [86, 90, 93]
  },
  products: {
    chord: [52, 59, 62, 66, 69],
    cutoff: 1900,
    hum: 0,
    air: 0.75,
    room: 0.1,
    space: 0.75,
    bells: [88, 90, 93, 95]
  },
  experience: {
    chord: [45, 52, 59, 61, 64],
    cutoff: 1500,
    hum: 0,
    air: 0.6,
    room: 0.1,
    space: 0.8,
    bells: [81, 85, 88]
  },
  contact: {
    chord: [50, 57, 64, 66, 69],
    cutoff: 2200,
    hum: 0,
    air: 0.85,
    room: 0.05,
    space: 0.9,
    bells: [86, 90, 93, 98]
  }
};

export function midiToHz(note: number): number {
  return 440 * 2 ** ((note - 69) / 12);
}
