import { formatEur, formatDate } from '@/lib/format';

export interface Point {
  t: string;
  price: number;
}

/** Eenvoudige SVG-lijngrafiek, zonder client-side JavaScript */
export function PriceChart({ points, rrp }: { points: Point[]; rrp?: number | null }) {
  if (points.length < 2) {
    return <p className="muted">Er is nog te weinig historiek voor een grafiek.</p>;
  }

  const W = 640;
  const H = 240;
  const pad = { l: 56, r: 12, t: 12, b: 28 };

  const times = points.map((p) => Date.parse(p.t));
  const prices = points.map((p) => p.price);
  const tMin = Math.min(...times);
  const tMax = Math.max(...times);
  const allPrices = rrp ? [...prices, rrp] : prices;
  const pMin = Math.min(...allPrices) * 0.95;
  const pMax = Math.max(...allPrices) * 1.05;

  const x = (t: number) => pad.l + ((t - tMin) / Math.max(1, tMax - tMin)) * (W - pad.l - pad.r);
  const y = (p: number) => pad.t + (1 - (p - pMin) / Math.max(0.01, pMax - pMin)) * (H - pad.t - pad.b);

  let d = `M ${x(times[0])} ${y(prices[0])}`;
  for (let i = 1; i < points.length; i++) {
    d += ` H ${x(times[i])} V ${y(prices[i])}`;
  }

  const ticks = [pMin, (pMin + pMax) / 2, pMax];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Prijsverloop">
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={pad.l} x2={W - pad.r} y1={y(tick)} y2={y(tick)} stroke="#D5DBE3" />
          <text x={pad.l - 8} y={y(tick) + 4} textAnchor="end" fontSize="11" fill="#5B6577">
            {formatEur(tick)}
          </text>
        </g>
      ))}
      {rrp ? (
        <g>
          <line x1={pad.l} x2={W - pad.r} y1={y(rrp)} y2={y(rrp)} stroke="#0F1722" strokeDasharray="3 5" />
          <text x={W - pad.r} y={y(rrp) - 4} textAnchor="end" fontSize="11" fill="#5B6577">
            adviesprijs
          </text>
        </g>
      ) : null}
      <path d={`${d} V ${H - pad.b} H ${x(times[0])} Z`} fill="#0F1722" fillOpacity="0.06" />
      <path d={d} fill="none" stroke="#14213D" strokeWidth="2" strokeLinejoin="round" />
      <circle cx={x(times[times.length - 1])} cy={y(prices[prices.length - 1])} r="7" fill="var(--accent)" stroke="#0F1722" strokeWidth="2" />
      <text x={pad.l} y={H - 8} fontSize="11" fill="#5B6577">{formatDate(points[0].t)}</text>
      <text x={W - pad.r} y={H - 8} textAnchor="end" fontSize="11" fill="#5B6577">
        {formatDate(points[points.length - 1].t)}
      </text>
    </svg>
  );
}
