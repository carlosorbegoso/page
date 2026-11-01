import { layoutKind, stackedLayout } from '../../scenes/common';
import { MONITOR } from '../layout';
import { DEG, portraitBlend } from './math';
import { monitorFrame } from './surfaces';
import type { Place, Region, SurfaceFrame, Viewport } from './types';

/** HUD bar (clock, tour button) across the top of the frame, in CSS px. */
const HUD_HEIGHT = 72;

/** Panel position and subject x for a shot whose text sits on one side. */
export interface SideLayout {
  panel: Place;
  subject: number;
}

/**
 * The director lays an anchored panel on the side of its anchor away from the frame centre:
 * an anchor right of centre gets the panel on its left. Subjects sit on the opposite side.
 */
export const TEXT_LEFT: SideLayout = { panel: { sx: 0.56, sy: 0.3 }, subject: 0.7 };

/** Everything the chapter shots of one viewport share. */
export interface ShotContext {
  view: Viewport;
  phone: SurfaceFrame;
  portrait: boolean;
  stacked: boolean;
  /** `portraitBlend` of the viewport. */
  t: number;
  /** Stacked phones use a wider lens; the close-ups dolly in by this factor so subjects keep their 40° size. */
  lens: number;
  monitor: SurfaceFrame;
  screenSpan: number;
  screenRise: number;
  /** Below the bottom edge minus the panel height, so the director docks the panel at the bottom. */
  panelDocked: Place;
  subjectY: number;
  /** Free frame above the text: under the HUD, over the docked panel (stacked) or the panel below. */
  stage: Region;
  stageY: number;
  /** A neighbour may sit anywhere clear of the edges and the HUD: it is soft and behind the subject. */
  whole: Region;
  layoutFor(side: SideLayout): { panel: Place; sx: number };
  /** Distance at which `span` metres fill the half of the frame above the docked panel. */
  topHalf(span: number): number;
}

export function shotContext(view: Viewport, phone: SurfaceFrame): ShotContext {
  const portrait = view.width < view.height;
  const stacked = stackedLayout(view);
  const monitor = monitorFrame();
  const panelDocked = { sx: 0.5, sy: 0.95 };
  /** A portrait frame 1024 px or wider gets the desktop panel, centred on its anchor: lower it under the stage. */
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
    layoutFor: side => ({ panel: portrait ? panelBelow : side.panel, sx: portrait ? 0.5 : side.subject }),
    topHalf: span => span / Math.tan((view.fov * DEG) / 2)
  };
}
