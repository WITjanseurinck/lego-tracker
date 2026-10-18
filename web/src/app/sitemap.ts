import type { MetadataRoute } from 'next';
import { allArticles, articlePaths } from '@/lib/articles';
import { bolFetchedAt } from '@/lib/bol';
import { getCompareDeals } from '@/lib/deals';
import { LOCALES, LOCALE_TAG, localizePath, type Locale } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

const hreflang = (l: Locale) => (l === 'en' ? 'en' : LOCALE_TAG[l]);

/** Eén vermelding per taal, elk met verwijzingen naar de andere talen (hreflang). */
function entry(
  pathFor: (l: Locale) => string,
  extra: { lastModified?: string; changeFrequency?: 'daily' | 'weekly'; priority?: number },
): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[hreflang(l)] = `${SITE_URL}${localizePath(l, pathFor(l))}`;
  languages['x-default'] = `${SITE_URL}${localizePath('nl', pathFor('nl'))}`;
  return LOCALES.map((l) => ({ url: `${SITE_URL}${localizePath(l, pathFor(l))}`.replace(/\/$/, '') || SITE_URL, ...extra, alternates: { languages } }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = allArticles();
  return [
    ...entry(() => '/', { lastModified: bolFetchedAt, changeFrequency: 'daily', priority: 1 }),
    ...entry(() => '/gids', { changeFrequency: 'weekly', priority: 0.9 }),
    ...entry(() => '/themas', { changeFrequency: 'weekly', priority: 0.9 }),
    ...entry(() => '/kiezen', { changeFrequency: 'weekly', priority: 0.9 }),
    ...[...new Set(getCompareDeals().map((d) => d.theme))].filter((t) => t !== 'overig').flatMap((t) => entry(() => `/thema/${t}`, { lastModified: bolFetchedAt, changeFrequency: 'daily', priority: 0.8 })),
    ...getCompareDeals().flatMap((d) => entry(() => `/set/${d.set}`, { lastModified: bolFetchedAt, changeFrequency: 'daily', priority: 0.8 })),
    ...articles.flatMap((a) => entry((l) => articlePaths(a)[l], { lastModified: a.updated, changeFrequency: 'weekly', priority: 0.8 })),
  ];
}
