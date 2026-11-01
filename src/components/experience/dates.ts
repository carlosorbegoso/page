import { formatYearMonth, type Locale } from '../../i18n/utils';

/** Short month and year without the abbreviation dot that es-PE adds ("jun. 2025" → "jun 2025"). */
export function formatTimelineMonth(value: string, locale: Locale): string {
  return formatYearMonth(value, locale).replace('.', '');
}
