import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { amazonFetchedAt } from '@/lib/amazon';
import { bolFetchedAt } from '@/lib/bol';
import { getCompareDeal, getCompareDeals } from '@/lib/deals';
import { formatDate, formatEur } from '@/lib/format';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ set: string }> };

const title = (set: string, name: string) => `LEGO ${set} ${name}`;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { set } = await params;
  const deal = getCompareDeal(set);
  if (!deal) return { title: 'Set niet gevonden', robots: { index: false } };
  const best = deal.offers[0];
  const shops = deal.offers.map((o) => o.shop).join(' en ');
  const heading = `${title(deal.set, deal.name)}: prijs vergelijken`;
  const description = `${title(deal.set, deal.name)} kost vanaf ${formatEur(best.price)} bij ${best.shop}. Vergelijk de prijs bij ${shops} in België en klik door naar de goedkoopste shop.`;
  return {
    title: heading,
    description,
    alternates: { canonical: `/set/${deal.set}` },
    openGraph: { title: heading, description, url: `/set/${deal.set}`, type: 'website' },
    twitter: { card: 'summary_large_image', title: heading, description },
  };
}

export default async function SetPage({ params }: Params) {
  const { set } = await params;
  const deal = getCompareDeal(set);
  if (!deal) notFound();
  const best = deal.offers[0];
  const second = deal.offers[1];
  const name = title(deal.set, deal.name);
  const url = `${SITE_URL}/set/${deal.set}`;
  const related = getCompareDeals().filter((d) => d.set !== deal.set).slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${url}#product`,
        name,
        sku: deal.set,
        mpn: deal.set,
        brand: { '@type': 'Brand', name: 'LEGO' },
        ...(deal.image ? { image: [deal.image] } : {}),
        url,
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'EUR',
          lowPrice: best.price.toFixed(2),
          highPrice: deal.offers[deal.offers.length - 1].price.toFixed(2),
          offerCount: deal.offers.length,
          availability: 'https://schema.org/InStock',
          offers: deal.offers.map((o) => ({
            '@type': 'Offer',
            priceCurrency: 'EUR',
            price: o.price.toFixed(2),
            url: o.url,
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'Organization', name: o.shop },
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
          { '@type': 'ListItem', position: 2, name, item: url },
        ],
      },
    ],
  };

  return (
    <div className="wrap page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Kruimelpad" className="crumbs"><Link href="/">Alle deals</Link> / <span>LEGO {deal.set}</span></nav>
      <div className="setpage">
        <div className="setpic">
          {deal.image ? <img src={deal.image} alt={name} referrerPolicy="no-referrer" /> : <span className="none">LEGO {deal.set}</span>}
        </div>
        <div>
          <p className="kicker">LEGO {deal.set}</p>
          <h1>{name}: prijs vergelijken</h1>
          <p className="lead">
            Vanaf <strong>{formatEur(best.price)}</strong> bij {best.shop}
            {second ? (second.price - best.price < 0.005 ? `, zelfde prijs bij ${second.shop}.` : `, ${formatEur(second.price - best.price)} goedkoper dan bij ${second.shop}.`) : '.'}
            {deal.bestDiscount > 0 ? ` Dat is ${deal.bestDiscount}% onder de doorstreepprijs.` : ''}
          </p>
          <table className="cmptable">
            <caption className="sr-only">Prijzen van {name} per shop</caption>
            <thead><tr><th scope="col">Shop</th><th scope="col">Prijs</th><th scope="col">Doorstreepprijs</th><th scope="col"><span className="sr-only">Link</span></th></tr></thead>
            <tbody>
              {deal.offers.map((o, i) => (
                <tr key={o.shop} className={i === 0 ? 'best' : undefined}>
                  <th scope="row">{o.shop}{i === 0 ? <span className="tag">Goedkoopst</span> : null}</th>
                  <td className="price">{formatEur(o.price)}</td>
                  <td className="rrp">{o.strikethrough && o.strikethrough > o.price ? formatEur(o.strikethrough) : ''}</td>
                  <td><a href={o.url} className="btn dark" target="_blank" rel="sponsored noopener" data-affiliate={o.shop.toLowerCase()}>Bekijk bij {o.shop}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="small">
            Prijzen van {formatDate(bolFetchedAt)} (bol) en {formatDate(amazonFetchedAt)} (Amazon) en kunnen intussen veranderd zijn. Controleer de actuele prijs in de shop.
            Reclame: dit zijn affiliate links. Koop je via een link, dan ontvangen wij een commissie van de shop. Voor jou verandert de prijs niet.
          </p>
        </div>
      </div>
      {related.length > 0 ? (
        <section className="sec">
          <h2>Meer LEGO-deals</h2>
          <ul className="relatedlist">
            {related.map((d) => (
              <li key={d.set}><Link href={`/set/${d.set}`}>LEGO {d.set} {d.name}</Link> <span>vanaf {formatEur(d.offers[0].price)}</span></li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
