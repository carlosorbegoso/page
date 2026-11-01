import { Vector2, type PerspectiveCamera, type ShaderMaterial, type WebGLRenderer } from 'three';
import type { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import type { GpuTimer } from '../gpuTimer';
import type { Grade } from '../grading';
import type { TierProfile } from '../settings';
import { dofFrag } from '../shaders';
import type { Targets } from '../targets';
import { passMaterial } from './material';

/** Gather bokeh into the DoF target; the material is built lazily with the tier's tap count. */
export class DofPass {
  private built: ShaderMaterial | null = null;

  material(taps: number): ShaderMaterial {
    this.built ??= passMaterial(dofFrag(taps), {
      tColor: { value: null },
      tDepth: { value: null },
      uNear: { value: 0.1 },
      uFar: { value: 60 },
      uFocus: { value: 5 },
      uRange: { value: 2.5 },
      uTexel: { value: new Vector2() },
      uMaxRadius: { value: 4 }
    });
    return this.built;
  }

  render(
    renderer: WebGLRenderer,
    quad: FullScreenQuad,
    targets: Targets,
    camera: PerspectiveCamera,
    focusDistance: number,
    grade: Grade,
    bokeh: number,
    profile: TierProfile,
    timer: GpuTimer | null
  ): void {
    const dofTarget = targets.dof!;
    const dof = this.material(profile.dofTaps);
    const u = dof.uniforms;
    u.tColor!.value = targets.scene.texture;
    u.tDepth!.value = targets.scene.depthTexture;
    u.uNear!.value = camera.near;
    u.uFar!.value = camera.far;
    u.uFocus!.value = focusDistance;
    u.uRange!.value = grade.focusRange;
    (u.uTexel!.value as Vector2).set(1 / dofTarget.width, 1 / dofTarget.height);
    u.uMaxRadius!.value = (bokeh * grade.bokeh * 3 * (targets.height / 1080)) / profile.dofDivisor;
    timer?.begin('dof');
    quad.material = dof;
    renderer.setRenderTarget(dofTarget);
    quad.render(renderer);
    timer?.end();
  }

  dispose(): void {
    this.built?.dispose();
    this.built = null;
  }
}
