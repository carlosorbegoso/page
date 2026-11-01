export const FIRE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uWobble;
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    vUv = uv;
    float along = uv.y;
    vec3 p = position;
    float sway = sin(along * 9.0 - uTime * 16.0) * 0.16 + sin(along * 17.0 - uTime * 27.0 + 1.7) * 0.08;
    p.x += sway * along * uWobble;
    p.z += cos(along * 11.0 - uTime * 19.0) * 0.12 * along * uWobble;
    p.xz *= 1.0 + 0.18 * sin(along * 23.0 - uTime * 31.0 + uv.x * 6.2832) * along;
    vec4 view = modelViewMatrix * vec4(p, 1.0);
    vec3 n = normalize(normalMatrix * normal);
    vFacing = abs(dot(n, normalize(-view.xyz)));
    gl_Position = projectionMatrix * view;
  }`;

export const FIRE_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uAmount;
  uniform float uReach;
  uniform float uHeat;
  varying vec2 vUv;
  varying float vFacing;
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  void main() {
    float along = vUv.y;
    vec2 flow = vec2(vUv.x * 7.0, along * 6.0 - uTime * 11.0);
    float n = noise(flow) * 0.6 + noise(flow * 2.3 + 3.1) * 0.4;
    float tip = 1.0 - smoothstep(uReach - 0.22, uReach, along);
    float root = smoothstep(0.0, 0.05, along);
    float edge = clamp(vFacing, 0.0, 1.0);
    float body = edge * edge * root * tip;
    float breakup = smoothstep(along * 0.75 - 0.1, along * 0.75 + 0.25, n);
    float alpha = clamp(body * breakup * uAmount, 0.0, 1.0);
    if (alpha < 0.02) discard;
    float heat = clamp(uHeat * edge * (1.0 - along * 1.1) + n * 0.25, 0.0, 1.0);
    vec3 red = vec3(0.85, 0.16, 0.04);
    vec3 orange = vec3(1.0, 0.45, 0.08);
    vec3 yellow = vec3(1.0, 0.82, 0.32);
    vec3 white = vec3(1.0, 0.97, 0.82);
    vec3 color = mix(red, orange, smoothstep(0.0, 0.35, heat));
    color = mix(color, yellow, smoothstep(0.35, 0.7, heat));
    color = mix(color, white, smoothstep(0.75, 1.0, heat));
    gl_FragColor = vec4(color * 1.5, alpha);
  }`;
