import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  Mesh,
  NoColorSpace,
  PlaneGeometry,
  ShaderMaterial,
  Vector3
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
const SKY = { halfWidth: 95, bottom: -40, top: 48 } as const;
const ROW = 256;
const AVIATION_LIGHTS = 6;

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

interface CityAtlas {
  texture: CanvasTexture;
  /** Rooftop aviation lights: (u, v) inside the layer quad and the layer index (1..3). */
  aviation: Vector3[];
}

/**
 * Skyline atlas, one 1024 × 256 row per layer. Every channel is data, not colour:
 * a = building silhouette, r = window lit at night (~9 % of the cells), g = per-window random
 * (switch-off order, sodium / LED pick), b = facade tone, darker where a window's glass sits.
 */
function cityAtlas(): CityAtlas {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = ROW * CITY_LAYERS.length;
  const ctx = canvas.getContext('2d')!;
  const roofs: { layer: number; u: number; v: number }[] = [];
  CITY_LAYERS.forEach((_, layer) => {
    const random = seeded(17 + layer * 31);
    const top = layer * ROW;
    const cell = layer === 2 ? 6 : 4;
    let x = 0;
    while (x < 1024) {
      const width = Math.round(18 + random() * (layer === 2 ? 70 : 46));
      const height = Math.round(ROW * (0.32 + random() * 0.63) * (random() < 0.18 ? 1 : 0.82));
      const tone = Math.round(110 + random() * 120);
      const roof = top + ROW - height;
      ctx.fillStyle = `rgb(0, 0, ${tone})`;
      ctx.fillRect(x, roof, width, height);
      const glass = Math.round(tone * (0.55 + random() * 0.15));
      for (let wy = roof + cell; wy < top + ROW - cell; wy += Math.round(cell * 1.8)) {
        for (let wx = x + cell; wx < x + width - cell; wx += Math.round(cell * 1.6)) {
          const lit = random() < 0.09 ? 255 : 0;
          ctx.fillStyle = `rgb(${lit}, ${1 + Math.round(random() * 254)}, ${glass})`;
          ctx.fillRect(wx, wy, Math.round(cell * 0.8), cell);
        }
      }
      if (layer < 2) roofs.push({ layer: layer + 1, u: (x + width / 2) / 1024, v: height / ROW });
      if (layer === 1 && random() < 0.04) {
        ctx.fillStyle = `rgb(0, 0, ${tone})`;
        ctx.fillRect(x + Math.round(width / 2), roof - 14, 2, 14);
      }
      x += width + Math.round(random() * 6);
    }
  });
  const aviation = roofs
    .filter(roof => Math.abs(roof.u - 0.5) < 0.2)
    .sort((a, b) => b.v - a.v)
    .slice(0, AVIATION_LIGHTS)
    .map(roof => new Vector3(roof.u, roof.v - 0.008, roof.layer));
  while (aviation.length < AVIATION_LIGHTS) aviation.push(new Vector3(0, -1, 0));
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = NoColorSpace;
  return { texture, aviation };
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

const glslFloat = (value: number) => value.toFixed(3);
const layerSize = (index: number) => {
  const layer = CITY_LAYERS[index]!;
  return `vec2(${glslFloat(layer.halfWidth * 2)}, ${glslFloat(layer.top - layer.bottom)})`;
};

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
uniform vec3 uSeaHaze;
uniform vec3 uDawnHigh;
uniform vec3 uDawnLow;
uniform vec3 uSilhouette;
uniform vec3 uSodium;
uniform vec3 uLed;
uniform vec3 uBeacon;
uniform vec3 uAviation[${AVIATION_LIGHTS}];
uniform float uDawn;
uniform float uLate;
uniform float uDay;
uniform vec3 uDayHigh;
uniform vec3 uDayLow;
uniform vec3 uDayHaze;
uniform vec3 uCityDay;
uniform float uTime;
varying vec2 vUv;
varying float vLayer;

const float HORIZON = 1.0;
// Overcast stays below the bloom threshold (--fx-bloom-threshold) so the window never burns out by day.
const float DAY_CEILING = 0.72;

float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    sum += amplitude * noise(p);
    p = mat2(1.6, 1.2, -1.2, 1.6) * p + 7.3;
    amplitude *= 0.5;
  }
  return sum;
}

vec3 hazeTint() {
  vec3 night = uSeaHaze + uSodium * 0.012;
  vec3 dawn = mix(uDawnLow, uDawnHigh, 0.45) * 0.55;
  vec3 tint = mix(night, dawn, uDawn);
  return mix(tint, uDayHaze * mix(vec3(1.0), uDawnLow * 1.15, uDawn * 0.35), uDay);
}

vec3 sky(vec2 p) {
  float rise = p.y - HORIZON;
  float alt = clamp(rise / 32.0, 0.0, 1.0);
  float elevation = max(rise + 1.2, 0.35);
  vec2 deck = vec2(p.x * 1.1, 42.0) / elevation;
  vec2 drift = vec2(uTime * 0.018, uTime * 0.004);
  float rolls = fbm(deck * vec2(0.22, 0.5) + drift);
  float folds = fbm(deck * vec2(0.6, 1.3) - drift * 1.7 + 3.1);
  float cloud = clamp(rolls * 0.7 + folds * 0.45 - 0.08, 0.0, 1.0);
  float horizonFog = exp(-elevation / 4.5);
  float band = exp(-pow(rise / 7.0, 2.0));

  vec3 night = mix(uHorizon * 2.2, uZenith + uDawnHigh * 0.006, smoothstep(0.0, 0.8, alt));
  night += (uSodium * 0.022 + uSeaHaze * 0.25) * cloud * cloud * exp(-alt * 2.5);
  night = mix(night, uSeaHaze, band * 0.55);

  vec3 dawnBase = mix(uDawnLow * 0.85, uDawnHigh * 0.5, smoothstep(0.0, 0.55, alt));
  vec3 underside = mix(uDawnLow, vec3(0.85, 0.42, 0.5), smoothstep(0.05, 0.4, alt));
  vec3 dawn = mix(dawnBase * 0.7, underside * (0.35 + 0.6 * (1.0 - alt)), cloud);
  dawn = mix(dawn, uDawnLow * 0.9, band * 0.65);

  vec3 overcast = mix(uDayLow, uDayHigh, smoothstep(0.0, 0.75, alt));
  overcast *= 0.76 + 0.4 * cloud * (1.0 - horizonFog);
  overcast = mix(overcast, overcast * mix(vec3(1.0), uDawnLow * 1.25, 0.6), uDawn * band);

  vec3 color = mix(night, dawn, uDawn);
  color = mix(color, overcast, uDay * (1.0 - uDawn * 0.55));
  color = mix(color, hazeTint(), horizonFog * 0.6);

  float shore = HORIZON - 1.1;
  float cliffTop = HORIZON - 4.0 + smoothstep(6.0, 46.0, p.x) * (10.0 + 1.2 * fbm(vec2(p.x * 0.18, 1.7))) + 0.25 * noise(vec2(p.x * 1.4, 0.0));
  float nightLights = 1.0 - max(uDay, uDawn);
  if (p.x > 6.0 && p.y < cliffTop && p.y > shore) {
    vec3 earth = mix(uSilhouette * 1.4, mix(uDawnLow, uSilhouette, 0.6), uDawn * 0.5);
    earth = mix(earth, uCityDay * vec3(0.98, 0.94, 0.86), uDay);
    earth *= 0.9 + 0.2 * noise(p * vec2(0.6, 2.2));
    color = mix(earth, hazeTint(), mix(0.62, 0.8, uDay));
    float lamps = step(0.78, fract(p.x * 0.9)) * exp(-pow((p.y - cliffTop + 0.35) * 6.0, 2.0));
    color += uSodium * lamps * 1.4 * nightLights;
  } else if (p.y < HORIZON && p.y > shore) {
    vec3 sea = mix(uSeaHaze * 0.7, uDayHaze * 0.8, uDay);
    sea = mix(sea, uDawnLow * 0.5, uDawn * (1.0 - uDay * 0.5));
    float glint = noise(vec2(p.x * 0.5 + uTime * 0.1, p.y * 6.0));
    color = mix(sea * (0.9 + 0.12 * glint), hazeTint(), 0.5);
  } else if (p.y <= shore) {
    float drop = shore - p.y;
    float depth = 6.0 / (drop + 0.15);
    vec2 ground = vec2(p.x * depth * 0.05, depth) * 2.4;
    vec2 cell = floor(ground);
    vec2 offset = vec2(hash(cell + 1.3), hash(cell + 5.1)) * 0.5 + 0.25;
    float seed = hash(cell);
    float sparkDepth = (cell.y + offset.y) / 2.4;
    vec2 sparkAt = vec2((cell.x + offset.x) / (sparkDepth * 0.12), shore + 0.15 - 6.0 / sparkDepth);
    float spark = step(0.62, seed) * smoothstep(0.2, 0.05, length(p - sparkAt));
    float fog = exp(-drop / 3.0);
    float onAt = max(max(uLate * 0.6, uDawn * 1.1), uDay);
    vec3 street = mix(uSodium, uLed, step(0.9, fract(seed * 11.0))) * spark * step(onAt, fract(seed * 37.0)) * 1.6;
    vec3 carpet = uSilhouette * 1.2 + mix(street, uSodium * 0.06 * nightLights, fog);
    vec3 dayCarpet = mix(uCityDay * (0.72 + 0.2 * noise(p * vec2(0.4, 1.5))), hazeTint(), 0.55 + 0.4 * fog);
    carpet = mix(carpet, mix(uDawnLow, uSilhouette, 0.5) * 0.5 + street * 0.4, uDawn * (1.0 - uDay));
    color = mix(mix(carpet, hazeTint(), fog * 0.7), dayCarpet, uDay);
  }
  return min(color, vec3(mix(4.0, DAY_CEILING, uDay * (1.0 - uDawn * 0.3))));
}

float aviation(vec2 uv, float layer, vec2 size) {
  float light = 0.0;
  for (int i = 0; i < ${AVIATION_LIGHTS}; i++) {
    vec3 a = uAviation[i];
    if (abs(a.z - layer) > 0.5) continue;
    float blink = step(0.55, fract(uTime * 0.5 + a.x * 13.0));
    light += blink * exp(-pow(length((uv - a.xy) * size) / 0.32, 2.0));
  }
  return light;
}

void main() {
  if (vLayer < 0.5) {
    vec2 p = vec2((vUv.x - 0.5) * ${glslFloat(SKY.halfWidth * 2)}, mix(${glslFloat(SKY.bottom)}, ${glslFloat(SKY.top)}, vUv.y));
    gl_FragColor = vec4(sky(p), 1.0);
  } else {
    float row = 3.0 - vLayer;
    vec2 uv = vec2(vUv.x, (row + clamp(vUv.y, 0.01, 0.985)) / 3.0);
    vec4 city = texture2D(uCity, uv);
    if (city.a < 0.02) discard;
    bool far = vLayer < 1.5;
    bool mid = !far && vLayer < 2.5;
    vec2 size = far ? ${layerSize(0)} : (mid ? ${layerSize(1)} : ${layerSize(2)});
    float haze = far ? 0.55 : (mid ? 0.3 : 0.08);
    float dayFog = far ? 0.74 : (mid ? 0.5 : 0.24);
    float facade = city.b / city.a;
    float ground = 1.0 - smoothstep(0.0, 0.55, vUv.y);

    vec3 night = uSilhouette * (0.75 + 0.5 * facade) * (1.0 + uDawn * 1.8);
    night = mix(night, hazeTint(), haze + ground * 0.12);

    vec3 lit = uCityDay * (0.62 + 0.55 * facade);
    lit *= mix(vec3(1.0), uDawnLow * 1.2, uDawn * 0.35);
    vec3 day = mix(lit, uDayHaze, clamp(dayFog + ground * 0.18, 0.0, 0.92));
    vec3 body = mix(night, day, uDay * (1.0 - uDawn * 0.6));

    float order = city.g / city.a;
    float off = step(order, max(max(uDawn * 1.15, uLate), uDay));
    vec3 lamp = mix(uSodium, uLed, step(0.82, fract(order * 7.0)));
    float tv = step(0.94, fract(order * 13.0)) * (0.75 + 0.25 * noise(vec2(uTime * 6.0, order * 50.0)));
    float window = city.r * (1.0 - off) * (1.0 - haze * 0.6) * (1.0 - tv * 0.4);
    vec3 lights = lamp * window * 2.2;

    float beacon = mid ? step(0.92, fract(uTime / 3.0)) * exp(-pow(length((vUv - vec2(0.62, 0.86)) * vec2(60.0, 30.0)), 2.0)) : 0.0;
    float rooftop = aviation(vUv, vLayer, size) * mix(1.0, 0.06, uDay) * (1.0 - haze * 0.4);
    gl_FragColor = vec4(body + lights + uBeacon * (beacon * 3.0 + rooftop * 3.5), 1.0);
  }
  #include <colorspace_fragment>
}
`;

export interface Backdrop {
  mesh: Mesh<BufferGeometry, ShaderMaterial>;
  /** 0 night … 1 first light over the Pacific: warm horizon band, cloud deck lit from below, city switching off. */
  setDawn(value: number): void;
  /** 0 early night … 1 every city window dark (the story clock). */
  setLateness(value: number): void;
  /** 0 night … 1 Lima's overcast daylight ("panza de burro"): grey cloud deck, buildings fading into the sea fog. */
  setDay(value: number): void;
  setTime(time: number): void;
  dispose(): void;
}

/** Lima sky, Costa Verde cliffs and a three-layer city behind the window (desk.md §4), one draw call. */
export function createBackdrop(): Backdrop {
  const { texture, aviation } = cityAtlas();
  const parts = [
    layerQuad(SKY.halfWidth, SKY.bottom, SKY.top, SKY_Z, 0),
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
