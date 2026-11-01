import { ACESFilmicToneMapping, SRGBColorSpace, WebGLRenderer } from 'three';
import type { Tier } from '../tier';
import { tokenColor, tokenNumber } from '../tokens';
import type { World } from '../world';

export function createStageRenderer(tier: Tier, capture: boolean, pixelRatio: number): { canvas: HTMLCanvasElement; renderer: WebGLRenderer } {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.dataset.stageCanvas = '';
  const renderer = new WebGLRenderer({
    canvas,
    alpha: false,
    antialias: tier === 'high' || capture,
    stencil: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: capture
  });
  renderer.info.autoReset = false;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setPixelRatio(pixelRatio);
  return { canvas, renderer };
}

export function applyStageTokens(renderer: WebGLRenderer, world: World | undefined): void {
  renderer.setClearColor(tokenColor('--color-sky-horizon', '#0a0e14'), 1);
  renderer.toneMappingExposure = tokenNumber('--scene-tone-exposure', 1);
  world?.applyTokens();
}
