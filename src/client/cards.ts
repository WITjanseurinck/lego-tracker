import { getDict } from '@/lib/dict';
import { getDict2, themeName } from '@/lib/dict2';
import { formatEur } from '@/lib/format';
import { localizePath, type Locale } from '@/lib/i18n';
import { photoTint } from '@/lib/themes';

/** Een set zoals de pagina's die in de browser nodig hebben (zonder lange beschrijvingen). */
export interface ClientOffer { shop: string; price: number; strikethrough: number | null; url: string; stock?: 'out' }
export interface ClientDeal {
  set: string;
  name: string;
  image: string | null;
  offers: ClientOffer[];
  bestDiscount: number;
  theme: string;
  pieces: number | null;
  age: number | null;
}

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

let cache: Promise<ClientDeal[]> | null = null;
/** Alle sets, één keer opgehaald (gedeeld bestand voor alle talen). */
export function loadDeals(): Promise<ClientDeal[]> {
  cache ??= fetch('/data/deals.json').then((r) => r.json());
  return cache;
}

/** Zelfde opmaak als components/CompareCard.astro. */
export function renderCard(deal: ClientDeal, tintIndex: number, locale: Locale): string {
  const t = getDict(locale).card;
  const t2 = getDict2(locale);
  const eur = (n: number) => formatEur(n, locale);
  const best = deal.offers[0];
  const second = deal.offers[1];
  const saving = second ? second.price - best.price : 0;
  const href = localizePath(locale, `/set/${deal.set}`);
  const name = `LEGO ${deal.set} ${deal.name}`;
  const isBest = (i: number) => i === 0 && (deal.offers.length < 2 || deal.offers[1].price - deal.offers[0].price >= 0.005);
  const offers = deal.offers
    .map(
      (o, i) => `<li${isBest(i) ? ' class="best"' : ''}><a href="${esc(o.url)}" class="pill" target="_blank" rel="sponsored nofollow noopener" data-affiliate="${esc(o.shop.toLowerCase())}" aria-label="${esc(`${t.see} ${o.shop}: ${eur(o.price)}`)}"><span class="shop">${esc(o.shop)}${o.stock ? `<small class="stockout"> · ${esc(t2.stockOut)}</small>` : ''}</span><span class="price">${eur(o.price)}</span><span class="rrp">${o.strikethrough && o.strikethrough > o.price ? eur(o.strikethrough) : ''}</span><span class="go" aria-hidden="true">${esc(t.see)} →</span></a></li>`,
    )
    .join('');
  const cmp = second ? (saving < 0.005 ? t.same(best.shop, second.shop) : t.cheaper(best.shop, eur(saving), second.shop)) : t.only(best.shop);
  const themeLink = deal.theme !== 'overig' ? `<a href="${localizePath(locale, `/thema/${deal.theme}`)}" class="themelink">${esc(t2.moreIn(themeName(deal.theme, locale)))} →</a>` : '';
  return `<article class="tile"><a href="${href}" class="pic" style="background:${photoTint(tintIndex)}" aria-label="${esc(t.aria(name))}">${deal.image ? `<img src="${esc(deal.image)}" alt="${esc(name)}" loading="lazy" referrerpolicy="no-referrer">` : `<span class="none">LEGO ${deal.set}</span>`}${deal.bestDiscount > 0 ? `<span class="flag">-${deal.bestDiscount}%</span>` : ''}</a><div class="info"><div class="num">LEGO ${deal.set}</div><a href="${href}" class="name">${esc(deal.name)}</a><ul class="offers">${offers}</ul><p class="cmp">${esc(cmp)}</p>${themeLink}</div></article>`;
}

export const numParam = (v: string | null | undefined) => {
  const n = Number((v ?? '').replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : null;
};

export const pageLocale = (): Locale => {
  const l = document.documentElement.lang;
  return l === 'fr' || l === 'en' ? l : 'nl';
};
