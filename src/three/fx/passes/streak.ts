import { Vector2, type WebGLRenderTarget, type WebGLRenderer } from 'three';
import type { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import type { GpuTimer } from '../gpuTimer';
import { STREAK_FRAG } from '../shaders';
import type { Targets } from '../targets';
import { passMaterial } from './material';

export class StreakPass {
  readonly material = passMaterial(STREAK_FRAG, {
    tInput: { value: null },
    uTexel: { value: new Vector2() },
    uStride: { value: 1 },
    uKeep: { value: 0 }
  });

  render(renderer: WebGLRenderer, quad: FullScreenQuad, targets: Targets, threshold: number, timer: GpuTimer | null): void {
    const pair = targets.streak;
    const source = targets.down[0];
    if (!pair || !source) return;
    const u = this.material.uniforms;
    timer?.begin('streak');
    quad.material = this.material;
    const passes: Array<[WebGLRenderTarget, WebGLRenderTarget, number, number]> = [
      [source, pair[0], 1, threshold],
      [pair[0], pair[1], 2.5, 0]
    ];
    for (const [input, output, stride, keep] of passes) {
      u.tInput!.value = input.texture;
      (u.uTexel!.value as Vector2).set(1 / output.width, 1 / output.height);
      u.uStride!.value = stride;
      u.uKeep!.value = keep;
      renderer.setRenderTarget(output);
      quad.render(renderer);
    }
    timer?.end();
  }

  dispose(): void {
    this.material.dispose();
  }
}
