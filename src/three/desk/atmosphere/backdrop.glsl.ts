import { AVIATION_LIGHTS, CITY_LAYERS, SKY } from './city-atlas';

const glslFloat = (value: number) => value.toFixed(3);
const layerSize = (index: number) => {
  const layer = CITY_LAYERS[index]!;
  return `vec2(${glslFloat(layer.halfWidth * 2)}, ${glslFloat(layer.top - layer.bottom)})`;
};

export const BACKDROP_VERTEX = /* glsl */ `
attribute float layer;
varying vec2 vUv;
varying float vLayer;
void main() {
  vUv = uv;
  vLayer = layer;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const BACKDROP_FRAGMENT = /* glsl */ `
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
  float bandAt = rise / 7.0;
  float band = exp(-bandAt * bandAt);

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
    float lamps = step(0.78, fract(p.x * 0.9)) * exp(-(p.y - cliffTop + 0.35) * (p.y - cliffTop + 0.35) * 36.0);
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
