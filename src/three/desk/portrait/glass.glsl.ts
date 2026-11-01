export const PORTRAIT_GLASS_VERTEX = /* glsl */ `
varying vec2 vUv;
varying vec2 vReflect;
void main() {
  vUv = uv;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vec3 view = normalize(world.xyz - cameraPosition);
  vReflect = reflect(view, vec3(0.0, 0.0, 1.0)).xy;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

/**
 * Additive sheen over the print: a soft cool pane (the window) and a small warm spot (the lamp)
 * that slide with the view, plus a diagonal glint that sweeps across on hover.
 */
export const PORTRAIT_GLASS_FRAGMENT = /* glsl */ `
uniform vec3 uWindow;
uniform vec3 uLamp;
uniform float uGlint;
uniform float uGlintStrength;
uniform float uAspect;
varying vec2 vUv;
varying vec2 vReflect;

float softBox(vec2 p, vec2 centre, vec2 extent, float blur) {
  vec2 d = abs(p - centre) - extent;
  float outside = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  return 1.0 - smoothstep(-blur, blur, outside);
}

void main() {
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  vec2 slide = vReflect * vec2(0.55, 0.35);
  float pane = softBox(p, vec2(0.86 * uAspect, 0.72) + slide, vec2(0.1, 0.2), 0.12);
  float mullion = 1.0 - 0.6 * softBox(p, vec2(0.86 * uAspect, 0.72) + slide, vec2(0.006, 0.2), 0.01);
  vec2 toLamp = p - (vec2(0.78 * uAspect, 0.86) + slide * 1.3);
  float lamp = exp(-dot(toLamp, toLamp) / 0.0025);
  float diagonal = (vUv.x * uAspect + vUv.y) / (1.0 + uAspect);
  float band = (diagonal - mix(-0.25, 1.25, uGlint)) / 0.07;
  float glint = exp(-band * band) * uGlintStrength;
  float edge = smoothstep(0.0, 0.03, vUv.x) * smoothstep(0.0, 0.03, vUv.y) * smoothstep(0.0, 0.03, 1.0 - vUv.x) * smoothstep(0.0, 0.03, 1.0 - vUv.y);
  vec3 color = uWindow * pane * mullion + uLamp * lamp + vec3(1.0, 0.97, 0.9) * glint;
  gl_FragColor = vec4(color * edge, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
