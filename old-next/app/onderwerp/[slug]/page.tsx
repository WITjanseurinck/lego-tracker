import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CompareCard } from '@/components/CompareCard';
import { getDict2, themeName } from '@/lib/dict2';
import { formatEur } from '@/lib/format';
import { getI18n } from '@/lib/i18n-server';
import { localizePath, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { photoTint } from '@/lib/themes';
import { TOPICS, TOPIC_KEYS, dealsByTopic, isTopic } from '@/lib/topics';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ thema?: string }> };

const ALL: Record<Locale, string> = { nl: 'Alle', fr: 'Tous', en: 'All' };
const otherWord: Record<Locale, string> = { nl: 'Andere onderwerpen', fr: 'Autres sujets', en: 'Other topics' };
const title = (n: string, l: Locale) =>
  ({ nl: `LEGO ${n}: prijzen vergelijken bij de Belgische webshops`, fr: `LEGO ${n} : comparer les prix dans les boutiques en ligne belges`, en: `LEGO ${n}: compare prices at Belgian web shops` })[l];
const desc = (n: string, c: number, from: string, l: Locale) =>
  ({
    nl: `${c} LEGO-sets rond ${n.toLowerCase()} met de prijzen van de Belgische webshops naast elkaar, vanaf ${from}. Zie meteen waar elke set het goedkoopst is.`,
    fr: `${c} sets LEGO autour du thème « ${n.toLowerCase()} » avec les prix des boutiques en ligne belges côte à côte, dès ${from}. Voyez tout de suite où chaque set est le moins cher.`,
    en: `${c} LEGO sets about ${n.toLowerCase()} with the prices of the Belgian web shops side by side, from ${from}. See at once where each set is cheapest.`,
  })[l];

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { thema } = await searchParams;
  const { locale } = await getI18n();
  if (!isTopic(slug)) return { title: '404', robots: { index: false } };
  const deals = dealsByTopic(slug);
  if (deals.length === 0) return { title: '404', robots: { index: false } };
  const n = TOPICS[slug].name[locale];
  const from = formatEur(Math.min(...deals.map((d) => d.offers[0].price)), locale);
  return pageMeta({ locale, path: `/onderwerp/${slug}`, title: title(n, locale), description: desc(n, deals.length, from, locale), noindex: !!thema });
}

export default async function OnderwerpPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { thema } = await searchParams;
  const { locale, href } = await getI18n();
  if (!isTopic(slug)) notFound();
  const all = dealsByTopic(slug);
  if (all.length === 0) notFound();
  const t2 = getDict2(locale);
  const copy = TOPICS[slug];
  const n = copy.name[locale];
  const eur = (x: number) => formatEur(x, locale);

  // Themakeuze bovenaan: enkel reeksen die in dit onderwerp voorkomen, grootste eerst.
  const counts = new Map<string, number>();
  for (const d of all) counts.set(d.theme, (counts.get(d.theme) ?? 0) + 1);
  const themes = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const active = thema && counts.has(thema) ? thema : null;
  const deals = active ? all.filter((d) => d.theme === active) : all;
  const sorted = [...deals].sort((a, b) => a.offers[0].price - b.offers[0].price);
  const base = `/onderwerp/${slug}`;
  const url = `${SITE_URL}${localizePath(locale, base)}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: title(n, locale),
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

  return (
    <div className="wrap page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="crumbs"><Link href={href('/')}>{SITE_NAME}</Link> / <span>{n}</span></nav>
      <h1>{copy.h1[locale]}</h1>
      <p className="lead">{copy.lead[locale]}</p>
      <ul className="chips" style={{ marginTop: 20 }}>
        <li><Link href={href(base)} className={active ? undefined : 'on'}>{ALL[locale]} ({all.length})</Link></li>
        {themes.map(([k, c]) => (
          <li key={k}><Link href={href(`${base}?thema=${k}`)} className={active === k ? 'on' : undefined}>{themeName(k, locale)} ({c})</Link></li>
        ))}
      </ul>
      <p className="muted" style={{ marginTop: 16 }}>{t2.themeCount(sorted.length, eur(sorted[0].offers[0].price), eur(sorted[sorted.length - 1].offers[0].price))}</p>
      <div className="grid" style={{ marginTop: 24 }}>
        {sorted.map((d, i) => <CompareCard key={d.set} deal={d} tint={photoTint(i)} locale={locale} />)}
      </div>
      <section className="sec">
        <h2>{otherWord[locale]}</h2>
        <ul className="chips">
          {TOPIC_KEYS.filter((k) => k !== slug).map((k) => <li key={k}><Link href={href(`/onderwerp/${k}`)}>{TOPICS[k].name[locale]}</Link></li>)}
          <li><Link href={href('/themas')}>{t2.allThemes}</Link></li>
          <li><Link href={href('/kiezen')}>{t2.finder.nav}</Link></li>
        </ul>
      </section>
    </div>
  );
}
