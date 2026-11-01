import { Color } from 'three';

function raw(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Reads a colour design token (`--color-…`) as a three Color in the working colour space. */
export function tokenColor(name: string, fallback = '#808080'): Color {
  const value = raw(name) || fallback;
  const color = new Color();
  try {
    color.setStyle(value);
  } catch {
    color.setStyle(fallback);
  }
  return color;
}

/** Reads a numeric design token (`--alfa-roughness`, …). */
export function tokenNumber(name: string, fallback: number): number {
  const value = Number.parseFloat(raw(name));
  return Number.isFinite(value) ? value : fallback;
}
