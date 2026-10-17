import Link from 'next/link';
import { formatEur } from '@/lib/format';
import { productImageUrl } from '@/lib/images';
import { StudMeter } from '@/components/StudMeter';

export interface ProductCardData {
  sku: string;
  name: string;
  image_path: string | null;
  rrp_eur: number | null;
  price_eur: number;
  lowest_eur?: number | null;
  discount_pct?: number | null;
  is_all_time_low?: boolean;
  category?: string | null;
}

export function ProductCard({ product, tint = '#1E55A8' }: { product: ProductCardData; tint?: string }) {
  const img = productImageUrl(product.image_path);
  const href = `/p/${product.sku}`;
  const disc = product.discount_pct ? Math.round(Number(product.discount_pct)) : null;
  return (
    <article className="tile">
      <Link href={href} className="pic" style={{ background: tint }} aria-label={product.name}>
        {img ? <img src={img} alt={product.name} loading="lazy" /> : <span className="none">Geen foto</span>}
        {product.is_all_time_low ? <span className="flag">Laagste prijs ooit</span> : null}
      </Link>
      <div className="info">
        <div className="num">{product.sku}{product.category ? ` · ${product.category}` : ''}</div>
        <Link href={href} className="name">{product.name}</Link>
        <div className="pr">
          <span className="price">{formatEur(product.price_eur)}</span>
          {product.rrp_eur ? <span className="rrp">{formatEur(product.rrp_eur)}</span> : null}
          {disc ? <span className="disc">-{disc}%</span> : null}
        </div>
        <StudMeter price={Number(product.price_eur)} low={product.lowest_eur ?? null} rrp={product.rrp_eur ? Number(product.rrp_eur) : null} />
      </div>
    </article>
  );
}
