import type { PerspectiveCamera, Vector3 } from 'three';
import type { StationPick } from '../contracts';
import { setupInteraction, type PickSource } from '../interaction';
import { watchMotion, type MotionState } from '../motion';
import type { StagePointer } from '../pointer';

export interface ListenHost {
  canvas: HTMLCanvasElement;
  camera: PerspectiveCamera;
  pointerField: StagePointer;
  source: PickSource;
  finePointer: boolean;
  capture: boolean;
  focus(): Vector3;
  measure(force?: boolean): void;
  bump(): void;
  stop(): void;
  degrade(reason: 'context-lost'): void;
  setPointer(pointer: { x: number; y: number }): void;
  setMotion(state: MotionState): void;
  navigate(pick: StationPick): void;
  themeChanged(): void;
  refocus(point: Vector3 | null): void;
}

type Cleanups = Array<() => void>;

function onWindow<K extends keyof WindowEventMap>(cleanups: Cleanups, type: K, handler: (event: WindowEventMap[K]) => void): void {
  window.addEventListener(type, handler, { passive: true });
  cleanups.push(() => window.removeEventListener(type, handler));
}

function listenPointer(host: ListenHost, cleanups: Cleanups): void {
  onWindow(cleanups, 'pointermove', event => {
    host.setPointer({ x: (event.clientX / window.innerWidth) * 2 - 1, y: (event.clientY / window.innerHeight) * 2 - 1 });
    const rect = host.canvas.getBoundingClientRect();
    host.pointerField.move(event.clientX - rect.left, event.clientY - rect.top, rect.width, rect.height, host.camera, host.focus());
    host.bump();
  });
}

function listenDocument(host: ListenHost, cleanups: Cleanups): void {
  const onVisibility = () => (document.visibilityState === 'visible' ? host.bump() : host.stop());
  document.addEventListener('visibilitychange', onVisibility);
  cleanups.push(() => document.removeEventListener('visibilitychange', onVisibility));
  host.canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    host.degrade('context-lost');
  });
  cleanups.push(
    watchMotion(state => {
      host.setMotion(state);
      host.setPointer({ x: 0, y: 0 });
      host.bump();
    })
  );
}

function listenTheme(host: ListenHost, cleanups: Cleanups): void {
  const themeObserver = new MutationObserver(() => host.themeChanged());
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  cleanups.push(() => themeObserver.disconnect());
}

/** Window, document and canvas listeners that keep the stage measured, awake and clickable. */
export function listenStage(host: ListenHost, cleanups: Cleanups): void {
  onWindow(cleanups, 'resize', () => host.measure());
  onWindow(cleanups, 'orientationchange', () => host.measure(true));
  onWindow(cleanups, 'scroll', () => host.bump());
  onWindow(cleanups, 'keydown', () => host.bump());
  onWindow(cleanups, 'touchstart', () => host.bump());
  if (host.finePointer && !host.capture) listenPointer(host, cleanups);
  listenDocument(host, cleanups);
  if (!host.capture) {
    cleanups.push(setupInteraction({ source: host.source, camera: host.camera, canvas: host.canvas, navigate: pick => host.navigate(pick), invalidate: () => host.bump() }));
  }
  listenTheme(host, cleanups);
  onWindow(cleanups, 'desk:focus' as keyof WindowEventMap, event => host.refocus((event as CustomEvent<{ point: Vector3 | null }>).detail.point));
}
