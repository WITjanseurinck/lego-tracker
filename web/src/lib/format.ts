import { LOCALE_TAG, type Locale } from '@/lib/i18n';

export function formatEur(value: number | string, locale: Locale = 'nl'): string {
  return new Intl.NumberFormat(LOCALE_TAG[locale], { style: 'currency', currency: 'EUR' }).format(Number(value));
}

export function formatDate(iso: string, locale: Locale = 'nl'): string {
  return new Date(iso).toLocaleDateString(LOCALE_TAG[locale], { day: 'numeric', month: 'long', year: 'numeric' });
}
