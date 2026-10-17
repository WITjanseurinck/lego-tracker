import { VERTICAL } from '@/verticals';

const eur = new Intl.NumberFormat(VERTICAL.locale, { style: 'currency', currency: 'EUR' });

export function formatEur(value: number | string): string {
  return eur.format(Number(value));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(VERTICAL.locale, { day: 'numeric', month: 'short', year: 'numeric' });
}
