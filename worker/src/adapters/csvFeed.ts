import { parse } from 'csv-parse/sync';
import type { FeedAdapter, FeedItem } from '../types.js';

/**
 * Generieke adapter voor Awin- en Daisycon-productfeeds in CSV.
 * Elke shop heeft een eigen feed-URL (uit je affiliate-dashboard) en
 * kolomnamen die licht verschillen, daarom is de mapping instelbaar.
 */
export interface CsvFeedConfig {
  shopSlug: string;
  url: string;
  delimiter?: string;
  columns: {
    title: string;
    price: string;
    productUrl: string;
    affiliateUrl?: string;
    ean?: string;
    stock?: string;
    image?: string;
    rrp?: string;
  };
  /** Waarden in de stockkolom die "op voorraad" betekenen */
  inStockValues?: string[];
}

function toNumber(raw: string | undefined): number | undefined {
  if (!raw) return undefined;
  const cleaned = raw.replace(/[^\d,.-]/g, '');
  const normalized = cleaned.includes(',') && !cleaned.includes('.')
    ? cleaned.replace(',', '.')
    : cleaned.replace(/,/g, '');
  const n = Number(normalized);
  return Number.isFinite(n) ? n : undefined;
}

export function csvFeedAdapter(cfg: CsvFeedConfig): FeedAdapter {
  const inStock = (cfg.inStockValues ?? ['1', 'true', 'in stock', 'in_stock', 'yes', 'ja']).map((v) =>
    v.toLowerCase(),
  );

  return {
    shopSlug: cfg.shopSlug,
    async fetchItems(): Promise<FeedItem[]> {
      const res = await fetch(cfg.url);
      if (!res.ok) throw new Error(`${cfg.shopSlug}: feed gaf ${res.status}`);
      const text = await res.text();

      const rows = parse(text, {
        columns: true,
        delimiter: cfg.delimiter ?? ',',
        skip_empty_lines: true,
        relax_quotes: true,
        relax_column_count: true,
      }) as Record<string, string>[];

      const items: FeedItem[] = [];
      for (const row of rows) {
        const price = toNumber(row[cfg.columns.price]);
        const title = row[cfg.columns.title];
        const productUrl = row[cfg.columns.productUrl];
        if (!price || !title || !productUrl) continue;

        items.push({
          title,
          priceEur: price,
          productUrl,
          affiliateUrl: cfg.columns.affiliateUrl ? row[cfg.columns.affiliateUrl] : undefined,
          ean: cfg.columns.ean ? row[cfg.columns.ean] : undefined,
          imageUrl: cfg.columns.image ? row[cfg.columns.image] : undefined,
          rrpEur: cfg.columns.rrp ? toNumber(row[cfg.columns.rrp]) : undefined,
          inStock: cfg.columns.stock
            ? inStock.includes((row[cfg.columns.stock] ?? '').toLowerCase())
            : true,
        });
      }
      return items;
    },
  };
}
