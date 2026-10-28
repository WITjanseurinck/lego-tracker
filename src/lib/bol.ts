import data from '../../data/products.json';

export interface BolDeal {
  set: string;
  name: string;
  price: number;
  strikethrough: number | null;
  seller: string | null;
  stock?: 'out';
  url: string;
  image: string;
  bolId: string;
  theme?: string;
  pieces?: number;
  age?: number;
}

// Het SiteId staat ook in elke publieke link, het is dus geen geheim.
const SITE_ID = process.env.BOL_SITE_ID || '1550851';

/** Officiele bol-trackinglink. f=txl is voor handmatig samengestelde tekstlinks. */
export function bolAffiliateUrl(productUrl: string, subId = 'home'): string {
  const u = new URL(productUrl);
  if (u.protocol !== 'https:' || !(u.hostname === 'bol.com' || u.hostname.endsWith('.bol.com'))) return productUrl;
  return `https://partner.bol.com/click/click?&t=url&s=${encodeURIComponent(SITE_ID)}&url=${encodeURIComponent(productUrl)}&f=txl&subid=${encodeURIComponent(subId)}`;
}

export const bolFetchedAt: string = data.fetchedAt;

/** Enkel echte LEGO-sets: titel bevat een setnummer en geen "compatibel"-achtige woorden. */
export function getBolDeals(): BolDeal[] {
  const bad = /compatibel|compatible|kompatibel|bouwstenen|blokken|alternatief/i;
  const items = data.items as BolDeal[];
  return items.filter((d) => /^\d{4,6}$/.test(d.set) && !bad.test(d.name) && d.url.startsWith('https://www.bol.com/'));
}
