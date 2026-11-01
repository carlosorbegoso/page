import { StageLoader } from './loader';
import { LoaderStatus } from './status';

export type { RevealDetail } from './frame';

export function startStageLoader(container: HTMLElement): void {
  const canvas = container.querySelector<HTMLCanvasElement>('[data-stage-loader]');
  const status = document.querySelector<HTMLElement>('[data-stage-status]');
  const context = canvas?.getContext('2d');
  if (!canvas || !status || !context || location.search.includes('capture') || container.dataset.ready === 'true') return;
  new StageLoader(container, canvas, new LoaderStatus(status), context).start();
}
