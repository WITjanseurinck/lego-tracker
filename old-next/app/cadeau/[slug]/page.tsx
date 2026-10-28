import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CompareCard } from '@/components/CompareCard';
import { getCompareDeals } from '@/lib/deals';
import { THEMES, getDict2, themeName } from '@/lib/dict2';
import { expandKeyword, matchesKeyword } from '@/lib/finder';
import { AGE_GROUPS, GIFTS, TIER_LABELS, isGiftSlug, pickTrio } from '@/lib/gifts';
import { formatEur } from '@/lib/format';
import { getI18n } from '@/lib/i18n-server';
import { pageMeta } from '@/lib/seo';
import { photoTint } from '@/lib/themes';

export const dynamic = 'force-dynamic';

type SP = { leeftijd?: string; budget?: string; thema?: string; q?: string };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isGiftSlug(slug)) return {};
  const { locale } = await getI18n();
  const c = GIFTS[slug].copy[locale];
  return pageMeta({ locale, path: `/cadeau/${slug}`, title: c.title, description: c.desc, og: { g: slug } });
}

const num = (v: string | undefined) => {
  const n = Number((v ?? '').replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : null;
};

export default async function Cadeau({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<SP> }) {
  const { slug } = await params;
  if (!isGiftSlug(slug)) notFound();
  const sp = await searchParams;
  const { locale, href } = await getI18n();
  const g = GIFTS[slug];
  const c = g.copy[locale];
  const t2 = getDict2(locale);
  const f = t2.finder;
  const base = `/cadeau/${slug}`;
  const all = getCompareDeals();
  const group = AGE_GROUPS.find((a) => a.v === sp.leeftijd);
  const trio = group ? pickTrio(all, group, g.tiers) : [];

  // Uitgebreide keuzehulp, op deze pagina zelf.
  const themes = Object.keys(THEMES).filter((k) => all.some((d) => d.theme === k));
  const theme = sp.thema && themes.includes(sp.thema) ? sp.thema : '';
  const budget = num(sp.budget);
  const qRaw = (sp.q ?? '').slice(0, 40);
  const kw = expandKeyword(qRaw);
  const used = Boolean(theme || budget || kw);
  const price = (d: (typeof all)[number]) => d.offers[0].price;
  const extra = used
    ? all
        .filter(
          (d) =>
            (!theme || d.theme === theme) &&
            (!budget || (price(d) >= budget * 0.8 && price(d) <= budget * 1.25)) &&
            (!group || (d.age !== null && d.age >= group.lo && d.age <= group.hi)) &&
            (!kw || matchesKeyword(kw, `${d.name} ${d.set}`, d.theme)),
        )
        .sort((a, b) => (budget ? Math.abs(price(a) - budget) - Math.abs(price(b) - budget) : price(a) - price(b)))
        .slice(0, 3)
    : [];
  const fullQuery = new URLSearchParams();
  if (budget) fullQuery.set('budget', String(budget));
  if (theme) fullQuery.set('thema', theme);
  if (qRaw) fullQuery.set('q', qRaw);
  if (group) fullQuery.set('leeftijd', String(group.hi === 99 ? 18 : group.hi));
  const qs = fullQuery.toString();

  return (
    <div className="wrap page">
      <h1>{c.h1}</h1>
      <p className="lead">{c.lead}</p>
      <p className="giftintro">{c.intro}</p>

      <section className="sec" id="leeftijd">
        <h2>{c.ageTitle}</h2>
        <ul className="chips agechips">
          {AGE_GROUPS.map((a) => (
            <li key={a.v}>
              <Link href={href(`${base}?leeftijd=${a.v}#voorstellen`)} className={group?.v === a.v ? 'on' : undefined} scroll={false}>
                {a.label[locale]}
              </Link>
            </li>
          ))}
        </ul>
        <p className="muted small">{c.ageHelp}</p>
      </section>

      {group ? (
        <section className="sec" id="voorstellen">
          <h2>{c.picksTitle(group.label[locale])}</h2>
          <div className="grid related3">
            {trio.map(({ tier, deal }, i) => (
              <div key={deal.set}>
                <p className="nearnote">{TIER_LABELS[locale][tier]}</p>
                <CompareCard deal={deal} tint={photoTint(i)} locale={locale} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="sec" id="keuzehulp">
        <h2>{c.midTitle}</h2>
        <p className="lead">{c.midText}</p>
        <form className="finder" action={`${href(base)}#keuzehulp`} method="get">
          {group ? <input type="hidden" name="leeftijd" value={group.v} /> : null}
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
          <div className="actions">
            <button type="submit" className="btn dark">{f.submit}</button>
            {used ? <Link href={href(base)}>{f.reset}</Link> : null}
          </div>
        </form>
        {used ? (
          extra.length ? (
            <div className="grid related3" style={{ marginTop: 24 }}>
              {extra.map((d, i) => <CompareCard key={d.set} deal={d} tint={photoTint(i + 1)} locale={locale} />)}
            </div>
          ) : (
            <p style={{ marginTop: 24 }}>{f.none}</p>
          )
        ) : null}
        <p style={{ marginTop: 16 }}>
          <Link href={href(`/kiezen${qs ? `?${qs}` : ''}`)}>{f.nav} →</Link>
        </p>
      </section>

      <section className="sec">
        <h2>{c.endTitle}</h2>
        <p className="giftintro">{c.endText}</p>
        <p className="small muted">{t2.giftDisclosure}</p>
      </section>
    </div>
  );
}
