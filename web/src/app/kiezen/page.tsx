import type { Metadata } from 'next';
import Link from 'next/link';
import { CompareCard } from '@/components/CompareCard';
import { getCompareDeals } from '@/lib/deals';
import { THEMES, getDict2, themeName } from '@/lib/dict2';
import { expandKeyword, matchesKeyword } from '@/lib/finder';
import { formatEur } from '@/lib/format';
import { getI18n } from '@/lib/i18n-server';
import { pageMeta } from '@/lib/seo';
import { photoTint } from '@/lib/themes';

export const dynamic = 'force-dynamic';

type SP = { budget?: string; thema?: string; q?: string; leeftijd?: string };

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();
  const f = getDict2(locale).finder;
  return pageMeta({ locale, path: '/kiezen', title: f.title, description: f.desc });
}

const num = (v: string | undefined) => {
  const n = Number((v ?? '').replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : null;
};

export default async function Kiezen({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const { locale, href } = await getI18n();
  const f = getDict2(locale).finder;
  const eur = (n: number) => formatEur(n, locale);
  const all = getCompareDeals();
  const themes = Object.keys(THEMES).filter((k) => all.some((d) => d.theme === k));
  const theme = sp.thema && themes.includes(sp.thema) ? sp.thema : '';
  const budget = num(sp.budget);
  const age = num(sp.leeftijd);
  const qRaw = (sp.q ?? '').slice(0, 40);
  const kw = expandKeyword(qRaw);
  const used = Boolean(theme || budget || age || kw);

  // Richtbudget: van licht onder tot licht boven (80% tot 125%), de dichtste bij het budget eerst.
  const lo = budget ? budget * 0.8 : 0;
  const hi = budget ? budget * 1.25 : Infinity;
  const price = (d: (typeof all)[number]) => d.offers[0].price;
  let list = used
    ? all.filter(
        (d) =>
          (!theme || d.theme === theme) &&
          (!budget || (price(d) >= lo && price(d) <= hi)) &&
          (!age || (d.age !== null && d.age <= age)) &&
          (!kw || matchesKeyword(kw, `${d.name} ${d.set}`, d.theme)),
      )
    : [];
  list = [...list].sort((a, b) => (budget ? Math.abs(price(a) - budget) - Math.abs(price(b) - budget) : price(a) - price(b)));
  const ageOptions = [3, 6, 8, 10, 12, 14, 18];

  return (
    <div className="wrap page">
      <h1>{f.h1}</h1>
      <p className="lead">{f.lead}</p>
      <form className="finder" action={href('/kiezen')} method="get">
        <label>
          <span>{f.budget}</span>
          <input type="number" name="budget" min="1" step="1" inputMode="numeric" defaultValue={budget ?? ''} placeholder={f.budgetPh} />
          <small>{f.budgetHelp}</small>
        </label>
        <label>
          <span>{f.theme}</span>
          <select name="thema" defaultValue={theme}>
            <option value="">{f.anyTheme}</option>
            {themes.map((k) => <option key={k} value={k}>{themeName(k, locale)}</option>)}
          </select>
        </label>
        <label>
          <span>{f.keyword}</span>
          <input type="search" name="q" maxLength={40} defaultValue={qRaw} placeholder={f.keywordPh} />
        </label>
        <label>
          <span>{f.age}</span>
          <input type="number" name="leeftijd" min="1" max="99" step="1" inputMode="numeric" defaultValue={age ?? ''} placeholder={f.agePh} list="ages" />
          <datalist id="ages">{ageOptions.map((a) => <option key={a} value={a} />)}</datalist>
          <small>{f.ageHelp}</small>
        </label>
        <div className="actions">
          <button type="submit" className="btn dark">{f.submit}</button>
          {used ? <Link href={href('/kiezen')}>{f.reset}</Link> : null}
        </div>
      </form>

      {used ? (
        <>
          <p className="muted" role="status">
            {f.results(list.length)}
            {budget ? ` · ${f.around(eur(lo), eur(hi))}` : ''}
          </p>
          {list.length === 0 ? <p>{f.none}</p> : null}
          <div className="grid" style={{ marginTop: 24 }}>
            {list.slice(0, 48).map((d, i) => <CompareCard key={d.set} deal={d} tint={photoTint(i)} locale={locale} />)}
          </div>
        </>
      ) : (
        <section className="sec">
          <ul className="chips">
            {themes.filter((k) => k !== 'overig').map((k) => <li key={k}><Link href={href(`/thema/${k}`)}>{themeName(k, locale)}</Link></li>)}
          </ul>
        </section>
      )}
    </div>
  );
}
