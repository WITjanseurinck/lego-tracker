import { bolAffiliateUrl, type BolDeal } from '@/lib/bol';
import { formatEur } from '@/lib/format';

export function BolDealCard({ deal, tint = '#1E55A8' }: { deal: BolDeal; tint?: string }) {
  const href = bolAffiliateUrl(deal.url, deal.set);
  const disc = deal.strikethrough && deal.strikethrough > deal.price ? Math.round((1 - deal.price / deal.strikethrough) * 100) : null;
  return (
    <article className="tile">
      <a href={href} className="pic" style={{ background: tint }} aria-label={`LEGO ${deal.set} ${deal.name} bij bol`} target="_blank" rel="sponsored noopener">
        <img src={deal.image} alt={`LEGO ${deal.set} ${deal.name}`} loading="lazy" referrerPolicy="no-referrer" />
      </a>
      <div className="info">
        <div className="num">{deal.set}</div>
        <a href={href} className="name" target="_blank" rel="sponsored noopener">{deal.name}</a>
        <div className="pr">
          <span className="price">{formatEur(deal.price)}</span>
          {deal.strikethrough ? <span className="rrp">{formatEur(deal.strikethrough)}</span> : null}
          {disc ? <span className="disc">-{disc}%</span> : null}
        </div>
        <a href={href} className="btn" target="_blank" rel="sponsored noopener" data-affiliate="bol">Bekijk bij bol</a>
      </div>
    </article>
  );
}
