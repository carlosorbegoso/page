export const FULLSCREEN_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/** Signed circle of confusion in 0..1 (far > 0, near < 0) from the depth buffer. */
const COC_CHUNK = /* glsl */ `
#include <packing>
uniform sampler2D tDepth;
uniform float uNear;
uniform float uFar;
uniform float uFocus;
uniform float uRange;
float viewDepth(vec2 uv) {
  return -perspectiveDepthToViewZ(texture2D(tDepth, uv).x, uNear, uFar);
}
float circleOfConfusion(vec2 uv) {
  float z = viewDepth(uv);
  float d = z - uFocus;
  float c = smoothstep(0.0, 1.0, (abs(d) - uRange * 0.5) / (uRange * 1.5));
  // Far points (city lights, stars behind the glass) are 1-2 px: a full bokeh smears them into blotches.
  c = z > 30.0 ? min(c, 0.3) : c;
  return d < 0.0 ? -c : c;
}
`;

/** 13-tap downsample (Jimenez 2014); the first level adds a soft threshold and Karis averaging against fireflies. */
export const BLOOM_DOWN_FRAG = /* glsl */ `
uniform sampler2D tInput;
uniform vec2 uTexel;
uniform float uThreshold;
uniform float uSmoothing;
uniform bool uPrefilter;
varying vec2 vUv;
vec3 tap(float x, float y) { return texture2D(tInput, vUv + vec2(x, y) * uTexel).rgb; }
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
vec3 keep(vec3 c) { return c * smoothstep(uThreshold, uThreshold + uSmoothing, luma(c)); }
float karis(vec3 c) { return 1.0 / (1.0 + luma(c)); }
void main() {
  vec3 a = tap(-2.0, 2.0), b = tap(0.0, 2.0), c = tap(2.0, 2.0);
  vec3 d = tap(-2.0, 0.0), e = tap(0.0, 0.0), f = tap(2.0, 0.0);
  vec3 g = tap(-2.0, -2.0), h = tap(0.0, -2.0), i = tap(2.0, -2.0);
  vec3 j = tap(-1.0, 1.0), k = tap(1.0, 1.0), l = tap(-1.0, -1.0), m = tap(1.0, -1.0);
  vec3 g0 = (j + k + l + m) * 0.25;
  vec3 g1 = (a + b + d + e) * 0.25;
  vec3 g2 = (b + c + e + f) * 0.25;
  vec3 g3 = (d + e + g + h) * 0.25;
  vec3 g4 = (e + f + h + i) * 0.25;
  vec3 color;
  if (uPrefilter) {
    g0 = keep(g0); g1 = keep(g1); g2 = keep(g2); g3 = keep(g3); g4 = keep(g4);
    float w0 = karis(g0) * 0.5;
    float w1 = karis(g1) * 0.125, w2 = karis(g2) * 0.125, w3 = karis(g3) * 0.125, w4 = karis(g4) * 0.125;
    color = (g0 * w0 + g1 * w1 + g2 * w2 + g3 * w3 + g4 * w4) / (w0 + w1 + w2 + w3 + w4);
  } else {
    color = g0 * 0.5 + (g1 + g2 + g3 + g4) * 0.125;
  }
  gl_FragColor = vec4(color, 1.0);
}
`;

export const BLOOM_UP_FRAG = /* glsl */ `
uniform sampler2D tLow;
uniform sampler2D tHigh;
uniform vec2 uTexel;
uniform float uRadius;
varying vec2 vUv;
vec3 tap(float x, float y) { return texture2D(tLow, vUv + vec2(x, y) * uTexel).rgb; }
void main() {
  vec3 up = tap(0.0, 0.0) * 4.0;
  up += (tap(-1.0, 0.0) + tap(1.0, 0.0) + tap(0.0, -1.0) + tap(0.0, 1.0)) * 2.0;
  up += tap(-1.0, -1.0) + tap(1.0, -1.0) + tap(-1.0, 1.0) + tap(1.0, 1.0);
  up /= 16.0;
  gl_FragColor = vec4(mix(texture2D(tHigh, vUv).rgb, up, uRadius), 1.0);
}
`;

/** Gather bokeh on a golden-angle disc; background samples are clamped to the centre CoC so they never bleed over sharp foreground. */
export function dofFrag(taps: number): string {
  return /* glsl */ `
${COC_CHUNK}
uniform sampler2D tColor;
uniform vec2 uTexel;
uniform float uMaxRadius;
varying vec2 vUv;
#define TAPS ${taps}
void main() {
  float c0 = circleOfConfusion(vUv);
  vec3 sum = texture2D(tColor, vUv).rgb;
  float total = 1.0;
  for (int i = 0; i < TAPS; i++) {
    float fi = float(i) + 0.5;
    float r = sqrt(fi / float(TAPS)) * uMaxRadius;
    float a = fi * 2.39996323;
    vec2 suv = vUv + vec2(cos(a), sin(a)) * r * uTexel;
    float cs = circleOfConfusion(suv);
    float reach = cs > c0 ? min(abs(cs), abs(c0)) : abs(cs);
    float w = clamp(reach * uMaxRadius - r + 1.0, 0.0, 1.0);
    sum += texture2D(tColor, suv).rgb * w;
    total += w;
  }
  gl_FragColor = vec4(sum / total, abs(c0));
}
`;
}

/** Fused final pass: DoF mix, bloom, chapter grade, renderer tone mapping, vignette, grain. */
export const COMPOSITE_FRAG = /* glsl */ `
${COC_CHUNK}
uniform sampler2D tScene;
uniform sampler2D tDof;
uniform sampler2D tBloom;
uniform float uDofAmount;
uniform float uBloomStrength;
uniform float uExposure;
uniform vec3 uBalance;
uniform float uSplit;
uniform float uVignetteDarkness;
uniform float uVignetteOffset;
uniform float uGrain;
uniform float uSeed;
varying vec2 vUv;

const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);
const vec3 SHADOW_TINT = vec3(0.92, 0.98, 1.08);
const vec3 HIGHLIGHT_TINT = vec3(1.07, 1.0, 0.9);

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec3 color = texture2D(tScene, vUv).rgb;

  if (uDofAmount > 0.001) {
    float coc = abs(circleOfConfusion(vUv));
    color = mix(color, texture2D(tDof, vUv).rgb, smoothstep(0.02, 0.45, coc) * uDofAmount);
  }

  color += texture2D(tBloom, vUv).rgb * uBloomStrength;

  color *= uExposure * uBalance;
  // Split toning on a Reinhard-compressed luma, so HDR highlights do not saturate the weight.
  float l = dot(color, LUMA);
  float w = smoothstep(0.0, 1.0, l / (1.0 + l));
  color *= mix(vec3(1.0), mix(SHADOW_TINT, HIGHLIGHT_TINT, w), uSplit);

  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>

  float d = distance(vUv, vec2(0.5));
  gl_FragColor.rgb *= smoothstep(0.8, uVignetteOffset * 0.799, d * (uVignetteDarkness + uVignetteOffset));

  // Overlay blend with mono noise, weighted towards the shadows.
  vec3 c = gl_FragColor.rgb;
  float n = hash(gl_FragCoord.xy + uSeed * 37.0);
  vec3 overlay = mix(2.0 * c * n, 1.0 - 2.0 * (1.0 - c) * (1.0 - n), step(0.5, c));
  float shadows = 1.0 - 0.6 * dot(c, LUMA);
  gl_FragColor.rgb = mix(c, overlay, uGrain * 1.5 * shadows);
}
`;
