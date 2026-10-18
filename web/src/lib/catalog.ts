import catalog from '@/data/lego-catalog.json';

/** Een rij uit de LEGO.com-catalogus voor België (prijzen in euro, zonder affiliate). */
export interface CatalogRow {
  set: string;
  name: string;
  /** Themanaam zoals LEGO die toont, bv. "LEGO® Technic". */
  brand: string;
  slug: string;
  image: string;
  age: number | null;
  pieces: number | null;
  price: number;
  list: number | null;
  /** E_AVAILABLE, E_TEMPORARILY_SOLD_OUT, ... */
  avail: string;
}

export const catalogFetchedAt: string = (catalog as { fetchedAt: string }).fetchedAt;

export function getCatalog(): CatalogRow[] {
  return (catalog as { items: CatalogRow[] }).items;
}

/** LEGO-themanaam naar een url-vriendelijke sleutel. Bekende thema's behouden hun oude sleutel. */
const KNOWN: Record<string, string> = {
  technic: 'technic',
  'speed champions': 'speed-champions',
  creator: 'creator',
  'creator 3-in-1': 'creator',
  icons: 'icons',
  ideas: 'ideas',
  'star wars': 'star-wars',
  'harry potter': 'harry-potter',
  botanicals: 'botanicals',
  art: 'art',
  architecture: 'architecture',
  disney: 'disney',
  city: 'city',
  editions: 'editions',
};

export function brandLabel(brand: string): string {
  return brand.replace(/^LEGO®\s*/i, '').replace(/™|®/g, '').trim();
}

export function themeKey(brand: string): string {
  const label = brandLabel(brand);
  if (!label) return 'overig';
  const k = label.toLowerCase();
  if (KNOWN[k]) return KNOWN[k];
  return k.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' en ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'overig';
}
