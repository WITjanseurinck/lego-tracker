import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { photoTint } from '@/lib/themes';
import { ProductCard } from '@/components/ProductCard';
import { getThemeProducts } from '@/lib/data';
import { VERTICAL } from '@/verticals';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { theme } = await getThemeProducts(slug);
  if (!theme) return {};
  return {
    title: `${VERTICAL.label} ${theme.name}: prijzen en deals`,
    description: `Alle ${theme.name}-${VERTICAL.productNounPlural} met de laagste prijs in ${VERTICAL.homeCountryLabel}, met prijshistoriek.`,
    alternates: { canonical: `/thema/${theme.slug}` },
  };
}

export default async function ThemaPagina({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { theme, products } = await getThemeProducts(slug);
  if (!theme) notFound();
  const sorted = [...products].sort((a, b) => Number(b.discount_pct ?? 0) - Number(a.discount_pct ?? 0));
  return (
    <div className="wrap page">
      <nav className="crumbs" aria-label="Kruimelpad"><Link href="/themas">Thema’s</Link> / {theme.name}</nav>
      <h1 style={{ marginTop: 16 }}>{theme.name}</h1>
      <p className="lead">{products.length} {products.length === 1 ? VERTICAL.productNoun : VERTICAL.productNounPlural}, gesorteerd op de grootste korting.</p>
      <div className="grid" style={{ marginTop: 48 }}>{sorted.map((p, i) => <ProductCard key={p.sku} product={p} tint={photoTint(i)} />)}</div>
      {products.length === 0 ? <div className="empty">Nog geen sets met een prijs in dit thema.</div> : null}
    </div>
  );
}
