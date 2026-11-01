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

interface Phone {
  plate: HTMLElement;
  active(): boolean;
  clock: ReturnType<typeof createClock>;
  toast: ReturnType<typeof createToast>;
  banner: ReturnType<typeof createBanner>;
  mail: ReturnType<typeof createMail>;
  sheet: ReturnType<typeof createSheet>;
  downloading: boolean;
  bypassDownload: boolean;
  bannerArmed: boolean;
  enabled: boolean;
}

function createPhone(plate: HTMLElement, home: HTMLElement, toastEl: HTMLElement, toastText: HTMLElement): Phone {
  const clock = createClock(plate.querySelector('[data-phone-clock]'));
  const toast = createToast(toastEl, toastText);
  const banner = createBanner(plate.querySelector('[data-phone-banner]'));
  const covered = () => {
    home.inert = mail.isOpen() || sheet.isOpen();
  };
  const mail = createMail({ plate, template: plate.querySelector('[data-phone-mail-template]'), covered });
  const sheet = createSheet({ plate, template: plate.querySelector('[data-phone-sheet-template]'), covered });
  return {
    plate,
    active: () =>
      document.documentElement.classList.contains('is-3d') && plate.dataset.plateMode === 'surface-phone',
    clock,
    toast,
    banner,
    mail,
    sheet,
    downloading: false,
    bypassDownload: false,
    bannerArmed: false,
    enabled: false
  };
}

function download(phone: Phone, link: HTMLAnchorElement): void {
  if (phone.downloading) return;
  phone.downloading = true;
  const { toast } = phone;
  toast.progress(toast.strings.downloading ?? '', () => {
    phone.bypassDownload = true;
    link.click();
    phone.bypassDownload = false;
    phone.downloading = false;
    toast.show(toast.strings.downloaded ?? '', 'done');
  });
}

function openMailFromBanner(phone: Phone): void {
  haptic();
  phone.banner.hide();
  phone.mail.open(phone.plate.querySelector('[data-phone-mail-open]'));
}

function routeControl(phone: Phone, control: HTMLElement, event: MouseEvent): void {
  const { mail, sheet, banner, toast } = phone;
  if (control.matches('[data-phone-mail-open]')) {
    event.preventDefault();
    banner.hide();
    mail.open(control);
  } else if (control.matches('[data-phone-external]')) {
    event.preventDefault();
    banner.hide();
    sheet.open(control as HTMLAnchorElement);
  } else if (control.matches('.contact-cv') && !phone.bypassDownload) {
    event.preventDefault();
    download(phone, control as HTMLAnchorElement);
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

function onClick(phone: Phone, event: MouseEvent): void {
  if (!phone.active() || event.defaultPrevented) return;
  const target = event.target as Element;
  if (phone.banner.contains(target)) {
    openMailFromBanner(phone);
    return;
  }
  const control = target.closest<HTMLElement>('a[href], button');
  if (!control) return;
  haptic();
  routeControl(phone, control, event);
}

function onKeyDown(phone: Phone, event: KeyboardEvent): void {
  if (!phone.active()) return;
  const { mail, sheet } = phone;
  if (!sheet.isOpen()) mail.wrapFocus(event);
  if (event.key !== 'Escape' || event.defaultPrevented) return;
  if (sheet.isOpen()) sheet.close();
  else if (mail.isOpen()) mail.close();
  else return;
  event.preventDefault();
  event.stopPropagation();
}

function resetToHome(phone: Phone): void {
  phone.sheet.close(false);
  phone.mail.close(false);
  phone.banner.hide();
}

function sync(phone: Phone): void {
  if (phone.active() === phone.enabled) return;
  phone.enabled = !phone.enabled;
  phone.plate.toggleAttribute('data-phone-on', phone.enabled);
  if (phone.enabled) {
    phone.clock.start();
    return;
  }
  phone.clock.stop();
  resetToHome(phone);
  phone.toast.hide();
}

function bindPlateInput(phone: Phone): void {
  const { plate } = phone;
  plate.addEventListener('click', event => onClick(phone, event));
  plate.addEventListener('keydown', event => onKeyDown(phone, event));
  plate.addEventListener('pointerdown', event => {
    if (phone.active()) ripple(event, plate);
  });
  mirrorCopyStatus(plate.querySelector('[data-copy-status]'), phone.toast, phone.active);
}

function bindChapterBanner(phone: Phone): void {
  const { plate, mail, sheet } = phone;
  window.addEventListener('chapter:enter', event => {
    phone.bannerArmed = (event as CustomEvent<{ id: string }>).detail?.id === 'contact';
    if (!phone.bannerArmed) resetToHome(phone);
  });
  window.addEventListener('chapter:settled', event => {
    if ((event as CustomEvent<{ id: string }>).detail?.id !== 'contact' || !phone.bannerArmed) return;
    phone.bannerArmed = false;
    whenShown(plate, () => {
      if (phone.active() && plate.hasAttribute('data-active') && !mail.isOpen() && !sheet.isOpen())
        phone.banner.show();
    }, BANNER_DELAY_MS);
  });
}

function observeMode(phone: Phone): void {
  const onChange = () => sync(phone);
  new MutationObserver(onChange).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
  new MutationObserver(onChange).observe(phone.plate, {
    attributes: true,
    attributeFilter: ['data-plate-mode']
  });
}

export function initPhone(plate: HTMLElement): void {
  const home = plate.querySelector<HTMLElement>('[data-phone-home]');
  const toastEl = plate.querySelector<HTMLElement>('[data-phone-toast]');
  const toastText = plate.querySelector<HTMLElement>('[data-phone-toast-text]');
  if (!home || !toastEl || !toastText) return;
  const phone = createPhone(plate, home, toastEl, toastText);
  bindPlateInput(phone);
  bindChapterBanner(phone);
  observeMode(phone);
  sync(phone);
}
