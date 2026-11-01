import { layoutKind, stackedLayout } from '../../scenes/common';
import { MONITOR } from '../layout';
import { DEG, portraitBlend } from './math';
import { monitorFrame } from './surfaces';
import type { Place, Region, SurfaceFrame, Viewport } from './types';

const HUD_HEIGHT = 72;

export interface SideLayout {
  panel: Place;
  subject: number;
}

export const TEXT_LEFT: SideLayout = { panel: { sx: 0.56, sy: 0.3 }, subject: 0.7 };

export interface ShotContext {
  view: Viewport;
  phone: SurfaceFrame;
  portrait: boolean;
  stacked: boolean;
  t: number;
  lens: number;
  monitor: SurfaceFrame;
  screenSpan: number;
  screenRise: number;
  panelDocked: Place;
  subjectY: number;
  stage: Region;
  stageY: number;
  whole: Region;
  layoutFor(side: SideLayout): { panel: Place; sx: number };
}

export function shotContext(view: Viewport, phone: SurfaceFrame): ShotContext {
  const portrait = view.width < view.height;
  const stacked = stackedLayout(view);
  const monitor = monitorFrame();
  const panelDocked = { sx: 0.5, sy: 0.95 };
  const panelBelow = stacked ? panelDocked : { sx: 0.06, sy: layoutKind(view.width) === 'desktop' ? 0.74 : 0.6 };
  const stage: Region = { left: 0.05, right: 0.95, top: HUD_HEIGHT / view.height, bottom: stacked ? 0.53 : 0.6 };
  return {
    view,
    phone,
    portrait,
    stacked,
    t: portraitBlend(view),
    lens: stacked ? Math.tan(20 * DEG) / Math.tan((view.fov * DEG) / 2) : 1,
    monitor,
    screenSpan: monitor.width + MONITOR.bezel * 2,
    screenRise: monitor.height + MONITOR.bezel * 2,
    panelDocked,
    subjectY: stacked ? 0.27 : portrait ? 0.3 : 0.5,
    stage,
    stageY: (stage.top + stage.bottom) / 2,
    whole: { left: 0.02, right: 0.98, top: stage.top, bottom: 1 },
    layoutFor: side => ({ panel: portrait ? panelBelow : side.panel, sx: portrait ? 0.5 : side.subject })
  };
}
