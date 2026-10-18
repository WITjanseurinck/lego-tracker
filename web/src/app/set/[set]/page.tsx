import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { amazonFetchedAt } from '@/lib/amazon';
import { bolFetchedAt } from '@/lib/bol';
import { getCompareDeal, relatedByPrice } from '@/lib/deals';
import { CompareCard } from '@/components/CompareCard';
import { getDict2, themeName } from '@/lib/dict2';
import { photoTint } from '@/lib/themes';
import { formatDate, formatEur } from '@/lib/format';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { getI18n } from '@/lib/i18n-server';
import { pageMeta } from '@/lib/seo';
import { shopDates } from '@/lib/dict';
import { localizePath } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ set: string }> };

const title = (set: string, name: string) => `LEGO ${set} ${name}`;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { set } = await params;
  const { locale, t, tag } = await getI18n();
  const deal = getCompareDeal(set);
  if (!deal) return { title: t.set.notFound, robots: { index: false } };
  const best = deal.offers[0];
  const shops = deal.offers.map((o) => o.shop).join(` ${t.set.and} `);
  const heading = t.set.heading(title(deal.set, deal.name));
  const description = t.set.desc(title(deal.set, deal.name), formatEur(best.price, locale), best.shop, shops);
  void tag;
  return pageMeta({ locale, path: `/set/${deal.set}`, title: heading, description, og: { set: deal.set } });
}

export default async function SetPage({ params }: Params) {
  const { set } = await params;
  const { locale, t, href, tag } = await getI18n();
  const eur = (n: number) => formatEur(n, locale);
  const deal = getCompareDeal(set);
  if (!deal) notFound();
  const best = deal.offers[0];
  const second = deal.offers[1];
  const name = title(deal.set, deal.name);
  const url = `${SITE_URL}${localizePath(locale, `/set/${deal.set}`)}`;
  const related = relatedByPrice(deal);
  const t2 = getDict2(locale);

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
        inLanguage: tag,
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
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}${localizePath(locale, '/')}`.replace(/\/$/, '') },
          { '@type': 'ListItem', position: 2, name, item: url },
        ],
      },
    ],
  };

  return (
    <div className="wrap page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label={t.set.crumbAria} className="crumbs"><Link href={href('/')}>{t.set.crumbAll}</Link> / <span>LEGO {deal.set}</span></nav>
      <div className="setpage">
        <div className="setpic">
          {deal.image ? <img src={deal.image} alt={name} referrerPolicy="no-referrer" /> : <span className="none">LEGO {deal.set}</span>}
        </div>
        <div>
          <p className="kicker">LEGO {deal.set}{deal.theme !== 'overig' ? <> · <Link href={href(`/thema/${deal.theme}`)}>{themeName(deal.theme, locale)}</Link></> : null}</p>
          <h1>{t.set.heading(name)}</h1>
          <p className="lead">
            {t.set.leadA}<strong>{eur(best.price)}</strong>{t.set.leadB(best.shop)}
            {second ? (second.price - best.price < 0.005 ? t.set.tailSame(second.shop) : t.set.tailDiff(eur(second.price - best.price), second.shop)) : t.set.tailNone}
            {deal.bestDiscount > 0 ? t.set.discount(deal.bestDiscount) : ''}
          </p>
          <table className="cmptable">
            <caption className="sr-only">{t.set.caption(name)}</caption>
            <thead><tr><th scope="col">{t.set.thShop}</th><th scope="col">{t.set.thPrice}</th><th scope="col">{t.set.thStrike}</th><th scope="col"><span className="sr-only">{t.set.thLink}</span></th></tr></thead>
            <tbody>
              {deal.offers.map((o, i) => (
                <tr key={o.shop} className={i === 0 && (deal.offers.length < 2 || deal.offers[1].price - deal.offers[0].price >= 0.005) ? 'best' : undefined}>
                  <th scope="row">{o.shop}{i === 0 && second && second.price - best.price >= 0.005 ? <span className="tag">{t.set.cheapest}</span> : null}</th>
                  <td className="price">{eur(o.price)}</td>
                  <td className="rrp">{o.strikethrough && o.strikethrough > o.price ? eur(o.strikethrough) : ''}</td>
                  <td><a href={o.url} className="btn dark" target="_blank" rel="sponsored noopener" data-affiliate={o.shop.toLowerCase()}>{t.set.viewAt(o.shop)}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="small">{t.set.note(shopDates(locale, formatDate(bolFetchedAt, locale), formatDate(amazonFetchedAt, locale)))}</p>
        </div>
      </div>
      {related.length > 0 ? (
        <section className="sec">
          <h2>{t2.related.title}</h2>
          <p className="lead">{t2.related.intro}</p>
          <div className="grid related3">
            {related.map((r, i) => (
              <div key={r.deal.set}>
                <p className="relkind">{t2.related[r.kind]}</p>
                <CompareCard deal={r.deal} tint={photoTint(i)} locale={locale} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
