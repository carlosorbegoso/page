import { formatYearMonth, type Locale } from '../../i18n/utils';

export function formatTimelineMonth(value: string, locale: Locale): string {
  return formatYearMonth(value, locale).replace('.', '');
}
