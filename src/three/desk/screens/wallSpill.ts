import { ROOM, WINDOW } from '../layout';

/**
 * Share of the window light (moon, dawn or sun) that the sill, floor and reveal bounce back onto
 * the wall around the opening. The directional light only reaches room-facing surfaces, so without
 * it the backlit wall beside the window renders as a flat black slab.
 */
const WINDOW_SPILL = 1.6;

function glsl(value: number): string {
  return value.toFixed(4);
}

/** Fragment helpers: back-wall mask, plaster value noise and the falloff of light around the window opening. */
export const WALL_SPILL_DECLARATIONS = /* glsl */ `
const vec4 WINDOW_RECT = vec4(${glsl(WINDOW.x)}, ${glsl(WINDOW.y)}, ${glsl(WINDOW.width / 2)}, ${glsl(WINDOW.height / 2)});

float plaster(vec2 p) {
  vec2 cell = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = fract(sin(dot(cell, vec2(127.1, 311.7))) * 43758.5453);
  float b = fract(sin(dot(cell + vec2(1.0, 0.0), vec2(127.1, 311.7))) * 43758.5453);
  float c = fract(sin(dot(cell + vec2(0.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
  float d = fract(sin(dot(cell + vec2(1.0, 1.0), vec2(127.1, 311.7))) * 43758.5453);
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float backWall(vec3 p, vec3 n) {
  return step(p.z, ${glsl(ROOM.back + 0.002)}) * step(0.5, n.z);
}

float windowSpill(vec3 p) {
  vec2 outside = max(abs(p.xy - WINDOW_RECT.xy) - WINDOW_RECT.zw, 0.0);
  float distance = length(outside);
  float reveal = exp(-distance / 0.32);
  float bounce = exp(-distance / 0.9) * (0.55 + 0.45 * clamp(1.0 - p.y / ${glsl(ROOM.height)}, 0.0, 1.0));
  return 0.55 * reveal + 0.45 * bounce;
}
`;

/** Runs after `color_fragment`: marks back-wall fragments and breaks the paint up with plaster variation. */
export const WALL_SPILL_ALBEDO = /* glsl */ `
float onBackWall = backWall(vRoomPosition, normalize(vRoomNormal));
diffuseColor.rgb *= 1.0 + onBackWall * (0.1 * plaster(vRoomPosition.xy * 9.0) + 0.06 * plaster(vRoomPosition.xy * 37.0) - 0.08);
`;

/** Runs after `lights_fragment_end`: the window light (directional light 0, the only one the desk keeps visible) bounced onto the wall. */
export const WALL_SPILL_LIGHT = /* glsl */ `
#if NUM_DIR_LIGHTS > 0
reflectedLight.indirectDiffuse += onBackWall * windowSpill(vRoomPosition) * ${glsl(WINDOW_SPILL)} * directionalLights[0].color * BRDF_Lambert(diffuseColor.rgb);
#endif
`;
