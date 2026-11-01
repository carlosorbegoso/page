import { layoutKind } from '../scenes/common';
import type { SafeInsets, Viewport } from './types';

const SAFE_Y = 24;
/** Clear of the HUD row and the top letterbox bar: a panel never starts under the story clock. */
const SAFE_TOP_MIN = 84;
const SAFE_TOP_SHARE = 0.11;
/** Touch HUD: tap-sized row at max(0.5rem, safe-area-inset-top), plus a breathing gap below it. */
const HUD_TOP_TOUCH = 8;
const HUD_CLEARANCE_TOUCH = 62;

/** Vertical room a panel may use, between the HUD and the bottom edge. */
export interface PanelRoom {
  desktop: boolean;
  top: number;
  bottom: number;
}

/** `env(safe-area-inset-top/bottom)` in px (notch, home indicator on iOS), resolved by style alone: no layout pass. */
export function measureSafeArea(): SafeInsets {
  const probe = document.createElement('div');
  probe.style.cssText =
    'position:fixed;top:0;padding-top:env(safe-area-inset-top, 0px);padding-bottom:env(safe-area-inset-bottom, 0px);visibility:hidden;pointer-events:none';
  document.body.append(probe);
  const style = getComputedStyle(probe);
  const insets = { top: Number.parseFloat(style.paddingTop) || 0, bottom: Number.parseFloat(style.paddingBottom) || 0 };
  probe.remove();
  return insets;
}

export function panelRoom(view: Viewport, safe: SafeInsets): PanelRoom {
  const desktop = layoutKind(view.width) === 'desktop';
  const top = desktop ? Math.max(SAFE_TOP_MIN, view.height * SAFE_TOP_SHARE) : Math.max(HUD_TOP_TOUCH, safe.top) + HUD_CLEARANCE_TOUCH;
  const bottom = desktop
    ? view.height - Math.max(SAFE_Y * 2, view.height * 0.06, SAFE_Y + safe.bottom)
    : view.height - SAFE_Y - safe.bottom;
  return { desktop, top, bottom };
}
