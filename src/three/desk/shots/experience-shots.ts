import { Vector3 } from 'three';
import { FOLDERS, OPEN_FOLDER, folderSpine, type FolderId } from '../layout';
import { TEXT_LEFT, type ShotContext } from './context';
import { storyShot } from './portrait-fit';
import { printedSheetShot } from './printed-shots';
import { centreOf, coverPoints, folderPoints, FOLDER_PULL, takenSheetPoints } from './protagonists';
import { EXPERIENCE_ANCHOR, EXPERIENCE_ORDER } from './story';
import type { Framing, Place, Setup } from './types';

const SHELF_LANDSCAPE: Setup = { heading: -6, pitch: -4, distance: 1.1 };
const SHELF_PORTRAIT: Setup = { heading: -20, pitch: -4, distance: 0.9 };
const OPEN_LANDSCAPE: Setup = { heading: -8, pitch: -18, distance: 0.7 };
const OPEN_PORTRAIT: Setup = { heading: -14, pitch: -18, distance: 0.7 };
const FOLDER_LANDSCAPE: Setup = { heading: -26, pitch: 0, distance: 1.18 };
const OVERVIEW_STAGE_BOTTOM = 0.7;

function withStageBottom(ctx: ShotContext, bottom: number): ShotContext {
  const stage = { ...ctx.stage, bottom };
  return { ...ctx, stage, stageY: (stage.top + stage.bottom) / 2 };
}

function shelfShot(ctx: ShotContext, place: Place, panel: Place): Framing {
  const shelfFocus = folderSpine('baufest').lerp(folderSpine('intercorp'), 0.5);
  const points = [...coverPoints(0), ...FOLDERS.flatMap(id => folderPoints(id, 0))];
  const aim = ctx.portrait ? shelfFocus : centreOf(points);
  const fitCtx = ctx.portrait ? withStageBottom(ctx, OVERVIEW_STAGE_BOTTOM) : ctx;
  const frame = storyShot(fitCtx, aim, SHELF_LANDSCAPE, SHELF_PORTRAIT, place, points);
  return {
    ...frame,
    aim: frame.aim ?? aim,
    focus: shelfFocus,
    panel: { name: 'exp-intro', ...panel }
  };
}

function openFolderShot(ctx: ShotContext, sx: number, panel: Place): Framing {
  if (ctx.stacked) return printedSheetShot(ctx, EXPERIENCE_ANCHOR.tcs);
  const focus = OPEN_FOLDER.centre.clone().add(new Vector3(0, 0.06, 0));
  const sheet = takenSheetPoints();
  const points = sheet;
  const aim = centreOf(points);
  const place = { sx, sy: 0.32 };
  const frame = storyShot(ctx, aim, OPEN_LANDSCAPE, OPEN_PORTRAIT, place, points);
  return {
    ...frame,
    aim: frame.aim ?? aim,
    focus,
    panel: { name: EXPERIENCE_ANCHOR.tcs, ...panel }
  };
}

function shelfFolderShot(ctx: ShotContext, id: Exclude<FolderId, 'tcs'>, place: Place, panel: Place): Framing {
  const focus = folderSpine(id);
  return {
    ...storyShot(
      ctx,
      focus,
      FOLDER_LANDSCAPE,
      { heading: -22, pitch: -2, distance: 1.24 },
      place,
      [...coverPoints(id === 'sysarp' ? FOLDER_PULL : 0), ...folderPoints(id, FOLDER_PULL)],
      [],
      FOLDER_LANDSCAPE.distance
    ),
    focus,
    panel: { name: EXPERIENCE_ANCHOR[id], ...panel }
  };
}

export function experienceShots(ctx: ShotContext): Framing[] {
  const layout = ctx.layoutFor(TEXT_LEFT);
  const place = { sx: layout.sx, sy: ctx.portrait ? ctx.subjectY : 0.5 };
  const shelf = shelfShot(ctx, place, layout.panel);
  const folders = EXPERIENCE_ORDER.map<Framing>(id =>
    id === 'tcs' ? openFolderShot(ctx, layout.sx, layout.panel) : shelfFolderShot(ctx, id, place, layout.panel)
  );
  return [shelf, ...folders];
}
