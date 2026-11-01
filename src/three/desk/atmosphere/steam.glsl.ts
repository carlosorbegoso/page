export const STEAM_VERTEX = /* glsl */ `
attribute vec2 corner;
attribute float seed;
uniform vec2 uSize;
varying vec2 vUv;
varying float vSeed;
void main() {
  vUv = corner * vec2(0.5, 1.0) + vec2(0.5, 0.0);
  vSeed = seed;
  vec3 anchor = (modelMatrix * vec4(position, 1.0)).xyz;
  vec3 right = vec3(viewMatrix[0][0], 0.0, viewMatrix[2][0]);
  right = length(right) > 1e-4 ? normalize(right) : vec3(1.0, 0.0, 0.0);
  vec3 world = anchor + right * corner.x * uSize.x * 0.5 + vec3(0.0, corner.y * uSize.y, 0.0);
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`;

export const STEAM_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform float uStrength;
uniform float uOcclusion;
uniform vec3 uColor;
varying vec2 vUv;
varying float vSeed;
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < STEAM_OCTAVES; i++) {
    sum += amp * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    amp *= 0.5;
  }
  return sum;
}
void main() {
  float y = clamp(vUv.y, 0.0, 1.0);
  float t = uTime;
  float phase = vSeed * 6.2831;
  float life = fract(t / (4.5 + 2.0 * vSeed) + vSeed * 3.7);
  float rise = t * (0.16 + 0.05 * vSeed);
  vec2 warpBase = vec2(vUv.x * 1.6 + vSeed * 7.3, y * 1.4 - rise);
  vec2 warp = vec2(fbm(warpBase), fbm(warpBase + vec2(5.2, 1.3))) - 0.5;
  float sway = sin(y * 3.4 - t * 0.7 + phase) * 0.09 * y + sin(y * 7.0 - t * 1.1 + phase * 1.9) * 0.035 * y;
  float centre = 0.5 + sway + warp.x * 0.5 * y + 0.06 * y * y * sin(phase);
  float width = mix(0.07, 0.24, pow(y, 0.8));
  float d = (vUv.x - centre) / width;
  float body = exp(-d * d * 2.2);
  float bend = d * 0.9 + warp.y * 3.2 * (0.25 + y) + sin(y * 5.0 - t * 0.6 + phase) * 0.4 * y;
  float strand = clamp(1.0 - abs(noise(vec2(bend * 1.1 + vSeed * 19.0, y * 2.4 - rise * 2.2)) * 2.0 - 1.0), 0.0, 1.0);
  float strands = pow(strand, 3.0) * 0.55 + pow(strand, 10.0) * 0.25;
  float breakup = fbm(vec2(vUv.x * 3.0 + warp.x * 2.0 + vSeed * 4.0, y * 2.6 - rise * 1.3));
  float dissolve = smoothstep(0.28 + 0.34 * y, 0.5 + 0.34 * y, breakup + 0.12);
  float density = body * (0.4 + strands) * mix(1.0, dissolve, smoothstep(0.08, 0.5, y));
  float fade = smoothstep(0.0, 0.14, y) * pow(1.0 - y, 1.6);
  float edges = smoothstep(0.0, 0.12, vUv.x) * (1.0 - smoothstep(0.88, 1.0, vUv.x));
  float pulse = smoothstep(0.0, 0.25, life) * (1.0 - smoothstep(0.6, 1.0, life));
  float a = density * fade * edges * (0.3 + 0.7 * pulse) * uStrength * 0.6;
  gl_FragColor = vec4(uColor * a, a * uOcclusion);
}
`;
