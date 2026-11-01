import { BufferAttribute, BufferGeometry, Matrix4, Mesh, Vector3, type Material, type Object3D } from 'three';
import type { AtlasUniforms } from '../materials';

/** What a triangle of the merged figures geometry is, to decide which moving part it belongs to. */
export interface TriangleInfo {
  oid: number;
  centroid: Vector3;
  color: [number, number, number];
  emissive: number;
  normal: Vector3;
}

export interface RigPart {
  readonly name: string;
  readonly mesh: Mesh;
  /** Rest-pose centroid of the part's triangles, in room space. */
  readonly centre: Vector3;
  /** Rest-pose centroids of every triangle, for parts that need to be split further. */
  readonly centroids: Vector3[];
}

export interface RigOptions {
  material: Material;
  depthMaterial?: Material;
  shadows: boolean;
}

/**
 * Splits the merged figures geometry into a static remainder plus named moving parts, each its own
 * mesh over the same vertex buffers and atlas material. Every part keeps its object id, so the atlas
 * shader still applies the figure's lift and turn, hover rim and presence to it.
 */
export function splitFigures(geometry: BufferGeometry, classify: (info: TriangleInfo) => string | null, options: RigOptions): { rest: Mesh; parts: Map<string, RigPart> } {
  const index = geometry.getIndex()!;
  const position = geometry.getAttribute('position');
  const color = geometry.getAttribute('color');
  const pbr = geometry.getAttribute('pbr');
  const oid = geometry.getAttribute('oid');
  const buckets = new Map<string, { indices: number[]; centroids: Vector3[] }>();
  const rest: number[] = [];
  const a = new Vector3();
  const b = new Vector3();
  const c = new Vector3();
  for (let i = 0; i < index.count; i += 3) {
    const i0 = index.getX(i);
    const i1 = index.getX(i + 1);
    const i2 = index.getX(i + 2);
    a.fromBufferAttribute(position, i0);
    b.fromBufferAttribute(position, i1);
    c.fromBufferAttribute(position, i2);
    const centroid = a.clone().add(b).add(c).multiplyScalar(1 / 3);
    const name = classify({
      oid: Math.round(oid.getX(i0)),
      centroid,
      color: [color.getX(i0), color.getY(i0), color.getZ(i0)],
      emissive: pbr.getZ(i0),
      normal: c.clone().sub(b).cross(a.clone().sub(b)).normalize()
    });
    if (!name) {
      rest.push(i0, i1, i2);
      continue;
    }
    let bucket = buckets.get(name);
    if (!bucket) buckets.set(name, (bucket = { indices: [], centroids: [] }));
    bucket.indices.push(i0, i1, i2);
    bucket.centroids.push(centroid);
  }
  const parts = new Map<string, RigPart>();
  for (const [name, bucket] of buckets) {
    parts.set(name, { name, mesh: partMesh(geometry, bucket.indices, `desk-figure-${name}`, options), centre: centreOf(bucket.centroids), centroids: bucket.centroids });
  }
  return { rest: partMesh(geometry, rest, 'desk-figures', options), parts };
}

function centreOf(points: Vector3[]): Vector3 {
  return points.reduce((sum, point) => sum.add(point), new Vector3()).multiplyScalar(1 / Math.max(points.length, 1));
}

function partMesh(source: BufferGeometry, indices: number[], name: string, options: RigOptions): Mesh {
  const geometry = new BufferGeometry();
  for (const [key, attribute] of Object.entries(source.attributes)) geometry.setAttribute(key, attribute);
  geometry.setIndex(new BufferAttribute(source.getAttribute('position').count > 65535 ? new Uint32Array(indices) : new Uint16Array(indices), 1));
  geometry.boundingSphere = source.boundingSphere?.clone() ?? null;
  geometry.boundingBox = source.boundingBox?.clone() ?? null;
  const node = new Mesh(geometry, options.material);
  node.name = name;
  node.castShadow = options.shadows;
  node.receiveShadow = options.shadows;
  if (options.depthMaterial) node.customDepthMaterial = options.depthMaterial;
  node.matrixAutoUpdate = false;
  node.raycast = () => undefined;
  return node;
}

/** Splits a part into `count` sub-parts, `groupOf[i]` naming the group of its i-th triangle. */
export function splitPart(part: RigPart, groupOf: number[], count: number, options: RigOptions): RigPart[] {
  const index = part.mesh.geometry.getIndex()!;
  const out: RigPart[] = [];
  for (let group = 0; group < count; group++) {
    const indices: number[] = [];
    const centroids: Vector3[] = [];
    groupOf.forEach((g, triangle) => {
      if (g !== group) return;
      indices.push(index.getX(triangle * 3), index.getX(triangle * 3 + 1), index.getX(triangle * 3 + 2));
      centroids.push(part.centroids[triangle]!);
    });
    if (!indices.length) continue;
    const name = `${part.name}${group}`;
    out.push({ name, mesh: partMesh(part.mesh.geometry, indices, `desk-figure-${name}`, options), centre: centreOf(centroids), centroids });
  }
  return out;
}

/** The atlas shader's figure transform F (turn about the pivot, then lift) for figure slot `slot`. */
export function figureFrame(uniforms: AtlasUniforms, slot: number, out: Matrix4): Matrix4 {
  const pivot = uniforms.uFigPivot.value[slot]!;
  const lift = uniforms.uFigLift.value[slot] ?? 0;
  const yaw = uniforms.uFigYaw.value[slot] ?? 0;
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return out.set(c, 0, s, pivot.x - c * pivot.x - s * pivot.z, 0, 1, 0, lift, -s, 0, c, pivot.z + s * pivot.x - c * pivot.z, 0, 0, 0, 1);
}

const inverse = new Matrix4();

/**
 * Poses a rig part that the shader already moves by F: the mesh matrix becomes F·H·F⁻¹, so the part
 * ends at F(H(p)), its own motion `H` (in rest space) carried by the figure's lift and turn.
 */
export function poseInFrame(node: Object3D, frame: Matrix4, local: Matrix4): void {
  node.matrix.multiplyMatrices(frame, local).multiply(inverse.copy(frame).invert());
  node.matrixWorldNeedsUpdate = true;
}

/** Places an overlay the shader does not move at F·H·placement. */
export function placeInFrame(node: Object3D, frame: Matrix4, local: Matrix4, placement: Matrix4): void {
  node.matrix.multiplyMatrices(frame, local).multiply(placement);
  node.matrixWorldNeedsUpdate = true;
}

/** Rotation about an axis through `pivot`, then a translation: T(offset)·T(pivot)·R·T(-pivot). */
export function aroundPivot(out: Matrix4, pivot: Vector3, rotation: Matrix4, offset?: Vector3): Matrix4 {
  out.makeTranslation(pivot.x + (offset?.x ?? 0), pivot.y + (offset?.y ?? 0), pivot.z + (offset?.z ?? 0));
  out.multiply(rotation);
  return out.multiply(scratch.makeTranslation(-pivot.x, -pivot.y, -pivot.z));
}

const scratch = new Matrix4();

export function sameColor(a: [number, number, number], b: { r: number; g: number; b: number }): boolean {
  return Math.abs(a[0] - b.r) < 1e-3 && Math.abs(a[1] - b.g) < 1e-3 && Math.abs(a[2] - b.b) < 1e-3;
}
