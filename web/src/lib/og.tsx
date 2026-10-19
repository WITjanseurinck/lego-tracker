import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/lib/site';

export const OG_SIZE = { width: 1200, height: 630 };

/** Beeldverhoudingen die Google Discover en Google News graag naast elkaar zien (16:9, 4:3 en 1:1), naast de 1,91:1 van het deelbeeld. */
export const OG_RATIOS = {
  '16x9': { width: 1200, height: 675 },
  '4x3': { width: 1200, height: 900 },
  '1x1': { width: 1200, height: 1200 },
} as const;
export type OgRatio = keyof typeof OG_RATIOS;

export interface OgProps {
  kicker?: string;
  title: string;
  lines?: string[];
  badge?: string;
  /** Weglaten voor 1200x630. */
  ratio?: OgRatio;
}

/** Deelbeeld van 1200x630 (of een andere verhouding, zie OG_RATIOS) in de huisstijl: geel/donker, grote titel, prijsregels. */
export function renderOg({ kicker, title, lines = [], badge, ratio }: OgProps) {
  const size = title.length > 60 ? 54 : title.length > 36 ? 66 : 78;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0F1722', color: '#ffffff', padding: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#FFC52E', display: 'flex', flexWrap: 'wrap', padding: 7, gap: 4 }}>
              {[0, 1, 2, 3].map((i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: '#E8AC10' }} />)}
            </div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{SITE_NAME}</div>
          </div>
          {badge ? <div style={{ display: 'flex', background: '#FFC52E', color: '#0F1722', fontSize: 34, fontWeight: 800, padding: '8px 22px', borderRadius: 12 }}>{badge}</div> : null}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {kicker ? <div style={{ fontSize: 30, color: '#FFC52E', fontWeight: 600 }}>{kicker}</div> : null}
          <div style={{ fontSize: size, lineHeight: 1.05, fontWeight: 800, letterSpacing: -2 }}>{title}</div>
        </div>
        <div style={{ display: 'flex', gap: 28, fontSize: 36, color: '#C9D1DC' }}>
          {lines.map((l) => <div key={l} style={{ display: 'flex' }}>{l}</div>)}
        </div>
      </div>
    ),
    { ...(ratio ? OG_RATIOS[ratio] : OG_SIZE) },
  );
}
