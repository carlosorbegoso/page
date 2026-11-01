import { COC_CHUNK } from './coc.glsl';

/** Gather bokeh on a golden-angle disc; background samples are clamped to the centre CoC so they never bleed over sharp foreground. */
export function dofFrag(taps: number): string {
  return /* glsl */ `
${COC_CHUNK}
uniform sampler2D tColor;
uniform vec2 uTexel;
uniform float uMaxRadius;
varying vec2 vUv;
#define TAPS ${taps}
vec3 finite(vec3 c) { return any(isnan(c)) || any(isinf(c)) ? vec3(0.0) : c; }
void main() {
  float c0 = circleOfConfusion(vUv);
  vec3 sum = finite(texture2D(tColor, vUv).rgb);
  float total = 1.0;
  for (int i = 0; i < TAPS; i++) {
    float fi = float(i) + 0.5;
    float r = sqrt(fi / float(TAPS)) * uMaxRadius;
    float a = fi * 2.39996323;
    vec2 suv = vUv + vec2(cos(a), sin(a)) * r * uTexel;
    float cs = circleOfConfusion(suv);
    float reach = cs > c0 ? min(abs(cs), abs(c0)) : abs(cs);
    float w = clamp(reach * uMaxRadius - r + 1.0, 0.0, 1.0);
    sum += finite(texture2D(tColor, suv).rgb) * w;
    total += w;
  }
  gl_FragColor = vec4(sum / total, abs(c0));
}
`;
}
