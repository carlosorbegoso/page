import { Vector3 } from 'three';
import { FOLDERS, OPEN_FOLDER, folderSpine, type FolderId } from '../layout';
import { TEXT_LEFT, type ShotContext } from './context';
import { storyShot } from './portrait-fit';
import { coverPoints, folderPoints, FOLDER_PULL, openFolderPoints } from './protagonists';
import { EXPERIENCE_ANCHOR, EXPERIENCE_ORDER } from './story';
import type { Framing, Place } from './types';

/**
 * The whole shelf opens the day years. It also bridges the cut from the monitor: about → the first
 * folder alone turns about 35°, past SHOT_LIMITS; through the shelf each cut stays under 25°.
 */
function shelfShot(ctx: ShotContext, place: Place, panel: Place): Framing {
  const shelfFocus = folderSpine('baufest').lerp(folderSpine('intercorp'), 0.5);
  return {
    ...storyShot(
      ctx,
      shelfFocus,
      { heading: -14, pitch: -4, distance: 1.6 },
      { heading: -20, pitch: -4, distance: 1.6 },
      place,
      [...coverPoints(0), ...FOLDERS.flatMap(id => folderPoints(id, 0))]
    ),
    focus: shelfFocus,
    panel: { name: 'exp-intro', ...panel }
  };
}

function openFolderShot(ctx: ShotContext, sx: number, panel: Place): Framing {
  const focus = OPEN_FOLDER.centre.clone().add(new Vector3(0, 0.01, 0));
  const place = { sx, sy: ctx.stacked ? ctx.subjectY : ctx.portrait ? 0.32 : 0.56 };
  return {
    ...storyShot(ctx, focus, { heading: -8, pitch: -18, distance: 0.85 }, { heading: -20, pitch: -18, distance: 1.05 }, place, openFolderPoints()),
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
      { heading: -26, pitch: 0, distance: 1.18 },
      { heading: -22, pitch: -2, distance: 1.24 },
      place,
      [...coverPoints(id === 'sysarp' ? FOLDER_PULL : 0), ...folderPoints(id, FOLDER_PULL)]
    ),
    focus,
    panel: { name: EXPERIENCE_ANCHOR[id], ...panel }
  };
}

/** Portrait keeps the archive cover sheet in frame with the current box, so it looks along the stack less steeply. */
export function experienceShots(ctx: ShotContext): Framing[] {
  const layout = ctx.layoutFor(TEXT_LEFT);
  const place = { sx: layout.sx, sy: ctx.portrait ? ctx.subjectY : 0.5 };
  const shelf = shelfShot(ctx, place, layout.panel);
  const folders = EXPERIENCE_ORDER.map<Framing>(id =>
    id === 'tcs' ? openFolderShot(ctx, layout.sx, layout.panel) : shelfFolderShot(ctx, id, place, layout.panel)
  );
  return [shelf, ...folders];
}
