import type { CameraDirector } from '../director';
import type { ExploreHost, ExploreMode } from './explore';

export function exploreHost(director: CameraDirector, wake: () => void): ExploreHost {
  return {
    setOverride: override => {
      director.override = override;
    },
    resetLook: () => director.look.reset(),
    wake
  };
}

export function listenExplore(host: ExploreHost, enabled: () => boolean): () => void {
  let mode: ExploreMode | null = null;
  let loading: Promise<ExploreMode> | null = null;
  const load = () =>
    (loading ??= import('./explore').then(module => {
      mode = new module.ExploreMode(host);
      return mode;
    }));
  const onToggle = () => {
    if (!enabled() && !mode) return;
    void load().then(loaded => loaded.toggle());
  };
  const onExit = () => mode?.exit();
  window.addEventListener('explore:toggle', onToggle);
  window.addEventListener('explore:exit', onExit);
  document.documentElement.dataset.exploreReady = '';
  window.dispatchEvent(new CustomEvent('explore:ready'));
  return () => {
    window.removeEventListener('explore:toggle', onToggle);
    window.removeEventListener('explore:exit', onExit);
    mode?.dispose();
    delete document.documentElement.dataset.exploreReady;
  };
}
