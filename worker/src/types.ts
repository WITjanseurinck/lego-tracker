export interface FeedItem {
  title: string;
  ean?: string;
  sku?: string;
  priceEur: number;
  inStock: boolean;
  productUrl: string;
  affiliateUrl?: string;
  imageUrl?: string;
  rrpEur?: number;
  category?: string;
}

export interface FeedAdapter {
  /** Moet overeenkomen met shops.slug in de database */
  shopSlug: string;
  fetchItems(): Promise<FeedItem[]>;
}

/** Alles wat per vertical verschilt: matching, namen, landen en toegestane beeldbronnen */
export interface Vertical {
  id: string;
  /** Voor tekst in mails en artikels, bv. 'Lego' */
  label: string;
  brand: string;
  /** Zoekterm voor API-bronnen zoals bol */
  searchTerm: string;
  /** Landen waarvoor we prijzen ophalen, standaard enkel BE */
  countries: string[];
  /** Enkel van deze hosts (en subdomeinen) kopieren we afbeeldingen */
  officialImageHosts: string[];
  /** Hoort deze feedregel bij deze vertical? */
  isRelevant(item: FeedItem): boolean;
  /** Stabiele productsleutel, bv. het setnummer */
  skuFor(item: FeedItem): string | undefined;
  cleanName(item: FeedItem, sku: string): string;
  /** Extra velden voor products.attrs, bv. stukjes */
  attrsFor?(item: FeedItem): Record<string, unknown>;
}
