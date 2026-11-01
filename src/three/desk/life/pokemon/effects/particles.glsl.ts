export const PARTICLE_VERTEX = /* glsl */ `
  attribute vec3 tint;
  attribute float fade;
  attribute float extent;
  uniform float uScale;
  varying vec3 vTint;
  varying float vAlpha;
  void main() {
    vTint = tint;
    vAlpha = fade;
    vec4 view = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * view;
    gl_PointSize = max(1.0, extent * uScale / max(-view.z, 0.01)) * step(0.004, fade);
  }`;

export const GLOW_PARTICLE_FRAGMENT = /* glsl */ `
  varying vec3 vTint;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = clamp(1.0 - d, 0.0, 1.0);
    a *= a * vAlpha;
    if (a < 0.02) discard;
    gl_FragColor = vec4(vTint * 1.8, a);
  }`;

export const SMOKE_FRAGMENT = /* glsl */ `
  varying vec3 vTint;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = clamp(1.0 - d * d, 0.0, 1.0) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vTint, a);
  }`;
