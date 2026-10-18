import { amazonAffiliateUrl, getAmazonDeals } from '@/lib/amazon';
import { bolAffiliateUrl, getBolDeals } from '@/lib/bol';

export interface ShopOffer {
  shop: string; // bol, Amazon, en later andere shops
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
  theme: string;
  pieces: number | null;
  age: number | null;
}

/** LEGO-afbeeldingen zijn tot 5000 px breed: laat de CDN ze verkleinen. */
const sized = (url: string | null) =>
  url && url.startsWith('https://www.lego.com/cdn/') && !url.includes('?') ? `${url}?format=webply&fit=bounds&quality=80&width=640&height=640` : url;

/** Voegt de aanbiedingen van alle shops samen per setnummer. */
export function getCompareDeals(): CompareDeal[] {
  const map = new Map<string, CompareDeal>();
  const get = (set: string, name: string, image: string | null, theme = 'overig', pieces: number | null = null, age: number | null = null) => {
    let d = map.get(set);
    if (!d) {
      d = { set, name, image, offers: [], bestDiscount: 0, theme, pieces, age };
      map.set(set, d);
    }
    if (!d.image && image) d.image = image;
    if (d.theme === 'overig' && theme !== 'overig') d.theme = theme;
    if (!d.pieces && pieces) d.pieces = pieces;
    if (!d.age && age) d.age = age;
    return d;
  };
  for (const b of getBolDeals()) {
    get(b.set, b.name.replace(/^LEGO®? /, ''), b.image, b.theme, b.pieces ?? null, b.age ?? null).offers.push({
      shop: 'bol',
      price: b.price,
      strikethrough: b.strikethrough,
      url: bolAffiliateUrl(b.url, b.set),
    });
  }
  for (const a of getAmazonDeals()) {
    get(a.set, a.name, sized(a.image ?? null), a.theme, a.pieces ?? null, a.age ?? null).offers.push({
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

export function getCompareDeal(set: string): CompareDeal | undefined {
  return getCompareDeals().find((d) => d.set === set);
}

export function dealsByTheme(theme: string): CompareDeal[] {
  return getCompareDeals().filter((d) => d.theme === theme);
}

export type RelatedKind = 'cheaper' | 'similar' | 'pricier';
export interface RelatedPick {
  kind: RelatedKind;
  deal: CompareDeal;
}

/**
 * Drie alternatieven uit dezelfde reeks: iets goedkoper, ongeveer dezelfde prijs en iets duurder.
 * Is de set de goedkoopste (of duurste) van de reeks, dan komen er drie duurdere (of goedkopere).
 */
export function relatedByPrice(deal: CompareDeal): RelatedPick[] {
  const price = deal.offers[0].price;
  const all = getCompareDeals();
  let pool = all.filter((d) => d.theme === deal.theme && d.set !== deal.set);
  if (pool.length < 4) pool = all.filter((d) => d.set !== deal.set);
  const p = (d: CompareDeal) => d.offers[0].price;
  pool.sort((a, b) => p(a) - p(b));
  const below = pool.filter((d) => p(d) < price - 0.005);
  const above = pool.filter((d) => p(d) > price + 0.005);
  const same = pool.filter((d) => Math.abs(p(d) - price) <= 0.005);
  const near = (list: CompareDeal[]) => [...list].sort((a, b) => Math.abs(p(a) - price) - Math.abs(p(b) - price));

  const picks: RelatedPick[] = [];
  const used = new Set<string>();
  const add = (kind: RelatedKind, d: CompareDeal | undefined) => {
    if (d && !used.has(d.set)) {
      used.add(d.set);
      picks.push({ kind, deal: d });
    }
  };
  if (below.length === 0) {
    // De goedkoopste van de reeks: drie keer iets duurder, elk wat verder weg.
    const up = [...same, ...above];
    [0, Math.floor(up.length / 4), Math.floor(up.length / 2)].forEach((i) => add('pricier', up[Math.min(i, up.length - 1)]));
    for (const d of up) if (picks.length < 3) add('pricier', d);
  } else if (above.length === 0) {
    const down = [...same, ...[...below].reverse()];
    [0, Math.floor(down.length / 4), Math.floor(down.length / 2)].forEach((i) => add('cheaper', down[Math.min(i, down.length - 1)]));
    for (const d of down) if (picks.length < 3) add('cheaper', d);
  } else {
    // Goedkoper: de dichtstbijzijnde die minstens ~10% minder kost, anders gewoon de eerstvolgende.
    add('cheaper', [...below].reverse().find((d) => p(d) <= price * 0.9) ?? below[below.length - 1]);
    add('pricier', above.find((d) => p(d) >= price * 1.1) ?? above[0]);
    add('similar', near([...same, ...below, ...above].filter((d) => !used.has(d.set)))[0]);
  }
  const order: Record<RelatedKind, number> = { cheaper: 0, similar: 1, pricier: 2 };
  return picks.sort((a, b) => order[a.kind] - order[b.kind] || p(a.deal) - p(b.deal));
}
