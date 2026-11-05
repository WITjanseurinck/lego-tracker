import names from '../../data/names.json';
import type { Locale } from '@/lib/i18n';

type SetNames = { nl: string; fr: string; en: string };
const NAMES = names as Record<string, SetNames>;

/** Officiële LEGO-naam van een set in de taal van de pagina. Zonder naam blijft de oorspronkelijke naam staan. */
export const setName = (id: string, locale: Locale, fallback: string): string => NAMES[id]?.[locale] || fallback;

/** Namen voor de browser: enkel de talen die verschillen van de standaardnaam. */
export const clientNames = (id: string, fallback: string): { fr?: string; en?: string } => {
  const n = NAMES[id];
  const nl = n?.nl || fallback;
  return { ...(n?.fr && n.fr !== nl ? { fr: n.fr } : {}), ...(n?.en && n.en !== nl ? { en: n.en } : {}) };
};
