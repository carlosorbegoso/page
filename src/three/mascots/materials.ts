import { MeshStandardMaterial, type Material } from 'three';
import { tokenColor, tokenNumber } from '../tokens';

export interface SurfaceTokens {
  color: string;
  roughness: string;
  metalness: string;
  flatShading?: boolean;
}

export interface SignalTokens {
  color: string;
  intensity: string;
  /** Multiplier over the intensity token (for secondary signals). */
  scale?: number;
}

interface TokenUserData {
  surface?: SurfaceTokens;
  signal?: SignalTokens;
  baseIntensity?: number;
}

/** Body/accent material whose values come from design tokens. */
export function surfaceMaterial(tokens: SurfaceTokens): MeshStandardMaterial {
  const material = new MeshStandardMaterial({ flatShading: tokens.flatShading ?? false });
  (material.userData as TokenUserData).surface = tokens;
  applyMaterialTokens(material);
  return material;
}

/** Emissive "signal line" material (the family trait instead of eyes). */
export function signalMaterial(tokens: SignalTokens): MeshStandardMaterial {
  const material = new MeshStandardMaterial({ roughness: 0.4, metalness: 0 });
  (material.userData as TokenUserData).signal = tokens;
  applyMaterialTokens(material);
  return material;
}

export function applyMaterialTokens(material: Material): void {
  const data = material.userData as TokenUserData;
  const standard = material as MeshStandardMaterial;
  if (data.surface) {
    standard.color.copy(tokenColor(data.surface.color));
    standard.roughness = tokenNumber(data.surface.roughness, 0.5);
    standard.metalness = tokenNumber(data.surface.metalness, 0.2);
  }
  if (data.signal) {
    const color = tokenColor(data.signal.color);
    standard.color.copy(color).multiplyScalar(0.25);
    standard.emissive.copy(color);
    data.baseIntensity = tokenNumber(data.signal.intensity, 1.4) * (data.signal.scale ?? 1);
    standard.emissiveIntensity = data.baseIntensity;
  }
}

/** Nominal emissive intensity of a signal material (from its token). */
export function baseIntensity(material: Material): number {
  return (material.userData as TokenUserData).baseIntensity ?? (material as MeshStandardMaterial).emissiveIntensity;
}
