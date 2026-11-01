import { registerShotProvider } from '../contracts';
import { DeskSet } from './DeskSet';

export { DeskSet } from './DeskSet';

export default function install(): void {
  registerShotProvider(new DeskSet());
}
