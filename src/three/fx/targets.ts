import { DepthTexture, HalfFloatType, LinearFilter, RGBAFormat, UnsignedIntType, WebGLRenderTarget } from 'three';
import type { TierProfile } from './settings';

export interface Targets {
  width: number;
  height: number;
  scene: WebGLRenderTarget;
  dof: WebGLRenderTarget | null;
  down: WebGLRenderTarget[];
  up: WebGLRenderTarget[];
  streak: [WebGLRenderTarget, WebGLRenderTarget] | null;
}

function colorTarget(width: number, height: number): WebGLRenderTarget {
  return new WebGLRenderTarget(Math.max(1, width), Math.max(1, height), {
    type: HalfFloatType,
    format: RGBAFormat,
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    depthBuffer: false,
    stencilBuffer: false
  });
}

/** Scene target with depth, the half-res DoF target, the bloom mip chain and the streak pair for one buffer size. */
export function createTargets(width: number, height: number, profile: TierProfile, wantsDof: boolean): Targets {
  const depthTexture = new DepthTexture(width, height, UnsignedIntType);
  const scene = new WebGLRenderTarget(width, height, {
    type: HalfFloatType,
    format: RGBAFormat,
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    depthBuffer: true,
    stencilBuffer: false,
    samples: profile.msaa,
    depthTexture
  });
  const divisor = profile.dofDivisor;
  const dof = wantsDof ? colorTarget(Math.ceil(width / divisor), Math.ceil(height / divisor)) : null;
  const down: WebGLRenderTarget[] = [];
  let w = Math.ceil(width / profile.bloomDivisor);
  let h = Math.ceil(height / profile.bloomDivisor);
  for (let i = 0; i < profile.bloomLevels; i++) {
    down.push(colorTarget(w, h));
    w = Math.max(1, Math.ceil(w / 2));
    h = Math.max(1, Math.ceil(h / 2));
  }
  const up = down.slice(0, -1).map(t => colorTarget(t.width, t.height));
  const streakWidth = Math.ceil(width / (profile.bloomDivisor * 2));
  const streakHeight = Math.ceil(height / (profile.bloomDivisor * 2));
  const streak: Targets['streak'] = profile.streak && down.length > 0 ? [colorTarget(streakWidth, streakHeight), colorTarget(streakWidth, streakHeight)] : null;
  return { width, height, scene, dof, down, up, streak };
}

export function disposeTargets(t: Targets): void {
  t.scene.depthTexture?.dispose();
  t.scene.dispose();
  t.dof?.dispose();
  for (const target of [...t.down, ...t.up, ...(t.streak ?? [])]) target.dispose();
}
