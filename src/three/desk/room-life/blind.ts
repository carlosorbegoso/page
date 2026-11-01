import { BoxGeometry, Color, CylinderGeometry, DoubleSide, Group, Mesh, MeshStandardMaterial, PlaneGeometry, type BufferGeometry } from 'three';
import { GLASS_Z, WINDOW } from '../layout';
import type { DeskFrame } from '../set/frame';

/** In the window reveal, just room-side of the sash handle, so the raised roll hides under the lintel. */
const BLIND_Z = GLASS_Z + 0.056;
const ROLL_RADIUS = 0.016;
const TOP = WINDOW.y + WINDOW.height / 2 - ROLL_RADIUS - 0.004;
const DROP = WINDOW.height - 0.028;
const WIDTH = WINDOW.width - 0.02;
const LINEN = '#a99e8b';
/** Light the fabric lets through (it glows like linen against the sky): faint city at night, bright by day. */
const NIGHT_GLOW = new Color('#3a4258');
const DAY_GLOW = new Color('#fff3e0');
const SWAY_STIFFNESS = 90;
const SWAY_DAMPING = 7;

/** A linen roller blind in the window reveal: the visitor lowers or raises it, and it sways when touched. */
export class RollerBlind {
  readonly group = new Group();
  private readonly cloth: Group;
  private readonly fabric: Mesh;
  private readonly hem: Mesh;
  private readonly fabricMaterial: MeshStandardMaterial;
  private readonly materials: MeshStandardMaterial[];
  private readonly geometries: BufferGeometry[];
  private sway = 0;
  private swaySpeed = 0;

  constructor() {
    this.fabricMaterial = new MeshStandardMaterial({ color: LINEN, roughness: 0.95, metalness: 0, side: DoubleSide, emissive: NIGHT_GLOW.clone(), emissiveIntensity: 1 });
    const hardware = new MeshStandardMaterial({ color: '#e8e4dc', roughness: 0.5, metalness: 0.1 });
    const rollGeometry = new CylinderGeometry(ROLL_RADIUS, ROLL_RADIUS, WIDTH + 0.01, 20).rotateZ(Math.PI / 2);
    const fabricGeometry = new PlaneGeometry(WIDTH, 1).translate(0, -0.5, 0);
    const hemGeometry = new BoxGeometry(WIDTH + 0.004, 0.014, 0.01);
    const roll = new Mesh(rollGeometry, hardware);
    this.fabric = new Mesh(fabricGeometry, this.fabricMaterial);
    this.hem = new Mesh(hemGeometry, hardware);
    this.cloth = new Group();
    this.cloth.position.set(0, -ROLL_RADIUS * 0.6, ROLL_RADIUS * 0.4);
    this.cloth.add(this.fabric, this.hem);
    this.group.add(roll, this.cloth);
    this.group.position.set(WINDOW.x, TOP, BLIND_Z);
    this.group.name = 'desk-blind';
    for (const mesh of [roll, this.fabric, this.hem]) mesh.raycast = () => undefined;
    this.materials = [this.fabricMaterial, hardware];
    this.geometries = [rollGeometry, fabricGeometry, hemGeometry];
    this.apply(0, 0);
  }

  /** A touch sets the hem swinging (hover a little, a click more). */
  nudge(strength: number): void {
    this.swaySpeed += strength;
  }

  update(frame: DeskFrame): boolean {
    if (!frame.motion) {
      this.sway = this.swaySpeed = 0;
      this.cloth.rotation.x = 0;
      return false;
    }
    const dt = Math.min(frame.dt, 1 / 30);
    this.swaySpeed += (-SWAY_STIFFNESS * this.sway - SWAY_DAMPING * this.swaySpeed) * dt;
    this.sway += this.swaySpeed * dt;
    this.cloth.rotation.x = this.sway;
    const moving = Math.abs(this.sway) > 1e-4 || Math.abs(this.swaySpeed) > 1e-3;
    if (!moving) this.sway = this.swaySpeed = 0;
    return moving;
  }

  /** `blind` 0 raised … 1 lowered; `day` 0…1 for the light the cloth lets through. */
  apply(blind: number, day: number): void {
    const length = Math.max(blind * DROP, 0.0005);
    this.fabric.scale.y = length;
    this.fabric.visible = blind > 0.002;
    this.hem.position.y = -length - 0.006;
    this.fabricMaterial.emissive.copy(NIGHT_GLOW).lerp(DAY_GLOW, day);
    this.fabricMaterial.emissiveIntensity = 0.08 + 0.3 * day;
  }

  dispose(): void {
    for (const material of this.materials) material.dispose();
    for (const geometry of this.geometries) geometry.dispose();
  }
}
