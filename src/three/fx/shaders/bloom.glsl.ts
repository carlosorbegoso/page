/** 13-tap downsample (Jimenez 2014); the first level adds a soft threshold and Karis averaging against fireflies. */
export const BLOOM_DOWN_FRAG = /* glsl */ `
uniform sampler2D tInput;
uniform vec2 uTexel;
uniform float uThreshold;
uniform float uSmoothing;
uniform bool uPrefilter;
varying vec2 vUv;
vec3 finite(vec3 c) { return any(isnan(c)) || any(isinf(c)) ? vec3(0.0) : c; }
vec3 tap(float x, float y) { return finite(texture2D(tInput, vUv + vec2(x, y) * uTexel).rgb); }
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
