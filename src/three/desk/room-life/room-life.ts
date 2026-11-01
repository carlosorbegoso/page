import type { Group, Material } from 'three';
import type { StationContext } from '../../contracts';
import { LampBulb, LampSwitch } from '../lamp';
import type { Palette } from '../props/palette';
import type { DeskFrame } from '../set/frame';
import type { DeskLevels, LightLevels } from '../set/levels';
import { RollerBlind } from './blind';
import { SwayingPlant } from './plant';

export type RoomToy = 'lamp' | 'window' | 'plant';

export interface RoomLifeOptions {
  material: Material;
  depthMaterial: Material | undefined;
  palette: Palette;
}

export class RoomLife {
  private readonly bulb = new LampBulb();
  private readonly lampSwitch = new LampSwitch();
  private readonly blind = new RollerBlind();
  private plant!: SwayingPlant;
  private hovered: RoomToy | null = null;

  constructor(
    private readonly context: StationContext,
    private readonly levels: DeskLevels
  ) {}

  build(room: Group, options: RoomLifeOptions): void {
    const high = this.context.tier === 'high';
    this.plant = new SwayingPlant({ ...options, quality: high ? 1 : 0.6, shadows: high });
    room.add(this.bulb.group, this.lampSwitch.group, this.blind.group, this.plant.group);
  }

  setHover(name: string | null): void {
    const toy = name === 'lamp' || name === 'window' || name === 'plant' ? name : null;
    if (toy === this.hovered) return;
    this.hovered = toy;
    this.lampSwitch.setHover(toy === 'lamp');
    if (toy === 'window') this.blind.nudge(0.35);
    if (toy === 'plant') this.plant.nudge(0.5, 0.1);
  }

  action(action: string | undefined): boolean {
    if (action === 'blind') {
      this.levels.toggleBlind();
      this.blind.nudge(0.6);
      return true;
    }
    if (action === 'plant') {
      this.plant.rustle();
      return true;
    }
    return false;
  }

  update(frame: DeskFrame): boolean {
    const { pointer, camera } = this.context;
    const near = frame.motion && pointer.active && pointer.enabled ? { ndc: pointer.ndc, velocity: pointer.velocity, camera } : null;
    const rocking = this.lampSwitch.update(frame, this.levels.lampOn);
    const swaying = this.blind.update(frame);
    const rustling = this.plant.update(frame, near);
    if (rustling && this.context.tier === 'high') this.context.renderer.shadowMap.needsUpdate = true;
    return rocking || swaying || rustling;
  }

  apply(level: LightLevels): void {
    this.bulb.apply(level.lamp, level.day);
    this.blind.apply(level.blind, level.day);
  }

  dispose(): void {
    this.bulb.dispose();
    this.lampSwitch.dispose();
    this.blind.dispose();
    this.plant?.dispose();
  }
}
