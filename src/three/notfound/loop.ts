import type { Scene, WebGLRenderer } from 'three';
import { motionAllowed, readMotion } from '../motion';
import type { CameraRig } from './camera-rig';
import type { TimedUniform } from './types';

const STILL_TIME = 12;

export interface FrameLoop {
  readonly running: boolean;
  play(): void;
  stop(): void;
  still(): void;
  setMotion(allowed: boolean): void;
}

export function createFrameLoop(renderer: WebGLRenderer, scene: Scene, rig: CameraRig, timed: TimedUniform[]): FrameLoop {
  let frame = 0;
  let running = false;
  let motion = motionAllowed(readMotion());
  const start = performance.now();

  function render(time: number): void {
    for (const uniforms of timed) uniforms.uTime.value = time;
    rig.place(time);
    renderer.render(scene, rig.camera);
  }

  function tick(): void {
    frame = requestAnimationFrame(tick);
    render((performance.now() - start) / 1000);
  }

  return {
    get running() {
      return running;
    },
    play() {
      if (running || document.hidden || !motion) return;
      running = true;
      frame = requestAnimationFrame(tick);
    },
    stop() {
      running = false;
      cancelAnimationFrame(frame);
    },
    still() {
      rig.centre();
      render(STILL_TIME);
    },
    setMotion(allowed) {
      motion = allowed;
    }
  };
}
