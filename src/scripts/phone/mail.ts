import { afterTransition, cloneTemplate, FOCUSABLE, focusQuietly } from './dom';
import { haptic } from './haptics';
import { bindSwipeBack } from './swipe';

interface MailHost {
  plate: HTMLElement;
  template: HTMLTemplateElement | null;
  /** Called with true while the screen is up, so the home layer goes inert. */
  covered(open: boolean): void;
}

/** In-phone Mail composer; Send is a real `mailto:` link whose href follows the fields. */
export function createMail(host: MailHost) {
  const draft = { subject: '', message: '', edited: false };
  let screen: HTMLElement | null = null;
  let origin: HTMLElement | null = null;

  const field = <T extends HTMLElement>(name: string) =>
    screen?.querySelector<T>(`[data-phone-${name}]`) ?? null;

  function sync(): void {
    const subject = field<HTMLInputElement>('subject');
    const message = field<HTMLTextAreaElement>('message');
    const send = field<HTMLAnchorElement>('send');
    if (!screen || !subject || !message || !send) return;
    draft.subject = subject.value;
    draft.message = message.value;
    draft.edited = true;
    const query = [
      draft.subject.trim() && `subject=${encodeURIComponent(draft.subject.trim())}`,
      draft.message.trim() && `body=${encodeURIComponent(draft.message.trim())}`
    ]
      .filter(Boolean)
      .join('&');
    send.href = `mailto:${screen.dataset.email ?? ''}${query ? `?${query}` : ''}`;
  }

  /** Enter in the subject moves to the message, like a mail composer; it never submits. */
  function onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && (event.target as Element).matches('[data-phone-subject]')) {
      event.preventDefault();
      focusQuietly(field('message'));
    }
  }

  function open(from: HTMLElement | null): void {
    if (screen) return;
    const next = cloneTemplate<HTMLElement>(host.template);
    if (!next) return;
    screen = next;
    origin = from;
    const subject = field<HTMLInputElement>('subject');
    const message = field<HTMLTextAreaElement>('message');
    if (draft.edited && subject && message) {
      subject.value = draft.subject;
      message.value = draft.message;
    }
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
    requestAnimationFrame(() => {
      next.toggleAttribute('data-shown', true);
      focusQuietly(next.querySelector('#phone-mail-title'));
    });
  }

  function close(restoreFocus = true): void {
    const leaving = screen;
    if (!leaving) return;
    screen = null;
    leaving.removeAttribute('data-shown');
    leaving.style.transform = '';
    host.covered(false);
    delete host.plate.dataset.phoneScreen;
    if (restoreFocus) focusQuietly(origin);
    origin = null;
    afterTransition(() => leaving.remove());
  }

  /** Shift+Tab off the first control wraps to Send instead of landing in the inert home. */
  function wrapFocus(event: KeyboardEvent): void {
    if (!screen || event.key !== 'Tab' || !event.shiftKey) return;
    const items = [...screen.querySelectorAll<HTMLElement>(FOCUSABLE)];
    const current = document.activeElement;
    if (current !== items[0] && current !== screen.querySelector('#phone-mail-title')) return;
    event.preventDefault();
    event.stopPropagation();
    focusQuietly(items.at(-1));
  }

  return { open, close, wrapFocus, isOpen: () => screen !== null };
}
