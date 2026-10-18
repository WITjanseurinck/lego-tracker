import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { StudMeter } from '@/components/StudMeter';
import { CompareCard } from '@/components/CompareCard';
import { amazonFetchedAt } from '@/lib/amazon';
import { bolFetchedAt } from '@/lib/bol';
import { getCompareDeals } from '@/lib/deals';
import { isDemo } from '@/lib/demo';
import { getArticles, getDeals, getThemes } from '@/lib/data';
import { formatDate, formatEur } from '@/lib/format';
import { productImageUrl } from '@/lib/images';
import { photoTint } from '@/lib/themes';
import { VERTICAL } from '@/verticals';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [{ deals, error }, articles, themes] = await Promise.all([getDeals(), getArticles(3), getThemes()]);
  const compare = isDemo || deals.length === 0 ? getCompareDeals() : [];
  const useBol = compare.length > 0;
  const [first, ...rest] = useBol ? [] : deals;
  const hero = compare.find((d) => d.image && d.offers.length > 1 && d.bestDiscount <= 45) ?? compare[0];
  const gridDeals = compare.filter((d) => d !== hero);
  const firstImg = first ? productImageUrl(first.image_path) : null;
  const disc = first?.discount_pct ? Math.round(Number(first.discount_pct)) : null;

  return (
    <>
      {useBol && hero ? (
        <section className="hero">
          <div className="grid2">
            <div className="text">
              <div className="kicker">Prijsvergelijking van vandaag · {hero.set}</div>
              <h1>{hero.name}</h1>
              <ul className="offers heroOffers">
                {hero.offers.map((o, i) => (
                  <li key={o.shop} className={i === 0 ? 'best' : undefined}>
                    <span className="shop">{o.shop}</span>
                    <span className="price">{formatEur(o.price)}</span>
                    {o.strikethrough && o.strikethrough > o.price ? <span className="rrp">{formatEur(o.strikethrough)}</span> : null}
                    <a href={o.url} className="btn dark" target="_blank" rel="sponsored noopener" data-affiliate={o.shop.toLowerCase()}>Bekijk bij {o.shop}</a>
                  </li>
                ))}
              </ul>
              <div className="cta"><Link href="/zoeken" className="btn">Zoek een {VERTICAL.productNoun}</Link></div>
            </div>
            <div className="photo">{hero.image ? <img src={hero.image} alt={`LEGO ${hero.set} ${hero.name}`} referrerPolicy="no-referrer" /> : null}</div>
          </div>
        </section>
      ) : first ? (
        <section className="hero">
          <div className="grid2">
            <div className="text">
              <div className="kicker">Selectie van vandaag{first.category ? ` · ${first.category}` : ''}</div>
              <h1>{first.name}</h1>
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
              <h2>LEGO-deals vergeleken</h2>
              <p className="lead">Dezelfde set bij bol en Amazon naast elkaar, de goedkoopste bovenaan. Prijzen van {formatDate(bolFetchedAt)} (bol) en {formatDate(amazonFetchedAt)} (Amazon), controleer de actuele prijs in de shop.</p>
            </div>
          </div>
          <div className="grid">{gridDeals.map((d, i) => <CompareCard key={d.set} deal={d} tint={photoTint(i + 1)} />)}</div>
          <p className="lead" style={{ marginTop: 32 }}>Reclame: dit zijn affiliate links. Koop je via een link, dan ontvangen wij een commissie van bol of Amazon. Voor jou verandert de prijs niet.</p>
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
            <h2>Wacht tot jouw set zakt</h2>
            <p>Open een set, kies een prijs en je krijgt een mail zodra een shop eronder zit. Geen account nodig.</p>
          </div>
          <Link href="/zoeken" className="btn dark">Kies een {VERTICAL.productNoun}</Link>
        </div>
      </section>

      {articles.length > 0 ? (
        <section className="wrap sec" style={{ paddingBottom: 120 }}>
          <div className="sechead"><h2>Nieuws en uitleg</h2><Link href="/nieuws">Alle artikels</Link></div>
          <div className="news">
            {articles.map((a, i) => (
              <article className="art" key={a.slug}>
                <Link href={`/nieuws/${a.slug}`}>
                  <div className="pic" style={{ background: photoTint(i + 2) }}>
                    {a.hero_image_url ? <img src={productImageUrl(a.hero_image_url) ?? a.hero_image_url} alt="" loading="lazy" /> : null}
                  </div>
                  <p className="date">{a.published_at ? formatDate(a.published_at) : ''}</p>
                  <h3>{a.title}</h3>
                </Link>
                <p className="s">{a.summary}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
