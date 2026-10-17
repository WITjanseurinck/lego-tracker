import type { FeedAdapter, Vertical } from './types.js';
import { bolAdapter } from './adapters/bol.js';
import { csvFeedAdapter } from './adapters/csvFeed.js';

/**
 * Welke feeds actief zijn hangt af van de env-variabelen. Een shop zonder feed-URL
 * wordt overgeslagen. De index laat daarna enkel de shops door die in de database actief
 * zijn en bij een land van de vertical horen.
 *
 * De kolomnamen zijn typische Awin-namen. Controleer ze tegen de echte feed van elke
 * shop (eerste regel van de CSV).
 */
const awinColumns = {
  title: 'product_name',
  price: 'search_price',
  productUrl: 'merchant_deep_link',
  affiliateUrl: 'aw_deep_link',
  ean: 'ean',
  stock: 'in_stock',
  image: 'merchant_image_url',
  rrp: 'rrp_price',
};

const awinShops = [
  { slug: 'lego-be', env: 'FEED_LEGO_BE' },
  { slug: 'mediamarkt-be', env: 'FEED_MEDIAMARKT_BE' },
  { slug: 'dreamland', env: 'FEED_DREAMLAND' },
  { slug: 'fun', env: 'FEED_FUN' },
  { slug: 'smyths-be', env: 'FEED_SMYTHS_BE' },
  { slug: 'mediamarkt-nl', env: 'FEED_MEDIAMARKT_NL' },
];

const daisyconShops = [
  { slug: 'intertoys', env: 'FEED_INTERTOYS' },
  { slug: 'bart-smit', env: 'FEED_BART_SMIT' },
];

export function buildAdapters(vertical: Vertical): FeedAdapter[] {
  const adapters: FeedAdapter[] = [];
  const { BOL_CLIENT_ID, BOL_CLIENT_SECRET, BOL_SITE_ID } = process.env;

  if (BOL_CLIENT_ID && BOL_CLIENT_SECRET && BOL_SITE_ID) {
    for (const [shopSlug, countryCode] of [['bol-be', 'BE'], ['bol-nl', 'NL']] as const) {
      adapters.push(
        bolAdapter({
          clientId: BOL_CLIENT_ID,
          clientSecret: BOL_CLIENT_SECRET,
          siteId: BOL_SITE_ID,
          shopSlug,
          countryCode,
          searchTerm: vertical.searchTerm,
          subId: vertical.id,
        }),
      );
    }
  }

  for (const s of awinShops) {
    const url = process.env[s.env];
    if (url) adapters.push(csvFeedAdapter({ shopSlug: s.slug, url, columns: awinColumns }));
  }

  for (const s of daisyconShops) {
    const url = process.env[s.env];
    if (url) {
      adapters.push(
        csvFeedAdapter({
          shopSlug: s.slug,
          url,
          delimiter: ';',
          columns: {
            title: 'title',
            price: 'price',
            productUrl: 'link',
            affiliateUrl: 'link',
            ean: 'ean',
            stock: 'stock',
            image: 'image_link',
          },
        }),
      );
    }
  }

  return adapters;
}
