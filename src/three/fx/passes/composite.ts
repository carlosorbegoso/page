import { Vector3, type PerspectiveCamera, type WebGLRenderer } from 'three';
import type { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import type { GpuTimer } from '../gpuTimer';
import { balanceGains, type Grade } from '../grading';
import type { FxTokens } from '../settings';
import { COMPOSITE_FRAG } from '../shaders';
import type { Targets } from '../targets';
import { passMaterial } from './material';

export interface CompositeFrame {
  camera: PerspectiveCamera;
  grade: Grade;
  focusDistance: number;
  dofAmount: number;
  frozen: boolean;
  time: number;
}

/** Fused final pass to the canvas: fringe, DoF mix, bloom, streak, grade, tone mapping, vignette, grain. */
export class CompositePass {
  private readonly balance = new Vector3(1, 1, 1);
  readonly material = passMaterial(
    COMPOSITE_FRAG,
    {
      tScene: { value: null },
      tDepth: { value: null },
      tDof: { value: null },
      tBloom: { value: null },
      tStreak: { value: null },
      uNear: { value: 0.1 },
      uFar: { value: 60 },
      uFocus: { value: 5 },
      uRange: { value: 2.5 },
      uDofAmount: { value: 0 },
      uBloomStrength: { value: 0.32 },
      uStreakStrength: { value: 0 },
      uAberration: { value: 0 },
      uExposure: { value: 1 },
      uBalance: { value: this.balance },
      uSplit: { value: 0.2 },
      uContrast: { value: 0 },
      uVignetteDarkness: { value: 0.3 },
      uVignetteOffset: { value: 0.32 },
      uGrain: { value: 0.035 },
      uSeed: { value: 0 }
    },
    true
  );

  render(renderer: WebGLRenderer, quad: FullScreenQuad, targets: Targets, tokens: FxTokens, frame: CompositeFrame, timer: GpuTimer | null): void {
    const { camera, grade } = frame;
    const u = this.material.uniforms;
    u.tScene!.value = targets.scene.texture;
    u.tDepth!.value = targets.scene.depthTexture;
    u.tDof!.value = targets.dof?.texture ?? targets.scene.texture;
    u.tBloom!.value = (targets.up[0] ?? targets.down[0])!.texture;
    u.tStreak!.value = targets.streak ? targets.streak[1].texture : (targets.up[0] ?? targets.down[0])!.texture;
    u.uStreakStrength!.value = targets.streak ? tokens.streakStrength : 0;
    u.uAberration!.value = document.documentElement.dataset.time === 'day' ? 0 : tokens.aberration;
    u.uContrast!.value = grade.contrast;
    u.uNear!.value = camera.near;
    u.uFar!.value = camera.far;
    u.uFocus!.value = frame.focusDistance;
    u.uRange!.value = grade.focusRange;
    u.uDofAmount!.value = targets.dof ? frame.dofAmount : 0;
    u.uBloomStrength!.value = tokens.bloomStrength;
    u.uExposure!.value = grade.exposure;
    balanceGains(grade.temperature, this.balance);
    u.uSplit!.value = grade.split;
    u.uVignetteDarkness!.value = grade.vignette * (tokens.vignetteDarkness / 0.5);
    u.uVignetteOffset!.value = tokens.vignetteOffset;
    u.uGrain!.value = tokens.grain;
    u.uSeed!.value = frame.frozen ? 0 : Math.floor(frame.time * 24) % 997;

    timer?.begin('composite');
    quad.material = this.material;
    renderer.setRenderTarget(null);
    quad.render(renderer);
    timer?.end();
  }

  dispose(): void {
    this.material.dispose();
  }
}
