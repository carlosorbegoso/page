import { BufferAttribute, BufferGeometry, Matrix4, Mesh, Vector3, type Material, type Object3D } from 'three';
import type { AtlasUniforms } from '../materials';

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
  readonly centre: Vector3;
  readonly centroids: Vector3[];
}

export interface RigOptions {
  material: Material;
  depthMaterial?: Material;
  shadows: boolean;
}

type Bucket = { indices: number[]; centroids: Vector3[] };

const corner = [new Vector3(), new Vector3(), new Vector3()];

function describeTriangle(geometry: BufferGeometry, i: number): { indices: [number, number, number]; info: TriangleInfo } {
  const index = geometry.getIndex()!;
  const position = geometry.getAttribute('position');
  const color = geometry.getAttribute('color');
  const indices: [number, number, number] = [index.getX(i), index.getX(i + 1), index.getX(i + 2)];
  const [a, b, c] = corner as [Vector3, Vector3, Vector3];
  a.fromBufferAttribute(position, indices[0]);
  b.fromBufferAttribute(position, indices[1]);
  c.fromBufferAttribute(position, indices[2]);
  const i0 = indices[0];
  return {
    indices,
    info: {
      oid: Math.round(geometry.getAttribute('oid').getX(i0)),
      centroid: a.clone().add(b).add(c).multiplyScalar(1 / 3),
      color: [color.getX(i0), color.getY(i0), color.getZ(i0)],
      emissive: geometry.getAttribute('pbr').getZ(i0),
      normal: c.clone().sub(b).cross(a.clone().sub(b)).normalize()
    }
  };
}

function bucketTriangles(geometry: BufferGeometry, classify: (info: TriangleInfo) => string | null): { buckets: Map<string, Bucket>; rest: number[] } {
  const buckets = new Map<string, Bucket>();
  const rest: number[] = [];
  const count = geometry.getIndex()!.count;
  for (let i = 0; i < count; i += 3) {
    const { indices, info } = describeTriangle(geometry, i);
    const name = classify(info);
    if (!name) {
      rest.push(...indices);
      continue;
    }
    let bucket = buckets.get(name);
    if (!bucket) buckets.set(name, (bucket = { indices: [], centroids: [] }));
    bucket.indices.push(...indices);
    bucket.centroids.push(info.centroid);
  }
  return { buckets, rest };
}

export function splitFigures(geometry: BufferGeometry, classify: (info: TriangleInfo) => string | null, options: RigOptions): { rest: Mesh; parts: Map<string, RigPart> } {
  const { buckets, rest } = bucketTriangles(geometry, classify);
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

export function figureFrame(uniforms: AtlasUniforms, slot: number, out: Matrix4): Matrix4 {
  const pivot = uniforms.uFigPivot.value[slot]!;
  const lift = uniforms.uFigLift.value[slot] ?? 0;
  const yaw = uniforms.uFigYaw.value[slot] ?? 0;
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return out.set(c, 0, s, pivot.x - c * pivot.x - s * pivot.z, 0, 1, 0, lift, -s, 0, c, pivot.z + s * pivot.x - c * pivot.z, 0, 0, 0, 1);
}

const inverse = new Matrix4();

export function poseInFrame(node: Object3D, frame: Matrix4, local: Matrix4): void {
  node.matrix.multiplyMatrices(frame, local).multiply(inverse.copy(frame).invert());
  node.matrixWorldNeedsUpdate = true;
}

export function placeInFrame(node: Object3D, frame: Matrix4, local: Matrix4, placement: Matrix4): void {
  node.matrix.multiplyMatrices(frame, local).multiply(placement);
  node.matrixWorldNeedsUpdate = true;
}

export function aroundPivot(out: Matrix4, pivot: Vector3, rotation: Matrix4, offset?: Vector3): Matrix4 {
  out.makeTranslation(pivot.x + (offset?.x ?? 0), pivot.y + (offset?.y ?? 0), pivot.z + (offset?.z ?? 0));
  out.multiply(rotation);
  return out.multiply(scratch.makeTranslation(-pivot.x, -pivot.y, -pivot.z));
}

const scratch = new Matrix4();

export function sameColor(a: [number, number, number], b: { r: number; g: number; b: number }): boolean {
  return Math.abs(a[0] - b.r) < 1e-3 && Math.abs(a[1] - b.g) < 1e-3 && Math.abs(a[2] - b.b) < 1e-3;
}
