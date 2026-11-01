import type { MascotId } from './mascots/types';

export type ModelVariant = 'high' | 'mid';

export const MODELS: Partial<Record<MascotId, Partial<Record<ModelVariant, string>>>> = {};
