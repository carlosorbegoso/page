import { AdditiveBlending, BoxGeometry, Color, CylinderGeometry, Group, Mesh, MeshBasicMaterial, SphereGeometry, Vector3 } from 'three';

const UP = new Vector3(0, 1, 0);
const PUFFS = 12;
const BOLT_SEGMENTS = 9;
/** The bolt re-forks this often, like a real arc, instead of holding one shape. */
const BOLT_RESHAPE = 0.055;

export function glowMaterial(color: string, strength: number): MeshBasicMaterial {
  return new MeshBasicMaterial({ color: new Color(color).multiplyScalar(strength), transparent: true, opacity: 0, depthWrite: false, blending: AdditiveBlending });
}

export function glowBall(radius: number, color: string, strength: number): Mesh<SphereGeometry, MeshBasicMaterial> {
  const mesh = new Mesh(new SphereGeometry(radius, 12, 8), glowMaterial(color, strength));
  mesh.visible = false;
  mesh.raycast = () => undefined;
  return mesh;
}

/** Stretches a +Y unit primitive from `from` to `to`. */
function span(mesh: Mesh, from: Vector3, to: Vector3, width: number): void {
  const direction = to.clone().sub(from);
  mesh.position.copy(from).add(to).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(UP, direction.clone().normalize());
  mesh.scale.set(width, direction.length(), width);
}

/** Charizard's flamethrower: a flickering cone from its mouth and puffs of fire racing along it. */
export class FireStream {
  readonly object3D = new Group();
  private readonly cone = new Mesh(new CylinderGeometry(0.5, 1, 1, 14, 1, true), glowMaterial('#ff7a1c', 1.8));
  private readonly core = new Mesh(new CylinderGeometry(0.3, 0.6, 1, 10, 1, true), glowMaterial('#ffd36a', 2.4));
  private readonly puffs: Mesh<SphereGeometry, MeshBasicMaterial>[] = [];

  constructor() {
    this.cone.geometry.translate(0, 0.5, 0);
    this.core.geometry.translate(0, 0.5, 0);
    this.object3D.add(this.cone, this.core);
    for (let i = 0; i < PUFFS; i++) {
      const puff = glowBall(1, i % 3 === 0 ? '#ffd36a' : '#ff8a2a', 2);
      this.puffs.push(puff);
      this.object3D.add(puff);
    }
    this.object3D.visible = false;
  }

  update(time: number, amount: number, mouth: Vector3, target: Vector3): void {
    this.object3D.visible = amount > 0.01;
    if (!this.object3D.visible) return;
    const reach = Math.min(1, amount * 2.2);
    const end = mouth.clone().lerp(target, reach);
    const flicker = 0.8 + 0.2 * Math.sin(time * 47) * Math.sin(time * 31);
    for (const [mesh, width] of [
      [this.cone, 0.012],
      [this.core, 0.007]
    ] as const) {
      mesh.position.copy(mouth);
      mesh.quaternion.setFromUnitVectors(UP, end.clone().sub(mouth).normalize());
      mesh.scale.set(width * flicker, Math.max(end.distanceTo(mouth), 1e-4), width * flicker);
      mesh.material.opacity = 0.55 * amount;
    }
    this.puffs.forEach((puff, i) => {
      const travel = (time * 2.4 + i / PUFFS) % 1;
      const along = travel * reach;
      puff.visible = true;
      puff.position.copy(mouth).lerp(target, along);
      puff.position.y += 0.004 * Math.sin(time * 23 + i * 1.7);
      puff.scale.setScalar(0.003 + 0.007 * travel);
      puff.material.opacity = amount * (1 - travel) * 0.8;
    });
  }

  dispose(): void {
    for (const mesh of [this.cone, this.core, ...this.puffs]) {
      mesh.geometry.dispose();
      mesh.material.dispose();
    }
  }
}

/** Pikachu's thunderbolt: a jagged arc up from Pikachu and down onto Charizard, with a soft glow around it. */
export class LightningBolt {
  readonly object3D = new Group();
  private readonly core: Mesh<BoxGeometry, MeshBasicMaterial>[] = [];
  private readonly halo: Mesh<BoxGeometry, MeshBasicMaterial>[] = [];
  private readonly coreMaterial = glowMaterial('#fffbe0', 3.2);
  private readonly haloMaterial = glowMaterial('#ffe14a', 1.6);
  private readonly unit = new BoxGeometry(1, 1, 1);
  private shapeAt = -1;
  private readonly points: Vector3[] = [];

  constructor() {
    for (let i = 0; i < BOLT_SEGMENTS; i++) {
      const core = new Mesh(this.unit, this.coreMaterial);
      const halo = new Mesh(this.unit, this.haloMaterial);
      this.core.push(core);
      this.halo.push(halo);
      this.object3D.add(core, halo);
    }
    this.object3D.visible = false;
  }

  update(time: number, amount: number, from: Vector3, to: Vector3): void {
    this.object3D.visible = amount > 0.01;
    if (!this.object3D.visible) return;
    if (time - this.shapeAt > BOLT_RESHAPE || this.points.length === 0) this.reshape(time, from, to);
    for (let i = 0; i < BOLT_SEGMENTS; i++) {
      span(this.core[i]!, this.points[i]!, this.points[i + 1]!, 0.0011);
      span(this.halo[i]!, this.points[i]!, this.points[i + 1]!, 0.0045);
    }
    const strobe = Math.sin(time * 80) > -0.3 ? 1 : 0.35;
    this.coreMaterial.opacity = amount * strobe;
    this.haloMaterial.opacity = 0.45 * amount * strobe;
  }

  private reshape(time: number, from: Vector3, to: Vector3): void {
    this.shapeAt = time;
    this.points.length = 0;
    const lift = 0.045;
    for (let i = 0; i <= BOLT_SEGMENTS; i++) {
      const t = i / BOLT_SEGMENTS;
      const point = from.clone().lerp(to, t);
      point.y += Math.sin(t * Math.PI) * lift;
      if (i > 0 && i < BOLT_SEGMENTS) point.add(new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.012));
      this.points.push(point);
    }
  }

  dispose(): void {
    this.unit.dispose();
    this.coreMaterial.dispose();
    this.haloMaterial.dispose();
  }
}

export function disposeGlow(mesh: Mesh<SphereGeometry, MeshBasicMaterial>): void {
  mesh.geometry.dispose();
  mesh.material.dispose();
}

