import enExperience from '../../../content/experience/en.json';
import esExperience from '../../../content/experience/es.json';
import { en } from '../../../i18n/ui.en';
import { es } from '../../../i18n/ui.es';
import type { FolderId } from '../layout';
import { SPINE_TEXT } from '../spines';

export interface SheetContent {
  company: string;
  years: string;
  role: string;
  client: string;
  summary: string;
  highlightsTitle: string;
  highlights: string[];
  stackTitle: string;
  stack: string[];
}

interface ExperienceEntry {
  id: string;
  company: string;
  client?: string;
  role: string;
  start: string;
  end: string | null;
  summary?: string;
  highlights: string[];
  stack: string[];
}

/** Content ids of the experience entries, by shelf folder. */
export const FOLDER_EXPERIENCE: Record<FolderId, string> = { sysarp: 'sysarp', baufest: 'baufest', intercorp: 'intercorp-retail', tcs: 'tcs' };

function pageIsEnglish(): boolean {
  return document.documentElement.lang.startsWith('en');
}

/** "jun 2025", like the timeline (es-PE adds an abbreviation dot that the timeline drops). */
function month(value: string, english: boolean): string {
  const [year, monthIndex] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year!, monthIndex! - 1, 1));
  return new Intl.DateTimeFormat(english ? 'en-US' : 'es-PE', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date).replace('.', '');
}

/** The job printed on a folder's sheet, read from the experience content in the page's language. */
export function readExperience(folder: FolderId): SheetContent {
  const english = pageIsEnglish();
  const ui = english ? en : es;
  const entries = (english ? enExperience : esExperience).entries as ExperienceEntry[];
  const entry = entries.find(candidate => candidate.id === FOLDER_EXPERIENCE[folder]);
  const [spineName, spineYears] = SPINE_TEXT[folder];
  if (!entry) {
    return { company: spineName, years: spineYears, role: '', client: '', summary: '', highlightsTitle: '', highlights: [], stackTitle: '', stack: [] };
  }
  const end = entry.end ? month(entry.end, english) : ui['experience.present'];
  return {
    company: entry.company,
    years: `${month(entry.start, english)} – ${end}`,
    role: entry.role,
    client: entry.client ? `${ui['experience.client']}: ${entry.client}` : '',
    summary: entry.summary ?? '',
    highlightsTitle: ui['experience.highlights'],
    highlights: entry.highlights,
    stackTitle: ui['experience.stack'],
    stack: entry.stack
  };
}
