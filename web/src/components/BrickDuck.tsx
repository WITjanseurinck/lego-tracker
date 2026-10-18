/** Decoratieve illustratie voor een onmogelijke combinatie: een groot eendje van stenen, met een bouwkraan. */
const P = 24; // noppenafstand
const H = 24; // steenhoogte

function Brick({ x, y, w, c, d }: { x: number; y: number; w: number; c: string; d: string }) {
  return (
    <g>
      {Array.from({ length: w }).map((_, i) => (
        <rect key={i} x={x + i * P + 6} y={y - 5} width={12} height={6} rx={2} fill={c} stroke={d} strokeWidth={1.5} />
      ))}
      <rect x={x} y={y} width={w * P} height={H} rx={2} fill={c} stroke={d} strokeWidth={1.5} />
    </g>
  );
}

export function BrickDuck({ caption }: { caption: string }) {
  const Y = '#facc15', YD = '#a16207', R = '#ef4444', RD = '#991b1b', G = '#9ca3af', GD = '#4b5563', O = '#f97316', OD = '#9a3412';
  return (
    <figure className="duckfig">
      <svg viewBox="0 0 480 290" role="img" aria-label={caption} className="duck">
        {/* grondplaat */}
        <rect x="0" y="270" width="480" height="14" rx="3" fill={G} stroke={GD} strokeWidth="1.5" />
        {Array.from({ length: 19 }).map((_, i) => <rect key={i} x={10 + i * 25} y={266} width={12} height={5} rx={2} fill={G} stroke={GD} strokeWidth="1.2" />)}

        {/* eend, bouwlaag per laag */}
        <Brick x={124} y={246} w={3} c={R} d={RD} />
        <Brick x={100} y={222} w={8} c={Y} d={YD} />
        <Brick x={100} y={198} w={8} c={Y} d={YD} />
        <Brick x={124} y={174} w={5} c={Y} d={YD} />
        <Brick x={268} y={174} w={1} c={Y} d={YD} />
        <Brick x={124} y={150} w={3} c={Y} d={YD} />
        <Brick x={76} y={150} w={2} c={R} d={RD} />
        <Brick x={124} y={126} w={3} c={Y} d={YD} />
        <circle cx="152" cy="162" r="6.5" fill="#fff" stroke="#111827" strokeWidth="1.5" />
        <circle cx="150" cy="162" r="3" fill="#111827" />

        {/* kraan */}
        <rect x="330" y="258" width="120" height="12" rx="2" fill={O} stroke={OD} strokeWidth="1.5" />
        <rect x="372" y="64" width="20" height="194" fill="none" stroke={OD} strokeWidth="2" />
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} d={i % 2 ? `M372 ${64 + i * 24.25} L392 ${88.25 + i * 24.25}` : `M392 ${64 + i * 24.25} L372 ${88.25 + i * 24.25}`} stroke={OD} strokeWidth="2" />
        ))}
        <rect x="120" y="56" width="340" height="10" rx="2" fill={O} stroke={OD} strokeWidth="1.5" />
        <path d="M382 24 L370 56 M382 24 L394 56 M382 24 L120 56 M382 24 L452 56" stroke={OD} strokeWidth="1.5" fill="none" />
        <rect x="428" y="66" width="30" height="26" rx="2" fill={G} stroke={GD} strokeWidth="1.5" />
        <rect x="396" y="66" width="26" height="22" rx="2" fill="#bae6fd" stroke={OD} strokeWidth="1.5" />

        {/* katrol, kabel en haak met een steen voor op de kop */}
        <rect x="140" y="66" width="20" height="8" rx="2" fill={GD} />
        <line x1="150" y1="74" x2="150" y2="82" stroke={GD} strokeWidth="2" />
        <path d="M150 82 v6 M142 88 h16" stroke={GD} strokeWidth="2" fill="none" />
        <line x1="144" y1="88" x2="144" y2="97" stroke={GD} strokeWidth="1.5" />
        <line x1="156" y1="88" x2="156" y2="97" stroke={GD} strokeWidth="1.5" />
        <Brick x={126} y={102} w={2} c={Y} d={YD} />
      </svg>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
