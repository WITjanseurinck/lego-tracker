import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
import { NOINDEX, SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  if (NOINDEX) return { rules: [{ userAgent: '*', disallow: '/' }] };
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/alert/', '/verlanglijst'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
