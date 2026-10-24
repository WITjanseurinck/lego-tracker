import fs from 'node:fs';
import data from '@/data/bol-deals.json';

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

// Optionele live prijzen, door scripts/refresh-bol.mjs op de server geschreven (BOL_OVERLAY_FILE op een volume).
type Overlay = { fetchedAt: string; prices: Record<string, { price: number; strikethrough: number | null; seller: string | null; stock?: 'out' }> };
let overlayCache: { mtime: number; o: Overlay | null } = { mtime: -1, o: null };
function overlay(): Overlay | null {
  const f = process.env.BOL_OVERLAY_FILE;
  if (!f) return null;
  try {
    const m = fs.statSync(f).mtimeMs;
    if (m !== overlayCache.mtime) overlayCache = { mtime: m, o: JSON.parse(fs.readFileSync(f, 'utf8')) };
    return overlayCache.o;
  } catch {
    return null;
  }
}

export const bolFetchedAt: string = data.fetchedAt;

/** Enkel echte LEGO-sets: titel bevat een setnummer en geen "compatibel"-achtige woorden. */
export function getBolDeals(): BolDeal[] {
  const bad = /compatibel|compatible|kompatibel|bouwstenen|blokken|alternatief/i;
  const ov = overlay()?.prices;
  const items = (data.items as BolDeal[]).map((d) => {
    const p = ov?.[d.set];
    if (!p) return d;
    const { stock: _s, ...rest } = d;
    return { ...rest, price: p.price, strikethrough: p.strikethrough, seller: p.seller ?? d.seller, ...(p.stock ? { stock: p.stock } : {}) } as BolDeal;
  });
  return items.filter((d) => /^\d{4,6}$/.test(d.set) && !bad.test(d.name) && d.url.startsWith('https://www.bol.com/'));
}
