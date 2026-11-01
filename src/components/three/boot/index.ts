import { BootSequence } from './sequence';

export { warmVisit } from './sequence';

export function startBoot(root: HTMLElement): void {
  new BootSequence(root, document.querySelector<HTMLElement>('[data-stage]')).start();
}
