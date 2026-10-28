import { allArticles, articlePaths } from '@/lib/articles';
import { bolFetchedAt } from '@/lib/bol';
import { allRoutes } from '@/lib/routes';
import { LOCALES, LOCALE_TAG, localizePath, type Locale } from '@/lib/i18n';
import { SITE_URL } from '@/lib/site';

const hreflang = (l: Locale) => (l === 'en' ? 'en' : LOCALE_TAG[l]);
const abs = (l: Locale, p: string) => `${SITE_URL}${localizePath(l, p)}`.replace(/\/$/, '') || SITE_URL;

const FREQ: Record<string, { changefreq: string; priority: number }> = {
  home: { changefreq: 'daily', priority: 1 },
  gids: { changefreq: 'weekly', priority: 0.9 },
  themas: { changefreq: 'weekly', priority: 0.9 },
  kiezen: { changefreq: 'weekly', priority: 0.9 },
  cadeau: { changefreq: 'weekly', priority: 0.8 },
  onderwerp: { changefreq: 'daily', priority: 0.8 },
  thema: { changefreq: 'daily', priority: 0.8 },
  set: { changefreq: 'daily', priority: 0.8 },
  artikel: { changefreq: 'weekly', priority: 0.8 },
};

/** Eén vermelding per taal en pagina, elk met verwijzingen naar de andere talen (hreflang). */
export function GET() {
  const articles = new Map(allArticles().map((a) => [a.id, a]));
  const rows: string[] = [];
  const seen = new Set<string>();
  for (const r of allRoutes()) {
    const f = FREQ[r.kind];
    if (!f) continue; // zoeken en privacy-varianten blijven buiten de sitemap
    const art = r.kind === 'artikel' ? articles.get(r.key!) : undefined;
    const pathFor = (l: Locale) => (art ? articlePaths(art)[l] : r.internal);
    const key = `${r.locale}${pathFor(r.locale)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const links = LOCALES.map((l) => `    <xhtml:link rel="alternate" hreflang="${hreflang(l)}" href="${abs(l, pathFor(l))}"/>`).concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${abs('nl', pathFor('nl'))}"/>`);
    const last = art ? art.updated : bolFetchedAt;
    rows.push(`  <url>\n    <loc>${abs(r.locale, pathFor(r.locale))}</loc>\n    <lastmod>${last}</lastmod>\n    <changefreq>${f.changefreq}</changefreq>\n    <priority>${f.priority}</priority>\n${links.join('\n')}\n  </url>`);
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${rows.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
