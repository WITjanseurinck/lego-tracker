import { formatEur } from '@/lib/format';

/** Tien noppen: links de laagste prijs ooit, rechts de adviesprijs. De grote nop is de prijs van nu. */
export function StudMeter({ price, low, rrp, shop }: { price: number; low: number | null; rrp: number | null; shop?: string }) {
  if (!low || !rrp || rrp <= low) return null;
  const p = Math.min(1, Math.max(0, (price - low) / (rrp - low)));
  const on = Math.round(p * 9);
  return (
    <>
      <div className="meter" role="img" aria-label={`Prijs ${formatEur(price)}, laagste ooit ${formatEur(low)}, adviesprijs ${formatEur(rrp)}`}>
        {Array.from({ length: 10 }, (_, i) => <span key={i} className={i === on ? 'on' : undefined} />)}
      </div>
      <div className="ends"><span>{shop ? `${shop} · ` : ''}laagste ooit {formatEur(low)}</span><span>advies {formatEur(rrp)}</span></div>
    </>
  );
}
