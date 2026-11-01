import type { BufferGeometry } from 'three';
import { MODELS, type ModelVariant } from '../models.generated';
import type { Tier } from '../tier';
import { alfaRecipe } from './Alfa';
import { buildMascot, type MascotOptions, type MascotRecipe } from './base';
import { burbuRecipe } from './Burbu';
import { giftRecipe } from './GiftBox';
import { toolRecipe } from './Tool';
import type { Mascot, MascotId } from './types';

export type { Mascot, MascotId } from './types';
export type { MascotOptions } from './base';

interface ProceduralEntry {
  shadowSize: number;
  build: (options: MascotOptions) => Promise<Mascot>;
}

function entry<G extends Record<string, BufferGeometry>>(recipe: MascotRecipe<G>): ProceduralEntry {
  return { shadowSize: recipe.shadowSize, build: options => buildMascot(recipe, options) };
}

const RECIPES: Record<MascotId, ProceduralEntry> = {
  alfa: entry(alfaRecipe),
  burbu: entry(burbuRecipe),
  gift: entry(giftRecipe),
  tool: entry(toolRecipe)
};

function modelUrl(id: MascotId, tier: Tier): string | undefined {
  const variants = MODELS[id];
  if (!variants) return undefined;
  const preferred: ModelVariant = tier === 'high' ? 'high' : 'mid';
  const file = variants[preferred] ?? variants.high ?? variants.mid;
  return file ? `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}models/${file}` : undefined;
}

export async function createMascot(id: MascotId, tier: Tier, options: MascotOptions = {}): Promise<Mascot> {
  const url = modelUrl(id, tier);
  if (url) {
    const { loadGltfMascot } = await import('./GlbMascot');
    return loadGltfMascot(id, url, RECIPES[id].shadowSize, options.shadow !== false);
  }
  return RECIPES[id].build(options);
}
