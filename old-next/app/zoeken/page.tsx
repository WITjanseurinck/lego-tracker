import type { Metadata } from 'next';
import { CompareCard } from '@/components/CompareCard';
import { getCompareDeals } from '@/lib/deals';
import { getI18n } from '@/lib/i18n-server';
import { pageMeta } from '@/lib/seo';
import { photoTint } from '@/lib/themes';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return pageMeta({ locale, path: '/zoeken', title: t.search.title, description: t.search.hint, noindex: true });
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default async function Zoeken({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const { locale, t, href } = await getI18n();
  const term = q.trim().replace(/[%,()]/g, '');
  const compare = term
    ? getCompareDeals().filter((d) => d.set.includes(term) || norm(`${d.name} lego`).includes(norm(term)))
    : [];
  const count = compare.length;

  return (
    <div className="wrap page">
      <h1>{t.search.h1}</h1>
      <p className="lead">{t.search.hint}</p>
      <form className="searchbar" action={href('/zoeken')} style={{ marginTop: 32 }}>
        <label htmlFor="q" className="sr">{t.search.label}</label>
        <input id="q" type="search" name="q" defaultValue={q} placeholder={t.search.placeholder} />
        <button type="submit">{t.search.button}</button>
      </form>
      {term && count === 0 ? <p className="muted">{t.search.none(term)}</p> : null}
      {term && count > 0 ? <p className="muted">{t.search.count(count)}</p> : null}
      <div className="grid">
        {compare.map((d, i) => <CompareCard key={d.set} deal={d} tint={photoTint(i)} locale={locale} />)}
      </div>
    </div>
  );
}
