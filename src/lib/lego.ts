/** Rakuten Advertising: publisher-id (te vinden onder Links > Deep Links). Zolang die niet is ingevuld, linken we gewoon naar LEGO.com. */
const RAKUTEN_ID = (process.env.RAKUTEN_ID ?? '').trim();
const LEGO_MID = process.env.LEGO_MID || '50641';

export function legoUrl(slug: string): string {
  const url = `https://www.lego.com/nl-be/product/${slug}`;
  if (!RAKUTEN_ID) return url;
  return `https://click.linksynergy.com/deeplink?id=${encodeURIComponent(RAKUTEN_ID)}&mid=${encodeURIComponent(LEGO_MID)}&murl=${encodeURIComponent(url)}`;
}

export const legoAffiliateActive = Boolean(RAKUTEN_ID);
