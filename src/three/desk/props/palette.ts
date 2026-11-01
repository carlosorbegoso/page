import { Color } from 'three';
import { tokenColor, tokenNumber } from '../../tokens';
import type { Finish } from '../builder';
import type { FolderId } from '../layout';

export type Quality = number;

export interface Palette {
  wall: Finish;
  floor: Finish;
  wood: Finish;
  metal: Finish;
  fabric: Finish;
  ceramic: Finish;
  coffee: Finish;
  crema: Finish;
  plant: Finish;
  pot: Finish;
  soil: Finish;
  paper: Finish;
  bookDark: Finish;
  bookBlue: Finish;
  brass: Finish;
  frame: Finish;
  bezel: Finish;
  keys: Finish;
  trackpad: Finish;
  shade: Finish;
  diffuser: Finish;
  telescope: Finish;
  telescopeBrass: Finish;
  lens: Finish;
  alfaBody: Finish;
  alfaVisor: Finish;
  alfaRing: Finish;
  alfaSignal: Finish;
  burbuBody: Finish;
  burbuDots: Finish;
  burbuBase: Finish;
  burbuSignal: Finish;
  giftBody: Finish;
  giftRibbon: Finish;
  giftSeam: Finish;
  giftTag: Finish;
  toolBody: Finish;
  toolBand: Finish;
  toolSignal: Finish;
  toolStand: Finish;
  folders: Record<FolderId, Finish>;
  label: Finish;
  phone: Finish;
}

const PERCEIVED_TO_ALBEDO = { wall: 3.5, floor: 2 } as const;

const COLLECTIBLE = { matte: 0.62, satin: 0.4 } as const;

function ceramic(color: Color, mute: number, value: number): Color {
  const hsl = { h: 0, s: 0, l: 0 };
  color.getHSL(hsl);
  return new Color().setHSL(hsl.h, hsl.s * (1 - mute), Math.min(hsl.l * value, 0.85));
}

const c = (token: string, fallback: string) => tokenColor(token, fallback);

type CollectibleKey = Extract<keyof Palette, `alfa${string}` | `burbu${string}` | `gift${string}` | `tool${string}`>;
type DeskKey = Exclude<keyof Palette, CollectibleKey | 'folders' | 'label' | 'phone'>;

function readDeskFinishes(): Pick<Palette, DeskKey> {
  return {
    wall: { color: c('--color-desk-wall', '#121722').multiplyScalar(PERCEIVED_TO_ALBEDO.wall), roughness: 0.95, metalness: 0 },
    floor: { color: c('--color-desk-floor', '#17140f').multiplyScalar(PERCEIVED_TO_ALBEDO.floor), roughness: 0.7, metalness: 0, grain: 0.7 },
    wood: { color: c('--color-desk-wood', '#5a3e2b'), roughness: 0.72, metalness: 0, grain: 1 },
    metal: { color: c('--color-desk-metal', '#2b313c'), roughness: 0.35, metalness: 0.8 },
    fabric: { color: c('--color-desk-fabric', '#232a3a'), roughness: 0.9, metalness: 0 },
    ceramic: { color: c('--color-desk-ceramic', '#e6e0d4'), roughness: 0.7, metalness: 0 },
    coffee: { color: new Color('#3a2214'), roughness: 0.62, metalness: 0 },
    crema: { color: new Color('#a8703d'), roughness: 0.7, metalness: 0 },
    plant: { color: c('--color-desk-plant', '#2f5a44'), roughness: 0.45, metalness: 0 },
    pot: { color: c('--color-desk-pot', '#8c5a44'), roughness: 0.8, metalness: 0 },
    soil: { color: c('--color-desk-coffee', '#2a1a10').multiplyScalar(0.6), roughness: 1, metalness: 0 },
    paper: { color: c('--color-desk-paper', '#d8d2c4'), roughness: 0.9, metalness: 0 },
    bookDark: { color: c('--color-desk-fabric', '#232a3a'), roughness: 0.8, metalness: 0 },
    bookBlue: { color: c('--color-desk-metal', '#2b313c'), roughness: 0.8, metalness: 0 },
    brass: { color: c('--color-desk-brass', '#b08a4a'), roughness: 0.35, metalness: 1 },
    frame: { color: c('--color-window-frame', '#1a1f29'), roughness: 0.5, metalness: 0.6 },
    bezel: { color: c('--color-monitor-bezel', '#0c0f14'), roughness: 0.4, metalness: 0.3 },
    keys: { color: c('--color-monitor-bezel', '#0c0f14').multiplyScalar(1.6), roughness: 0.5, metalness: 0.2 },
    trackpad: { color: c('--color-desk-metal', '#2b313c'), roughness: 0.3, metalness: 0.6 },
    shade: { color: c('--color-lamp-shade', '#1d222b'), roughness: 0.6, metalness: 0.3 },
    diffuser: { color: c('--color-lamp', '#ffb566'), roughness: 0.5, metalness: 0, emissive: 2 },
    telescope: { color: c('--color-telescope', '#c9ced6'), roughness: 0.3, metalness: 0.1 },
    telescopeBrass: { color: c('--color-telescope-brass', '#b08a4a'), roughness: 0.35, metalness: 1 },
    lens: { color: new Color(0.01, 0.015, 0.03), roughness: 0.05, metalness: 0.4 }
  };
}

function readCollectibleFinishes(brass: Finish): Pick<Palette, CollectibleKey> {
  return {
    alfaBody: { color: c('--color-desk-ceramic', '#e6e0d4').lerp(new Color('#f4f7fb'), 0.6), roughness: 0.24, metalness: 0 },
    alfaVisor: { color: c('--color-alfa-body', '#10131a'), roughness: 0.1, metalness: 0.35 },
    alfaRing: brass,
    alfaSignal: { color: c('--color-alfa-signal', '#5aa9ff'), roughness: 0.3, metalness: 0, emissive: 1.4 * tokenNumber('--alfa-signal-intensity', 1) },
    burbuBody: { color: ceramic(c('--color-burbu-signal', '#3fcf8e'), 0.12, 0.92), roughness: 0.3, metalness: 0, emissive: 0.08 },
    burbuDots: { color: c('--color-desk-paper', '#d8d2c4').lerp(new Color('#ffffff'), 0.6), roughness: 0.3, metalness: 0, emissive: 0.18 },
    burbuBase: { color: c('--color-alfa-body', '#10131a').multiplyScalar(1.8), roughness: COLLECTIBLE.satin, metalness: 0.2 },
    burbuSignal: { color: c('--color-burbu-signal', '#3fcf8e'), roughness: 0.4, metalness: 0, emissive: 0.9 * tokenNumber('--burbu-signal-intensity', 0.8) },
    giftBody: { color: ceramic(c('--color-gift-ribbon', '#f28ba0'), 0.08, 0.95), roughness: 0.3, metalness: 0 },
    giftRibbon: { color: c('--color-desk-paper', '#d8d2c4').lerp(new Color('#fff8f2'), 0.55), roughness: 0.32, metalness: 0.05 },
    giftSeam: { color: c('--color-gift-ribbon', '#f28ba0'), roughness: 0.4, metalness: 0, emissive: 0.9 },
    giftTag: { color: c('--color-desk-paper', '#d8d2c4'), roughness: 0.85, metalness: 0 },
    toolBody: { color: new Color('#c9ccd1'), roughness: 0.24, metalness: 1 },
    toolBand: brass,
    toolStand: { color: c('--color-alfa-body', '#10131a').multiplyScalar(1.6), roughness: COLLECTIBLE.satin, metalness: 0 },
    toolSignal: { color: c('--color-tool-band', '#f0a43c'), roughness: 0.4, metalness: 0, emissive: 0.6 }
  };
}

export function readPalette(): Palette {
  const brass: Finish = { color: c('--color-desk-brass', '#b08a4a'), roughness: 0.38, metalness: 1 };
  return {
    ...readDeskFinishes(),
    ...readCollectibleFinishes(brass),
    folders: {
      sysarp: { color: c('--color-folder-sysarp', '#7e776a'), roughness: 0.85, metalness: 0 },
      baufest: { color: c('--color-folder-baufest', '#4a5847'), roughness: 0.85, metalness: 0 },
      intercorp: { color: c('--color-folder-intercorp', '#6b4a35'), roughness: 0.7, metalness: 0 },
      tcs: { color: c('--color-folder-tcs', '#33405a'), roughness: 0.85, metalness: 0 }
    },
    label: { color: c('--color-desk-paper', '#d8d2c4'), roughness: 0.9, metalness: 0 },
    phone: { color: c('--color-phone-body', '#15181e'), roughness: 0.45, metalness: 0.6 }
  };
}
