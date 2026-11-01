import { AdditiveBlending, Group, Matrix4, Mesh, MeshBasicMaterial, type BufferGeometry } from 'three';

const LAGS = [0.035, 0.075];
const OPACITY = [0.32, 0.16];

export class QuickTrail {
  readonly object3D = new Group();
  private readonly ghosts: { meshes: Mesh[]; material: MeshBasicMaterial; lag: number; opacity: number }[];
  private readonly matrix = new Matrix4();

  constructor(geometries: BufferGeometry[]) {
    this.ghosts = LAGS.map((lag, i) => {
      const material = new MeshBasicMaterial({ color: '#fff4b0', transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending });
      const meshes = geometries.map(geometry => {
        const mesh = new Mesh(geometry, material);
        mesh.matrixAutoUpdate = false;
        mesh.raycast = () => undefined;
        this.object3D.add(mesh);
        return mesh;
      });
      return { meshes, material, lag, opacity: OPACITY[i]! };
    });
    this.object3D.visible = false;
  }

  update(amount: number, bodyAt: (lag: number, out: Matrix4) => Matrix4): void {
    this.object3D.visible = amount > 0.01;
    if (!this.object3D.visible) return;
    for (const ghost of this.ghosts) {
      bodyAt(ghost.lag, this.matrix);
      ghost.material.opacity = ghost.opacity * amount;
      for (const mesh of ghost.meshes) {
        mesh.matrix.copy(this.matrix);
        mesh.matrixWorldNeedsUpdate = true;
      }
    }
  }

  dispose(): void {
    for (const ghost of this.ghosts) ghost.material.dispose();
  }
}
