import { NOINDEX, SITE_URL } from '@/lib/site';

// Zoekresultaten blijven uit Google.
const blocked = ['/zoeken', '/fr/recherche', '/en/search'];

export function GET() {
  const body = NOINDEX
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n${blocked.map((p) => `Disallow: ${p}`).join('\n')}\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
