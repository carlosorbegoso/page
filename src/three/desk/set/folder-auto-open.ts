import type { Vector3 } from 'three';
import type { FolderDetail } from '../folderDetail';
import type { FolderId } from '../layout';
import type { DeskFrame } from './frame';

/** Pause after the camera lands before the shot's folder comes out on its own. */
const AUTO_SETTLE = 0.25;

/**
 * Each experience sub-shot opens its folder once the camera lands, since the sheet now carries the
 * job (the DOM panel is only for screen readers in 3D). Opened once per arrival: a folder the visitor
 * puts back stays back until the shot changes.
 */
export class FolderAutoOpen {
  private folder: FolderId | null = null;
  private pending = false;

  /** Returns true while it waits for the camera to settle, so the loop keeps ticking until it opens. */
  update(frame: DeskFrame, folder: FolderId | null, detail: FolderDetail, eye: () => Vector3): boolean {
    if (folder !== this.folder) {
      this.folder = folder;
      this.pending = folder !== null;
    }
    if (!this.pending || !folder) return false;
    if (detail.active === folder) {
      this.pending = false;
      return false;
    }
    if (detail.active || frame.settledAt < 0 || frame.time - frame.settledAt < AUTO_SETTLE) return true;
    this.pending = false;
    detail.toggle(folder, eye());
    return false;
  }
}
