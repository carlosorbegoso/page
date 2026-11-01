/** GLSL declarations shared by vertex and fragment use. */
export const FLUID_PARS = /* glsl */ `
uniform sampler2D uFluidVelocity;
uniform float uFluidScale;
uniform float uFluidMax;
uniform float uFluidActive;
uniform vec2 uFluidViewport;
vec2 fluidOffsetAt(vec2 screenUv) {
  if (uFluidActive < 0.5) return vec2(0.0);
  vec2 shift = texture2D(uFluidVelocity, screenUv).xy * uFluidScale;
  return shift * min(1.0, uFluidMax / max(length(shift), 1e-6));
}
`;

/** @deprecated Kept for existing imports; same as `FLUID_PARS`. */
export const FLUID_VERTEX_PARS = FLUID_PARS;

/** GLSL block to place after `gl_Position` is written: shifts the vertex in screen space by the clamped flow. */
export const FLUID_VERTEX_DISPLACE = /* glsl */ `
gl_Position.xy += fluidOffsetAt(gl_Position.xy / gl_Position.w * 0.5 + 0.5) * 2.0 * gl_Position.w;
`;

/**
 * GLSL for a fragment shader (rain refraction on the glass, steam wobble): after `FLUID_PARS`,
 * `fluidOffset()` returns this pixel's clamped UV offset; add it to the UVs you sample.
 */
export const FLUID_FRAGMENT_OFFSET = /* glsl */ `
vec2 fluidOffset() { return fluidOffsetAt(gl_FragCoord.xy / uFluidViewport); }
`;
