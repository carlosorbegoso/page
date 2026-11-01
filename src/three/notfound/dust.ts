import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Points, ShaderMaterial, Vector3, type Scene } from 'three';
import { DEG, LAMP_HEAD } from './constants';
import { dustShader } from './dust.glsl';
import type { LampBeam } from './lamp';
import type { NotFoundQuality, TimedUniform } from './types';

export interface DustUniforms extends TimedUniform {
  uPixel: { value: number };
}

function scatterInBeam(count: number, beam: LampBeam): { positions: Float32Array; seeds: Float32Array } {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const local = new Vector3();
  for (let i = 0; i < count; i++) {
    const t = 0.15 + Math.random() * 0.8;
    const radius = Math.sqrt(Math.random()) * Math.tan(26 * DEG) * beam.length * t;
    const angle = Math.random() * Math.PI * 2;
    local.set(Math.cos(angle) * radius, -t * beam.length, Math.sin(angle) * radius).applyQuaternion(beam.orientation).add(LAMP_HEAD);
    local.toArray(positions, i * 3);
    seeds[i] = Math.random();
  }
  return { positions, seeds };
}

/** Dust motes drifting inside the lamp beam; returns their animated uniforms. */
export function addDust(scene: Scene, beam: LampBeam, quality: NotFoundQuality): DustUniforms {
  const { positions, seeds } = scatterInBeam(quality === 'high' ? 320 : 160, beam);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1));
  const material = new ShaderMaterial({
    ...dustShader,
    uniforms: { uTime: { value: 0 }, uPixel: { value: 1 }, uColor: { value: new Color(beam.color).lerp(new Color('#ffffff'), 0.4) } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending
  });
  scene.add(new Points(geometry, material));
  return material.uniforms as unknown as DustUniforms;
}
