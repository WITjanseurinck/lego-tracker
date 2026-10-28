import { allArticles, articlePaths } from '@/lib/articles';
import { getI18n } from '@/lib/i18n-server';
import { localizePath } from '@/lib/i18n';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { ogImageUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c] as string));

/**
 * Atom-feed met de gidsen in de taal van de URL (/feed, /fr/feed, /en/feed).
 * Chrome en Google gebruiken die feed voor de Volgen-knop en voor het ontdekken van nieuwe artikels.
 */
export async function GET() {
  const { locale, t, href } = await getI18n();
  const articles = allArticles();
  const feedUrl = `${SITE_URL}${href('/feed')}`;
  const updated = articles.reduce((m, a) => (a.updated > m ? a.updated : m), articles[0]?.updated ?? new Date().toISOString());
  const entries = articles.map((a) => {
    const x = a.text[locale];
    const url = `${SITE_URL}${localizePath(locale, articlePaths(a)[locale])}`;
    const image = `${SITE_URL}${ogImageUrl(locale, { a: a.id })}`;
    return `  <entry>
    <id>${esc(url)}</id>
    <title>${esc(x.title)}</title>
    <link rel="alternate" type="text/html" href="${esc(url)}"/>
    <link rel="enclosure" type="image/png" href="${esc(image)}"/>
    <published>${a.published}</published>
    <updated>${a.updated}</updated>
    <summary>${esc(x.summary)}</summary>
  </entry>`;
  });
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${locale}">
  <id>${esc(feedUrl)}</id>
  <title>${esc(`${SITE_NAME}: ${t.nav.guides}`)}</title>
  <link rel="self" type="application/atom+xml" href="${esc(feedUrl)}"/>
  <link rel="alternate" type="text/html" href="${esc(`${SITE_URL}${href('/gids')}`)}"/>
  <updated>${updated}</updated>
  <author><name>${esc(SITE_NAME)}</name></author>
${entries.join('\n')}
</feed>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8', 'Cache-Control': 'public, max-age=600' } });
}
