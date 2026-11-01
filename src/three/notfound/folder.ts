import { BoxGeometry, BufferAttribute, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, PlaneGeometry } from 'three';
import { DEG, PAPER_H, PAPER_W, TARGET } from './constants';
import { ghostTexture, paperTexture } from './paper-texture';

function addCovers(folder: Object3D, material: MeshStandardMaterial): void {
  const coverGeometry = new BoxGeometry(0.98, 0.012, 1.3);
  for (const x of [-0.5, 0.5]) {
    const cover = new Mesh(coverGeometry, material);
    cover.position.x = x;
    cover.receiveShadow = true;
    cover.castShadow = true;
    folder.add(cover);
  }
  const tab = new Mesh(new BoxGeometry(0.34, 0.012, 0.1), material);
  tab.position.set(0.7, 0, -0.69);
  folder.add(tab);
}

function curledPaperGeometry(): PlaneGeometry {
  const geometry = new PlaneGeometry(PAPER_W, PAPER_H, 12, 1);
  const positions = geometry.attributes.position as BufferAttribute;
  for (let i = 0; i < positions.count; i++) {
    const u = positions.getX(i) / PAPER_W + 0.5;
    positions.setZ(i, Math.pow(u, 3) * 0.035);
  }
  geometry.computeVertexNormals();
  return geometry;
}

function createPaper(label: string): Mesh {
  const paper = new Mesh(curledPaperGeometry(), new MeshStandardMaterial({ map: paperTexture(label), roughness: 0.92 }));
  paper.rotation.set(-Math.PI / 2, 0, 3 * DEG);
  paper.position.set(0.5, 0.014, 0.02);
  paper.castShadow = true;
  paper.receiveShadow = true;
  return paper;
}

function createMissingSheetOutline(): Mesh {
  const ghost = new Mesh(
    new PlaneGeometry(PAPER_W * 0.98, PAPER_H * 0.98),
    new MeshBasicMaterial({ map: ghostTexture(), transparent: true, opacity: 0.35, depthWrite: false })
  );
  ghost.rotation.x = -Math.PI / 2;
  ghost.position.set(-0.5, 0.0125, 0);
  return ghost;
}

/** The open folder with the 404 sheet on one side and the outline of the missing sheet on the other. */
export function buildFolder(material: MeshStandardMaterial, paperLabel: string): Object3D {
  const folder = new Object3D();
  folder.position.copy(TARGET).setY(0.006);
  folder.rotation.y = -7 * DEG;
  addCovers(folder, material);
  folder.add(createPaper(paperLabel));
  folder.add(createMissingSheetOutline());
  return folder;
}
