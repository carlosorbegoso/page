import { createBanner } from './banner';
import { createClock } from './clock';
import { whenShown } from './dom';
import { haptic } from './haptics';
import { createMail } from './mail';
import { ripple } from './ripple';
import { createSheet } from './sheet';
import { createToast, mirrorCopyStatus } from './toast';

const BANNER_DELAY_MS = 1500;
const SEND_CLOSE_MS = 900;

/**
 * Turns the Contact plate into a working smartphone while it is the CSS3D `surface-phone`
 * (status bar clock, taps with ripple and haptics, Mail screen, link sheet, toasts, banner).
 * Any other mode leaves the plain section and its native links untouched.
 */
export function initPhone(plate: HTMLElement): void {
  const home = plate.querySelector<HTMLElement>('[data-phone-home]');
  const toastEl = plate.querySelector<HTMLElement>('[data-phone-toast]');
  const toastText = plate.querySelector<HTMLElement>('[data-phone-toast-text]');
  if (!home || !toastEl || !toastText) return;

  const active = () =>
    document.documentElement.classList.contains('is-3d') &&
    plate.dataset.plateMode === 'surface-phone';
  const clock = createClock(plate.querySelector('[data-phone-clock]'));
  const toast = createToast(toastEl, toastText);
  const banner = createBanner(plate.querySelector('[data-phone-banner]'));
  const covered = () => {
    home.inert = mail.isOpen() || sheet.isOpen();
  };
  const mail = createMail({
    plate,
    template: plate.querySelector('[data-phone-mail-template]'),
    covered
  });
  const sheet = createSheet({
    plate,
    template: plate.querySelector('[data-phone-sheet-template]'),
    covered
  });
  let downloading = false;
  let bypassDownload = false;
  let bannerArmed = false;
  let enabled = false;

  function download(link: HTMLAnchorElement): void {
    if (downloading) return;
    downloading = true;
    toast.progress(toast.strings.downloading ?? '', () => {
      bypassDownload = true;
      link.click();
      bypassDownload = false;
      downloading = false;
      toast.show(toast.strings.downloaded ?? '', 'done');
    });
  }

  function onClick(event: MouseEvent): void {
    if (!active() || event.defaultPrevented) return;
    const target = event.target as Element;
    if (banner.contains(target)) {
      haptic();
      banner.hide();
      mail.open(plate.querySelector('[data-phone-mail-open]'));
      return;
    }
    const control = target.closest<HTMLElement>('a[href], button');
    if (!control) return;
    haptic();
    if (control.matches('[data-phone-mail-open]')) {
      event.preventDefault();
      banner.hide();
      mail.open(control);
    } else if (control.matches('[data-phone-external]')) {
      event.preventDefault();
      banner.hide();
      sheet.open(control as HTMLAnchorElement);
    } else if (control.matches('.contact-cv') && !bypassDownload) {
      event.preventDefault();
      download(control as HTMLAnchorElement);
    } else if (control.matches('[data-phone-back]')) {
      mail.close();
    } else if (control.matches('[data-phone-sheet-cancel]')) {
      sheet.close();
    } else if (control.matches('[data-phone-sheet-open]')) {
      window.setTimeout(() => sheet.close(), 150);
    } else if (control.matches('[data-phone-send]')) {
      toast.show(toast.strings.sending ?? '', 'done');
      window.setTimeout(() => mail.close(), SEND_CLOSE_MS);
    }
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (!active()) return;
    if (!sheet.isOpen()) mail.wrapFocus(event);
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    if (sheet.isOpen()) sheet.close();
    else if (mail.isOpen()) mail.close();
    else return;
    event.preventDefault();
    event.stopPropagation();
  }

  function resetToHome(): void {
    sheet.close(false);
    mail.close(false);
    banner.hide();
  }

  function sync(): void {
    if (active() === enabled) return;
    enabled = !enabled;
    plate.toggleAttribute('data-phone-on', enabled);
    if (enabled) {
      clock.start();
      return;
    }
    clock.stop();
    resetToHome();
    toast.hide();
  }

  plate.addEventListener('click', onClick);
  plate.addEventListener('keydown', onKeyDown);
  plate.addEventListener('pointerdown', event => {
    if (active()) ripple(event, plate);
  });
  mirrorCopyStatus(plate.querySelector('[data-copy-status]'), toast, active);

  window.addEventListener('chapter:enter', event => {
    bannerArmed = (event as CustomEvent<{ id: string }>).detail?.id === 'contact';
    if (!bannerArmed) resetToHome();
  });
  window.addEventListener('chapter:settled', event => {
    if ((event as CustomEvent<{ id: string }>).detail?.id !== 'contact' || !bannerArmed) return;
    bannerArmed = false;
    whenShown(plate, () => {
      if (active() && plate.hasAttribute('data-active') && !mail.isOpen() && !sheet.isOpen()) banner.show();
    }, BANNER_DELAY_MS);
  });

  new MutationObserver(sync).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
  new MutationObserver(sync).observe(plate, {
    attributes: true,
    attributeFilter: ['data-plate-mode']
  });
  sync();
}
