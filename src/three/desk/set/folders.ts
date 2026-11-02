import { Matrix4, Vector3, type Mesh } from 'three';
import type { ChapterId } from '../../contracts';
import { OBJECT_ID } from '../builder';
import { FLAP_THICKNESS, FOLDER_PARK } from '../folder-detail/constants';
import { follow } from '../folder-detail/follow';
import type { FolderDetail } from '../folderDetail';
import type { OpenFolderPrint } from '../folders/open-folder-print';
import { FOLDERS, OPEN_FOLDER, type FolderId } from '../layout';
import type { DeskLife } from '../life';
import type { AtlasUniforms } from '../materials';
import { damp } from '../math';
import { experienceFolder } from '../shots';
import type { DeskFrame } from './frame';
import { FolderAutoOpen } from './folder-auto-open';
import { EXPERIENCE_IDS, FOLDER_OPENS_AT } from './story';

const FOLDER_OPEN_DELAY = 0.3;
const FOLDER_HINGE_AXIS = new Vector3(Math.sin(OPEN_FOLDER.yaw), 0, Math.cos(OPEN_FOLDER.yaw));
const FOLDER_HINGE_ORIGIN = OPEN_FOLDER.centre.clone().add(new Vector3(0, 0.009, 0));
const FOLDER_PULL = 0.03;
const REQUEST_TIMEOUT_MS = 5000;
const REQUEST_SETTLE = 0.15;

interface FolderRequest {
  id: FolderId;
  at: number;
  eye: () => Vector3;
}

function requestedFolder(interactId: string): FolderId | null {
  const key = interactId.replace(/^folder-/, '');
  if (key === 'openFolder') return 'tcs';
  return (FOLDERS as readonly string[]).includes(key) ? (key as FolderId) : null;
}

export class DeskFolders {
  detail: FolderDetail | null = null;
  private print: OpenFolderPrint | null = null;
  private request: FolderRequest | null = null;
  private readonly autoOpen = new FolderAutoOpen();
  private focusKey = '';
  private open = 0;
  private readonly pull = new Map<FolderId, number>(FOLDERS.map(id => [id, 0]));
  private readonly glow = new Map<string, number>(FOLDERS.map(id => [id, 0]));
  private readonly hingeMatrix = new Matrix4();
  private detailShadowPose = '';
  private spineLabels = new Map<FolderId, Mesh>();
  private archiveCover: Mesh | null = null;
  private readonly origin = new Vector3();
  private readonly coverRest = new Vector3();

  attachPrint(print: OpenFolderPrint): void {
    this.print = print;
  }

  attachSpines(labels: Map<FolderId, Mesh>, cover: Mesh): void {
    this.spineLabels = labels;
    this.archiveCover = cover;
  }

  updateHinge(frame: DeskFrame): boolean {
    const { rank, motion, settledAt, time, step } = frame;
    const openGoal = rank >= FOLDER_OPENS_AT ? 1 : 0;
    const opening = motion && rank === FOLDER_OPENS_AT && openGoal > this.open;
    if (!opening || (settledAt >= 0 && time - settledAt >= FOLDER_OPEN_DELAY)) {
      this.open = damp(this.open, openGoal, opening ? 3.2 : motion ? 5 : 10, step);
      if (Math.abs(this.open - openGoal) < 0.001) this.open = openGoal;
    }
    return this.open !== openGoal;
  }

  updateShelf(frame: DeskFrame, hoverId: number, eye: () => Vector3): { settling: boolean; posed: boolean } {
    const { chapter, subIndex, dt, motion, step } = frame;
    let settling = false;
    let posed = false;
    const folder = chapter === 'experience' ? experienceFolder(subIndex) : null;
    const detail = this.detail;
    this.serveRequest(frame, folder);
    if (detail) {
      const waiting = this.autoOpen.update(frame, folder, detail, eye);
      settling ||= waiting;
      if (detail.active && detail.active !== folder) detail.close();
      const moving = detail.update(dt, motion);
      settling ||= moving;
      this.announceFocus(detail);
      const pose = detail.poseKey();
      if (pose !== this.detailShadowPose) {
        this.detailShadowPose = pose;
        posed = true;
      }
    }
    for (const id of FOLDERS) {
      const held = detail?.active === id;
      const pullGoal = id === folder ? FOLDER_PULL : OBJECT_ID[id] === hoverId && !held ? FOLDER_PULL * 0.6 : 0;
      const pull = damp(this.pull.get(id)!, pullGoal, 7, step);
      this.pull.set(id, pull);
      settling ||= Math.abs(pull - pullGoal) > 1e-4;
      const goal = id === folder ? 1 : 0;
      const glow = damp(this.glow.get(id)!, goal, 6, step);
      this.glow.set(id, glow);
      settling ||= Math.abs(glow - goal) > 0.002;
    }
    return { settling, posed };
  }

  private announceFocus(detail: FolderDetail): void {
    const point = detail.heldFocus;
    const key = point ? `${detail.active}:${point.toArray().join(',')}` : '';
    if (key === this.focusKey) return;
    this.focusKey = key;
    window.dispatchEvent(new CustomEvent('desk:focus', { detail: { point: point?.clone() ?? null } }));
  }

  requestFolder(interactId: string, eye: () => Vector3): void {
    const id = requestedFolder(interactId);
    this.request = id ? { id, at: performance.now(), eye } : null;
  }

  private serveRequest(frame: DeskFrame, folder: FolderId | null): void {
    const request = this.request;
    const detail = this.detail;
    if (!request || !detail) return;
    if (detail.active === request.id || performance.now() - request.at > REQUEST_TIMEOUT_MS) {
      this.request = null;
      return;
    }
    if (folder !== request.id || frame.settledAt < 0 || frame.time - frame.settledAt < REQUEST_SETTLE) return;
    this.request = null;
    detail.toggle(folder, request.eye());
  }

  action(action: 'folder' | 'folder-close', id: string | undefined, chapter: ChapterId, subIndex: number, eye: () => Vector3): boolean {
    const detail = this.detail;
    if (!detail) return false;
    if (action === 'folder-close') detail.close();
    else {
      const folder = chapter === 'experience' ? experienceFolder(subIndex) : null;
      if (!folder || (id !== folder && id !== EXPERIENCE_IDS[folder])) return false;
      this.request = null;
      detail.toggle(folder, eye());
    }
    return true;
  }

  apply(uniforms: AtlasUniforms, life: DeskLife | null, proxies: Map<string, Mesh>): void {
    for (const id of FOLDERS) uniforms.uGlow.value[OBJECT_ID[id]] = (this.glow.get(id) ?? 0) * 0.32 + (life?.glow(id) ?? 0);
    const closed = 1 - this.open;
    uniforms.uHinge.value.setFromMatrix4(this.hingeMatrix.makeRotationAxis(FOLDER_HINGE_AXIS, -Math.PI * 0.985 * (closed * closed * (3 - 2 * closed))));
    uniforms.uHingeOrigin.value.copy(FOLDER_HINGE_ORIGIN);
    this.print?.applyHinge(this.hingeMatrix, FOLDER_HINGE_ORIGIN);
    for (const id of FOLDERS) {
      const pull = this.pull.get(id) ?? 0;
      const held = this.detail?.shelfPose(id, pull) ?? null;
      uniforms.uPull.value[OBJECT_ID[id]] = held ? FOLDER_PARK : pull;
      const label = this.spineLabels.get(id);
      if (label) {
        label.position.x = pull;
        follow(label, held, this.origin);
      }
      const cover = id === FOLDERS[0] ? this.archiveCover : null;
      if (cover) this.placeArchiveCover(cover, id, pull);
      const proxy = proxies.get(id);
      if (proxy) follow(proxy, held, proxy.position);
    }
    uniforms.uGlow.value[OBJECT_ID.openFolder] = (this.glow.get('tcs') ?? 0) * 0.25 + (life?.glow('openFolder') ?? 0);
  }

  private placeArchiveCover(cover: Mesh, id: FolderId, pull: number): void {
    const restX = cover.userData.restX as number;
    const restZ = cover.userData.restZ as number;
    cover.position.x = restX + pull;
    const held = this.detail?.coverPose(id) ?? null;
    follow(cover, held, this.coverRest.set(restX, cover.position.y, restZ + FLAP_THICKNESS));
  }
}
