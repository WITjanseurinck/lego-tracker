import type { Metadata } from 'next';
import Link from 'next/link';
import { getThemes } from '@/lib/data';
import { VERTICAL } from '@/verticals';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: `${VERTICAL.label} thema’s`,
  description: `Alle ${VERTICAL.label}-thema’s met de laagste prijzen in ${VERTICAL.homeCountryLabel}.`,
  alternates: { canonical: '/themas' },
};

export default async function Themas() {
  const themes = await getThemes();
  return (
    <div className="wrap page">
      <h1>Thema’s</h1>
      <p className="lead">Kies een thema en zie meteen wat vandaag het goedkoopst is.</p>
      <div className="themes" style={{ marginTop: 40 }}>
        {themes.map((t) => (
          <Link key={t.slug} href={`/thema/${t.slug}`} className="theme" style={{ background: t.bg, color: t.fg }}>
            <span className="c">{t.count} {t.count === 1 ? VERTICAL.productNoun : VERTICAL.productNounPlural}</span>
            <span className="tn">{t.name}</span>
          </Link>
        ))}
      </div>
      {themes.length === 0 ? <div className="empty">Nog geen thema’s.</div> : null}
    </div>
  );
}
