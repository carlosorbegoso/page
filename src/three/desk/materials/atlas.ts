import {
  Color,
  MeshBasicMaterial,
  MeshDepthMaterial,
  MeshStandardMaterial,
  RGBADepthPacking,
  Matrix3,
  Vector3
} from 'three';
import { WALL_SPILL_ALBEDO, WALL_SPILL_LIGHT } from '../screens/wallSpill';
import {
  FIGURE_TRANSFORM,
  FIGURE_YAW,
  FRAGMENT_DECLARATIONS,
  VERTEX_DECLARATIONS
} from './atlas.glsl';
import { type AtlasUniforms, FIGURE_SLOTS, OBJECT_SLOTS } from './slots';

function createAtlasUniforms(): AtlasUniforms {
  return {
    uHoverId: { value: -1 },
    uHoverMix: { value: 0 },
    uHoverColor: { value: new Color(1, 1, 1) },
    uFigPivot: { value: Array.from({ length: FIGURE_SLOTS }, () => new Vector3()) },
    uFigLift: { value: new Array<number>(FIGURE_SLOTS).fill(0) },
    uFigYaw: { value: new Array<number>(FIGURE_SLOTS).fill(0) },
    uSignal: { value: new Array<number>(OBJECT_SLOTS).fill(1) },
    uGlow: { value: new Array<number>(OBJECT_SLOTS).fill(0) },
    uPresence: { value: new Array<number>(OBJECT_SLOTS).fill(1) },
    uPull: { value: new Array<number>(OBJECT_SLOTS).fill(0) },
    uHinge: { value: new Matrix3() },
    uHingeOrigin: { value: new Vector3() }
  };
}

function patchAtlasVertex(vertexShader: string): string {
  return vertexShader
    .replace('#include <common>', `#include <common>\n${VERTEX_DECLARATIONS}`)
    .replace(
      '#include <beginnormal_vertex>',
      `#include <beginnormal_vertex>
      ${FIGURE_YAW}
      objectNormal = vec3(yawC * objectNormal.x + yawS * objectNormal.z, objectNormal.y, -yawS * objectNormal.x + yawC * objectNormal.z);
      if (abs(oid - 11.0) < 0.5) objectNormal = uHinge * objectNormal;`
    )
    .replace('#include <begin_vertex>', `#include <begin_vertex>\n${FIGURE_TRANSFORM}`)
    .replace(
      '#include <color_vertex>',
      '#include <color_vertex>\nvPbr = pbr;\nvOid = oid;\nvRoomPosition = position;\nvRoomNormal = normal;'
    );
}

function patchAtlasFragment(fragmentShader: string): string {
  return fragmentShader
    .replace('#include <common>', `#include <common>\n${FRAGMENT_DECLARATIONS}`)
    .replace(
      '#include <color_fragment>',
      `#include <color_fragment>
      vec3 roomFootprint = fwidth(vRoomPosition);
      vec3 surface = vPbr.w > 0.0 ? surfaceDetail(vRoomPosition, normalize(vRoomNormal), vPbr.w, max(roomFootprint.x, max(roomFootprint.y, roomFootprint.z))) : vec3(1.0, 0.0, 0.0);
      if (vPbr.w > 0.0 && vPbr.w <= 1.0) diffuseColor.rgb *= mix(1.0, woodGrain(vRoomPosition), vPbr.w);
      diffuseColor.rgb *= surface.x;
      diffuseColor.rgb *= roomOcclusion(vRoomPosition, normalize(vRoomNormal));
      ${WALL_SPILL_ALBEDO}
      float presence = uPresence[clamp(int(vOid + 0.5), 0, ${OBJECT_SLOTS - 1})];
      diffuseColor.rgb = mix(vec3(dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722))), diffuseColor.rgb, presence) * (0.3 + 0.7 * presence);`
    )
    .replace(
      '#include <lights_fragment_end>',
      `#include <lights_fragment_end>\n${WALL_SPILL_LIGHT}`
    )
    .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = clamp(vPbr.x + surface.y, 0.04, 1.0);')
    .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\nnormal = surfaceBump(normal, surface.z);')
    .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = vPbr.y;')
    .replace(
      '#include <emissivemap_fragment>',
      `#include <emissivemap_fragment>
      int objectId = clamp(int(vOid + 0.5), 0, ${OBJECT_SLOTS - 1});
      totalEmissiveRadiance += diffuseColor.rgb * (vPbr.z * uSignal[objectId] * uPresence[objectId] + uGlow[objectId]);
      float hovered = (1.0 - step(0.5, abs(vOid - uHoverId))) * step(0.5, vOid);
      float rim = pow(clamp(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0), 2.5);
      totalEmissiveRadiance += uHoverColor * hovered * uHoverMix * (0.05 + 0.6 * rim);`
    );
}

export function createAtlasMaterial(
  roomBounds: [number, number, number, number],
  deskBounds: [number, number, number, number],
  deskTop: number
): {
  material: MeshStandardMaterial;
  uniforms: AtlasUniforms;
} {
  const material = new MeshStandardMaterial({ vertexColors: true, roughness: 1, metalness: 0 });
  const uniforms = createAtlasUniforms();
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, {
      uHoverId: uniforms.uHoverId,
      uHoverMix: uniforms.uHoverMix,
      uHoverColor: uniforms.uHoverColor,
      uFigPivot: uniforms.uFigPivot,
      uFigLift: uniforms.uFigLift,
      uFigYaw: uniforms.uFigYaw,
      uSignal: uniforms.uSignal,
      uGlow: uniforms.uGlow,
      uPresence: uniforms.uPresence,
      uPull: uniforms.uPull,
      uHinge: uniforms.uHinge,
      uHingeOrigin: uniforms.uHingeOrigin,
      uRoomBounds: { value: roomBounds },
      uDeskBounds: { value: deskBounds },
      uDeskTop: { value: deskTop }
    });
    shader.vertexShader = patchAtlasVertex(shader.vertexShader);
    shader.fragmentShader = patchAtlasFragment(shader.fragmentShader);
  };
  material.customProgramCacheKey = () => 'desk-atlas-v7';
  return { material, uniforms };
}

export function createAtlasDepthMaterial(uniforms: AtlasUniforms): MeshDepthMaterial {
  const material = new MeshDepthMaterial({ depthPacking: RGBADepthPacking });
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, {
      uFigPivot: uniforms.uFigPivot,
      uFigLift: uniforms.uFigLift,
      uFigYaw: uniforms.uFigYaw,
      uPull: uniforms.uPull,
      uHinge: uniforms.uHinge,
      uHingeOrigin: uniforms.uHingeOrigin
    });
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
uniform vec3 uFigPivot[${FIGURE_SLOTS}];
uniform float uFigLift[${FIGURE_SLOTS}];
uniform float uFigYaw[${FIGURE_SLOTS}];
uniform float uPull[${OBJECT_SLOTS}];
uniform mat3 uHinge;
uniform vec3 uHingeOrigin;
attribute float oid;`
      )
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n${FIGURE_YAW}\n${FIGURE_TRANSFORM}`);
  };
  material.customProgramCacheKey = () => 'desk-atlas-depth-v3';
  return material;
}

export function createPickMaterial(): MeshBasicMaterial {
  return new MeshBasicMaterial({ visible: false });
}
