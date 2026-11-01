import { BufferAttribute, Color, Mesh, PlaneGeometry, ShaderMaterial, type BufferGeometry, type Texture, type Vector3 } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { tokenColor } from '../../tokens';
import { BACKDROP_FRAGMENT, BACKDROP_VERTEX } from './backdrop.glsl';
import { CITY_LAYERS, cityAtlas, SKY, SKY_Z } from './city-atlas';

function layerQuad(halfWidth: number, bottom: number, top: number, z: number, layer: number): BufferGeometry {
  const quad = new PlaneGeometry(halfWidth * 2, top - bottom).translate(0, (top + bottom) / 2, z);
  const uv = quad.getAttribute('uv');
  const layers = new Float32Array(uv.count).fill(layer);
  quad.setAttribute('layer', new BufferAttribute(layers, 1));
  quad.deleteAttribute('normal');
  return quad;
}

export interface Backdrop {
  mesh: Mesh<BufferGeometry, ShaderMaterial>;
  setDawn(value: number): void;
  setLateness(value: number): void;
  setDay(value: number): void;
  setTime(time: number): void;
  dispose(): void;
}

function backdropGeometry(): BufferGeometry {
  const parts = [
    layerQuad(SKY.halfWidth, SKY.bottom, SKY.top, SKY_Z, 0),
    ...CITY_LAYERS.map((layer, index) => layerQuad(layer.halfWidth, layer.bottom, layer.top, layer.z, index + 1))
  ];
  const geometry = mergeGeometries(parts, false)!;
  for (const part of parts) part.dispose();
  return geometry;
}

function backdropMaterial(texture: Texture, aviation: Vector3[]): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: BACKDROP_VERTEX,
    fragmentShader: BACKDROP_FRAGMENT,
    uniforms: {
      uCity: { value: texture },
      uZenith: { value: tokenColor('--color-sky-zenith', '#04060b') },
      uHorizon: { value: tokenColor('--color-sky-horizon', '#0a0e14') },
      uSeaHaze: { value: tokenColor('--color-sea-haze', '#1b2532') },
      uDawnHigh: { value: tokenColor('--color-dawn-high', '#6f86ae') },
      uDawnLow: { value: tokenColor('--color-dawn-low', '#e9a47a') },
      uSilhouette: { value: tokenColor('--color-city-silhouette', '#0d121b') },
      uSodium: { value: tokenColor('--color-city-sodium', '#e8a25a') },
      uLed: { value: tokenColor('--color-city-led', '#8fb4e8') },
      uBeacon: { value: new Color(1, 0.12, 0.08) },
      uAviation: { value: aviation },
      uDawn: { value: 0 },
      uLate: { value: 0 },
      uDay: { value: 0 },
      uDayHigh: { value: tokenColor('--color-day-sky-high', '#a9b1b9') },
      uDayLow: { value: tokenColor('--color-day-sky-low', '#c9cbc8') },
      uDayHaze: { value: tokenColor('--color-day-haze', '#bcbfbe') },
      uCityDay: { value: tokenColor('--color-day-city', '#7f858c') },
      uTime: { value: 0 }
    },
    depthWrite: false
  });
}

export function createBackdrop(): Backdrop {
  const { texture, aviation } = cityAtlas();
  const geometry = backdropGeometry();
  const material = backdropMaterial(texture, aviation);
  const mesh = new Mesh(geometry, material);
  mesh.name = 'desk-city';
  mesh.renderOrder = -10;
  mesh.frustumCulled = false;
  mesh.raycast = () => undefined;
  return {
    mesh,
    setDawn: value => {
      material.uniforms.uDawn!.value = value;
    },
    setLateness: value => {
      material.uniforms.uLate!.value = value;
    },
    setDay: value => {
      material.uniforms.uDay!.value = value;
    },
    setTime: time => {
      material.uniforms.uTime!.value = time;
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
      texture.dispose();
    }
  };
}
