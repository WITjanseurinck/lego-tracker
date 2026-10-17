export interface ProductMeta {
  sku: string;
  category: string | null;
  attrs: Record<string, unknown>;
}

export interface VerticalConfig {
  id: string;
  siteName: string;
  label: string;
  brand: string;
  tagline: string;
  description: string;
  productNoun: string;
  productNounPlural: string;
  skuPattern: RegExp;
  searchPlaceholder: string;
  displayName: (sku: string, name: string) => string;
  metaLine: (p: ProductMeta) => string;
  accent: string;
  background: string;
  countries: string[];
  locale: string;
  homeCountryLabel: string;
}
