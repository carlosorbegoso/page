import { Vector2, type WebGLRenderer } from 'three';
import type { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import type { GpuTimer } from '../gpuTimer';
import type { FxTokens, TierProfile } from '../settings';
import { BLOOM_DOWN_FRAG, BLOOM_UP_FRAG } from '../shaders';
import type { Targets } from '../targets';
import { passMaterial } from './material';

/** Mip-chain bloom: thresholded 13-tap downsample, then tent upsample back to the first level. */
export class BloomPass {
  readonly down = passMaterial(BLOOM_DOWN_FRAG, {
    tInput: { value: null },
    uTexel: { value: new Vector2() },
    uThreshold: { value: 1 },
    uSmoothing: { value: 0.1 },
    uPrefilter: { value: false }
  });
  readonly up = passMaterial(BLOOM_UP_FRAG, {
    tLow: { value: null },
    tHigh: { value: null },
    uTexel: { value: new Vector2() },
    uRadius: { value: 0.45 }
  });

  render(renderer: WebGLRenderer, quad: FullScreenQuad, targets: Targets, tokens: FxTokens, profile: TierProfile, timer: GpuTimer | null): void {
    const { down, up } = targets;
    const d = this.down.uniforms;
    d.uThreshold!.value = tokens.bloomThreshold;
    d.uSmoothing!.value = tokens.bloomSmoothing;
    timer?.begin('bloom');
    quad.material = this.down;
    for (let i = 0; i < down.length; i++) {
      const source = i === 0 ? targets.scene : down[i - 1]!;
      const spread = i === 0 ? profile.bloomDivisor / 2 : 1;
      d.tInput!.value = source.texture;
      d.uPrefilter!.value = i === 0;
      (d.uTexel!.value as Vector2).set(spread / source.width, spread / source.height);
      renderer.setRenderTarget(down[i]!);
      quad.render(renderer);
    }
    const u = this.up.uniforms;
    u.uRadius!.value = tokens.bloomRadius;
    quad.material = this.up;
    for (let i = up.length - 1; i >= 0; i--) {
      const low = i === up.length - 1 ? down[i + 1]! : up[i + 1]!;
      u.tLow!.value = low.texture;
      u.tHigh!.value = down[i]!.texture;
      (u.uTexel!.value as Vector2).set(1 / low.width, 1 / low.height);
      renderer.setRenderTarget(up[i]!);
      quad.render(renderer);
    }
    timer?.end();
  }

  dispose(): void {
    this.down.dispose();
    this.up.dispose();
  }
}
