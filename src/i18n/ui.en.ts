import { contact } from './en/contact';
import { meta } from './en/meta';
import { nav } from './en/nav';
import { sections } from './en/sections';
import type { UiKey } from './ui.es';

export const en = { ...meta, ...nav, ...sections, ...contact } as const satisfies Record<UiKey, string>;
