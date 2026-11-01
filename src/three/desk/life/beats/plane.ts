import {
  CanvasTexture,
  Color,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SRGBColorSpace
} from 'three';
import { LATE_DEPTH_CHUNK, LATE_LAYER, lateUniforms } from '../../../fx/late';
import { PAPER_LEVEL } from '../../notes/paper';

const DENSITY = 9000;
export const BEAT_MM = DENSITY / 1000;
const SCREEN_LEVEL = 0.9;

export interface BeatSize {
  width: number;
  height: number;
}

export interface BeatCanvas {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  mm: number;
}

function lateMaterial(texture: CanvasTexture, paper: boolean): MeshBasicMaterial {
  const material = new MeshBasicMaterial({
    map: texture,
    color: new Color().setScalar(paper ? PAPER_LEVEL : SCREEN_LEVEL),
    transparent: true,
    depthWrite: false,
    depthTest: false,
    alphaTest: 0.02
  });
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, lateUniforms);
    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      `${LATE_DEPTH_CHUNK}\nvoid main() {\n  if (lateOccluded()) discard;`
    );
  };
  return material;
}

export class BeatPlane {
  readonly mesh: Mesh<PlaneGeometry, MeshBasicMaterial>;
  private readonly texture: CanvasTexture;
  readonly canvas: BeatCanvas;

  constructor(size: BeatSize, paper: boolean, draw: (canvas: BeatCanvas) => void) {
    const element = document.createElement('canvas');
    element.width = Math.round(size.width * DENSITY);
    element.height = Math.round(size.height * DENSITY);
    const context = element.getContext('2d')!;
    this.canvas = { context, width: element.width, height: element.height, mm: BEAT_MM };
    draw(this.canvas);
    this.texture = new CanvasTexture(element);
    this.texture.colorSpace = SRGBColorSpace;
    this.texture.anisotropy = 8;
    this.mesh = new Mesh(
      new PlaneGeometry(size.width, size.height),
      lateMaterial(this.texture, paper)
    );
    this.mesh.name = 'desk-beat';
    this.mesh.renderOrder = 6;
    this.mesh.layers.set(LATE_LAYER);
    this.mesh.matrixAutoUpdate = false;
    this.mesh.raycast = () => undefined;
  }

  set opacity(value: number) {
    this.mesh.material.opacity = value;
    this.mesh.visible = value > 0.001;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.texture.dispose();
  }
}
