import { finishCount, runCount } from './count';
import { settle, settleTimers, watchSettle } from './settle';
import { measureLines } from './split-markup';
import { stopKeys, typeKeys } from './type-keys';

export function revealRoot(root: HTMLElement, animate: boolean): void {
  if (root.dataset.reveal === 'in') return;
  if (root.dataset.kinetic && root.dataset.kinetic !== 'block') measureLines(root);
  root.dataset.reveal = 'in';
  if (root.dataset.kineticCount !== undefined) {
    if (animate) runCount(root);
    else finishCount(root);
  }
  if (animate && root.dataset.kineticVariant === 'type' && root.dataset.kineticSilent === undefined) typeKeys(root);
  if (animate) watchSettle(root);
  else settle(root);
}

export function resetRoot(root: HTMLElement): void {
  if (root.dataset.reveal !== 'in') return;
  window.clearTimeout(settleTimers.get(root));
  stopKeys(root);
  delete root.dataset.reveal;
  root.removeAttribute('data-settled');
  if (root.dataset.kineticCount !== undefined) finishCount(root);
}
