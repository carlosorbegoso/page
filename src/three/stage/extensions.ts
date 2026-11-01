import { yieldToMain } from '../idle';

export async function loadExtensions(): Promise<void> {
  const entries = import.meta.glob<{ default?: () => unknown }>(['../desk/index.ts', '../fx/index.ts']);
  for (const [path, load] of Object.entries(entries)) {
    try {
      const module = await load();
      if (typeof module.default === 'function') await module.default();
    } catch (error) {
      console.error('[stage] extension failed', path, error);
    }
    await yieldToMain();
  }
}
