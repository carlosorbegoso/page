type TiltPermission = { requestPermission?: () => Promise<string> };

async function askForTilt(): Promise<void> {
  const orientation = (globalThis as { DeviceOrientationEvent?: TiltPermission })
    .DeviceOrientationEvent;
  if (typeof orientation?.requestPermission !== 'function') return;
  try {
    await orientation.requestPermission();
  } catch {
    return;
  }
}

function reflect(button: HTMLButtonElement, hint: HTMLElement | null, active: boolean): void {
  const label = (active ? button.dataset.labelExit : button.dataset.labelEnter) ?? '';
  button.setAttribute('aria-pressed', String(active));
  button.setAttribute('aria-label', label);
  button.title = label;
  if (hint) hint.hidden = !active;
}

export function initExploreToggle(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-explore-toggle]');
  if (!button) return;
  const hint = document.querySelector<HTMLElement>('[data-explore-hint]');
  let active = false;
  const show = () => (button.hidden = false);
  if ('exploreReady' in document.documentElement.dataset) show();
  else window.addEventListener('explore:ready', show, { once: true });
  button.addEventListener('click', () => {
    void (active ? Promise.resolve() : askForTilt()).then(() =>
      window.dispatchEvent(new CustomEvent('explore:toggle'))
    );
  });
  window.addEventListener('explore:change', event => {
    active = Boolean((event as CustomEvent<{ active?: boolean }>).detail?.active);
    reflect(button, hint, active);
  });
}
