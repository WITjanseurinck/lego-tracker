import { getCompareDeals } from '@/lib/deals';
import { LOCALES, localizePath, type Locale } from '@/lib/i18n';

export type Route = { locale: Locale; internal: string; kind: 'home' | 'set'; set?: string };

/** Alle pagina's van de site: één per taal en intern pad. De publieke URL komt uit localizePath. */
export function allRoutes(): Route[] {
  const out: Route[] = [];
  for (const locale of LOCALES) {
    out.push({ locale, internal: '/', kind: 'home' });
    for (const d of getCompareDeals()) out.push({ locale, internal: `/set/${d.set}`, kind: 'set', set: d.set });
  }
  return out;
}

/** Rest-parameter voor Astro: leeg voor de homepage van de standaardtaal. */
export function routeParam(r: Route): string | undefined {
  return localizePath(r.locale, r.internal).replace(/^\//, '') || undefined;
}
