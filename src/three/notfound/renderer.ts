import { ACESFilmicToneMapping, PCFShadowMap, WebGLRenderer } from 'three';
import type { NotFoundQuality } from './types';

export function createRenderer(container: HTMLElement, quality: NotFoundQuality): WebGLRenderer {
  const renderer = new WebGLRenderer({ antialias: quality === 'high', powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.dataset.nfCanvas = '';
  canvas.setAttribute('aria-hidden', 'true');
  container.append(canvas);
  return renderer;
}
