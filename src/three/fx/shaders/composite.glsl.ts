import { COC_CHUNK } from './coc.glsl';

/** Fused final pass: chromatic fringe, DoF mix, bloom and streak, chapter grade, renderer tone mapping, contrast, vignette, grain. */
export const COMPOSITE_FRAG = /* glsl */ `
${COC_CHUNK}
uniform sampler2D tScene;
uniform sampler2D tDof;
uniform sampler2D tBloom;
uniform sampler2D tStreak;
uniform float uDofAmount;
uniform float uBloomStrength;
uniform float uStreakStrength;
uniform float uAberration;
uniform float uExposure;
uniform vec3 uBalance;
uniform float uSplit;
uniform float uContrast;
uniform float uVignetteDarkness;
uniform float uVignetteOffset;
uniform float uGrain;
uniform float uSeed;
varying vec2 vUv;

const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);
const vec3 SHADOW_TINT = vec3(0.84, 1.0, 1.07);
const vec3 HIGHLIGHT_TINT = vec3(1.1, 0.99, 0.84);
const vec3 STREAK_TINT = vec3(0.55, 0.8, 1.25);
const vec3 BLACK_FLOOR = vec3(0.006, 0.011, 0.016);

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 fromCentre = vUv - 0.5;
  // Lens fringe only towards the corners: the text column and the subject stay clean.
  vec2 fringe = fromCentre * dot(fromCentre, fromCentre) * uAberration;
  vec3 color = vec3(texture2D(tScene, vUv + fringe).r, texture2D(tScene, vUv).g, texture2D(tScene, vUv - fringe).b);

  if (uDofAmount > 0.001) {
    float coc = abs(circleOfConfusion(vUv));
    color = mix(color, texture2D(tDof, vUv).rgb, smoothstep(0.02, 0.45, coc) * uDofAmount);
  }

  color += texture2D(tBloom, vUv).rgb * uBloomStrength;
  color += texture2D(tStreak, vUv).rgb * STREAK_TINT * uStreakStrength;

  color *= uExposure * uBalance;
  // Split toning on a Reinhard-compressed luma, so HDR highlights do not saturate the weight.
  float l = dot(color, LUMA);
  float w = smoothstep(0.0, 1.0, l / (1.0 + l));
  color *= mix(vec3(1.0), mix(SHADOW_TINT, HIGHLIGHT_TINT, w), uSplit);

  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>

  vec3 c = gl_FragColor.rgb;
  c = mix(c, c * c * (3.0 - 2.0 * c), uContrast);
  c = max(c, BLACK_FLOOR * (1.0 - c));

  float d = length(fromCentre);
  c *= smoothstep(0.8, uVignetteOffset * 0.799, d * (uVignetteDarkness + uVignetteOffset));

  // Overlay blend with mono noise, weighted towards the shadows.
  float n = hash(gl_FragCoord.xy + uSeed * 37.0);
  vec3 overlay = mix(2.0 * c * n, 1.0 - 2.0 * (1.0 - c) * (1.0 - n), step(0.5, c));
  float shadows = 1.0 - 0.6 * dot(c, LUMA);
  gl_FragColor.rgb = mix(c, overlay, uGrain * 1.5 * shadows);
}
`;
