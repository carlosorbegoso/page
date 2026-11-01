import { BoxGeometry, Color, DoubleSide, Group, Mesh, MeshStandardMaterial } from 'three';
import { BLIND, WINDOW } from '../layout';
import type { DeskFrame } from '../set/frame';
import { BeadChain } from './blind-chain';
import { clothGeometry, WEAVE_TILE, weaveTexture } from './blind-cloth';

const TOP = WINDOW.y + WINDOW.height / 2 - BLIND.cassette;
const BAR_HEIGHT = 0.018;
const SILL_KISS = 0.006;
const DROP = TOP - (WINDOW.y - WINDOW.height / 2) - BAR_HEIGHT - SILL_KISS;
const LONGEST = 1 + SILL_KISS / DROP;
const WIDTH = WINDOW.width - 0.03;
const LINEN = '#b9ab92';
const NIGHT_GLOW = new Color('#2f3850');
const DAY_GLOW = new Color('#f4d6a8');
const SWAY_STIFFNESS = 70;
const SWAY_DAMPING = 5;
const MAX_SWAY = 0.03;
const KICK = 0.05;
const JUMP = 0.2;

/** What the room needs from the blind, which arrives after the first frame. */
export interface BlindView {
  readonly group: Group;
  nudge(strength: number): void;
  update(frame: DeskFrame, blind: number): boolean;
  apply(blind: number, day: number): void;
  dispose(): void;
}

function hardwareMaterials(): { bar: MeshStandardMaterial; chain: MeshStandardMaterial } {
  return {
    bar: new MeshStandardMaterial({ color: '#2b313c', roughness: 0.4, metalness: 0.6 }),
    chain: new MeshStandardMaterial({ color: '#c8ccd2', roughness: 0.3, metalness: 0.8 })
  };
}

/** Fabric roller blind in the window recess: linen cloth, weighted bottom bar and a bead pull-chain on the right. */
export class RollerBlind implements BlindView {
  readonly group = new Group();
  private readonly cloth = new Group();
  private readonly fabric: Mesh<ReturnType<typeof clothGeometry>, MeshStandardMaterial>;
  private readonly bar: Mesh<BoxGeometry, MeshStandardMaterial>;
  private readonly chain: BeadChain;
  private readonly chainMaterial: MeshStandardMaterial;
  private sway = 0;
  private swaySpeed = 0;
  private last = Number.NaN;
  private lastSpeed = 0;

  constructor() {
    const weave = weaveTexture();
    weave.repeat.set(WIDTH / WEAVE_TILE, 1);
    const fabricMaterial = new MeshStandardMaterial({ color: LINEN, map: weave, emissiveMap: weave, roughness: 0.96, metalness: 0, side: DoubleSide, emissive: NIGHT_GLOW.clone() });
    const { bar, chain } = hardwareMaterials();
    this.fabric = new Mesh(clothGeometry(WIDTH), fabricMaterial);
    this.bar = new Mesh(new BoxGeometry(WIDTH + 0.006, BAR_HEIGHT, 0.012), bar);
    this.chainMaterial = chain;
    this.chain = new BeadChain(chain);
    this.chain.group.position.set(WINDOW.width / 2 - 0.045, 0, 0.024);
    this.cloth.add(this.fabric, this.bar);
    this.group.add(this.cloth, this.chain.group);
    this.group.position.set(WINDOW.x, TOP, BLIND.z);
    this.group.name = 'desk-blind';
    this.fabric.raycast = this.bar.raycast = () => undefined;
    this.apply(0, 0);
  }

  nudge(strength: number): void {
    this.swaySpeed += strength * 0.2;
  }

  update(frame: DeskFrame, blind: number): boolean {
    const dt = Math.min(frame.dt, 1 / 30);
    if (dt > 0) this.feelTravel(blind, dt);
    this.swaySpeed += (-SWAY_STIFFNESS * this.sway - SWAY_DAMPING * this.swaySpeed) * dt;
    this.sway = Math.min(Math.max(this.sway + this.swaySpeed * dt, -MAX_SWAY), MAX_SWAY);
    const moving = Math.abs(this.sway) > 1e-4 || Math.abs(this.swaySpeed) > 1e-3;
    if (!moving) this.sway = this.swaySpeed = 0;
    this.cloth.rotation.x = this.sway;
    this.chain.swing(this.sway);
    return moving;
  }

  private feelTravel(blind: number, dt: number): void {
    const step = blind - this.last;
    this.last = blind;
    if (!(Math.abs(step) < JUMP)) {
      this.lastSpeed = 0;
      return;
    }
    const speed = step / dt;
    this.swaySpeed -= (speed - this.lastSpeed) * KICK;
    this.lastSpeed = speed;
  }

  apply(blind: number, day: number): void {
    const length = Math.min(Math.max(blind, 0.0005 / DROP), LONGEST) * DROP;
    const material = this.fabric.material;
    this.fabric.scale.y = length;
    this.fabric.visible = blind > 0.002;
    this.bar.position.y = -length - BAR_HEIGHT / 2;
    material.map!.repeat.y = length / WEAVE_TILE;
    material.emissive.copy(NIGHT_GLOW).lerp(DAY_GLOW, day);
    material.emissiveIntensity = 0.05 + 0.33 * day;
    this.chain.run(blind);
  }

  dispose(): void {
    this.fabric.geometry.dispose();
    this.fabric.material.map?.dispose();
    this.fabric.material.dispose();
    this.bar.geometry.dispose();
    this.bar.material.dispose();
    this.chainMaterial.dispose();
    this.chain.dispose();
  }
}
