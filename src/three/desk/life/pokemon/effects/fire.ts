import { AdditiveBlending, CylinderGeometry, Group, Mesh, ShaderMaterial, Vector3 } from 'three';
import { FIRE_FRAGMENT, FIRE_VERTEX } from './fire.glsl';

const UP = new Vector3(0, 1, 0);
const direction = new Vector3();

function fireMaterial(heat: number, wobble: number): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uAmount: { value: 0 }, uReach: { value: 0 }, uHeat: { value: heat }, uWobble: { value: wobble } },
    vertexShader: FIRE_VERTEX,
    fragmentShader: FIRE_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending
  });
}

function flameMesh(mouth: number, heat: number, wobble: number): Mesh<CylinderGeometry, ShaderMaterial> {
  const mesh = new Mesh(new CylinderGeometry(1, mouth, 1, 18, 12, true).translate(0, 0.5, 0), fireMaterial(heat, wobble));
  mesh.frustumCulled = false;
  mesh.raycast = () => undefined;
  return mesh;
}

export class FireStream {
  readonly object3D = new Group();
  private readonly layers = [
    { mesh: flameMesh(0.16, 0.75, 1), width: 0.013, reach: 1 },
    { mesh: flameMesh(0.3, 1.3, 0.55), width: 0.0055, reach: 0.82 }
  ];

  constructor() {
    for (const layer of this.layers) this.object3D.add(layer.mesh);
    this.object3D.visible = false;
  }

  update(time: number, amount: number, mouth: Vector3, target: Vector3): void {
    this.object3D.visible = amount > 0.01;
    if (!this.object3D.visible) return;
    direction.copy(target).sub(mouth);
    const length = Math.max(direction.length() * 1.08, 1e-4);
    direction.normalize();
    const reach = Math.min(1, amount * 1.6);
    const flicker = 0.85 + 0.15 * Math.sin(time * 47) * Math.sin(time * 31);
    for (const { mesh, width, reach: share } of this.layers) {
      mesh.position.copy(mouth);
      mesh.quaternion.setFromUnitVectors(UP, direction);
      mesh.scale.set(width * flicker, length, width * flicker);
      const uniforms = mesh.material.uniforms;
      uniforms.uTime!.value = time;
      uniforms.uAmount!.value = amount;
      uniforms.uReach!.value = reach * share;
    }
  }

  dispose(): void {
    for (const { mesh } of this.layers) {
      mesh.geometry.dispose();
      mesh.material.dispose();
    }
  }
}
