import type { Group } from 'three';
import type { Hotspots } from '../hotspots';
import type { DeskFrame } from './frame';
import type { LightRig } from './lighting';

export interface ExploreHintsHost {
  lights(): LightRig | undefined;
  applyLevels(): void;
  invalidate(): void;
}

export class ExploreHints {
  private hotspots: Hotspots | null = null;
  private active = false;
  private readonly onChange = (event: Event) => {
    this.active = Boolean((event as CustomEvent<{ active?: boolean }>).detail?.active);
    const lights = this.host.lights();
    if (lights) lights.exploreFill = this.active ? 1 : 0;
    this.hotspots?.setActive(this.active);
    this.host.applyLevels();
    this.host.invalidate();
  };

  constructor(private readonly host: ExploreHintsHost) {
    window.addEventListener('explore:change', this.onChange);
  }

  attach(hotspots: Hotspots, room: Group): void {
    this.hotspots = hotspots;
    room.add(hotspots.object3D);
    hotspots.setActive(this.active);
  }

  update(frame: DeskFrame): boolean {
    return this.hotspots?.update(frame.dt, frame.time, frame.motion) ?? false;
  }

  dispose(): void {
    window.removeEventListener('explore:change', this.onChange);
    this.hotspots?.dispose();
  }
}
