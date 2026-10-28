// Deelbeelden (Open Graph) in de huisstijl: donker met geel, grote titel, prijsregels.
// Draait bij de build via src/pages/og/[...slug].png.ts, met satori (tekst naar paden) en resvg (naar png).
import { readFileSync } from 'node:fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { SITE_NAME } from '@/lib/site';

export const OG_SIZE = { width: 1200, height: 630 };
/** Beeldverhoudingen die Google Discover en Google News graag naast elkaar zien, naast de 1,91:1 van het deelbeeld. */
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
  ratio?: OgRatio;
}

const font = (w: number) => readFileSync(`${process.cwd()}/node_modules/@fontsource/hanken-grotesk/files/hanken-grotesk-latin-${w}-normal.woff`);
const fonts = [600, 700, 800].map((w) => ({ name: 'Hanken Grotesk', data: font(w), weight: w as 600 | 700 | 800, style: 'normal' as const }));

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({ type, props: { style: { display: 'flex', ...style }, children } });

export async function renderOg({ kicker, title, lines = [], badge, ratio }: OgProps): Promise<Buffer> {
  const size = ratio ? OG_RATIOS[ratio] : OG_SIZE;
  const fs = title.length > 60 ? 54 : title.length > 36 ? 66 : 78;
  const logo = h('div', { alignItems: 'center', gap: 16 }, [
    h('div', { width: 44, height: 44, borderRadius: 10, background: '#FFC52E', flexWrap: 'wrap', padding: 7, gap: 4 },
      [0, 1, 2, 3].map(() => h('div', { width: 12, height: 12, borderRadius: 6, background: '#E8AC10' }))),
    h('div', { fontSize: 32, fontWeight: 700 }, SITE_NAME),
  ]);
  const tree = h('div', { width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'space-between', background: '#0F1722', color: '#ffffff', padding: 64, fontFamily: 'Hanken Grotesk' }, [
    h('div', { alignItems: 'center', justifyContent: 'space-between' }, [
      logo,
      badge ? h('div', { background: '#FFC52E', color: '#0F1722', fontSize: 34, fontWeight: 800, padding: '8px 22px', borderRadius: 12 }, badge) : h('div', {}),
    ]),
    h('div', { flexDirection: 'column', gap: 18 }, [
      ...(kicker ? [h('div', { fontSize: 30, color: '#FFC52E', fontWeight: 600 }, kicker)] : []),
      h('div', { fontSize: fs, lineHeight: 1.05, fontWeight: 800, letterSpacing: -2 }, title),
    ]),
    h('div', { gap: 28, fontSize: 36, color: '#C9D1DC', fontWeight: 600 }, lines.map((l) => h('div', {}, l))),
  ]);
  const svg = await satori(tree as never, { ...size, fonts });
  return Buffer.from(new Resvg(svg, { fitTo: { mode: 'width', value: size.width } }).render().asPng());
}
