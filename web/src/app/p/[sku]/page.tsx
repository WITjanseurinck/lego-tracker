import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { dbRead } from '@/lib/supabase';
import { formatEur, formatDate } from '@/lib/format';
import { productImageUrl } from '@/lib/images';
import { PriceChart } from '@/components/PriceChart';
import { StudMeter } from '@/components/StudMeter';
import { slugify } from '@/lib/themes';
import { createAlert, toggleWishlist } from '@/app/actions';
import { getProduct, getOffersAndHistory } from '@/lib/data';
import { isDemo } from '@/lib/demo';
import { SITE_URL } from '@/lib/site';
import { VERTICAL } from '@/verticals';

export const dynamic = 'force-dynamic';

const NOTICES: Record<string, string> = {
  verstuurd: 'Alert aangemaakt. Bevestig je e-mailadres via de link die we sturen.',
  demo: 'Dit is een demo: het alert is niet opgeslagen en er is geen mail verstuurd.',
  ongeldig: 'Controleer je e-mailadres en prijs.',
  fout: 'Het alert kon niet aangemaakt worden. Probeer later opnieuw.',
};

export async function generateMetadata({ params }: { params: Promise<{ sku: string }> }): Promise<Metadata> {
  const { sku } = await params;
  const p = await getProduct(sku);
  if (!p) return {};
  const title = `${VERTICAL.displayName(p.sku, p.name)}: prijs en prijshistoriek`;
  const img = productImageUrl(p.image_path);
  return {
    title,
    description: `Laagste prijs van ${VERTICAL.displayName(p.sku, p.name)} in ${VERTICAL.homeCountryLabel}, met prijsverloop en prijsalert.`,
    alternates: { canonical: `/p/${p.sku}` },
    openGraph: { title, images: img ? [{ url: img }] : undefined },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ sku: string }>;
  searchParams: Promise<{ alert?: string }>;
}) {
  const { sku } = await params;
  const { alert } = await searchParams;
  const product = await getProduct(sku);
  if (!product) notFound();

  const { offers, points } = await getOffersAndHistory(product);
  const inStock = offers.filter((o) => o.in_stock);
  const best = inStock[0] ?? null;
  const rrp = product.rrp_eur ? Number(product.rrp_eur) : null;
  const lowest = points.length ? Math.min(...points.map((p) => p.price)) : null;
  const disc = best && rrp ? Math.round(((rrp - best.price_eur) / rrp) * 100) : null;

  const jar = await cookies();
  let onWishlist = false;
  if (isDemo) {
    onWishlist = (jar.get('wishlist_demo')?.value ?? '').split(',').includes(product.sku);
  } else {
    const token = jar.get('wishlist')?.value;
    if (token) {
      const { data } = await dbRead()
        .from('wishlist_items').select('product_id').eq('token', token).eq('product_id', product.id).maybeSingle();
      onWishlist = Boolean(data);
    }
  }

  const img = productImageUrl(product.image_path);
  const name = VERTICAL.displayName(product.sku, product.name);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    sku: product.sku,
    gtin13: product.ean ?? undefined,
    brand: { '@type': 'Brand', name: product.brand ?? VERTICAL.brand },
    image: img ? [img.startsWith('/') ? `${SITE_URL}${img}` : img] : undefined,
    offers: inStock.length
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: 'EUR',
          lowPrice: Math.min(...inStock.map((o) => Number(o.price_eur))),
          highPrice: Math.max(...inStock.map((o) => Number(o.price_eur))),
          offerCount: inStock.length,
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/p/${product.sku}`,
        }
      : undefined,
  };

  return (
    <div className="wrap page" style={{ paddingTop: 32 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="crumbs" aria-label="Kruimelpad">
        <Link href="/">Selectie</Link> / {product.category ? <Link href={`/thema/${slugify(product.category)}`}>{product.category}</Link> : VERTICAL.label} / {product.sku}
      </nav>

      <div className="cols">
        <div>
          <div className="photo2">
            {img ? <img src={img} alt={name} /> : null}
            {lowest && best && best.price_eur <= lowest ? <span className="flag" style={{ left: 20, top: 20 }}>Laagste prijs ooit</span> : null}
          </div>

          <h2 className="h2" id="prijsverloop">Prijsverloop</h2>
          <p className="lead" style={{ margin: '0 0 28px' }}>
            De laagste prijs bij alle shops. De lijn springt enkel als een prijs echt verandert.
          </p>
          <PriceChart points={points} rrp={rrp} />

          <h2 className="h2">Shops in {VERTICAL.homeCountryLabel}</h2>
          <div role="table" aria-label="Prijzen per shop" style={{ borderTop: '1px solid var(--ink)', marginTop: 20 }}>
            {offers.map((o) => (
              <div className="srow" role="row" key={o.id}>
                <div role="cell">
                  <div className="shop">{o.shop.name}</div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
                    {o.in_stock ? 'Op voorraad' : 'Uitverkocht'} · bijgewerkt {formatDate(o.last_seen_at)}
                  </div>
                </div>
                <div role="cell" className="p">{formatEur(o.price_eur)}</div>
                <div role="cell" className="muted" style={{ fontSize: 14 }}>
                  {best && o.id === best.id ? 'Laagste prijs' : best ? `${formatEur(o.price_eur - best.price_eur)} duurder` : ''}
                </div>
                <a
                  role="cell"
                  className={best && o.id === best.id ? 'btn dark' : 'btn'}
                  href={o.affiliate_url ?? o.product_url}
                  rel="sponsored noopener"
                  target={o.product_url === '#' ? undefined : '_blank'}
                >
                  Naar shop
                </a>
              </div>
            ))}
          </div>
        </div>

        <aside className="buy">
          <div>
            <div className="muted">{VERTICAL.metaLine({ sku: product.sku, category: product.category, attrs: product.attrs ?? {} })}</div>
            <h1>{product.name}</h1>
          </div>

          {best ? (
            <div>
              <div className="muted">Laagste prijs nu, {best.shop.name}</div>
              <div className="pr">
                <span className="price">{formatEur(best.price_eur)}</span>
                {rrp ? <span className="rrp">{formatEur(rrp)}</span> : null}
                {disc ? <span className="disc">-{disc}%</span> : null}
              </div>
              <StudMeter price={best.price_eur} low={lowest} rrp={rrp} />
            </div>
          ) : (
            <div className="empty">Op dit moment nergens op voorraad.</div>
          )}

          {best ? (
            <a className="btn dark" style={{ padding: '20px 24px', fontSize: 17 }} href={best.affiliate_url ?? best.product_url} rel="sponsored noopener">
              Bekijk bij {best.shop.name}
            </a>
          ) : null}

          {alert && NOTICES[alert] ? <div className="notice">{NOTICES[alert]}</div> : null}

          <section className="panel">
            <h2>Prijsalert</h2>
            <p>Je krijgt een mail zodra deze {VERTICAL.productNoun} onder jouw prijs zakt.</p>
            <form action={createAlert}>
              <input type="hidden" name="sku" value={product.sku} />
              <label htmlFor="em">E-mailadres</label>
              <input id="em" type="email" name="email" placeholder="jouw@email.be" required />
              <label htmlFor="tp">Mail me onder (€)</label>
              <input id="tp" type="number" name="target" step="0.01" min="1" placeholder="65" required />
              <button type="submit" className="btn" style={{ marginTop: 8, padding: '16px 28px' }}>Alert zetten</button>
            </form>
          </section>

          <form action={toggleWishlist}>
            <input type="hidden" name="sku" value={product.sku} />
            <button type="submit" className="wish">{onWishlist ? 'Van verlanglijst halen' : 'Op verlanglijst zetten'}</button>
          </form>
        </aside>
      </div>
    </div>
  );
}
