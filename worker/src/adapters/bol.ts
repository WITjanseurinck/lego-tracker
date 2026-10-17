import type { FeedAdapter, FeedItem } from '../types.js';

/**
 * Bol Marketing Catalog API (Partner Programma).
 * Je hebt een API-key nodig uit het bol Partner Platform.
 * Controleer de exacte endpoint, veldnamen en landcodes in de actuele bol-documentatie
 * voor je dit live zet: dit is een eerste opzet en nog niet getest tegen de API.
 */
const BASE = 'https://api.bol.com/marketing/catalog/v1';

interface BolProduct {
  ean?: string;
  title?: string;
  url?: string;
  image?: { url?: string };
  offer?: { price?: number; availability?: string };
}

export function bolAdapter(opts: {
  apiKey: string;
  siteId: string;
  shopSlug: string;
  countryCode: 'BE' | 'NL';
  searchTerm: string;
}): FeedAdapter {
  return {
    shopSlug: opts.shopSlug,
    async fetchItems(): Promise<FeedItem[]> {
      const items: FeedItem[] = [];
      for (let page = 1; page <= 20; page++) {
        const url =
          `${BASE}/products/search?search-term=${encodeURIComponent(opts.searchTerm)}` +
          `&country-code=${opts.countryCode}&page=${page}&include-offer=true`;
        const res = await fetch(url, { headers: { 'X-Api-Key': opts.apiKey, Accept: 'application/json' } });
        if (!res.ok) throw new Error(`${opts.shopSlug}: ${res.status} op pagina ${page}`);
        const json = (await res.json()) as { results?: BolProduct[] };
        const results = json.results ?? [];
        if (results.length === 0) break;

        for (const p of results) {
          const price = p.offer?.price;
          if (!p.title || !p.url || !price) continue;
          items.push({
            title: p.title,
            ean: p.ean,
            priceEur: price,
            inStock: (p.offer?.availability ?? 'IN_STOCK').toUpperCase().includes('IN_STOCK'),
            productUrl: p.url,
            affiliateUrl: `${p.url}${p.url.includes('?') ? '&' : '?'}siteId=${encodeURIComponent(opts.siteId)}`,
            imageUrl: p.image?.url,
          });
        }
      }
      return items;
    },
  };
}
