import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  if (process.env.DEMO === '1') return { rules: [{ userAgent: '*', disallow: '/' }] };
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/alert/', '/verlanglijst'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
