import { CylinderGeometry, Mesh, Vector3, type MeshStandardMaterial } from 'three';

export function rod(from: Vector3, to: Vector3, radius: number, material: MeshStandardMaterial): Mesh {
  const length = from.distanceTo(to);
  const mesh = new Mesh(new CylinderGeometry(radius, radius, length, 12), material);
  mesh.position.copy(from).lerp(to, 0.5);
  mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), to.clone().sub(from).normalize());
  mesh.castShadow = true;
  return mesh;
}
