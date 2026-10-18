import { amazonAffiliateUrl, getAmazonDeals } from '@/lib/amazon';
import { bolAffiliateUrl, getBolDeals } from '@/lib/bol';
import descriptions from '@/data/descriptions.json';
import { getCatalog, themeKey } from '@/lib/catalog';
import { legoUrl } from '@/lib/lego';
import type { Locale } from '@/lib/i18n';

export interface ShopOffer {
  shop: string; // bol, Amazon, en later andere shops
  price: number;
  strikethrough: number | null;
  url: string;
  /** Alleen gezet als de shop de set tijdelijk niet kan leveren. */
  stock?: 'out';
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
  desc: Partial<Record<Locale, string>> | null;
}

/** LEGO-afbeeldingen zijn tot 5000 px breed: laat de CDN ze verkleinen. */
const sized = (url: string | null) =>
  url && url.startsWith('https://www.lego.com/cdn/') && !url.includes('?') ? `${url}?format=webply&fit=bounds&quality=80&width=640&height=640` : url;

let cache: CompareDeal[] | null = null;

/** Voegt de aanbiedingen van alle shops samen per setnummer (eenmalig berekend, de data is statisch). */
export function getCompareDeals(): CompareDeal[] {
  if (cache) return cache;
  const map = new Map<string, CompareDeal>();
  const get = (set: string, name: string, image: string | null, theme = 'overig', pieces: number | null = null, age: number | null = null) => {
    let d = map.get(set);
    if (!d) {
      d = { set, name, image, offers: [], bestDiscount: 0, theme, pieces, age, desc: (descriptions as Record<string, Partial<Record<Locale, string>>>)[set] ?? null };
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
  // Het volledige LEGO.com-assortiment: elke set krijgt een LEGO-aanbod (officiële prijs).
  for (const c of getCatalog()) {
    const d = get(c.set, c.name, sized(c.image), themeKey(c.brand), c.pieces || null, c.age || null);
    d.theme = themeKey(c.brand);
    if (!d.pieces && c.pieces) d.pieces = c.pieces;
    d.offers.push({
      shop: 'LEGO',
      price: c.price,
      strikethrough: c.list && c.list > c.price ? c.list : null,
      url: legoUrl(c.slug),
      ...(c.avail === 'out' ? { stock: 'out' as const } : {}),
    });
  }
  const out = [...map.values()];
  for (const d of out) {
    // Shops die tijdelijk niets kunnen leveren komen achteraan, ook als hun prijs het laagst is.
    d.offers.sort((x, y) => Number(x.stock === 'out') - Number(y.stock === 'out') || x.price - y.price);
    const ref = Math.max(...d.offers.map((o) => o.strikethrough ?? 0));
    d.bestDiscount = ref > d.offers[0].price ? Math.round((1 - d.offers[0].price / ref) * 100) : 0;
  }
  // Eerst sets die in beide shops staan (echte vergelijking), daarna op korting
  cache = out.sort((a, b) => b.offers.length - a.offers.length || b.bestDiscount - a.bestDiscount);
  return cache;
}

export function getCompareDeal(set: string): CompareDeal | undefined {
  return getCompareDeals().find((d) => d.set === set);
}

export function dealsByTheme(theme: string): CompareDeal[] {
  return getCompareDeals().filter((d) => d.theme === theme);
}

/** Verwante reeksen, voor het geval een reeks te klein is om drie alternatieven te geven. */
const THEME_FAMILY: Record<string, string[]> = {
  overig: ['disney', 'ideas', 'editions'],
  disney: ['overig', 'ideas', 'creator'],
  ideas: ['icons', 'disney', 'overig', 'art'],
  editions: ['speed-champions', 'icons', 'overig'],
  botanicals: ['art', 'icons', 'architecture'],
  art: ['botanicals', 'architecture', 'icons'],
  architecture: ['art', 'icons', 'ideas'],
  creator: ['disney', 'overig', 'ideas'],
  city: ['creator', 'technic', 'friends'],
  duplo: ['classic', 'bluey', 'friends'],
  friends: ['city', 'duplo', 'disney'],
  ninjago: ['city', 'monkie-kid', 'minecraft'],
  minecraft: ['ninjago', 'fortnite', 'super-mario'],
  marvel: ['dc', 'star-wars', 'ninjago'],
  dc: ['marvel', 'star-wars'],
  'jurassic-world': ['city', 'ninjago', 'minecraft'],
  classic: ['duplo', 'creator', 'city'],
  bluey: ['duplo', 'classic', 'friends'],
  'super-mario': ['sonic', 'minecraft', 'fortnite'],
  brickheadz: ['editions', 'disney', 'marvel'],
  sonic: ['super-mario', 'fortnite', 'minecraft'],
  fortnite: ['minecraft', 'sonic', 'super-mario'],
  'lord-of-the-rings': ['harry-potter', 'icons', 'ideas'],
  dreamzzz: ['ninjago', 'friends', 'monkie-kid'],
  'one-piece': ['ninjago', 'star-wars', 'monkie-kid'],
  wicked: ['disney', 'friends', 'icons'],
  wednesday: ['harry-potter', 'icons', 'ideas'],
  'monkie-kid': ['ninjago', 'city', 'dreamzzz'],
  'stranger-things': ['icons', 'ideas', 'harry-potter'],
  minifiguren: ['brickheadz', 'editions', 'overig'],
  'animal-crossing': ['super-mario', 'friends', 'disney'],
  'gabbys-dollhouse': ['friends', 'duplo', 'disney'],
  'speed-champions': ['technic', 'editions'],
};

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
  // Kleine reeks: vul aan met verwante reeksen, nooit met willekeurige andere thema's.
  if (pool.length < 4) {
    const family = THEME_FAMILY[deal.theme] ?? [];
    pool = all.filter((d) => d.set !== deal.set && (d.theme === deal.theme || family.includes(d.theme)));
  }
  if (pool.length === 0) return [];
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
