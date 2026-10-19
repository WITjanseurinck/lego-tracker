import { getCompareDeal } from '@/lib/deals';
import { getDict } from '@/lib/dict';
import { formatEur } from '@/lib/format';
import { isLocale } from '@/lib/i18n';
import { findArticleById } from '@/lib/articles';
import { GIFTS, isGiftSlug } from '@/lib/gifts';
import { getDict2 } from '@/lib/dict2';
import { OG_RATIOS, renderOg, type OgProps } from '@/lib/og';

export const dynamic = 'force-dynamic';

/** Deelafbeelding per taal: /og?l=fr, /og?l=fr&set=31387 of /og?l=fr&a=<artikel-id>. Met &r=16x9, 4x3 of 1x1 voor andere verhoudingen. */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const l = q.get('l');
  const locale = isLocale(l) ? l : 'nl';
  const t = getDict(locale);
  const r = q.get('r');
  const ratio = r && r in OG_RATIOS ? (r as keyof typeof OG_RATIOS) : undefined;
  const og = (p: OgProps) => renderOg({ ...p, ratio });

  const set = q.get('set');
  if (set) {
    const deal = getCompareDeal(set);
    if (deal) {
      return og({
        kicker: `LEGO ${deal.set}`,
        title: deal.name,
        badge: deal.bestDiscount > 0 ? `-${deal.bestDiscount}%` : undefined,
        lines: deal.offers.map((o) => `${o.shop} ${formatEur(o.price, locale)}`),
      });
    }
    return og({ title: t.og.fallbackTitle });
  }

  const gift = q.get('g');
  if (gift && isGiftSlug(gift)) {
    const c = GIFTS[gift].copy[locale];
    const lines = { nl: ['Drie voorstellen per leeftijd', 'Laagste prijs in België'], fr: ['Trois idées par âge', 'Meilleur prix en Belgique'], en: ['Three ideas per age', 'Lowest price in Belgium'] }[locale];
    return og({ kicker: getDict2(locale).giftsLabel, title: c.h1, lines });
  }

  const a = q.get('a');
  if (a) {
    const art = findArticleById(a);
    if (art) return og({ kicker: t.guides.crumb, title: art.text[locale].title, lines: t.og.lines });
  }

  return og({ kicker: t.og.kicker, title: t.og.title, lines: t.og.lines });
}
