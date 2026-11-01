import { BoxGeometry, CylinderGeometry, Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { tokenColor } from '../../tokens';
import { LAMP } from '../layout';
import { damp } from '../math';
import type { DeskFrame } from '../set/frame';

const BASE_TOP = 0.018;
export const LAMP_SWITCH = LAMP.base.clone().add(new Vector3(-0.034, BASE_TOP, 0.044));
const YAW = Math.atan2(-0.034, 0.044);
const ROCK = 0.32;
const HOVER_DIP = 0.0012;

export class LampSwitch {
  readonly group = new Group();
  private readonly rocker: Mesh;
  private readonly materials: MeshStandardMaterial[];
  private readonly geometries: Array<BoxGeometry | CylinderGeometry>;
  private angle = ROCK;
  private dip = 0;
  private hovered = false;

  constructor() {
    const housingMaterial = new MeshStandardMaterial({ color: tokenColor('--color-lamp-shade', '#1d222b'), roughness: 0.45, metalness: 0.3 });
    const rockerMaterial = new MeshStandardMaterial({ color: 0x15171c, roughness: 0.6, metalness: 0.05 });
    const housingGeometry = new CylinderGeometry(0.014, 0.015, 0.006, 20);
    const rockerGeometry = new BoxGeometry(0.014, 0.006, 0.018);
    const housing = new Mesh(housingGeometry, housingMaterial);
    housing.position.y = 0.003;
    this.rocker = new Mesh(rockerGeometry, rockerMaterial);
    this.rocker.position.y = 0.0065;
    this.group.add(housing, this.rocker);
    this.group.position.copy(LAMP_SWITCH);
    this.group.rotation.y = YAW;
    this.group.name = 'desk-lamp-switch';
    for (const child of this.group.children) child.raycast = () => undefined;
    this.materials = [housingMaterial, rockerMaterial];
    this.geometries = [housingGeometry, rockerGeometry];
  }

  setHover(hovered: boolean): void {
    this.hovered = hovered;
  }

  update(frame: DeskFrame, on: boolean): boolean {
    const angleGoal = on ? -ROCK : ROCK;
    const dipGoal = this.hovered ? HOVER_DIP : 0;
    this.angle = damp(this.angle, angleGoal, 38, frame.step);
    this.dip = damp(this.dip, dipGoal, 18, frame.step);
    this.rocker.rotation.x = this.angle;
    this.rocker.position.y = 0.0065 - this.dip;
    return Math.abs(this.angle - angleGoal) > 1e-3 || Math.abs(this.dip - dipGoal) > 1e-5;
  }

  dispose(): void {
    for (const material of this.materials) material.dispose();
    for (const geometry of this.geometries) geometry.dispose();
  }
}
