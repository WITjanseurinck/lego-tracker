import type { Metadata } from 'next';
import Link from 'next/link';
import { CompareCard } from '@/components/CompareCard';
import { amazonFetchedAt } from '@/lib/amazon';
import { bolFetchedAt } from '@/lib/bol';
import { getCompareDeal, getCompareDeals } from '@/lib/deals';
import { allArticles, articleHeroSet } from '@/lib/articles';
import { getI18n } from '@/lib/i18n-server';
import { pageMeta } from '@/lib/seo';
import { shopDates } from '@/lib/dict';
import { localizePath } from '@/lib/i18n';
import { formatDate, formatEur } from '@/lib/format';
import { photoTint } from '@/lib/themes';
import { THEMES, getDict2, themeName } from '@/lib/dict2';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return pageMeta({ locale, path: '/', title: t.home.metaTitle, absoluteTitle: true, description: t.home.metaDesc });
}

export default async function Home() {
  const { locale, t, href } = await getI18n();
  const articles = allArticles().slice(0, 3);
  const eur = (n: number) => formatEur(n, locale);
  const compare = getCompareDeals();
  const priceGap = (d: (typeof compare)[number]) => d.offers.length > 1 && d.offers[1].price - d.offers[0].price > 0.005;
  const hero =
    compare.find((d) => d.image && priceGap(d) && d.bestDiscount <= 45 && d.name.length <= 40 && d.offers[0].price >= 60 && ['technic', 'speed-champions', 'icons', 'creator'].includes(d.theme)) ??
    compare.find((d) => d.image && priceGap(d) && d.bestDiscount <= 45 && d.name.length <= 40) ??
    compare.find((d) => d.image && d.offers.length > 1 && d.bestDiscount <= 45) ??
    compare[0];
  const gridDeals = compare.filter((d) => d !== hero).slice(0, 24);
  const t2 = getDict2(locale);
  const themeCount = (k: string) => compare.filter((d) => d.theme === k).length;
  const themeKeys = Object.keys(THEMES).filter((k) => k !== 'overig' && themeCount(k) > 0).sort((a, b) => themeCount(b) - themeCount(a)).slice(0, 16);

  const itemList = compare.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: t.home.itemListName,
        itemListElement: compare.slice(0, 24).map((d, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}${localizePath(locale, `/set/${d.set}`)}`,
          name: `LEGO ${d.set} ${d.name}`,
        })),
      }
    : null;

  return (
    <>
      <h1 className="sr-only">{t.home.h1}</h1>
      {itemList ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} /> : null}
      {hero ? (
        <section className="hero">
          <div className="grid2">
            <div className="text">
              <div className="kicker">{t.home.kicker} · {hero.set}</div>
              <h2 className="title"><Link href={href(`/set/${hero.set}`)}>{hero.name}</Link></h2>
              <ul className="offers heroOffers">
                {hero.offers.map((o, i) => (
                  <li key={o.shop} className={i === 0 && (hero.offers.length < 2 || hero.offers[1].price - hero.offers[0].price >= 0.005) ? 'best' : undefined}>
                    <a href={o.url} className="pill" target="_blank" rel="sponsored noopener" data-affiliate={o.shop.toLowerCase()}>
                      <span className="shop">{o.shop}</span>
                      <span className="price">{eur(o.price)}</span>
                      <span className="rrp">{o.strikethrough && o.strikethrough > o.price ? eur(o.strikethrough) : ''}</span>
                      <span className="btn dark">{t.home.viewAt(o.shop)}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="cta"><Link href={href('/zoeken')} className="btn">{t.home.searchCta}</Link></div>
            </div>
            <div className="photo">{hero.image ? <img src={hero.image} alt={`LEGO ${hero.set} ${hero.name}`} referrerPolicy="no-referrer" /> : null}</div>
          </div>
        </section>
      ) : null}

      {themeKeys.length > 0 ? (
        <section className="wrap" style={{ paddingTop: 40 }}>
          <h2 className="sr-only">{t2.themeNav}</h2>
          <ul className="chips">
            {themeKeys.map((k) => <li key={k}><Link href={href(`/thema/${k}`)}>{themeName(k, locale)}</Link></li>)}
            <li><Link href={href('/kiezen')} className="on">{t2.finder.nav} →</Link></li>
          </ul>
        </section>
      ) : null}

      {gridDeals.length > 0 ? (
        <section className="wrap sec">
          <div className="sechead">
            <div>
              <h2>{t.home.sectionTitle}</h2>
              <p className="lead">{t.home.sectionLead(shopDates(locale, formatDate(bolFetchedAt, locale), formatDate(amazonFetchedAt, locale)))}</p>
            </div>
          </div>
          <div className="grid">{gridDeals.map((d, i) => <CompareCard key={d.set} deal={d} tint={photoTint(i + 1)} locale={locale} />)}</div>
          <p style={{ marginTop: 32 }}><Link href={href('/kiezen')} className="btn dark">{t2.finder.nav} →</Link></p>
          <p className="lead" style={{ marginTop: 32 }}>{t.home.disclosure}</p>
        </section>
      ) : null}

      <section className="band">
        <div className="wrap">
          <div>
            <h2>{t.home.bandTitle}</h2>
            <p>{t.home.bandText}</p>
          </div>
          <Link href={href('/gids')} className="btn dark">{t.home.bandButton}</Link>
        </div>
      </section>

      {articles.length > 0 ? (
        <section className="wrap sec" style={{ paddingBottom: 120 }}>
          <div className="sechead"><h2>{t.home.guidesTitle}</h2><Link href={href('/gids')}>{t.home.allGuides}</Link></div>
          <div className="news">
            {articles.map((a, i) => (
              <article className="art" key={a.id}>
                <Link href={href(`/gids/${a.text[locale].slug}`)}>
                  <div className="pic" style={{ background: photoTint(i + 2) }}>
                    {(() => {
                      const d = getCompareDeal(articleHeroSet(a) ?? '');
                      return d?.image ? <img src={d.image} alt={`LEGO ${d.set} ${d.name}`} loading="lazy" referrerPolicy="no-referrer" /> : null;
                    })()}
                  </div>
                  <p className="date">{formatDate(a.published, locale)}</p>
                  <h3>{a.text[locale].title}</h3>
                </Link>
                <p className="s">{a.text[locale].summary}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
