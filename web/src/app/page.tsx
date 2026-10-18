import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { StudMeter } from '@/components/StudMeter';
import { CompareCard } from '@/components/CompareCard';
import { amazonFetchedAt } from '@/lib/amazon';
import { bolFetchedAt } from '@/lib/bol';
import { getCompareDeals } from '@/lib/deals';
import { isDemo } from '@/lib/demo';
import { getDeals, getThemes } from '@/lib/data';
import { allArticles } from '@/lib/articles';
import { getI18n } from '@/lib/i18n-server';
import { pageMeta } from '@/lib/seo';
import { shopDates } from '@/lib/dict';
import { localizePath } from '@/lib/i18n';
import { formatDate, formatEur } from '@/lib/format';
import { productImageUrl } from '@/lib/images';
import { photoTint } from '@/lib/themes';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { VERTICAL } from '@/verticals';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return pageMeta({ locale, path: '/', title: t.home.metaTitle, absoluteTitle: true, description: t.home.metaDesc });
}

export default async function Home() {
  const { locale, t, href } = await getI18n();
  const [{ deals, error }, themes] = await Promise.all([getDeals(), getThemes()]);
  const articles = allArticles().slice(0, 3);
  const eur = (n: number) => formatEur(n, locale);
  const compare = isDemo || deals.length === 0 ? getCompareDeals() : [];
  const useBol = compare.length > 0;
  const [first, ...rest] = useBol ? [] : deals;
  const priceGap = (d: (typeof compare)[number]) => d.offers.length > 1 && d.offers[1].price - d.offers[0].price > 0.005;
  const hero =
    compare.find((d) => d.image && priceGap(d) && d.bestDiscount <= 45 && d.name.length <= 40) ??
    compare.find((d) => d.image && d.offers.length > 1 && d.bestDiscount <= 45) ??
    compare[0];
  const gridDeals = compare.filter((d) => d !== hero);
  const firstImg = first ? productImageUrl(first.image_path) : null;
  const disc = first?.discount_pct ? Math.round(Number(first.discount_pct)) : null;

  const itemList = useBol
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
      {useBol && hero ? (
        <section className="hero">
          <div className="grid2">
            <div className="text">
              <div className="kicker">{t.home.kicker} · {hero.set}</div>
              <h2 className="title"><Link href={href(`/set/${hero.set}`)}>{hero.name}</Link></h2>
              <ul className="offers heroOffers">
                {hero.offers.map((o, i) => (
                  <li key={o.shop} className={i === 0 && (hero.offers.length < 2 || hero.offers[1].price - hero.offers[0].price >= 0.005) ? 'best' : undefined}>
                    <span className="shop">{o.shop}</span>
                    <span className="price">{eur(o.price)}</span>
                    {o.strikethrough && o.strikethrough > o.price ? <span className="rrp">{eur(o.strikethrough)}</span> : null}
                    <a href={o.url} className="btn dark" target="_blank" rel="sponsored noopener" data-affiliate={o.shop.toLowerCase()}>{t.home.viewAt(o.shop)}</a>
                  </li>
                ))}
              </ul>
              <div className="cta"><Link href={href('/zoeken')} className="btn">{t.home.searchCta}</Link></div>
            </div>
            <div className="photo">{hero.image ? <img src={hero.image} alt={`LEGO ${hero.set} ${hero.name}`} referrerPolicy="no-referrer" /> : null}</div>
          </div>
        </section>
      ) : first ? (
        <section className="hero">
          <div className="grid2">
            <div className="text">
              <div className="kicker">Selectie van vandaag{first.category ? ` · ${first.category}` : ''}</div>
              <h2 className="title">{first.name}</h2>
              <div className="pr">
                <span className="price">{formatEur(first.price_eur)}</span>
                {first.rrp_eur ? <span className="rrp">{formatEur(first.rrp_eur)}</span> : null}
                {disc ? <span className="disc">-{disc}%</span> : null}
              </div>
              <div className="m">
                <StudMeter price={Number(first.price_eur)} low={first.lowest_eur ?? null} rrp={first.rrp_eur ? Number(first.rrp_eur) : null} />
              </div>
              <div className="cta">
                <Link href={`/p/${first.sku}`} className="btn dark">Bekijk de prijzen</Link>
                <Link href="/zoeken" className="btn">Zoek een {VERTICAL.productNoun}</Link>
              </div>
            </div>
            <div className="photo">{firstImg ? <img src={firstImg} alt={first.name} /> : null}</div>
          </div>
        </section>
      ) : (
        <div className="wrap page">
          {error ? <div className="notice">De deals konden niet geladen worden.</div> : <div className="empty">Nog geen deals. Draai de ingest-worker om prijzen binnen te halen.</div>}
        </div>
      )}

      {useBol && gridDeals.length > 0 ? (
        <section className="wrap sec">
          <div className="sechead">
            <div>
              <h2>{t.home.sectionTitle}</h2>
              <p className="lead">{t.home.sectionLead(shopDates(locale, formatDate(bolFetchedAt, locale), formatDate(amazonFetchedAt, locale)))}</p>
            </div>
          </div>
          <div className="grid">{gridDeals.map((d, i) => <CompareCard key={d.set} deal={d} tint={photoTint(i + 1)} locale={locale} />)}</div>
          <p className="lead" style={{ marginTop: 32 }}>{t.home.disclosure}</p>
        </section>
      ) : null}

      {!useBol && themes.length > 0 ? (
        <section className="wrap sec">
          <div className="sechead"><h2>Kies een thema</h2><Link href="/themas">Alle thema’s</Link></div>
          <div className="themes">
            {themes.slice(0, 8).map((t) => (
              <Link key={t.slug} href={`/thema/${t.slug}`} className="theme" style={{ background: t.bg, color: t.fg }}>
                <span className="c">{t.count} {t.count === 1 ? VERTICAL.productNoun : VERTICAL.productNounPlural}</span>
                <span className="tn">{t.name}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {!useBol && rest.length > 0 ? (
        <section className="wrap sec">
          <div className="sechead">
            <div>
              <h2>De selectie van vandaag</h2>
              <p className="lead">Sets die vandaag het verst onder hun adviesprijs staan. De noppenrij toont waar de prijs zit tussen de laagste prijs ooit (links) en de adviesprijs (rechts).</p>
            </div>
          </div>
          <div className="grid">{rest.map((p, i) => <ProductCard key={p.sku} product={p} tint={photoTint(i + 1)} />)}</div>
        </section>
      ) : null}

      <section className="band">
        <div className="wrap">
          <div>
            <h2>{useBol ? t.home.bandTitle : 'Wacht tot jouw set zakt'}</h2>
            <p>{useBol ? t.home.bandText : 'Open een set, kies een prijs en je krijgt een mail zodra een shop eronder zit. Geen account nodig.'}</p>
          </div>
          <Link href={useBol ? href('/gids') : href('/zoeken')} className="btn dark">{useBol ? t.home.bandButton : `Kies een ${VERTICAL.productNoun}`}</Link>
        </div>
      </section>

      {articles.length > 0 ? (
        <section className="wrap sec" style={{ paddingBottom: 120 }}>
          <div className="sechead"><h2>{t.home.guidesTitle}</h2><Link href={href('/gids')}>{t.home.allGuides}</Link></div>
          <div className="news">
            {articles.map((a, i) => (
              <article className="art" key={a.id}>
                <Link href={href(`/gids/${a.text[locale].slug}`)}>
                  <div className="pic" style={{ background: photoTint(i + 2) }} />
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
