import type { MetadataRoute } from 'next';
import { getSitemapData, getThemes } from '@/lib/data';
import { bolFetchedAt } from '@/lib/bol';
import { getCompareDeals } from '@/lib/deals';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ skus, articles }, themes] = await Promise.all([getSitemapData(), getThemes()]);
  const sets = getCompareDeals();
  return [
    { url: SITE_URL, lastModified: bolFetchedAt, changeFrequency: 'daily', priority: 1 },
    ...sets.map((d) => ({ url: `${SITE_URL}/set/${d.set}`, lastModified: bolFetchedAt, changeFrequency: 'daily' as const, priority: 0.8 })),
    { url: `${SITE_URL}/nieuws`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/themas`, changeFrequency: 'daily', priority: 0.8 },
    ...themes.map((t) => ({ url: `${SITE_URL}/thema/${t.slug}`, changeFrequency: 'daily' as const, priority: 0.7 })),
    ...articles.map((a) => ({
      url: `${SITE_URL}/nieuws/${a.slug}`,
      lastModified: a.updated_at,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...skus.map((sku) => ({ url: `${SITE_URL}/p/${sku}`, changeFrequency: 'daily' as const, priority: 0.6 })),
  ];
}
