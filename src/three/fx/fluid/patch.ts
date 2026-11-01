import type { Material } from 'three';
import { FLUID_FRAGMENT_OFFSET, FLUID_PARS, FLUID_VERTEX_DISPLACE } from './displace.glsl';
import { fluidUniforms, registerFluidConsumer } from './uniforms';

function patch(material: Material, kind: 'vertex' | 'fragment'): void {
  const release = registerFluidConsumer();
  material.addEventListener('dispose', release);
  const previous = material.onBeforeCompile.bind(material);
  material.onBeforeCompile = (shader, renderer) => {
    previous(shader, renderer);
    Object.assign(shader.uniforms, fluidUniforms);
    if (kind === 'vertex') {
      const end = shader.vertexShader.lastIndexOf('}');
      shader.vertexShader = `${FLUID_PARS}\n${shader.vertexShader.slice(0, end)}\n${FLUID_VERTEX_DISPLACE}\n}`;
    } else {
      shader.fragmentShader = `${FLUID_PARS}\n${FLUID_FRAGMENT_OFFSET}\n${shader.fragmentShader}`;
    }
  };
  const key = material.customProgramCacheKey.bind(material);
  material.customProgramCacheKey = () => `${key()}|fluid-${kind}`;
  material.needsUpdate = true;
}

export function withFluidDisplacement<T extends Material>(material: T): T {
  patch(material, 'vertex');
  return material;
}

export function withFluidFragment<T extends Material>(material: T): T {
  patch(material, 'fragment');
  return material;
}
