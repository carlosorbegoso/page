import { Group, Matrix4 } from 'three';
import { readCompany } from '../content';
import { boardFaceMatrix, CORKBOARD } from '../layout';
import { printedFace, printFonts, whenFontsReady, type PrintedFace } from '../paper';
import { drawAlfaCard, drawNote } from './cards';
import { drawCork, drawPinShadows } from './cork';
import { drawPostits, drawTitle } from './postits';
import { corkArea, type BoardCanvas } from './surface';

/** In front of the cork panel and behind the frame's lip, so the print never z-fights either. */
const PRINT_LIFT = 0.0008;

export interface CorkboardPrint {
  object3D: Group;
  dispose(): void;
}

function drawBoard(face: PrintedFace): void {
  const board: BoardCanvas = { context: face.context, scale: face.scale, fonts: printFonts() };
  const company = readCompany();
  drawCork(board);
  drawTitle(board, company.title);
  drawNote(board, company);
  drawAlfaCard(board, company);
  drawPostits(board);
  drawPinShadows(board);
  face.texture.needsUpdate = true;
}

/**
 * Everything pinned to TUSOCIO's cork board, printed on one face over the cork: the handwritten
 * title, the role and phrase card, the Alfa card and the three product post-its, at `BOARD_LAYOUT`.
 */
export function createCorkboardPrint(): CorkboardPrint {
  const { width, height } = corkArea();
  const face = printedFace('desk-corkboard-print', width, height);
  const placement = boardFaceMatrix().multiply(new Matrix4().makeTranslation(CORKBOARD.width / 2, CORKBOARD.height / 2, PRINT_LIFT));
  placement.decompose(face.mesh.position, face.mesh.quaternion, face.mesh.scale);
  const object3D = new Group();
  object3D.name = 'desk-corkboard';
  object3D.add(face.mesh);
  whenFontsReady(() => drawBoard(face));
  return {
    object3D,
    dispose() {
      face.dispose();
      object3D.removeFromParent();
    }
  };
}
