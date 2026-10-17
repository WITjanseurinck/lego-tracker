import { dbRead } from '@/lib/supabase';
import { VERTICAL } from '@/verticals';
import { isDemo, DEMO_PRODUCTS, DEMO_ARTICLES, type DemoProduct } from '@/lib/demo';
import type { ProductCardData } from '@/components/ProductCard';
import type { Point } from '@/components/PriceChart';
import { makeThemes, slugify, type Theme } from '@/lib/themes';

export interface ProductRow {
  id: number;
  sku: string;
  name: string;
  category: string | null;
  rrp_eur: number | null;
  image_path: string | null;
  attrs: Record<string, unknown> | null;
  ean: string | null;
  brand: string | null;
}

export interface OfferRow {
  id: number;
  price_eur: number;
  in_stock: boolean;
  product_url: string;
  affiliate_url: string | null;
  last_seen_at: string;
  shop: { name: string; country: string };
}

export interface ArticleRow {
  slug: string;
  title: string;
  summary: string;
  hero_image_url: string | null;
  published_at: string | null;
  updated_at?: string;
  hero_width?: number | null;
  hero_height?: number | null;
  body?: string;
}

const MONTH = 30 * 24 * 3600 * 1000;
const iso = (monthsAgo: number) => new Date(Date.now() - monthsAgo * MONTH).toISOString();

function card(p: DemoProduct): ProductCardData {
  const disc = ((p.rrp_eur - p.best) / p.rrp_eur) * 100;
  return {
    sku: p.sku, name: p.name, image_path: p.image_path, rrp_eur: p.rrp_eur, price_eur: p.best,
    lowest_eur: p.low, category: p.category,
    discount_pct: disc, is_all_time_low: p.best <= p.low,
  };
}

export async function getDeals(): Promise<{ deals: ProductCardData[]; error: boolean }> {
  if (isDemo) {
    const deals = [...DEMO_PRODUCTS].map(card).sort((a, b) => Number(b.discount_pct) - Number(a.discount_pct));
    return { deals, error: false };
  }
  const db = dbRead();
  const { data, error } = await db.from('daily_deals').select('*').eq('vertical', VERTICAL.id).limit(48);
  const ids = (data ?? []).map((d) => d.product_id);
  const { data: lows } = ids.length ? await db.from('all_time_low').select('product_id, low_eur').in('product_id', ids) : { data: [] };
  const lowBy = new Map((lows ?? []).map((l) => [l.product_id, Number(l.low_eur)]));
  const deals = (data ?? []).map((d) => {
    const low = lowBy.get(d.product_id) ?? null;
    return { ...d, lowest_eur: low, is_all_time_low: low !== null && Number(d.price_eur) <= low } as ProductCardData;
  });
  return { deals, error: Boolean(error) };
}

export async function getArticles(limit = 60): Promise<ArticleRow[]> {
  if (isDemo) return DEMO_ARTICLES.slice(0, limit);
  const { data } = await dbRead()
    .from('articles')
    .select('slug, title, summary, hero_image_url, published_at')
    .eq('vertical', VERTICAL.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);
  return (data ?? []) as ArticleRow[];
}

export async function getArticle(slug: string): Promise<ArticleRow | null> {
  if (isDemo) return DEMO_ARTICLES.find((a) => a.slug === slug) ?? null;
  const { data } = await dbRead().from('articles').select('*')
    .eq('vertical', VERTICAL.id).eq('slug', slug).eq('status', 'published').maybeSingle();
  return (data as ArticleRow | null) ?? null;
}

export async function getProduct(sku: string): Promise<ProductRow | null> {
  if (!VERTICAL.skuPattern.test(sku)) return null;
  if (isDemo) {
    const p = DEMO_PRODUCTS.find((d) => d.sku === sku);
    return p ? { ...p } : null;
  }
  const { data } = await dbRead().from('products').select('*').eq('vertical', VERTICAL.id).eq('sku', sku).maybeSingle();
  return (data as ProductRow | null) ?? null;
}

export async function getOffersAndHistory(product: ProductRow): Promise<{ offers: OfferRow[]; points: Point[] }> {
  if (isDemo) {
    const p = DEMO_PRODUCTS.find((d) => d.id === product.id)!;
    const offers: OfferRow[] = p.shops
      .map((s, i) => ({
        id: product.id * 10 + i,
        price_eur: Math.round((p.best + s.extra) * 100) / 100,
        in_stock: s.stock,
        product_url: '#',
        affiliate_url: null,
        last_seen_at: iso(0),
        shop: { name: s.name, country: 'BE' },
      }))
      .sort((a, b) => a.price_eur - b.price_eur);
    const points = p.series.map(([m, price]) => ({ t: iso(m), price }));
    return { offers, points };
  }

  const db = dbRead();
  const { data: all } = await db
    .from('offers')
    .select('id, price_eur, in_stock, product_url, affiliate_url, last_seen_at, shops(name, country, active)')
    .eq('product_id', product.id)
    .order('price_eur', { ascending: true });

  type Shop = { name: string; country: string; active: boolean } | null;
  const offers: OfferRow[] = (all ?? [])
    .filter((o) => (o.shops as unknown as Shop)?.active)
    .map((o) => {
      const s = o.shops as unknown as { name: string; country: string };
      return { ...o, shop: { name: s.name, country: s.country } } as OfferRow;
    });

  const ids = offers.map((o) => o.id);
  const { data: history } = ids.length
    ? await db.from('price_history').select('price_eur, recorded_at, in_stock').in('offer_id', ids).order('recorded_at', { ascending: true })
    : { data: [] as { price_eur: number; recorded_at: string; in_stock: boolean }[] };
  const points = (history ?? []).filter((h) => h.in_stock).map((h) => ({ t: h.recorded_at, price: Number(h.price_eur) }));
  return { offers, points };
}

export async function searchProducts(term: string): Promise<ProductCardData[]> {
  if (!term) return [];
  if (isDemo) {
    const t = term.toLowerCase();
    return DEMO_PRODUCTS.filter((p) => p.sku === term || p.name.toLowerCase().includes(t) || p.category.toLowerCase().includes(t)).map(card);
  }
  const db = dbRead();
  const { data: products } = await db.from('products').select('id, sku, name, image_path, rrp_eur')
    .eq('vertical', VERTICAL.id).or(`sku.eq.${term},name.ilike.%${term}%`).limit(48);
  const ids = (products ?? []).map((p) => p.id);
  const { data: best } = ids.length
    ? await db.from('best_offers').select('product_id, price_eur').in('product_id', ids)
    : { data: [] as { product_id: number; price_eur: number }[] };
  const priceBy = new Map((best ?? []).map((b) => [b.product_id, Number(b.price_eur)]));
  return (products ?? []).filter((p) => priceBy.has(p.id))
    .map((p) => ({ sku: p.sku, name: p.name, image_path: p.image_path, rrp_eur: p.rrp_eur, price_eur: priceBy.get(p.id)! }));
}

export async function getSitemapData(): Promise<{ skus: string[]; articles: { slug: string; updated_at?: string }[] }> {
  if (isDemo) return { skus: DEMO_PRODUCTS.map((p) => p.sku), articles: DEMO_ARTICLES };
  const db = dbRead();
  const [{ data: products }, { data: articles }] = await Promise.all([
    db.from('best_offers').select('sku').eq('vertical', VERTICAL.id).limit(5000),
    db.from('articles').select('slug, updated_at').eq('vertical', VERTICAL.id).eq('status', 'published')
      .order('published_at', { ascending: false }).limit(1000),
  ]);
  return { skus: (products ?? []).map((p) => p.sku), articles: articles ?? [] };
}

export async function getThemes(): Promise<Theme[]> {
  const counts = new Map<string, number>();
  if (isDemo) {
    for (const p of DEMO_PRODUCTS) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  } else {
    const { data } = await dbRead().from('products').select('category').eq('vertical', VERTICAL.id).limit(5000);
    for (const r of data ?? []) if (r.category) counts.set(r.category, (counts.get(r.category) ?? 0) + 1);
  }
  return makeThemes(counts);
}

export async function getThemeProducts(slug: string): Promise<{ theme: Theme | null; products: ProductCardData[] }> {
  const themes = await getThemes();
  const theme = themes.find((t) => t.slug === slug) ?? null;
  if (!theme) return { theme: null, products: [] };
  if (isDemo) {
    return { theme, products: DEMO_PRODUCTS.filter((p) => slugify(p.category) === slug).map(card) };
  }
  const db = dbRead();
  const { data: products } = await db.from('products').select('id, sku, name, image_path, rrp_eur, category')
    .eq('vertical', VERTICAL.id).eq('category', theme.name).limit(200);
  const ids = (products ?? []).map((p) => p.id);
  const { data: best } = ids.length
    ? await db.from('best_offers').select('product_id, price_eur').in('product_id', ids)
    : { data: [] as { product_id: number; price_eur: number }[] };
  const priceBy = new Map((best ?? []).map((b) => [b.product_id, Number(b.price_eur)]));
  return {
    theme,
    products: (products ?? []).filter((p) => priceBy.has(p.id)).map((p) => ({
      sku: p.sku, name: p.name, image_path: p.image_path, rrp_eur: p.rrp_eur, price_eur: priceBy.get(p.id)!, category: p.category,
    })),
  };
}
