import { contact } from './es/contact';
import { meta } from './es/meta';
import { nav } from './es/nav';
import { sections } from './es/sections';

export const es = { ...meta, ...nav, ...sections, ...contact } as const;

export type UiKey = keyof typeof es;
