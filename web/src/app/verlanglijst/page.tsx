import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { dbRead } from '@/lib/supabase';
import { photoTint } from '@/lib/themes';
import { ProductCard, type ProductCardData } from '@/components/ProductCard';
import { isDemo } from '@/lib/demo';
import { searchProducts } from '@/lib/data';
import { VERTICAL } from '@/verticals';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Verlanglijst', robots: { index: false, follow: false } };

export default async function Verlanglijst() {
  const jar = await cookies();
  let cards: ProductCardData[] = [];

  if (isDemo) {
    const skus = (jar.get('wishlist_demo')?.value ?? '').split(',').filter(Boolean);
    const all = await Promise.all(skus.map((s) => searchProducts(s)));
    cards = all.flat();
  } else {
    const token = jar.get('wishlist')?.value;
    if (token) {
      const db = dbRead();
      const { data: items } = await db.from('wishlist_items').select('product_id').eq('token', token);
      const ids = (items ?? []).map((i) => i.product_id);
      if (ids.length) {
        const { data: products } = await db
          .from('products').select('id, sku, name, image_path, rrp_eur').eq('vertical', VERTICAL.id).in('id', ids);
        const { data: best } = await db.from('best_offers').select('product_id, price_eur').in('product_id', ids);
        const priceBy = new Map((best ?? []).map((b) => [b.product_id, Number(b.price_eur)]));
        cards = (products ?? [])
          .filter((p) => priceBy.has(p.id))
          .map((p) => ({ sku: p.sku, name: p.name, image_path: p.image_path, rrp_eur: p.rrp_eur, price_eur: priceBy.get(p.id)! }));
      }
    }
  }

  return (
    <div className="wrap page">
      <h1>Verlanglijst</h1>
      <p className="lead">Bewaard in deze browser, je hebt geen account nodig.</p>
      <div style={{ height: 40 }} />
      {cards.length === 0 ? <div className="empty">Je verlanglijst is nog leeg. Open een set en kies “Op verlanglijst zetten”.</div> : null}
      <div className="grid">{cards.map((p, i) => <ProductCard key={p.sku} product={p} tint={photoTint(i)} />)}</div>
    </div>
  );
}
