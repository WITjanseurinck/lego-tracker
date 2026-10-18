import type { Metadata } from 'next';
import Link from 'next/link';
import { CompareCard } from '@/components/CompareCard';
import { getCompareDeals } from '@/lib/deals';
import { THEMES, TIME_RANGES, buildHours, getDict2, themeName } from '@/lib/dict2';
import { expandKeyword, matchesKeyword } from '@/lib/finder';
import { formatEur } from '@/lib/format';
import { getI18n } from '@/lib/i18n-server';
import { pageMeta } from '@/lib/seo';
import { photoTint } from '@/lib/themes';

export const dynamic = 'force-dynamic';

type SP = { budget?: string; thema?: string; q?: string; leeftijd?: string; tijd?: string };

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
  const range = TIME_RANGES.find((r) => r.v === sp.tijd);
  const hours = range ? range.v : null;
  const qRaw = (sp.q ?? '').slice(0, 40);
  const kw = expandKeyword(qRaw);
  const used = Boolean(theme || budget || age || hours || kw);

  // Richtbudget: van licht onder tot licht boven (80% tot 125%), de dichtste bij het budget eerst.
  const lo = budget ? budget * 0.8 : 0;
  const hi = budget ? budget * 1.25 : Infinity;
  const price = (d: (typeof all)[number]) => d.offers[0].price;
  const fitsTime = (d: (typeof all)[number]) => !range || (d.pieces !== null && buildHours(d.pieces, d.theme) >= range.lo && buildHours(d.pieces, d.theme) <= range.hi);
  const hrs = (d: (typeof all)[number]) => (d.pieces ? buildHours(d.pieces, d.theme) : 0);
  let list = used
    ? all.filter(
        (d) =>
          (!theme || d.theme === theme) &&
          (!budget || (price(d) >= lo && price(d) <= hi)) &&
          (!age || (d.age !== null && d.age <= age)) &&
          fitsTime(d) &&
          (!kw || matchesKeyword(kw, `${d.name} ${d.set}`, d.theme)),
      )
    : [];
  list = [...list].sort((a, b) => (budget ? Math.abs(price(a) - budget) - Math.abs(price(b) - budget) : price(a) - price(b)));
  // Onmogelijke combinatie (bv. veel bouwtijd en weinig budget): toon wat er het dichtst bij komt.
  let near: { text: string; deal: (typeof all)[number] } | null = null;
  let near2: { text: string; deal: (typeof all)[number] } | null = null;
  if (list.length === 0 && budget && range) {
    const base = all.filter((d) => (!theme || d.theme === theme) && (!age || (d.age !== null && d.age <= age)) && (!kw || matchesKeyword(kw, `${d.name} ${d.set}`, d.theme)));
    const byTime = base.filter(fitsTime).sort((a, b) => price(a) - price(b))[0];
    const byBudget = base.filter((d) => price(d) <= hi).sort((a, b) => hrs(b) - hrs(a))[0];
    const tl = range[locale];
    if (byTime) near = { text: f.nearTime(tl, eur(price(byTime))), deal: byTime };
    if (byBudget) near2 = { text: f.nearBudget(eur(budget), `${Math.max(1, Math.round(hrs(byBudget)))} ${locale === 'fr' ? 'h' : locale === 'en' ? (Math.round(hrs(byBudget)) === 1 ? 'hour' : 'hours') : 'uur'}`), deal: byBudget };
  }
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
        <label>
          <span>{f.time}</span>
          <select name="tijd" defaultValue={hours ?? ''}>
            <option value="">{f.anyTime}</option>
            {TIME_RANGES.map((r) => <option key={r.v} value={r.v}>{r[locale]}</option>)}
          </select>
          <small>{f.timeHelp}</small>
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
          {list.length === 0 ? <p>{near || near2 ? f.timeNone(eur(budget ?? 0), range ? range[locale] : '') : f.none}</p> : null}
          {near || near2 ? (
            <div className="grid near" style={{ marginTop: 24 }}>
              {[near, near2].filter(Boolean).map((n, i) => (
                <div key={n!.deal.set}>
                  <p className="nearnote">{n!.text}</p>
                  <CompareCard deal={n!.deal} tint={photoTint(i)} locale={locale} />
                </div>
              ))}
            </div>
          ) : null}
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
