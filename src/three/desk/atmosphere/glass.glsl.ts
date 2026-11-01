export const GLASS_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const GLASS_FRAGMENT = /* glsl */ `
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
