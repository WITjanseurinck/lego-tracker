import { db } from './db.js';
import { normalizeEan } from './ean.js';
import type { FeedAdapter, FeedItem, Vertical } from './types.js';

interface Known {
  bySku: Map<string, number>;
  byEan: Map<string, number>;
  needsImage: Set<number>;
}

async function loadKnown(vertical: Vertical): Promise<Known> {
  const known: Known = { bySku: new Map(), byEan: new Map(), needsImage: new Set() };
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await db
      .from('products')
      .select('id, sku, ean, image_source_url')
      .eq('vertical', vertical.id)
      .range(from, from + pageSize - 1);
    if (error) throw error;
    for (const p of data ?? []) {
      known.bySku.set(p.sku, p.id);
      if (p.ean) known.byEan.set(p.ean, p.id);
      if (!p.image_source_url) known.needsImage.add(p.id);
    }
    if (!data || data.length < pageSize) break;
  }
  return known;
}

export function isOfficialImage(vertical: Vertical, url?: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && vertical.officialImageHosts.some((h) => u.hostname === h || u.hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

export async function ingestShop(
  adapter: FeedAdapter,
  vertical: Vertical,
): Promise<{ matched: number; skipped: number }> {
  const { data: shop, error: shopErr } = await db
    .from('shops')
    .select('id')
    .eq('vertical', vertical.id)
    .eq('slug', adapter.shopSlug)
    .single();
  if (shopErr || !shop) throw new Error(`Onbekende shop: ${adapter.shopSlug}`);

  const known = await loadKnown(vertical);
  const items = await adapter.fetchItems();

  let matched = 0;
  let skipped = 0;
  const seenAt = new Date().toISOString();

  for (const item of items) {
    const productId = await resolveProduct(item, vertical, known);
    if (!productId) {
      skipped++;
      continue;
    }

    // Officiele afbeelding onthouden zodat de image-stap ze kan kopieren
    if (known.needsImage.has(productId) && isOfficialImage(vertical, item.imageUrl)) {
      await db.from('products').update({ image_source_url: item.imageUrl }).eq('id', productId).is('image_source_url', null);
      known.needsImage.delete(productId);
    }

    const { data: offer, error: offerErr } = await db
      .from('offers')
      .upsert(
        {
          product_id: productId,
          shop_id: shop.id,
          product_url: item.productUrl,
          affiliate_url: item.affiliateUrl ?? null,
          price_eur: item.priceEur,
          in_stock: item.inStock,
          last_seen_at: seenAt,
        },
        { onConflict: 'product_id,shop_id' },
      )
      .select('id')
      .single();
    if (offerErr || !offer) {
      skipped++;
      continue;
    }

    await recordHistory(offer.id, item);
    matched++;
  }

  return { matched, skipped };
}

async function resolveProduct(item: FeedItem, vertical: Vertical, known: Known): Promise<number | undefined> {
  const ean = normalizeEan(item.ean);
  if (ean && known.byEan.has(ean)) return known.byEan.get(ean);

  if (!vertical.isRelevant(item)) return undefined;
  const sku = vertical.skuFor(item);
  if (!sku) return undefined;
  if (known.bySku.has(sku)) return known.bySku.get(sku);

  // Nieuw product meteen aanmaken zodat het op de site staat
  const { data, error } = await db
    .from('products')
    .upsert(
      {
        vertical: vertical.id,
        sku,
        name: vertical.cleanName(item, sku),
        brand: vertical.brand,
        category: item.category ?? null,
        attrs: vertical.attrsFor?.(item) ?? {},
        ean: ean ?? null,
        rrp_eur: item.rrpEur ?? null,
      },
      { onConflict: 'vertical,sku' },
    )
    .select('id')
    .single();
  if (error || !data) return undefined;

  known.bySku.set(sku, data.id);
  if (ean) known.byEan.set(ean, data.id);
  known.needsImage.add(data.id);
  return data.id;
}

/** Enkel een nieuwe regel als prijs of voorraad echt veranderd is */
async function recordHistory(offerId: number, item: FeedItem): Promise<void> {
  const { data: last } = await db
    .from('price_history')
    .select('price_eur, in_stock')
    .eq('offer_id', offerId)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (last && Number(last.price_eur) === item.priceEur && last.in_stock === item.inStock) return;

  await db.from('price_history').insert({ offer_id: offerId, price_eur: item.priceEur, in_stock: item.inStock });
}
