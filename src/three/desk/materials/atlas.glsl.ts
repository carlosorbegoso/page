import { WALL_SPILL_DECLARATIONS } from '../screens/wallSpill';
import { FIGURE_SLOTS, OBJECT_SLOTS } from './slots';
import { SURFACE_DECLARATIONS } from './surface.glsl';

export const VERTEX_DECLARATIONS = /* glsl */ `
uniform vec3 uFigPivot[${FIGURE_SLOTS}];
uniform float uFigLift[${FIGURE_SLOTS}];
uniform float uFigYaw[${FIGURE_SLOTS}];
uniform float uPull[${OBJECT_SLOTS}];
uniform mat3 uHinge;
uniform vec3 uHingeOrigin;
attribute vec4 pbr;
attribute float oid;
varying vec4 vPbr;
varying float vOid;
varying vec3 vRoomPosition;
varying vec3 vRoomNormal;
`;

export const FIGURE_YAW = /* glsl */ `
int figure = int(oid + 0.5) - 1;
float figureYaw = figure >= 0 && figure < ${FIGURE_SLOTS} ? uFigYaw[figure] : 0.0;
float yawC = cos(figureYaw);
float yawS = sin(figureYaw);
`;

export const FIGURE_TRANSFORM = /* glsl */ `
if (figure >= 0 && figure < ${FIGURE_SLOTS}) {
  vec3 pivot = uFigPivot[figure];
  vec3 q = transformed - pivot;
  transformed = vec3(yawC * q.x + yawS * q.z, q.y, -yawS * q.x + yawC * q.z) + pivot + vec3(0.0, uFigLift[figure], 0.0);
}
transformed.x += uPull[clamp(int(oid + 0.5), 0, ${OBJECT_SLOTS - 1})];
if (abs(oid - 11.0) < 0.5) transformed = uHinge * (transformed - uHingeOrigin) + uHingeOrigin;
`;

export const FRAGMENT_DECLARATIONS = /* glsl */ `
varying vec4 vPbr;
varying float vOid;
varying vec3 vRoomPosition;
varying vec3 vRoomNormal;
uniform float uHoverId;
uniform float uHoverMix;
uniform vec3 uHoverColor;
uniform float uSignal[${OBJECT_SLOTS}];
uniform float uGlow[${OBJECT_SLOTS}];
uniform float uPresence[${OBJECT_SLOTS}];
uniform vec4 uRoomBounds;
uniform vec4 uDeskBounds;
uniform float uDeskTop;

float woodGrain(vec3 p) {
  float rings = p.z * 58.0 + p.y * 40.0 + sin(p.x * 4.3) * 1.7 + sin(p.x * 11.0 + p.z * 9.0) * 0.45;
  float figure = pow(max(0.5 + 0.5 * sin(rings), 0.0), 2.5);
  float pores = 0.5 + 0.5 * sin(p.x * 210.0 + sin(p.z * 70.0 + p.y * 50.0) * 2.4);
  return 0.78 + 0.3 * figure - 0.08 * pores;
}

float occlusion(float distance, float facing, float radius, float strength) {
  return 1.0 - strength * (1.0 - facing) * exp(-max(distance, 0.0) / radius);
}

float roomOcclusion(vec3 p, vec3 n) {
  float ao = occlusion(p.y, abs(n.y), 0.22, 0.55);
  ao *= occlusion(p.z - uRoomBounds.z, abs(n.z), 0.28, 0.45);
  ao *= occlusion(p.x - uRoomBounds.x, abs(n.x), 0.3, 0.4);
  ao *= occlusion(uRoomBounds.y - p.x, abs(n.x), 0.3, 0.4);
  vec2 overDesk = step(abs(p.xz - uDeskBounds.xy), uDeskBounds.zw);
  float onDesk = overDesk.x * overDesk.y;
  ao *= mix(1.0, occlusion(p.y - uDeskTop, abs(n.y), 0.035, 0.4), onDesk * step(uDeskTop - 0.005, p.y));
  float underDesk = onDesk * (1.0 - smoothstep(0.0, uDeskTop - 0.02, p.y));
  ao *= 1.0 - 0.35 * underDesk;
  return ao;
}

${WALL_SPILL_DECLARATIONS}
${SURFACE_DECLARATIONS}`;
