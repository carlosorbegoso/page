import { afterTransition, cloneTemplate, FOCUSABLE, focusQuietly } from './dom';
import { haptic } from './haptics';
import { bindSwipeBack } from './swipe';

interface MailHost {
  plate: HTMLElement;
  template: HTMLTemplateElement | null;
  /** Called with true while the screen is up, so the home layer goes inert. */
  covered(open: boolean): void;
}

interface Draft {
  subject: string;
  message: string;
  edited: boolean;
}

interface MailState {
  draft: Draft;
  screen: HTMLElement | null;
  origin: HTMLElement | null;
}

function field<T extends HTMLElement>(state: MailState, name: string): T | null {
  return state.screen?.querySelector<T>(`[data-phone-${name}]`) ?? null;
}

function mailtoHref(email: string, draft: Draft): string {
  const query = [
    draft.subject.trim() && `subject=${encodeURIComponent(draft.subject.trim())}`,
    draft.message.trim() && `body=${encodeURIComponent(draft.message.trim())}`
  ]
    .filter(Boolean)
    .join('&');
  return `mailto:${email}${query ? `?${query}` : ''}`;
}

function syncDraft(state: MailState): void {
  const subject = field<HTMLInputElement>(state, 'subject');
  const message = field<HTMLTextAreaElement>(state, 'message');
  const send = field<HTMLAnchorElement>(state, 'send');
  if (!state.screen || !subject || !message || !send) return;
  state.draft.subject = subject.value;
  state.draft.message = message.value;
  state.draft.edited = true;
  send.href = mailtoHref(state.screen.dataset.email ?? '', state.draft);
}

/** Enter in the subject moves to the message, like a mail composer; it never submits. */
function focusMessageOnEnter(state: MailState, event: KeyboardEvent): void {
  if (event.key === 'Enter' && (event.target as Element).matches('[data-phone-subject]')) {
    event.preventDefault();
    focusQuietly(field(state, 'message'));
  }
}

function restoreDraft(state: MailState): void {
  const subject = field<HTMLInputElement>(state, 'subject');
  const message = field<HTMLTextAreaElement>(state, 'message');
  if (state.draft.edited && subject && message) {
    subject.value = state.draft.subject;
    message.value = state.draft.message;
  }
}

function revealScreen(screen: HTMLElement): void {
  requestAnimationFrame(() => {
    screen.toggleAttribute('data-shown', true);
    focusQuietly(screen.querySelector('#phone-mail-title'));
  });
}

function dismissScreen(host: MailHost, state: MailState, leaving: HTMLElement, restoreFocus: boolean): void {
  leaving.removeAttribute('data-shown');
  leaving.style.transform = '';
  host.covered(false);
  delete host.plate.dataset.phoneScreen;
  if (restoreFocus) focusQuietly(state.origin);
  state.origin = null;
  afterTransition(() => leaving.remove());
}

/** Shift+Tab off the first control wraps to Send instead of landing in the inert home. */
function wrapFocusToSend(screen: HTMLElement | null, event: KeyboardEvent): void {
  if (!screen || event.key !== 'Tab' || !event.shiftKey) return;
  const items = [...screen.querySelectorAll<HTMLElement>(FOCUSABLE)];
  const current = document.activeElement;
  if (current !== items[0] && current !== screen.querySelector('#phone-mail-title')) return;
  event.preventDefault();
  event.stopPropagation();
  focusQuietly(items.at(-1));
}

/** In-phone Mail composer; Send is a real `mailto:` link whose href follows the fields. */
export function createMail(host: MailHost) {
  const state: MailState = { draft: { subject: '', message: '', edited: false }, screen: null, origin: null };
  const sync = () => syncDraft(state);
  const onKeyDown = (event: KeyboardEvent) => focusMessageOnEnter(state, event);

  function open(from: HTMLElement | null): void {
    if (state.screen) return;
    const next = cloneTemplate<HTMLElement>(host.template);
    if (!next) return;
    state.screen = next;
    state.origin = from;
    restoreDraft(state);
    next.addEventListener('input', sync);
    next.addEventListener('keydown', onKeyDown);
    bindSwipeBack(next, () => {
      haptic();
      close();
    });
    host.plate.append(next);
    sync();
    host.covered(true);
    host.plate.dataset.phoneScreen = 'mail';
    revealScreen(next);
  }

  function close(restoreFocus = true): void {
    const leaving = state.screen;
    if (!leaving) return;
    state.screen = null;
    dismissScreen(host, state, leaving, restoreFocus);
  }

  const wrapFocus = (event: KeyboardEvent) => wrapFocusToSend(state.screen, event);
  return { open, close, wrapFocus, isOpen: () => state.screen !== null };
}
