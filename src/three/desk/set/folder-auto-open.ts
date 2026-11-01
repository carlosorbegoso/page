import type { Vector3 } from 'three';
import type { FolderDetail } from '../folderDetail';
import type { FolderId } from '../layout';
import type { DeskFrame } from './frame';

const AUTO_SETTLE = 0.25;

export class FolderAutoOpen {
  private folder: FolderId | null = null;
  private pending = false;

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
