import { Group, Mesh, Vector2, Vector3, type Material, type PerspectiveCamera } from 'three';
import { PartBuilder } from '../builder';
import { buildPlantLeaves, PLANT_PIVOT } from '../props/decor';
import type { Palette, Quality } from '../props/palette';
import type { DeskFrame } from '../set/frame';

const CLUMPS = 3;
const STIFFNESS = 46;
const DAMPING = 3.2;
/** Largest lean a clump reaches (rad), so even a hard rustle stays a plant, not a whip. */
const MAX_LEAN = 0.09;
/** Pointer distance (NDC) under which a passing hand stirs the leaves. */
const NEAR = 0.22;
const LEAF_HEIGHT = 0.16;

interface Clump {
  group: Group;
  lean: Vector2;
  speed: Vector2;
  give: number;
}

export interface PlantOptions {
  material: Material;
  depthMaterial: Material | undefined;
  palette: Palette;
  quality: Quality;
  shadows: boolean;
}

export interface PlantPointer {
  ndc: Vector2;
  velocity: Vector2;
  camera: PerspectiveCamera;
}

/** The window plant's foliage in three clumps on springs: a hand passing nearby stirs it, a click rustles it. */
export class SwayingPlant {
  readonly group = new Group();
  private readonly clumps: Clump[] = [];
  private readonly crown = new Vector3();

  constructor(options: PlantOptions) {
    const builders = Array.from({ length: CLUMPS }, () => new PartBuilder());
    buildPlantLeaves(builders, options.palette, options.quality);
    builders.forEach((builder, index) => {
      const mesh = new Mesh(builder.build(), options.material);
      mesh.castShadow = options.shadows;
      mesh.receiveShadow = options.shadows;
      if (options.depthMaterial) mesh.customDepthMaterial = options.depthMaterial;
      mesh.raycast = () => undefined;
      const group = new Group();
      group.add(mesh);
      this.group.add(group);
      this.clumps.push({ group, lean: new Vector2(), speed: new Vector2(), give: 0.8 + 0.2 * index });
    });
    this.group.position.copy(PLANT_PIVOT);
    this.group.name = 'desk-plant';
  }

  /** Pushes the leaves sideways (`x` across the screen, `y` towards the wall). */
  nudge(x: number, y: number): void {
    this.clumps.forEach((clump, index) => clump.speed.add(new Vector2(x, y).multiplyScalar(clump.give * (index % 2 ? -0.7 : 1))));
  }

  /** A click: a quick shake of every clump in alternating directions. */
  rustle(): void {
    this.clumps.forEach((clump, index) => clump.speed.add(new Vector2(index % 2 ? -1.6 : 1.8, 0.6 * (index - 1))));
  }

  update(frame: DeskFrame, pointer: PlantPointer | null): boolean {
    if (!frame.motion) return this.rest();
    if (pointer) this.stir(pointer, frame.dt);
    const dt = Math.min(frame.dt, 1 / 30);
    let moving = false;
    for (const clump of this.clumps) {
      clump.speed.addScaledVector(clump.lean, -STIFFNESS * dt).multiplyScalar(Math.max(1 - DAMPING * dt, 0));
      clump.lean.addScaledVector(clump.speed, dt).clampLength(0, MAX_LEAN);
      clump.group.rotation.set(clump.lean.y, 0, -clump.lean.x);
      moving ||= clump.lean.lengthSq() > 1e-8 || clump.speed.lengthSq() > 1e-6;
    }
    return moving;
  }

  private stir(pointer: PlantPointer, dt: number): void {
    this.crown.copy(PLANT_PIVOT).add(new Vector3(0, LEAF_HEIGHT * 0.6, 0)).project(pointer.camera);
    const distance = Math.hypot(pointer.ndc.x - this.crown.x, pointer.ndc.y - this.crown.y);
    if (distance > NEAR || this.crown.z > 1) return;
    const closeness = 1 - distance / NEAR;
    const push = closeness * closeness * dt * 0.004;
    this.nudge(pointer.velocity.x * push, Math.abs(pointer.velocity.y) * push * 0.3);
  }

  private rest(): boolean {
    for (const clump of this.clumps) {
      clump.lean.set(0, 0);
      clump.speed.set(0, 0);
      clump.group.rotation.set(0, 0, 0);
    }
    return false;
  }

  dispose(): void {
    for (const clump of this.clumps) (clump.group.children[0] as Mesh).geometry.dispose();
  }
}
