import type { MetadataRoute } from 'next';
import { NOINDEX, SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

// Per taal dezelfde interne pagina's: zoekresultaten, alerts en de demo-productpagina's blijven uit Google.
const blocked = ['/zoeken', '/verlanglijst', '/alert/', '/p/', '/thema/', '/themas'];
const blockedLocalized = ['/fr/recherche', '/en/search'];

export default function robots(): MetadataRoute.Robots {
  if (NOINDEX) return { rules: [{ userAgent: '*', disallow: '/' }] };
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: [...blocked.flatMap((p) => [p, `/fr${p}`, `/en${p}`]), ...blockedLocalized] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
