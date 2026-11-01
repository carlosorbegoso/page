import { Texture, type BufferGeometry, type Material, type Mesh, type Scene } from 'three';

export function disposeSceneGraph(scene: Scene): void {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  scene.traverse(object => {
    const mesh = object as Mesh;
    if (mesh.geometry) geometries.add(mesh.geometry);
    if (mesh.material) materials.add(mesh.material as Material);
  });
  geometries.forEach(geometry => geometry.dispose());
  materials.forEach(material => {
    if ('map' in material && material.map instanceof Texture) material.map.dispose();
    material.dispose();
  });
}
