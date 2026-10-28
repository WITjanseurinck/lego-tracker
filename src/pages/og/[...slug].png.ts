import type { APIRoute, GetStaticPaths } from 'astro';
import { allArticles } from '@/lib/articles';
import { getCompareDeals } from '@/lib/deals';
import { getDict } from '@/lib/dict';
import { getDict2 } from '@/lib/dict2';
import { formatEur } from '@/lib/format';
import { GIFT_SLUGS, GIFTS } from '@/lib/gifts';
import { LOCALES } from '@/lib/i18n';
import { OG_RATIOS, renderOg, type OgProps, type OgRatio } from '@/lib/og';

const giftLines = {
  nl: ['Drie voorstellen per leeftijd', 'Laagste prijs in België'],
  fr: ['Trois idées par âge', 'Meilleur prix en Belgique'],
  en: ['Three ideas per age', 'Lowest price in Belgium'],
} as const;

/** Eén bestand per taal: algemeen, per set, per cadeaupagina en per artikel (de artikelen ook in drie extra verhoudingen). */
export const getStaticPaths = (() => {
  const out: { params: { slug: string }; props: { make: () => OgProps; ratio?: OgRatio } }[] = [];
  const add = (slug: string, make: () => OgProps, ratio?: OgRatio) => out.push({ params: { slug }, props: { make, ratio } });
  for (const l of LOCALES) {
    const t = getDict(l);
    add(l, () => ({ kicker: t.og.kicker, title: t.og.title, lines: t.og.lines }));
    for (const d of getCompareDeals()) {
      add(`${l}-${d.set}`, () => ({
        kicker: `LEGO ${d.set}`,
        title: d.name,
        badge: d.bestDiscount > 0 ? `-${d.bestDiscount}%` : undefined,
        lines: d.offers.map((o) => `${o.shop} ${formatEur(o.price, l)}`),
      }));
    }
    for (const g of GIFT_SLUGS) add(`${l}-g-${g}`, () => ({ kicker: getDict2(l).giftsLabel, title: GIFTS[g].copy[l].h1, lines: [...giftLines[l]] }));
    for (const a of allArticles()) {
      const make = () => ({ kicker: t.guides.crumb, title: a.text[l].title, lines: t.og.lines });
      add(`${l}-a-${a.id}`, make);
      for (const r of Object.keys(OG_RATIOS) as OgRatio[]) add(`${l}-a-${a.id}-${r}`, make, r);
    }
  }
  return out;
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const body = await renderOg({ ...props.make(), ratio: props.ratio });
  return new Response(body, { headers: { 'Content-Type': 'image/png' } });
};
