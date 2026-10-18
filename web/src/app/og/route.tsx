import { getCompareDeal } from '@/lib/deals';
import { getDict } from '@/lib/dict';
import { formatEur } from '@/lib/format';
import { isLocale } from '@/lib/i18n';
import { findArticleById } from '@/lib/articles';
import { GIFTS, isGiftSlug } from '@/lib/gifts';
import { getDict2 } from '@/lib/dict2';
import { renderOg } from '@/lib/og';

export const dynamic = 'force-dynamic';

/** Deelafbeelding per taal: /og?l=fr, /og?l=fr&set=31387 of /og?l=fr&a=<artikel-id>. */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const l = q.get('l');
  const locale = isLocale(l) ? l : 'nl';
  const t = getDict(locale);

  const set = q.get('set');
  if (set) {
    const deal = getCompareDeal(set);
    if (deal) {
      return renderOg({
        kicker: `LEGO ${deal.set}`,
        title: deal.name,
        badge: deal.bestDiscount > 0 ? `-${deal.bestDiscount}%` : undefined,
        lines: deal.offers.map((o) => `${o.shop} ${formatEur(o.price, locale)}`),
      });
    }
    return renderOg({ title: t.og.fallbackTitle });
  }

  const gift = q.get('g');
  if (gift && isGiftSlug(gift)) {
    const c = GIFTS[gift].copy[locale];
    const lines = { nl: ['Drie voorstellen per leeftijd', 'Laagste prijs in België'], fr: ['Trois idées par âge', 'Meilleur prix en Belgique'], en: ['Three ideas per age', 'Lowest price in Belgium'] }[locale];
    return renderOg({ kicker: getDict2(locale).giftsLabel, title: c.h1, lines });
  }

  const a = q.get('a');
  if (a) {
    const art = findArticleById(a);
    if (art) return renderOg({ kicker: t.guides.crumb, title: art.text[locale].title, lines: t.og.lines });
  }

  return renderOg({ kicker: t.og.kicker, title: t.og.title, lines: t.og.lines });
}
