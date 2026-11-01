import { SITE } from '../../../config/site';

export const displayUrl = (href: string) => href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

export const SOCIAL = [
  { label: 'LinkedIn', href: SITE.social.linkedin },
  { label: 'GitHub', href: SITE.social.github },
  { label: 'X', href: SITE.social.x }
];
