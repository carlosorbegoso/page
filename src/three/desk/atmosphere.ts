import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  SRGBColorSpace
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { withFluidDisplacement, withFluidFragment } from '../fx/fluid';
import { tokenColor } from '../tokens';
import { GLASS_Z, MUG, WINDOW } from './layout';

const SKY_Z = -55;
/** City layers: depth, half width, top of the tallest building (y), haze. Kept inside the camera far plane (60 m). */
const CITY_LAYERS = [
  { z: -50, halfWidth: 70, bottom: -24, top: 9, haze: 0.55 },
  { z: -38, halfWidth: 52, bottom: -22, top: 6.5, haze: 0.3 },
  { z: -26, halfWidth: 38, bottom: -20, top: 3.6, haze: 0.08 }
] as const;
const ROW = 256;

function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Skyline atlas, one 1024 × 256 row per layer: alpha = building silhouette, rgb = lit window
 * (sodium 85 % / LED 15 %, ~8 % occupancy), drawn once.
 */
function cityTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = ROW * CITY_LAYERS.length;
  const ctx = canvas.getContext('2d')!;
  const sodium = `#${tokenColor('--color-city-sodium', '#e8a25a').getHexString()}`;
  const led = `#${tokenColor('--color-city-led', '#8fb4e8').getHexString()}`;
  CITY_LAYERS.forEach((_, layer) => {
    const random = seeded(17 + layer * 31);
    const top = layer * ROW;
    let x = 0;
    while (x < 1024) {
      const width = 18 + random() * (layer === 2 ? 70 : 46);
      const height = ROW * (0.25 + random() * 0.7) * (random() < 0.12 ? 1 : 0.75);
      ctx.fillStyle = '#000000';
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillRect(x, top + ROW - height, width, height);
      const cell = layer === 2 ? 6 : 4;
      for (let wy = top + ROW - height + cell; wy < top + ROW - cell; wy += cell * 1.8) {
        for (let wx = x + cell; wx < x + width - cell; wx += cell * 1.6) {
          if (random() > 0.08) continue;
          ctx.fillStyle = random() < 0.85 ? sodium : led;
          ctx.fillRect(wx, wy, cell * 0.8, cell);
        }
      }
      if (layer === 1 && random() < 0.04) ctx.fillRect(x + width / 2, top + ROW - height - 14, 1.5, 14);
      x += width + random() * 6;
    }
  });
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** Quad facing +Z with a per-vertex layer index (0 = sky, 1..3 = city layers far → near). */
function layerQuad(halfWidth: number, bottom: number, top: number, z: number, layer: number): BufferGeometry {
  const quad = new PlaneGeometry(halfWidth * 2, top - bottom).translate(0, (top + bottom) / 2, z);
  const uv = quad.getAttribute('uv');
  const layers = new Float32Array(uv.count).fill(layer);
  quad.setAttribute('layer', new BufferAttribute(layers, 1));
  quad.deleteAttribute('normal');
  return quad;
}

const BACKDROP_VERTEX = /* glsl */ `
attribute float layer;
varying vec2 vUv;
varying float vLayer;
void main() {
  vUv = uv;
  vLayer = layer;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const BACKDROP_FRAGMENT = /* glsl */ `
uniform sampler2D uCity;
uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uDawnHigh;
uniform vec3 uDawnLow;
uniform vec3 uSilhouette;
uniform vec3 uBeacon;
uniform float uDawn;
uniform float uLate;
uniform float uDay;
uniform vec3 uDayHigh;
uniform vec3 uDayLow;
uniform vec3 uCityDay;
uniform float uTime;
varying vec2 vUv;
varying float vLayer;

float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }

void main() {
  if (vLayer < 0.5) {
    float h = smoothstep(0.25, 0.85, vUv.y);
    vec3 night = mix(uHorizon * 1.6, uZenith, h);
    vec3 dawn = mix(uDawnLow, uDawnHigh, smoothstep(0.2, 0.75, vUv.y));
    vec3 sky = mix(night, dawn, uDawn);
    vec3 overcast = mix(uDayLow, uDayHigh, smoothstep(0.15, 0.9, vUv.y));
    sky = mix(sky, overcast, uDay * (1.0 - uDawn));
    float glow = exp(-pow((vUv.y - 0.3) * 5.0, 2.0)) * 0.006 * (1.0 - uDawn) * (1.0 - uDay);
    gl_FragColor = vec4(sky + vec3(0.9, 0.6, 0.35) * glow, 1.0);
  } else {
    float row = 3.0 - vLayer;
    vec2 uv = vec2(vUv.x, (row + clamp(vUv.y, 0.01, 0.985)) / 3.0);
    vec4 city = texture2D(uCity, uv);
    if (city.a < 0.02) discard;
    float haze = vLayer < 1.5 ? 0.55 : (vLayer < 2.5 ? 0.3 : 0.08);
    vec3 hazeColor = mix(uHorizon * 2.2, mix(uDawnLow, uDawnHigh, 0.5) * 0.7, uDawn);
    vec3 body = mix(uSilhouette * (1.0 + uDawn * 1.8), hazeColor, haze);
    body = mix(body, mix(uCityDay, uDayLow, min(haze * 1.4, 1.0)), uDay * (1.0 - uDawn * 0.6));
    vec2 cell = floor(uv * vec2(256.0, 192.0));
    float off = step(hash(cell), max(max(uDawn * 1.15, uLate), uDay));
    vec3 lights = city.rgb * 2.2 * (1.0 - off) * (1.0 - haze * 0.6);
    float beacon = vLayer > 1.5 && vLayer < 2.5 ? step(0.92, fract(uTime / 3.0)) * exp(-pow(length((vUv - vec2(0.62, 0.86)) * vec2(60.0, 30.0)), 2.0)) : 0.0;
    gl_FragColor = vec4(body + lights + uBeacon * beacon * 3.0, 1.0);
  }
  #include <colorspace_fragment>
}
`;

export interface Backdrop {
  mesh: Mesh<BufferGeometry, ShaderMaterial>;
  setDawn(value: number): void;
  /** 0 early night … 1 every city window dark (the story clock). */
  setLateness(value: number): void;
  /** 0 night … 1 Lima's overcast daylight ("panza de burro"): pale sky, hazy grey city, windows dark. */
  setDay(value: number): void;
  setTime(time: number): void;
  dispose(): void;
}

/** Night sky and a three-layer city behind the window (desk.md §4), one draw call. */
export function createBackdrop(): Backdrop {
  const texture = cityTexture();
  const parts = [
    layerQuad(95, -18, 48, SKY_Z, 0),
    ...CITY_LAYERS.map((layer, index) => layerQuad(layer.halfWidth, layer.bottom, layer.top, layer.z, index + 1))
  ];
  const geometry = mergeGeometries(parts, false)!;
  for (const part of parts) part.dispose();
  const material = new ShaderMaterial({
    vertexShader: BACKDROP_VERTEX,
    fragmentShader: BACKDROP_FRAGMENT,
    uniforms: {
      uCity: { value: texture },
      uZenith: { value: tokenColor('--color-sky-zenith', '#04060b') },
      uHorizon: { value: tokenColor('--color-sky-horizon', '#0a0e14') },
      uDawnHigh: { value: tokenColor('--color-dawn-high', '#6f86ae') },
      uDawnLow: { value: tokenColor('--color-dawn-low', '#e9a47a') },
      uSilhouette: { value: tokenColor('--color-city-silhouette', '#0d121b') },
      uBeacon: { value: new Color(1, 0.12, 0.08) },
      uDawn: { value: 0 },
      uLate: { value: 0 },
      uDay: { value: 0 },
      uDayHigh: { value: tokenColor('--color-day-sky-high', '#c3cfdb') },
      uDayLow: { value: tokenColor('--color-day-sky-low', '#e9ebe7') },
      uCityDay: { value: tokenColor('--color-day-city', '#8a8f96') },
      uTime: { value: 0 }
    },
    depthWrite: false
  });
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

const GLASS_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const GLASS_FRAGMENT = /* glsl */ `
uniform vec3 uTint;
uniform vec3 uRain;
uniform vec3 uLamp;
uniform float uTime;
uniform float uAspect;
uniform float uLampReflection;
uniform float uDay;
uniform vec3 uTintDay;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float droplets(vec2 uv, float scale) {
  vec2 grid = uv * vec2(scale * uAspect, scale);
  vec2 cell = floor(grid);
  vec2 local = fract(grid) - 0.5;
  float h = hash(cell);
  vec2 offset = vec2(hash(cell + 3.1), hash(cell + 7.7)) - 0.5;
  float radius = 0.08 + 0.18 * h;
  float d = length((local - offset * 0.5) * vec2(1.0, 1.25));
  return step(0.55, h) * smoothstep(radius, radius * 0.4, d);
}

float streaks(vec2 uv) {
  float columns = 9.0 * uAspect;
  float column = floor(uv.x * columns);
  float h = hash(vec2(column, 1.7));
  if (h < 0.55) return 0.0;
  float speed = 0.02 + 0.03 * hash(vec2(column, 9.1));
  float head = fract(-uTime * speed + h * 7.0);
  float x = fract(uv.x * columns) - 0.5 - 0.15 * sin(uv.y * 9.0 + h * 6.0);
  float body = smoothstep(0.06, 0.0, abs(x)) * smoothstep(head - 0.25, head, uv.y) * step(uv.y, head);
  return body * (0.4 + 0.6 * smoothstep(head - 0.02, head, uv.y));
}

void main() {
  vec2 uv = vUv + fluidOffset();
  float drops = droplets(uv, 34.0) + droplets(uv + 0.37, 61.0) * 0.6;
  float trail = streaks(uv);
  float lamp = exp(-pow(length((vUv - vec2(0.12, 0.22)) * vec2(uAspect, 1.0)) * 4.0, 2.0)) * uLampReflection;
  float rain = 1.0 - uDay * 0.75;
  vec3 color = mix(uTint, uTintDay, uDay) + uRain * (drops * 0.22 * rain + trail * 0.18 * (1.0 - uDay)) + uLamp * lamp * 0.12;
  float alpha = mix(0.12, 0.05, uDay) + drops * 0.12 * rain + trail * 0.1 * (1.0 - uDay) + lamp * 0.1;
  gl_FragColor = vec4(color, alpha);
  #include <colorspace_fragment>
}
`;

export interface RainGlass {
  mesh: Mesh<PlaneGeometry, ShaderMaterial>;
  setTime(time: number): void;
  setLampReflection(level: number): void;
  /** By day only a light drizzle is left on a pale glass. */
  setDay(value: number): void;
  dispose(): void;
}

/** Window glass with static droplets, slow trickles and a fake warm lamp reflection. */
export function createRainGlass(): RainGlass {
  const width = WINDOW.width - WINDOW.frame * 2;
  const height = WINDOW.height - WINDOW.frame * 2;
  const geometry = new PlaneGeometry(width, height);
  const material = withFluidFragment(
    new ShaderMaterial({
      vertexShader: GLASS_VERTEX,
      fragmentShader: GLASS_FRAGMENT,
      uniforms: {
        uTint: { value: tokenColor('--color-window-glass', '#0b1220') },
        uRain: { value: tokenColor('--color-rain', '#9db8e8') },
        uLamp: { value: tokenColor('--color-lamp', '#ffb566') },
        uTime: { value: 0 },
        uAspect: { value: width / height },
        uLampReflection: { value: 1 },
        uDay: { value: 0 },
        uTintDay: { value: tokenColor('--color-window-glass-day', '#dfe6ec') }
      },
      transparent: true,
      depthWrite: false
    })
  );
  const mesh = new Mesh(geometry, material);
  mesh.name = 'desk-glass';
  mesh.position.set(WINDOW.x, WINDOW.y, GLASS_Z);
  mesh.raycast = () => undefined;
  return {
    mesh,
    setTime: time => {
      material.uniforms.uTime!.value = time;
    },
    setLampReflection: level => {
      material.uniforms.uLampReflection!.value = level;
    },
    setDay: value => {
      material.uniforms.uDay!.value = value;
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
    }
  };
}

const STEAM_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const STEAM_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform float uStrength;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
void main() {
  vec2 p = vec2(vUv.x * 2.0, vUv.y * 3.0 - uTime * 0.25);
  float n = noise(p * 2.0 + vec2(sin(vUv.y * 4.0 + uTime * 0.3) * 0.6, 0.0)) * noise(p * 4.3);
  float width = 0.32 - 0.12 * vUv.y;
  float column = smoothstep(width, 0.0, abs(vUv.x - 0.5 - 0.08 * sin(vUv.y * 5.0 + uTime * 0.4)));
  float fade = smoothstep(0.0, 0.15, vUv.y) * (1.0 - smoothstep(0.45, 1.0, vUv.y));
  gl_FragColor = vec4(vec3(0.85, 0.82, 0.78), n * column * fade * uStrength);
}
`;

export interface Steam {
  mesh: Mesh<BufferGeometry, ShaderMaterial>;
  setTime(time: number): void;
  setStrength(level: number): void;
  dispose(): void;
}

/** Two crossed soft sheets rising from the mug; sways with the FX fluid field. */
export function createSteam(): Steam {
  const sheet = (rotation: number) => new PlaneGeometry(0.07, 0.17).translate(0, 0.085, 0).rotateY(rotation);
  const parts = [sheet(0.4), sheet(0.4 + Math.PI / 2)];
  const geometry = mergeGeometries(parts, false)!;
  for (const part of parts) part.dispose();
  const material = withFluidDisplacement(
    new ShaderMaterial({
      vertexShader: STEAM_VERTEX,
      fragmentShader: STEAM_FRAGMENT,
      uniforms: { uTime: { value: 0 }, uStrength: { value: 0.22 } },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      side: DoubleSide
    })
  );
  const mesh = new Mesh(geometry, material);
  mesh.name = 'desk-steam';
  mesh.position.set(MUG.x, MUG.y + 0.088, MUG.z);
  mesh.raycast = () => undefined;
  return {
    mesh,
    setTime: time => {
      material.uniforms.uTime!.value = time;
    },
    setStrength: level => {
      material.uniforms.uStrength!.value = level;
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
    }
  };
}
