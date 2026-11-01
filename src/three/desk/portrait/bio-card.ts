import { BoxGeometry, Group, Mesh, MeshStandardMaterial, SphereGeometry } from 'three';
import { stackedLayout } from '../../scenes/common';
import { PAPER_LEVEL, printedFace, whenFontsReady } from '../notes/paper';
import { drawBioCard, readBio } from './bio-print';
import { BIO_CARD } from './layout';

const PIN_RADIUS = 0.006;

export class BioCard {
  readonly group = new Group();
  private readonly face = printedFace('bio-card-face', BIO_CARD.width, BIO_CARD.height);
  private readonly bodyGeometry = new BoxGeometry(BIO_CARD.width, BIO_CARD.height, BIO_CARD.thickness);
  private readonly bodyMaterial = new MeshStandardMaterial({ color: 0xece5d3, roughness: 0.95, metalness: 0 });
  private readonly pinGeometry = new SphereGeometry(PIN_RADIUS, 12, 8);
  private readonly pinMaterial = new MeshStandardMaterial({ color: 0xb8432f, roughness: 0.4, metalness: 0.1 });

  constructor() {
    this.group.name = 'bio-card';
    this.bodyMaterial.color.multiplyScalar(PAPER_LEVEL);
    const body = new Mesh(this.bodyGeometry, this.bodyMaterial);
    body.receiveShadow = true;
    this.face.mesh.position.z = BIO_CARD.thickness / 2 + 0.0002;
    const pin = new Mesh(this.pinGeometry, this.pinMaterial);
    pin.position.set(0, BIO_CARD.height / 2 - PIN_RADIUS * 2.2, BIO_CARD.thickness / 2 + PIN_RADIUS * 0.6);
    pin.castShadow = true;
    this.group.add(body, this.face.mesh, pin);
    this.group.position.copy(BIO_CARD.centre);
    this.group.rotation.z = BIO_CARD.tilt;
    this.group.traverse(node => (node.raycast = () => undefined));
    this.group.visible = this.shown();
    whenFontsReady(() => drawBioCard(this.face, readBio()));
  }

  private shown(): boolean {
    return stackedLayout({ width: innerWidth, height: innerHeight });
  }

  update(): void {
    this.group.visible = this.shown();
  }

  dispose(): void {
    this.face.dispose();
    this.bodyGeometry.dispose();
    this.bodyMaterial.dispose();
    this.pinGeometry.dispose();
    this.pinMaterial.dispose();
  }
}
