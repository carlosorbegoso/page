import { registerShotProvider } from '../contracts';
import { DeskSet } from './DeskSet';

export { DeskSet } from './DeskSet';

/** Registers the night desk as the shot provider (the Stage awaits this on load). */
export default function install(): void {
  registerShotProvider(new DeskSet());
}
