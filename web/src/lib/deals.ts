import { amazonAffiliateUrl, getAmazonDeals } from '@/lib/amazon';
import { bolAffiliateUrl, getBolDeals } from '@/lib/bol';

export interface ShopOffer {
  shop: 'bol' | 'Amazon';
  price: number;
  strikethrough: number | null;
  url: string;
}

export interface CompareDeal {
  set: string;
  name: string;
  image: string | null;
  offers: ShopOffer[]; // gesorteerd op prijs, goedkoopste eerst
  bestDiscount: number; // in procent, t.o.v. de hoogste doorstreepprijs
}

/** Voegt de aanbiedingen van bol en Amazon samen per setnummer. */
export function getCompareDeals(): CompareDeal[] {
  const map = new Map<string, CompareDeal>();
  const get = (set: string, name: string, image: string | null) => {
    let d = map.get(set);
    if (!d) {
      d = { set, name, image, offers: [], bestDiscount: 0 };
      map.set(set, d);
    }
    if (!d.image && image) d.image = image;
    return d;
  };
  for (const b of getBolDeals()) {
    get(b.set, b.name.replace(/^LEGO®? /, ''), b.image).offers.push({
      shop: 'bol',
      price: b.price,
      strikethrough: b.strikethrough,
      url: bolAffiliateUrl(b.url, b.set),
    });
  }
  for (const a of getAmazonDeals()) {
    get(a.set, a.name, null).offers.push({
      shop: 'Amazon',
      price: a.price,
      strikethrough: a.strikethrough,
      url: amazonAffiliateUrl(a.asin),
    });
  }
  const out = [...map.values()];
  for (const d of out) {
    d.offers.sort((x, y) => x.price - y.price);
    const ref = Math.max(...d.offers.map((o) => o.strikethrough ?? 0));
    d.bestDiscount = ref > d.offers[0].price ? Math.round((1 - d.offers[0].price / ref) * 100) : 0;
  }
  // Eerst sets die in beide shops staan (echte vergelijking), daarna op korting
  return out.sort((a, b) => b.offers.length - a.offers.length || b.bestDiscount - a.bestDiscount);
}
