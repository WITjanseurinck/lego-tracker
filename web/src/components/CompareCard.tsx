import Link from 'next/link';
import { getDict } from '@/lib/dict';
import { formatEur } from '@/lib/format';
import { localizePath, type Locale } from '@/lib/i18n';
import type { CompareDeal } from '@/lib/deals';
import { getDict2, themeName } from '@/lib/dict2';

export function CompareCard({ deal, tint = '#1E55A8', locale = 'nl' }: { deal: CompareDeal; tint?: string; locale?: Locale }) {
  const t = getDict(locale).card;
  const t2 = getDict2(locale);
  const eur = (n: number) => formatEur(n, locale);
  const best = deal.offers[0];
  const second = deal.offers[1];
  const saving = second ? second.price - best.price : 0;
  const href = localizePath(locale, `/set/${deal.set}`);
  return (
    <article className="tile">
      <Link href={href} className="pic" style={{ background: tint }} aria-label={t.aria(`LEGO ${deal.set} ${deal.name}`)}>
        {deal.image ? <img src={deal.image} alt={`LEGO ${deal.set} ${deal.name}`} loading="lazy" referrerPolicy="no-referrer" /> : <span className="none">LEGO {deal.set}</span>}
        {deal.bestDiscount > 0 ? <span className="flag">-{deal.bestDiscount}%</span> : null}
      </Link>
      <div className="info">
        <div className="num">{deal.set}</div>
        <Link href={href} className="name">{deal.name}</Link>
        <ul className="offers">
          {deal.offers.map((o, i) => (
            <li key={o.shop} className={i === 0 && (deal.offers.length < 2 || deal.offers[1].price - deal.offers[0].price >= 0.005) ? 'best' : undefined}>
              <span className="shop">{o.shop}</span>
              <span className="price">{eur(o.price)}</span>
              {o.strikethrough && o.strikethrough > o.price ? <span className="rrp">{eur(o.strikethrough)}</span> : null}
              <a href={o.url} className="go" target="_blank" rel="sponsored noopener" data-affiliate={o.shop.toLowerCase()}>{t.see}</a>
            </li>
          ))}
        </ul>
        {second ? (
          saving < 0.005
            ? <p className="cmp">{t.same(best.shop, second.shop)}</p>
            : <p className="cmp">{t.cheaper(best.shop, eur(saving), second.shop)}</p>
        ) : <p className="cmp">{t.only(best.shop)}</p>}
        {deal.theme !== 'overig' ? <Link href={localizePath(locale, `/thema/${deal.theme}`)} className="themelink">{t2.moreIn(themeName(deal.theme, locale))} →</Link> : null}
      </div>
    </article>
  );
}
