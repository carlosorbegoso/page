/**
 * Anamorphic streak: a short horizontal blur of the bloom's bright pass, run twice at low resolution.
 * `uKeep` is a hard re-threshold so only emitters (filament, antenna, LEDs) streak, not lit surfaces.
 * The second stride must stay within the first pass's footprint: a longer one samples gaps and
 * stamps discrete copies of the source along the line.
 */
export const STREAK_FRAG = /* glsl */ `
uniform sampler2D tInput;
uniform vec2 uTexel;
uniform float uStride;
uniform float uKeep;
varying vec2 vUv;
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
vec3 finite(vec3 c) { return any(isnan(c)) || any(isinf(c)) ? vec3(0.0) : c; }
vec3 bright(vec2 uv) {
  vec3 c = finite(texture2D(tInput, uv).rgb);
  return uKeep > 0.0 ? c * smoothstep(uKeep, uKeep * 1.15, luma(c)) : c;
}
void main() {
  vec3 sum = bright(vUv);
  float total = 1.0;
  for (int i = 1; i <= 8; i++) {
    float fi = float(i);
    float w = exp(-fi * 0.35);
    vec2 offset = vec2(fi * uStride * uTexel.x, 0.0);
    sum += (bright(vUv + offset) + bright(vUv - offset)) * w;
    total += 2.0 * w;
  }
  gl_FragColor = vec4(sum / total, 1.0);
}
`;
