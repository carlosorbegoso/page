import { Box3, Group, type Material, type Mesh, type MeshStandardMaterial, type Object3D } from 'three';
import { acquireGltf, release } from '../assets';
import { baseIntensity } from './materials';
import { createContactShadow } from './shadow';
import type { Mascot, MascotId } from './types';

const IDLE_TURN = 0.08;
const FLOAT_AMPLITUDE = 0.015;
const FLOAT_PERIOD = 6;

function isEmissive(material: Material): material is MeshStandardMaterial {
  const standard = material as MeshStandardMaterial;
  return Boolean(standard.emissive) && (standard.emissive.getHex() !== 0 || Boolean(standard.emissiveMap));
}

/**
 * Mascot backed by an optimised GLB. Node naming convention (see docs/3d/assets.md):
 * `lid` (lifted on focus), `dot-0..2` (sequenced signals); any emissive material is a signal.
 */
class GltfMascot implements Mascot {
  private readonly motion = new Group();
  private readonly signals: MeshStandardMaterial[] = [];
  private readonly materials: Material[] = [];
  private readonly dots: MeshStandardMaterial[] = [];
  private readonly lid: Object3D | undefined;
  private readonly lidY: number;
  private signalLevel = 1;
  private focusWeight = 0;
  readonly root = new Group();
  readonly height: number;

  constructor(
    readonly id: MascotId,
    source: Object3D,
    private readonly cleanup: () => void
  ) {
    const model = source.clone(true);
    model.traverse(object => {
      const mesh = object as Mesh;
      if (!mesh.isMesh) return;
      const own = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map(m => m.clone());
      mesh.material = Array.isArray(mesh.material) ? own : own[0]!;
      for (const material of own) {
        this.materials.push(material);
        if (!isEmissive(material)) continue;
        (material.userData as { baseIntensity?: number }).baseIntensity = material.emissiveIntensity;
        (/^dot-\d/.test(mesh.name) ? this.dots : this.signals).push(material);
      }
    });
    this.lid = model.getObjectByName('lid');
    this.lidY = this.lid?.position.y ?? 0;
    this.height = new Box3().setFromObject(model).max.y;
    this.root.name = id;
    this.motion.add(model);
    this.root.add(this.motion);
  }

  setSignal(level: number): void {
    this.signalLevel = level;
  }

  setFocus(weight: number): void {
    this.focusWeight = weight;
    if (this.lid) this.lid.position.y = this.lidY + weight * 0.025;
  }

  update(time: number, motion: boolean): void {
    if (motion) {
      this.motion.rotation.y = time * IDLE_TURN;
      this.motion.position.y = Math.sin((time / FLOAT_PERIOD) * Math.PI * 2) * FLOAT_AMPLITUDE;
    }
    const boost = this.signalLevel * (1 + this.focusWeight * 0.6);
    for (const material of this.signals) material.emissiveIntensity = baseIntensity(material) * boost;
    this.dots.forEach((material, index) => {
      const pulse = motion ? (Math.floor(time / 0.4) % 4 === index ? 1.6 : 0.55) : 1;
      material.emissiveIntensity = baseIntensity(material) * boost * pulse;
    });
  }

  applyTokens(): void {}

  dispose(): void {
    this.root.removeFromParent();
    for (const material of this.materials) material.dispose();
    this.cleanup();
  }
}

/** Loads a GLB mascot through the refcounted cache and adds a baked contact shadow. */
export async function loadGltfMascot(id: MascotId, url: string, shadowSize: number): Promise<Mascot> {
  const gltf = await acquireGltf(url);
  const hasShadow = Boolean(gltf.scene.getObjectByName('shadow'));
  const shadow = hasShadow ? undefined : await createContactShadow(shadowSize);
  const mascot = new GltfMascot(id, gltf.scene, () => {
    shadow?.dispose();
    release(url);
  });
  if (shadow) mascot.root.add(shadow.mesh);
  return mascot;
}
