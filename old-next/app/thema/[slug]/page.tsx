import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CompareCard } from '@/components/CompareCard';
import { dealsByTheme } from '@/lib/deals';
import { THEMES, getDict2, themeName } from '@/lib/dict2';
import { formatEur } from '@/lib/format';
import { getI18n } from '@/lib/i18n-server';
import { localizePath } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { photoTint } from '@/lib/themes';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await getI18n();
  const deals = dealsByTheme(slug);
  if (!THEMES[slug] || deals.length === 0) return { title: '404', robots: { index: false } };
  const t2 = getDict2(locale);
  const n = themeName(slug, locale);
  const from = formatEur(Math.min(...deals.map((d) => d.offers[0].price)), locale);
  return pageMeta({ locale, path: `/thema/${slug}`, title: t2.themeTitle(n), description: t2.themeDesc(n, deals.length, from) });
}

export default async function ThemaPage({ params }: Params) {
  const { slug } = await params;
  const { locale, href } = await getI18n();
  const deals = dealsByTheme(slug);
  if (!THEMES[slug] || deals.length === 0) notFound();
  const t2 = getDict2(locale);
  const n = themeName(slug, locale);
  const sorted = [...deals].sort((a, b) => a.offers[0].price - b.offers[0].price);
  const eur = (x: number) => formatEur(x, locale);
  const url = `${SITE_URL}${localizePath(locale, `/thema/${slug}`)}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: t2.themeTitle(n),
        itemListElement: sorted.slice(0, 30).map((d, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}${localizePath(locale, `/set/${d.set}`)}`, name: `LEGO ${d.set} ${d.name}` })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}${localizePath(locale, '/')}`.replace(/\/$/, '') },
          { '@type': 'ListItem', position: 2, name: n, item: url },
        ],
      },
    ],
  };
  const others = Object.keys(THEMES).filter((k) => k !== slug && k !== 'overig' && dealsByTheme(k).length > 0);

  return (
    <div className="wrap page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="crumbs"><Link href={href('/')}>{SITE_NAME}</Link> / <span>{n}</span></nav>
      <h1>{t2.themeH1(n)}</h1>
      <p className="lead">{THEMES[slug].blurb[locale]}</p>
      <p className="muted">{t2.themeCount(sorted.length, eur(sorted[0].offers[0].price), eur(sorted[sorted.length - 1].offers[0].price))}</p>
      <div className="grid" style={{ marginTop: 32 }}>
        {sorted.map((d, i) => <CompareCard key={d.set} deal={d} tint={photoTint(i)} locale={locale} />)}
      </div>
      <section className="sec">
        <h2>{t2.allThemes}</h2>
        <ul className="chips">
          {others.map((k) => <li key={k}><Link href={href(`/thema/${k}`)}>{themeName(k, locale)}</Link></li>)}
          <li><Link href={href('/kiezen')}>{t2.finder.nav}</Link></li>
        </ul>
      </section>
    </div>
  );
}
