import type { FeedAdapter, FeedItem } from '../types.js';

/**
 * bol Marketing Catalog API (Partner Programma).
 *
 * Bronnen:
 * - api.bol.com/marketing/docs/catalog-api (authenticatie, endpoints, rate limits)
 * - affiliate.bol.com/nl/handleiding/tracking-url (opbouw van de trackinglink)
 *
 * Wat de documentatie zegt en deze adapter doet:
 * - Authenticatie is OAuth2 client credentials (client id en secret uit je Affiliate account,
 *   via "API Client Credentials aanvragen"). Het token leeft ongeveer 5 minuten en wordt hergebruikt.
 * - De header Accept-Language is verplicht (nl-BE of nl-NL).
 * - Maximaal 10 requests per seconde per endpoint. We houden 150 ms tussen requests aan en
 *   proberen opnieuw bij een 429.
 * - Er is geen voorraadveld. Een zoekresultaat zonder offer is niet te bestellen en slaan we over.
 * - De url in de API is een gewone productlink. Pas na ombouw naar een tracking URL
 *   (partner.bol.com/click/click, met f=api) wordt een klik aan jouw account toegeschreven.
 */
const BASE = 'https://api.bol.com/marketing/catalog/v1';
const TOKEN_URL = 'https://login.bol.com/token?grant_type=client_credentials';
const TRACKING_BASE = 'https://partner.bol.com/click/click?&t=url';
const MIN_GAP_MS = 150;
const PAGE_SIZE = 50;

interface BolProduct {
  ean?: string;
  title?: string;
  url?: string;
  offer?: { price?: number; strikethroughPrice?: number; deliveryDescription?: string };
}

interface BolSearchResponse {
  page?: number;
  totalPages?: number;
  results?: BolProduct[];
}

export interface BolOptions {
  clientId: string;
  clientSecret: string;
  /** Het SiteId van jouw website in het bol Affiliate account (uniek per domein) */
  siteId: string;
  shopSlug: string;
  countryCode: 'BE' | 'NL';
  searchTerm: string;
  /** Optioneel veld in de trackinglink, bv. 'lego' */
  subId?: string;
  maxPages?: number;
}

/**
 * Bouwt de officiele bol tracking URL voor de API: f=api is verplicht bij gebruik van de API.
 * Geeft undefined terug als de url niet naar bol.com wijst, zodat we nooit een vreemde
 * landingspagina in een affiliatelink stoppen.
 */
export function bolTrackingUrl(siteId: string, productUrl: string, subId?: string): string | undefined {
  let host: string;
  try {
    const u = new URL(productUrl);
    if (u.protocol !== 'https:') return undefined;
    host = u.hostname;
  } catch {
    return undefined;
  }
  if (host !== 'bol.com' && !host.endsWith('.bol.com')) return undefined;

  let link = `${TRACKING_BASE}&s=${encodeURIComponent(siteId)}&url=${encodeURIComponent(productUrl)}&f=api`;
  if (subId) link += `&subid=${encodeURIComponent(subId)}`;
  return link;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let lastRequestAt = 0;
async function throttle(): Promise<void> {
  const wait = lastRequestAt + MIN_GAP_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();
}

let cachedToken: { token: string; expiresAt: number } | undefined;

async function getToken(clientId: string, clientSecret: string, force = false): Promise<string> {
  if (!force && cachedToken && cachedToken.expiresAt > Date.now() + 30_000) return cachedToken.token;
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`bol: token aanvragen gaf ${res.status}. Controleer BOL_CLIENT_ID en BOL_CLIENT_SECRET.`);
  const json = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!json.access_token) throw new Error('bol: tokenantwoord zonder access_token');
  cachedToken = { token: json.access_token, expiresAt: Date.now() + (json.expires_in ?? 299) * 1000 };
  return cachedToken.token;
}

async function bolGet<T>(url: string, opts: BolOptions, language: string): Promise<T> {
  let forceToken = false;
  for (let attempt = 0; attempt < 4; attempt++) {
    await throttle();
    const token = await getToken(opts.clientId, opts.clientSecret, forceToken);
    forceToken = false;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Accept-Language': language },
    });
    if (res.ok) return (await res.json()) as T;
    if (res.status === 401) {
      forceToken = true;
      continue;
    }
    if (res.status === 429) {
      await sleep(1000 * (attempt + 1));
      continue;
    }
    throw new Error(`${opts.shopSlug}: bol gaf ${res.status} voor ${url}`);
  }
  throw new Error(`${opts.shopSlug}: bol bleef weigeren na meerdere pogingen`);
}

export function bolAdapter(opts: BolOptions): FeedAdapter {
  const language = opts.countryCode === 'BE' ? 'nl-BE' : 'nl-NL';
  const maxPages = opts.maxPages ?? 20;

  return {
    shopSlug: opts.shopSlug,
    async fetchItems(): Promise<FeedItem[]> {
      const items: FeedItem[] = [];
      for (let page = 1; page <= maxPages; page++) {
        const url =
          `${BASE}/products/search?search-term=${encodeURIComponent(opts.searchTerm)}` +
          `&country-code=${opts.countryCode}&page=${page}&page-size=${PAGE_SIZE}` +
          `&sort=POPULARITY&include-offer=true`;
        const json = await bolGet<BolSearchResponse>(url, opts, language);
        const results = json.results ?? [];
        if (results.length === 0) break;

        for (const p of results) {
          const price = p.offer?.price;
          if (!p.title || !p.url || !price) continue;
          const affiliateUrl = bolTrackingUrl(opts.siteId, p.url, opts.subId);
          // Zonder geldige trackinglink tonen we het aanbod niet: een klik zonder tracking levert niets op
          if (!affiliateUrl) continue;
          items.push({
            title: p.title,
            ean: p.ean,
            priceEur: price,
            inStock: true,
            productUrl: p.url,
            affiliateUrl,
          });
        }

        if (json.totalPages !== undefined && page >= json.totalPages) break;
      }
      return items;
    },
  };
}
