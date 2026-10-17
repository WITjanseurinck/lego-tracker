import type { FeedItem, Vertical } from '../types.js';

/**
 * Lego-setnummers zijn 4 tot 6 cijfers (bv. 75192, 10294, 910001).
 * Feeds zetten het nummer meestal in de titel, soms enkel de EAN.
 */
const SET_NUMBER_RE = /(?<![\d.,])(\d{4,6})(?![\d.,])/g;

function extractSetNumber(title: string): string | undefined {
  const candidates = [...title.matchAll(SET_NUMBER_RE)].map((m) => m[1]);
  // Jaartallen (2000 tot 2035) zijn geen setnummers
  return candidates.find((c) => !(c.length === 4 && Number(c) >= 2000 && Number(c) <= 2035));
}

export const lego: Vertical = {
  id: 'lego',
  label: 'Lego',
  brand: 'LEGO',
  searchTerm: 'lego',
  countries: ['BE'],
  officialImageHosts: ['lego.com'],
  isRelevant: (item: FeedItem) => /\blego\b/i.test(item.title),
  skuFor: (item: FeedItem) => item.sku ?? extractSetNumber(item.title),
  cleanName: (item: FeedItem, sku: string) =>
    item.title
      .replace(/lego/gi, '')
      .replace(sku, '')
      .replace(/[-|:]+\s*$/, '')
      .replace(/\s{2,}/g, ' ')
      .trim(),
};
