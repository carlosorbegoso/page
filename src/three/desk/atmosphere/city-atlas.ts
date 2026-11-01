import { CanvasTexture, NoColorSpace, Vector3 } from 'three';
import { seeded } from '../math';

export const SKY_Z = -55;
/** City layers: depth, half width, top of the tallest building (y), haze. Kept inside the camera far plane (60 m). */
export const CITY_LAYERS = [
  { z: -50, halfWidth: 70, bottom: -24, top: 9, haze: 0.55 },
  { z: -38, halfWidth: 52, bottom: -22, top: 6.5, haze: 0.3 },
  { z: -26, halfWidth: 38, bottom: -20, top: 3.6, haze: 0.08 }
] as const;
export const SKY = { halfWidth: 95, bottom: -40, top: 48 } as const;
const ROW = 256;
export const AVIATION_LIGHTS = 6;


export interface CityAtlas {
  texture: CanvasTexture;
  /** Rooftop aviation lights: (u, v) inside the layer quad and the layer index (1..3). */
  aviation: Vector3[];
}

/**
 * Skyline atlas, one 1024 × 256 row per layer. Every channel is data, not colour:
 * a = building silhouette, r = window lit at night (~9 % of the cells), g = per-window random
 * (switch-off order, sodium / LED pick), b = facade tone, darker where a window's glass sits.
 */
export function cityAtlas(): CityAtlas {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = ROW * CITY_LAYERS.length;
  const ctx = canvas.getContext('2d')!;
  const roofs: { layer: number; u: number; v: number }[] = [];
  CITY_LAYERS.forEach((_, layer) => {
    const random = seeded(17 + layer * 31);
    const top = layer * ROW;
    const cell = layer === 2 ? 6 : 4;
    let x = 0;
    while (x < 1024) {
      const width = Math.round(18 + random() * (layer === 2 ? 70 : 46));
      const height = Math.round(ROW * (0.32 + random() * 0.63) * (random() < 0.18 ? 1 : 0.82));
      const tone = Math.round(110 + random() * 120);
      const roof = top + ROW - height;
      ctx.fillStyle = `rgb(0, 0, ${tone})`;
      ctx.fillRect(x, roof, width, height);
      const glass = Math.round(tone * (0.55 + random() * 0.15));
      for (let wy = roof + cell; wy < top + ROW - cell; wy += Math.round(cell * 1.8)) {
        for (let wx = x + cell; wx < x + width - cell; wx += Math.round(cell * 1.6)) {
          const lit = random() < 0.09 ? 255 : 0;
          ctx.fillStyle = `rgb(${lit}, ${1 + Math.round(random() * 254)}, ${glass})`;
          ctx.fillRect(wx, wy, Math.round(cell * 0.8), cell);
        }
      }
      if (layer < 2) roofs.push({ layer: layer + 1, u: (x + width / 2) / 1024, v: height / ROW });
      if (layer === 1 && random() < 0.04) {
        ctx.fillStyle = `rgb(0, 0, ${tone})`;
        ctx.fillRect(x + Math.round(width / 2), roof - 14, 2, 14);
      }
      x += width + Math.round(random() * 6);
    }
  });
  const aviation = roofs
    .filter(roof => Math.abs(roof.u - 0.5) < 0.2)
    .sort((a, b) => b.v - a.v)
    .slice(0, AVIATION_LIGHTS)
    .map(roof => new Vector3(roof.u, roof.v - 0.008, roof.layer));
  while (aviation.length < AVIATION_LIGHTS) aviation.push(new Vector3(0, -1, 0));
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = NoColorSpace;
  return { texture, aviation };
}
