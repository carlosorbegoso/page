import { Vector3, type PerspectiveCamera } from 'three';
import type { ChapterId, Shot } from '../../contracts';
import type { DeskFrame } from '../set/frame';
import { SHOT_LIMITS } from '../shots/story';
import { PORTRAIT } from './layout';

const DEG = Math.PI / 180;
const HEIGHT_SHARE = 0.6;
const WIDTH_SHARE = 0.78;
const SIDE = 0.08;
const RISE = 0.03;

function emit(type: string, detail: unknown): void {
  window.dispatchEvent(new CustomEvent(type, { detail }));
}

export function closeLook(camera: PerspectiveCamera): Shot {
  const tan = Math.tan((camera.fov * DEG) / 2);
  const distance = Math.max(PORTRAIT.height / HEIGHT_SHARE / (2 * tan), PORTRAIT.width / WIDTH_SHARE / (2 * tan * camera.aspect));
  const target = PORTRAIT.centre.clone();
  if (camera.aspect < 1) target.y -= distance * tan * 0.4;
  const position = target.clone().add(new Vector3(SIDE * distance, RISE * distance, distance));
  return { position, target };
}

function withinLimits(camera: PerspectiveCamera, shot: Shot): boolean {
  const from = camera.getWorldDirection(new Vector3());
  const to = shot.target.clone().sub(shot.position).normalize();
  const angle = Math.acos(Math.min(1, Math.max(-1, from.dot(to)))) / DEG;
  return angle <= SHOT_LIMITS.degrees - 4 && camera.position.distanceTo(shot.position) <= SHOT_LIMITS.metres - 0.2;
}

export class PortraitInspect {
  private active = false;
  private shotKey = '';
  private chapter: ChapterId = 'intro';
  private readonly onAction = (event: Event) => {
    if ((event as CustomEvent<{ action?: string }>).detail?.action === 'portrait') this.toggle();
  };
  private readonly onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') this.release();
  };
  private readonly onScroll = () => this.release();

  constructor(private readonly camera: PerspectiveCamera) {
    window.addEventListener('desk:action', this.onAction);
    window.addEventListener('keydown', this.onKey);
    window.addEventListener('wheel', this.onScroll, { passive: true });
    window.addEventListener('touchmove', this.onScroll, { passive: true });
  }

  update(frame: DeskFrame): void {
    const key = `${frame.chapter}:${frame.subIndex}`;
    if (this.active && key !== this.shotKey) this.release();
    this.shotKey = key;
    this.chapter = frame.chapter;
  }

  private toggle(): void {
    if (this.active) {
      this.release();
      return;
    }
    const shot = closeLook(this.camera);
    if (!withinLimits(this.camera, shot) && this.chapter !== 'about') {
      emit('story:goto', { chapter: 'about', sub: 0 });
      return;
    }
    this.active = true;
    emit('desk:detour', { shot });
    emit('desk:focus', { point: PORTRAIT.centre.clone() });
  }

  private release(): void {
    if (!this.active) return;
    this.active = false;
    emit('desk:detour', { shot: null });
    emit('desk:focus', { point: null });
  }

  dispose(): void {
    this.release();
    window.removeEventListener('desk:action', this.onAction);
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('wheel', this.onScroll);
    window.removeEventListener('touchmove', this.onScroll);
  }
}
