import { Mesh, MeshBasicMaterial, type Group, type Material, type Matrix4, type MeshStandardMaterial } from 'three';
import type { StationContext } from '../../contracts';
import { PartBuilder } from '../builder';
import { DESK, MONITOR, ROOM } from '../layout';
import { bakeNightEnvironment, createAtlasDepthMaterial, createAtlasMaterial, createContactShadowTexture, type AtlasUniforms } from '../materials';
import {
  buildChair,
  buildContactShadows,
  buildDesk,
  buildFigures,
  buildLamp,
  buildLaptop,
  buildPikachu,
  buildMonitorHead,
  buildOpenFolder,
  buildPhone,
  buildPlant,
  buildRoom,
  buildShelves,
  buildTelescope,
  buildWorkstation,
  type Palette
} from '../props';
import { monitorFrame } from '../shots';

export interface RoomMeshes {
  material: MeshStandardMaterial;
  uniforms: AtlasUniforms;
  depthMaterial: Material | undefined;
  /** Static geometry of the animated collectibles and the workstation, handed to `DeskLife`. */
  figures: PartBuilder;
  workstation: PartBuilder;
  phoneMatrix: Matrix4;
  triangles: number;
}

/** The atlas material and the merged static room: walls, furniture, props, the monitor head. */
export function buildRoomMeshes(room: Group, context: StationContext, palette: Palette, disposables: Array<{ dispose(): void }>): RoomMeshes {
  const high = context.tier === 'high';
  const q = high ? 1 : 0.6;
  const { material, uniforms } = createAtlasMaterial([ROOM.left, ROOM.right, ROOM.back, 0], [0, DESK.z, DESK.width / 2, DESK.depth / 2], DESK.top);
  const environment = bakeNightEnvironment(context.renderer);
  material.envMap = environment;
  material.envMapIntensity = 0.8;
  disposables.push(material, environment);

  const statics = new PartBuilder();
  buildRoom(statics, palette);
  buildDesk(statics, palette, q);
  const workstation = new PartBuilder();
  buildWorkstation(workstation, palette, q);
  const head = new PartBuilder();
  buildMonitorHead(head, palette, q);
  const headGeometry = head.build();
  const monitorHead = new Mesh(headGeometry, material);
  monitorHead.name = 'desk-monitor';
  monitorHead.castShadow = high;
  monitorHead.receiveShadow = high;
  monitorHead.position.copy(MONITOR.centre);
  monitorHead.quaternion.copy(monitorFrame().quaternion);
  room.add(monitorHead);
  disposables.push(headGeometry);
  buildLamp(statics, palette, q);
  buildPlant(statics, palette, q);
  buildShelves(statics, palette, q);
  buildChair(statics, palette, q);
  buildTelescope(statics, palette, q);
  buildOpenFolder(statics, palette);
  buildLaptop(statics, palette);
  buildPikachu(statics, q);
  const phoneMatrix = buildPhone(statics, palette);
  const figures = new PartBuilder();
  buildFigures(figures, palette, q);
  const geometry = statics.build();
  const triangles = statics.triangleCount + figures.triangleCount + workstation.triangleCount;
  const roomMesh = new Mesh(geometry, material);
  roomMesh.name = 'desk-room';
  roomMesh.castShadow = high;
  roomMesh.receiveShadow = high;
  if (high) {
    roomMesh.customDepthMaterial = createAtlasDepthMaterial(uniforms);
    disposables.push(roomMesh.customDepthMaterial);
  }
  room.add(roomMesh);
  disposables.push(geometry);
  return { material, uniforms, depthMaterial: roomMesh.customDepthMaterial, figures, workstation, phoneMatrix, triangles };
}

export function addContactShadows(room: Group, disposables: Array<{ dispose(): void }>): void {
  const texture = createContactShadowTexture();
  const geometry = buildContactShadows();
  const material = new MeshBasicMaterial({
    color: 0x000000,
    map: texture,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2
  });
  const mesh = new Mesh(geometry, material);
  mesh.name = 'desk-contact-shadows';
  mesh.renderOrder = -1;
  mesh.raycast = () => undefined;
  room.add(mesh);
  disposables.push(texture, geometry, material);
}
