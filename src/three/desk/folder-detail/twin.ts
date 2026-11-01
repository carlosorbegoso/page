import { BoxGeometry, TorusGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OBJECT_ID, PartBuilder } from '../builder';
import { FOLDER, folderCentre } from '../layout';
import type { Palette } from '../props';
import { SPINE_LABEL } from '../spines';
import type { ShelfFolder } from './constants';

/** The shelf box twin: same atlas finish and object id, so glow and hover still reach it. */
export function buildTwin(id: ShelfFolder, palette: Palette): PartBuilder {
  const builder = new PartBuilder();
  const centre = folderCentre(id);
  const objectId = OBJECT_ID[id];
  builder.add(new RoundedBoxGeometry(FOLDER.depth, FOLDER.height, FOLDER.spine, 2, 0.004), palette.folders[id], { position: centre.toArray() }, objectId);
  const spine = centre.x + FOLDER.depth / 2;
  builder.add(new BoxGeometry(0.003, SPINE_LABEL.length + 0.01, SPINE_LABEL.width), palette.label, { position: [spine + 0.0015, centre.y + SPINE_LABEL.lift, centre.z] }, objectId);
  builder.add(new TorusGeometry(0.012, 0.0025, 6, 16), palette.metal, { position: [spine + 0.002, centre.y - 0.07, centre.z], rotation: [0, Math.PI / 2, 0] }, objectId);
  return builder;
}
