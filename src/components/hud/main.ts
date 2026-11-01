import { initAudioHint } from './audio-hint';
import { initChapterBeat } from './chapter-beat';
import { queryHud, type IndexOpener } from './elements';
import { initIndexSheet } from './index-sheet';
import { initMenu } from './menu';
import { initProgress } from './progress';
import { initQuickTour, initTourBadge } from './tour-badge';

const elements = queryHud();
const opener: IndexOpener = { current: null };

initQuickTour(elements);
initMenu(elements, opener);
initProgress(elements);
initTourBadge(elements);
initAudioHint(elements);
initIndexSheet(elements, opener);
initChapterBeat(elements);
