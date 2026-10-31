import { BufferAttribute, BufferGeometry, Color, Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/** Surface parameters baked per vertex into the atlas material. */
export interface Finish {
  color: Color;
  roughness: number;
  metalness: number;
  /** Emission as a multiple of the albedo (signal lines, lamp diffuser). */
  emissive?: number;
  /** 0..1 strength of the procedural wood grain. */
  grain?: number;
}

export interface Placement {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
}

/**
 * Object ids baked per vertex (0 = static). 1–4 are the figures the vertex shader can lift and
 * turn; the rest only take hover and per-object light (`uGlow`, `uSignal`).
 */
export const OBJECT_ID = {
  none: 0,
  alfa: 1,
  ventixs: 2,
  parati: 3,
  skymek: 4,
  sysarp: 5,
  baufest: 6,
  intercorp: 7,
  tcs: 8,
  openFolder: 9,
  phone: 10
} as const;

export function placementMatrix(placement: Placement = {}): Matrix4 {
  const position = new Vector3(...(placement.position ?? [0, 0, 0]));
  const quaternion = new Quaternion().setFromEuler(new Euler(...(placement.rotation ?? [0, 0, 0])));
  const s = placement.scale ?? 1;
  const scale = typeof s === 'number' ? new Vector3(s, s, s) : new Vector3(...s);
  return new Matrix4().compose(position, quaternion, scale);
}

/**
 * Accumulates transformed primitives with their finish and merges them into one indexed
 * geometry (position, normal, color, pbr, oid): one draw call for everything sharing the
 * atlas material.
 */
export class PartBuilder {
  private readonly parts: BufferGeometry[] = [];
  private triangles = 0;

  add(geometry: BufferGeometry, finish: Finish, placement: Placement | Matrix4 = {}, objectId: number = OBJECT_ID.none): this {
    const matrix = placement instanceof Matrix4 ? placement : placementMatrix(placement);
    const part = new BufferGeometry();
    const position = geometry.getAttribute('position');
    part.setAttribute('position', position.clone());
    if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
    part.setAttribute('normal', geometry.getAttribute('normal').clone());
    const count = position.count;
    const index = geometry.getIndex();
    part.setIndex(index ? index.clone() : sequentialIndex(count));
    part.applyMatrix4(matrix);
    if (matrix.determinant() < 0) flipWinding(part);
    const colors = new Float32Array(count * 3);
    const pbr = new Float32Array(count * 4);
    const ids = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      colors.set([finish.color.r, finish.color.g, finish.color.b], i * 3);
      pbr.set([finish.roughness, finish.metalness, finish.emissive ?? 0, finish.grain ?? 0], i * 4);
      ids[i] = objectId;
    }
    part.setAttribute('color', new BufferAttribute(colors, 3));
    part.setAttribute('pbr', new BufferAttribute(pbr, 4));
    part.setAttribute('oid', new BufferAttribute(ids, 1));
    this.parts.push(part);
    this.triangles += part.getIndex()!.count / 3;
    geometry.dispose();
    return this;
  }

  get triangleCount(): number {
    return this.triangles;
  }

  build(): BufferGeometry {
    const merged = mergeGeometries(this.parts, false);
    for (const part of this.parts) part.dispose();
    this.parts.length = 0;
    if (!merged) throw new Error('desk: geometry merge failed');
    merged.computeBoundingSphere();
    merged.computeBoundingBox();
    return merged;
  }
}

function sequentialIndex(count: number): BufferAttribute {
  const array = count > 65535 ? new Uint32Array(count) : new Uint16Array(count);
  for (let i = 0; i < count; i++) array[i] = i;
  return new BufferAttribute(array, 1);
}

function flipWinding(geometry: BufferGeometry): void {
  const index = geometry.getIndex()!;
  for (let i = 0; i < index.count; i += 3) {
    const b = index.getX(i + 1);
    index.setX(i + 1, index.getX(i + 2));
    index.setX(i + 2, b);
  }
}

/** Duplicates a single-sided surface with flipped winding and normals (leaves). */
export function doubleSided(geometry: BufferGeometry): BufferGeometry {
  const back = geometry.clone();
  flipWinding(back.index ? back : back.setIndex(sequentialIndex(back.getAttribute('position').count)));
  const normals = back.getAttribute('normal');
  for (let i = 0; i < normals.count; i++) normals.setXYZ(i, -normals.getX(i), -normals.getY(i), -normals.getZ(i));
  const front = geometry.index ? geometry : geometry.setIndex(sequentialIndex(geometry.getAttribute('position').count));
  const keep = (g: BufferGeometry) => {
    const out = new BufferGeometry();
    out.setAttribute('position', g.getAttribute('position'));
    out.setAttribute('normal', g.getAttribute('normal'));
    out.setIndex(g.getIndex());
    return out;
  };
  const merged = mergeGeometries([keep(front), keep(back)], false)!;
  geometry.dispose();
  back.dispose();
  return merged;
}
