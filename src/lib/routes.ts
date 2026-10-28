import { allArticles, articlePaths } from '@/lib/articles';
import { getCompareDeals } from '@/lib/deals';
import { THEMES } from '@/lib/dict2';
import { GIFT_SLUGS } from '@/lib/gifts';
import { LOCALES, localizePath, type Locale } from '@/lib/i18n';
import { TOPIC_KEYS, dealsByTopic } from '@/lib/topics';
import { dealsByTheme } from '@/lib/deals';

export type Route = { locale: Locale; internal: string; kind: string; key?: string };

/** Alle pagina's van de site: één per taal en intern pad. De publieke URL komt uit localizePath. */
export function allRoutes(): Route[] {
  const out: Route[] = [];
  const deals = getCompareDeals();
  const themes = Object.keys(THEMES).filter((k) => k !== 'overig' && dealsByTheme(k).length > 0);
  for (const locale of LOCALES) {
    out.push({ locale, internal: '/', kind: 'home' });
    out.push({ locale, internal: '/gids', kind: 'gids' });
    out.push({ locale, internal: '/themas', kind: 'themas' });
    out.push({ locale, internal: '/kiezen', kind: 'kiezen' });
    out.push({ locale, internal: '/zoeken', kind: 'zoeken' });
    out.push({ locale, internal: '/privacy', kind: 'privacy' });
    for (const g of GIFT_SLUGS) out.push({ locale, internal: `/cadeau/${g}`, kind: 'cadeau', key: g });
    for (const k of TOPIC_KEYS) if (dealsByTopic(k).length > 0) out.push({ locale, internal: `/onderwerp/${k}`, kind: 'onderwerp', key: k });
    for (const k of themes) out.push({ locale, internal: `/thema/${k}`, kind: 'thema', key: k });
    for (const d of deals) out.push({ locale, internal: `/set/${d.set}`, kind: 'set', key: d.set });
    for (const a of allArticles()) out.push({ locale, internal: articlePaths(a)[locale], kind: 'artikel', key: a.id });
  }
  return out;
}

/** Rest-parameter voor Astro: leeg voor de homepage van de standaardtaal. */
export function routeParam(r: Route): string | undefined {
  return localizePath(r.locale, r.internal).replace(/^\//, '') || undefined;
}
