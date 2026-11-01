/** Signed circle of confusion in 0..1 (far > 0, near < 0) from the depth buffer. */
export const COC_CHUNK = /* glsl */ `
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
