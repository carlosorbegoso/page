import { AdditiveBlending, Color, Mesh, MeshBasicMaterial, SphereGeometry, type Vector3 } from 'three';

export type Glow = Mesh<SphereGeometry, MeshBasicMaterial>;

export function glowMaterial(color: string, strength: number): MeshBasicMaterial {
  return new MeshBasicMaterial({ color: new Color(color).multiplyScalar(strength), transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending });
}

export function glowBall(radius: number, color: string, strength: number): Glow {
  const mesh = new Mesh(new SphereGeometry(radius, 12, 8), glowMaterial(color, strength));
  mesh.visible = false;
  mesh.matrixAutoUpdate = false;
  mesh.raycast = () => undefined;
  return mesh;
}

export function setGlow(glow: Glow, opacity: number, at: Vector3, scale = 1): void {
  glow.visible = opacity > 0.01;
  glow.material.opacity = opacity;
  glow.matrix.makeScale(scale, scale, scale).setPosition(at);
}

export function disposeGlow(glow: Glow): void {
  glow.geometry.dispose();
  glow.material.dispose();
}
