const NEIGHBOURS = /* glsl */ `
uniform vec2 uTexel;
varying vec2 vUv;
#define LEFT (vUv - vec2(uTexel.x, 0.0))
#define RIGHT (vUv + vec2(uTexel.x, 0.0))
#define TOP (vUv + vec2(0.0, uTexel.y))
#define BOTTOM (vUv - vec2(0.0, uTexel.y))
`;

export const SPLAT_FRAG = /* glsl */ `
uniform sampler2D tVelocity;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform vec2 uForce;
uniform float uRadius;
uniform float uAspect;
varying vec2 vUv;
float segmentDistance(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-8), 0.0, 1.0);
  return length(pa - ba * h);
}
void main() {
  vec2 aspect = vec2(uAspect, 1.0);
  float d = segmentDistance(vUv * aspect, uFrom * aspect, uTo * aspect);
  vec2 v = texture2D(tVelocity, vUv).xy + uForce * exp(-d * d / uRadius);
  gl_FragColor = vec4(v, 0.0, 1.0);
}
`;

export const ADVECT_FRAG = /* glsl */ `
uniform sampler2D tVelocity;
uniform float uDt;
uniform float uDissipation;
varying vec2 vUv;
void main() {
  vec2 back = vUv - uDt * texture2D(tVelocity, vUv).xy;
  gl_FragColor = vec4(uDissipation * texture2D(tVelocity, back).xy, 0.0, 1.0);
}
`;

export const DIVERGENCE_FRAG = /* glsl */ `
${NEIGHBOURS}
uniform sampler2D tVelocity;
void main() {
  float l = texture2D(tVelocity, LEFT).x;
  float r = texture2D(tVelocity, RIGHT).x;
  float t = texture2D(tVelocity, TOP).y;
  float b = texture2D(tVelocity, BOTTOM).y;
  gl_FragColor = vec4(0.5 * (r - l + t - b), 0.0, 0.0, 1.0);
}
`;

export const CURL_FRAG = /* glsl */ `
${NEIGHBOURS}
uniform sampler2D tVelocity;
void main() {
  float l = texture2D(tVelocity, LEFT).y;
  float r = texture2D(tVelocity, RIGHT).y;
  float t = texture2D(tVelocity, TOP).x;
  float b = texture2D(tVelocity, BOTTOM).x;
  gl_FragColor = vec4(0.5 * (r - l - t + b), 0.0, 0.0, 1.0);
}
`;

// Vorticity confinement: pushes velocity along the gradient of |curl| to keep small swirls alive.
export const VORTICITY_FRAG = /* glsl */ `
${NEIGHBOURS}
uniform sampler2D tVelocity;
uniform sampler2D tCurl;
uniform float uStrength;
uniform float uDt;
void main() {
  float l = texture2D(tCurl, LEFT).x;
  float r = texture2D(tCurl, RIGHT).x;
  float t = texture2D(tCurl, TOP).x;
  float b = texture2D(tCurl, BOTTOM).x;
  float c = texture2D(tCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(t) - abs(b), abs(r) - abs(l));
  force /= length(force) + 1e-4;
  force *= uStrength * c;
  force.y *= -1.0;
  vec2 v = texture2D(tVelocity, vUv).xy + force * uDt;
  gl_FragColor = vec4(v, 0.0, 1.0);
}
`;

export const SCALE_FRAG = /* glsl */ `
uniform sampler2D tInput;
uniform float uScale;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(texture2D(tInput, vUv).xy * uScale, 0.0, 1.0);
}
`;

export const PRESSURE_FRAG = /* glsl */ `
${NEIGHBOURS}
uniform sampler2D tPressure;
uniform sampler2D tDivergence;
void main() {
  float l = texture2D(tPressure, LEFT).x;
  float r = texture2D(tPressure, RIGHT).x;
  float t = texture2D(tPressure, TOP).x;
  float b = texture2D(tPressure, BOTTOM).x;
  float div = texture2D(tDivergence, vUv).x;
  gl_FragColor = vec4((l + r + t + b - div) * 0.25, 0.0, 0.0, 1.0);
}
`;

export const GRADIENT_FRAG = /* glsl */ `
${NEIGHBOURS}
uniform sampler2D tPressure;
uniform sampler2D tVelocity;
void main() {
  float l = texture2D(tPressure, LEFT).x;
  float r = texture2D(tPressure, RIGHT).x;
  float t = texture2D(tPressure, TOP).x;
  float b = texture2D(tPressure, BOTTOM).x;
  vec2 v = texture2D(tVelocity, vUv).xy - vec2(r - l, t - b);
  gl_FragColor = vec4(v, 0.0, 1.0);
}
`;
