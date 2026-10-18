import { formatEur } from '@/lib/format';
import type { CompareDeal } from '@/lib/deals';

export function CompareCard({ deal, tint = '#1E55A8' }: { deal: CompareDeal; tint?: string }) {
  const best = deal.offers[0];
  const second = deal.offers[1];
  const saving = second ? second.price - best.price : 0;
  return (
    <article className="tile">
      <a href={best.url} className="pic" style={{ background: tint }} aria-label={`LEGO ${deal.set} ${deal.name}`} target="_blank" rel="sponsored noopener">
        {deal.image ? <img src={deal.image} alt={`LEGO ${deal.set} ${deal.name}`} loading="lazy" referrerPolicy="no-referrer" /> : <span className="none">LEGO {deal.set}</span>}
        {deal.bestDiscount > 0 ? <span className="flag">-{deal.bestDiscount}%</span> : null}
      </a>
      <div className="info">
        <div className="num">{deal.set}</div>
        <a href={best.url} className="name" target="_blank" rel="sponsored noopener">{deal.name}</a>
        <ul className="offers">
          {deal.offers.map((o, i) => (
            <li key={o.shop} className={i === 0 ? 'best' : undefined}>
              <span className="shop">{o.shop}</span>
              <span className="price">{formatEur(o.price)}</span>
              {o.strikethrough && o.strikethrough > o.price ? <span className="rrp">{formatEur(o.strikethrough)}</span> : null}
              <a href={o.url} className="go" target="_blank" rel="sponsored noopener" data-affiliate={o.shop.toLowerCase()}>Bekijk</a>
            </li>
          ))}
        </ul>
        {second ? (
          saving < 0.005
            ? <p className="cmp">Zelfde prijs bij {best.shop} en {second.shop}.</p>
            : <p className="cmp">Goedkoopst bij {best.shop}, {formatEur(saving)} minder dan bij {second.shop}.</p>
        ) : <p className="cmp">Enkel gevonden bij {best.shop}.</p>}
      </div>
    </article>
  );
}
