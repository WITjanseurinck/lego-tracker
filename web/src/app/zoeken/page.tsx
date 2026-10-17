import type { Metadata } from 'next';
import { photoTint } from '@/lib/themes';
import { ProductCard } from '@/components/ProductCard';
import { searchProducts } from '@/lib/data';
import { VERTICAL } from '@/verticals';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Zoeken', robots: { index: false, follow: true } };

export default async function Zoeken({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const term = q.trim().replace(/[%,()]/g, '');
  const results = await searchProducts(term);

  return (
    <div className="wrap page">
      <h1>Zoeken</h1>
      <form className="searchbar" action="/zoeken">
        <label htmlFor="q" className="sr">Zoek een {VERTICAL.productNoun}</label>
        <input id="q" type="search" name="q" defaultValue={q} placeholder={VERTICAL.searchPlaceholder} />
        <button type="submit">Zoek</button>
      </form>
      {term && results.length === 0 ? <p className="muted">Niets gevonden voor “{term}”. Probeer een setnummer of een deel van de naam.</p> : null}
      <div className="grid">{results.map((p, i) => <ProductCard key={p.sku} product={p} tint={photoTint(i)} />)}</div>
    </div>
  );
}
