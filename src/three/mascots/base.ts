import { Group, type BufferGeometry, type Material, type MeshStandardMaterial, type Object3D } from 'three';
import { acquire, release } from '../assets';
import { applyMaterialTokens, baseIntensity } from './materials';
import { createContactShadow } from './shadow';
import type { Mascot, MascotId } from './types';

export interface MascotRig {
  /** Group moved by the idle float/turn. */
  motion: Object3D;
  signals: MeshStandardMaterial[];
  materials: Material[];
  /** Mascot-specific reaction to focus weight. */
  focus?: (weight: number) => void;
  /** Per-signal multiplier for idle signal animation (breathing, typing dots). */
  signalPulse?: (time: number, index: number) => number;
  /** Extra idle motion (e.g. the wrench turning on its long axis). */
  idle?: (time: number) => void;
}

export interface MascotRecipe<G extends Record<string, BufferGeometry>> {
  id: MascotId;
  height: number;
  shadowSize: number;
  geometries: () => G;
  assemble: (geometries: G, root: Group) => MascotRig;
}

export interface MascotOptions {
  /** Baked contact shadow under the mascot (off for bodies floating in space). */
  shadow?: boolean;
}

const IDLE_TURN = 0.08;
const FLOAT_AMPLITUDE = 0.015;
const FLOAT_PERIOD = 6;

class RiggedMascot implements Mascot {
  private signalLevel = 1;
  private focusWeight = 0;

  constructor(
    readonly id: MascotId,
    readonly root: Group,
    readonly height: number,
    private readonly rig: MascotRig,
    private readonly cleanup: () => void
  ) {}

  setSignal(level: number): void {
    this.signalLevel = level;
  }

  setFocus(weight: number): void {
    this.focusWeight = weight;
    this.rig.focus?.(weight);
  }

  update(time: number, motion: boolean): void {
    const { motion: group, signals } = this.rig;
    if (motion) {
      group.rotation.y = time * IDLE_TURN;
      group.position.y = Math.sin((time / FLOAT_PERIOD) * Math.PI * 2) * FLOAT_AMPLITUDE;
      this.rig.idle?.(time);
    }
    const focusBoost = 1 + this.focusWeight * 0.6;
    signals.forEach((material, index) => {
      const pulse = motion && this.rig.signalPulse ? this.rig.signalPulse(time, index) : 1;
      material.emissiveIntensity = baseIntensity(material) * this.signalLevel * focusBoost * pulse;
    });
  }

  applyTokens(): void {
    for (const material of this.rig.materials) applyMaterialTokens(material);
  }

  dispose(): void {
    this.root.removeFromParent();
    for (const material of this.rig.materials) material.dispose();
    this.cleanup();
  }
}

/**
 * Builds a procedural mascot. Geometry is shared through the asset cache (Hero and
 * Ventures both use Alfa); materials are per instance so each scene drives its own signal.
 */
export async function buildMascot<G extends Record<string, BufferGeometry>>(
  recipe: MascotRecipe<G>,
  options: MascotOptions = {}
): Promise<Mascot> {
  const key = `procedural:${recipe.id}`;
  const geometries = await acquire(key, async () => recipe.geometries(), g => {
    for (const geometry of Object.values(g)) geometry.dispose();
  });
  const root = new Group();
  root.name = recipe.id;
  const rig = recipe.assemble(geometries, root);
  const shadow = options.shadow === false ? undefined : await createContactShadow(recipe.shadowSize);
  if (shadow) root.add(shadow.mesh);
  return new RiggedMascot(recipe.id, root, recipe.height, rig, () => {
    shadow?.dispose();
    release(key);
  });
}
