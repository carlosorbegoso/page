import type { HudElements } from './elements';

const INVITE_HINT_MS = 10_000;

/** Marks the menu toggle while audio is armed or the scene invites the visitor to turn it on. */
export function initAudioHint({ toggle }: HudElements): void {
  const audioHint = document.querySelector<HTMLElement>('[data-hud-audio-hint]');
  const audioToggle = document.querySelector<HTMLButtonElement>('[data-audio-toggle]');
  if (!toggle || !audioHint) return;
  let inviteTimer: number | undefined;
  let invited = false;

  const renderHint = () => {
    const armed = audioToggle?.dataset.state === 'armed';
    const show = armed || invited;
    if (show) toggle.dataset.audioHint = '';
    else delete toggle.dataset.audioHint;
    audioHint.textContent = show ? (audioHint.dataset.label ?? '') : '';
  };

  window.addEventListener('audio:invite', () => {
    invited = true;
    renderHint();
    window.clearTimeout(inviteTimer);
    inviteTimer = window.setTimeout(() => {
      invited = false;
      renderHint();
    }, INVITE_HINT_MS);
  });

  if (audioToggle) {
    new MutationObserver(() => {
      if (audioToggle.dataset.state === 'on') invited = false;
      renderHint();
    }).observe(audioToggle, { attributes: true, attributeFilter: ['data-state'] });
  }

  renderHint();
}
