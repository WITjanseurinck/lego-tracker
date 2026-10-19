import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articleHeroSet, articlePaths, findArticleBySlug } from '@/lib/articles';
import { getCompareDeal } from '@/lib/deals';
import { formatDate } from '@/lib/format';
import { getI18n } from '@/lib/i18n-server';
import { LOCALE_TAG, localizePath } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await getI18n();
  const a = findArticleBySlug(locale, slug);
  if (!a) return {};
  const x = a.text[locale];
  return pageMeta({
    locale,
    path: articlePaths(a)[locale],
    paths: articlePaths(a),
    title: x.title,
    description: x.summary,
    og: { a: a.id },
    type: 'article',
    publishedTime: a.published,
    modifiedTime: a.updated,
  });
}

export default async function Gids({ params }: Params) {
  const { slug } = await params;
  const { locale, t, href } = await getI18n();
  const a = findArticleBySlug(locale, slug);
  if (!a) notFound();
  const x = a.text[locale];
  const url = `${SITE_URL}${localizePath(locale, articlePaths(a)[locale])}`;
  const hero = getCompareDeal(articleHeroSet(a) ?? '');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: x.title,
        description: x.summary,
        inLanguage: LOCALE_TAG[locale],
        // Google Discover wil per artikel beelden in meerdere verhoudingen: 16:9, 4:3, 1:1 en het deelbeeld.
        image: [undefined, '16x9', '4x3', '1x1'].map((r) => `${SITE_URL}/og?l=${locale}&a=${a.id}${r ? `&r=${r}` : ''}`),
        datePublished: a.published,
        dateModified: a.updated,
        mainEntityOfPage: url,
        author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}${localizePath(locale, '/')}`.replace(/\/$/, '') },
          { '@type': 'ListItem', position: 2, name: t.guides.crumb, item: `${SITE_URL}${localizePath(locale, '/gids')}` },
          { '@type': 'ListItem', position: 3, name: x.title, item: url },
        ],
      },
    ],
  };

  return (
    <article className="wrap page"><div className="prose">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label={t.guides.crumbAria} className="crumbs"><Link href={href('/gids')}>{t.guides.crumb}</Link></nav>
      <h1>{x.title}</h1>
      <p className="lead">{x.summary}</p>
      <p className="muted">
        {t.guides.published(formatDate(a.published, locale))}
        {formatDate(a.updated, locale) !== formatDate(a.published, locale) ? t.guides.updated(formatDate(a.updated, locale)) : ''}
      </p>
      {hero?.image ? (
        <figure className="herofig">
          <Link href={href(`/set/${hero.set}`)}><img src={hero.image} alt={`LEGO ${hero.set} ${hero.name}`} referrerPolicy="no-referrer" /></Link>
          <figcaption><Link href={href(`/set/${hero.set}`)}>LEGO {hero.set} {hero.name}</Link></figcaption>
        </figure>
      ) : null}
      {x.body.map((b, i) =>
        'h2' in b ? <h2 key={i}>{b.h2}</h2>
        : 'ul' in b ? <ul key={i}>{b.ul.map((li, j) => <li key={j}>{li}</li>)}</ul>
        : 'src' in b ? <div key={i}><h2>{t.guides.sources}</h2><ul>{b.src.map((x) => <li key={x.url}><a href={x.url} target="_blank" rel="noopener nofollow">{x.label}</a></li>)}</ul></div>
        : <p key={i}>{b.p}</p>,
      )}
      <aside className="cta-card">
        <h2>{t.guides.ctaTitle}</h2>
        <p>{t.guides.ctaText}</p>
        <Link href={href('/')} className="btn dark">{t.guides.ctaButton}</Link>
      </aside>
    </div></article>
  );
}
