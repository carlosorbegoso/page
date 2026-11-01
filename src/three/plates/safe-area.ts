import { layoutKind } from '../scenes/common';
import type { SafeInsets, Viewport } from './types';

const SAFE_Y = 24;
const SAFE_TOP_MIN = 84;
const SAFE_TOP_SHARE = 0.11;
const HUD_TOP_TOUCH = 8;
const HUD_CLEARANCE_TOUCH = 62;

export interface PanelRoom {
  desktop: boolean;
  top: number;
  bottom: number;
}

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
