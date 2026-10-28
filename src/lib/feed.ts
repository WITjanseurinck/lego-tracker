import { allArticles, articlePaths } from '@/lib/articles';
import { getDict } from '@/lib/dict';
import { localizePath, type Locale } from '@/lib/i18n';
import { SITE_NAME, SITE_URL } from '@/lib/site';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c] as string));

/** Atom-feed met de gidsen in één taal. Chrome en Google gebruiken die voor de Volgen-knop en om nieuwe artikels te ontdekken. */
export function atomFeed(locale: Locale): Response {
  const t = getDict(locale);
  const articles = allArticles();
  const feedUrl = `${SITE_URL}${localizePath(locale, '/feed.xml')}`;
  const updated = articles.reduce((m, a) => (a.updated > m ? a.updated : m), articles[0]?.updated ?? new Date().toISOString());
  const entries = articles.map((a) => {
    const x = a.text[locale];
    const url = `${SITE_URL}${localizePath(locale, articlePaths(a)[locale])}`;
    const image = `${SITE_URL}/og/${locale}-a-${a.id}.png`;
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
  <link rel="alternate" type="text/html" href="${esc(`${SITE_URL}${localizePath(locale, '/gids')}`)}"/>
  <updated>${updated}</updated>
  <author><name>${esc(SITE_NAME)}</name></author>
${entries.join('\n')}
</feed>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
}
