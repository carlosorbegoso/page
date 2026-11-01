import type { Group, Object3D } from 'three';
import type { StationContext } from '../../contracts';
import { StoryClock, storyMinutes } from '../clock';
import { damp } from '../math';
import type { DeskFrame } from './frame';

export class ClockWiring {
  readonly model: StoryClock;
  private minutes = 60;

  constructor(context: StationContext) {
    this.model = new StoryClock(
      () => {
        this.model.show(this.minutes);
        context.renderer.shadowMap.needsUpdate = true;
        context.invalidate();
      },
      (model: Object3D) => context.precompile?.(model) ?? Promise.resolve(),
      () => context.invalidate()
    );
  }

  get group(): Group {
    return this.model.group;
  }

  update(frame: DeskFrame): boolean {
    const minutesGoal = storyMinutes(frame.chapter, frame.subIndex, frame.day);
    const minutes = damp(this.minutes, minutesGoal, 1.6, frame.step);
    if (Math.abs(minutes - this.minutes) > 0.01 || Math.abs(minutes - minutesGoal) < 0.01) {
      this.minutes = Math.abs(minutes - minutesGoal) < 0.05 ? minutesGoal : minutes;
      this.model.show(this.minutes);
    }
    return this.minutes !== minutesGoal;
  }

  ring(frame: DeskFrame): boolean {
    return this.model.update(frame.time, frame.motion);
  }

  dispose(): void {
    this.model.dispose();
  }
}
