import { getCompareDeals } from '@/lib/deals';
import { clientNames } from '@/lib/setnames';

/** Alle sets in compacte vorm voor de zoek- en keuzepagina's, die in de browser filteren. */
export function GET() {
  const deals = getCompareDeals().map((d) => ({
    set: d.set,
    name: d.name,
    ...clientNames(d.set, d.name),
    image: d.image,
    offers: d.offers,
    bestDiscount: d.bestDiscount,
    theme: d.theme,
    pieces: d.pieces,
    age: d.age,
  }));
  return new Response(JSON.stringify(deals), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
