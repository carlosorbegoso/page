import { registerStation } from '../contracts';
import { DeskStation } from './DeskStation';

export { DeskStation, DESK_PHASES, type DeskPick } from './DeskStation';

/** Registers the night desk as the `hero` station (the Stage awaits this on load). */
export default function install(): void {
  registerStation('hero', new DeskStation());
}
