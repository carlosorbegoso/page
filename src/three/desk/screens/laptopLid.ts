import { Group, Mesh, Vector3, type Material, type Object3D } from 'three';
import { PartBuilder } from '../builder';
import { LAPTOP } from '../layout';
import { damp, towards } from '../math';
import { buildLaptopLid, laptopHingeMatrix } from '../props';

const X_AXIS = new Vector3(1, 0, 0);
const CLOSE_SECONDS = 0.55;
const OPEN_SECONDS = 0.7;
const SHUT_LIFT = LAPTOP.lid / 2 + 0.0014;
const HOVER_OPEN = 0.035;
const SLEEP_AT = 0.55;

export class LaptopLid {
  readonly pivot = new Group();
  readonly panel = new Group();
  private readonly mesh: Mesh;
  private shut = 0;
  private shutGoal = 0;
  private hover = 0;
  private hovered = false;
  private power = 1;

  constructor(material: Material, depthMaterial: Material | undefined, shadows: boolean) {
    const builder = new PartBuilder();
    buildLaptopLid(builder);
    this.mesh = new Mesh(builder.build(), material);
    this.mesh.name = 'desk-laptop-lid';
    this.mesh.castShadow = shadows;
    this.mesh.receiveShadow = shadows;
    if (depthMaterial) this.mesh.customDepthMaterial = depthMaterial;
    this.pivot.name = 'desk-laptop-hinge';
    laptopHingeMatrix().decompose(this.pivot.position, this.pivot.quaternion, new Vector3());
    this.pivot.add(this.panel);
    this.panel.add(this.mesh);
    this.pose();
  }

  get open(): boolean {
    return this.shutGoal === 0;
  }

  get glow(): number {
    return this.power;
  }

  toggle(): boolean {
    this.shutGoal = this.shutGoal === 0 ? 1 : 0;
    return this.open;
  }

  setHover(hovered: boolean): void {
    this.hovered = hovered;
  }

  update(step: number): boolean {
    const seconds = this.shutGoal > this.shut ? CLOSE_SECONDS : OPEN_SECONDS;
    this.shut = towards(this.shut, this.shutGoal, step / seconds);
    this.hover = damp(this.hover, this.hovered && this.open ? 1 : 0, 12, step);
    const awake = this.open && this.shut < SLEEP_AT;
    this.power = damp(this.power, awake ? 1 : 0, awake ? 3.5 : 14, step);
    if (Math.abs(this.power - (awake ? 1 : 0)) < 0.002) this.power = awake ? 1 : 0;
    this.pose();
    return this.shut !== this.shutGoal || Math.abs(this.hover - (this.hovered && this.open ? 1 : 0)) > 0.002 || (this.power > 0 && this.power < 1);
  }

  private pose(): void {
    const eased = this.shut * this.shut * (3 - 2 * this.shut);
    const angle = -LAPTOP.lean - HOVER_OPEN * this.hover + (Math.PI / 2 + LAPTOP.lean) * eased;
    this.panel.quaternion.setFromAxisAngle(X_AXIS, angle);
    this.panel.position.set(0, SHUT_LIFT * eased, 0);
  }

  get body(): Object3D {
    return this.mesh;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
  }
}
