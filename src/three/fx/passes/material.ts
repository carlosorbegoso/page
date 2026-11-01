import { NoBlending, ShaderMaterial, type IUniform } from 'three';
import { FULLSCREEN_VERT } from '../shaders';

export function passMaterial(fragmentShader: string, uniforms: Record<string, IUniform>, toneMapped = false): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: FULLSCREEN_VERT,
    fragmentShader,
    uniforms,
    blending: NoBlending,
    depthTest: false,
    depthWrite: false,
    toneMapped
  });
}
