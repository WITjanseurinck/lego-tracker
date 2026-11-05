import amazon from '../../data/amazon.json';
import products from '../../data/products.json';
import history from '../../data/history.json';

const hist = history as Record<string, { d: string; p: number }[]>;
const latest = (...d: (string | undefined)[]) => d.filter(Boolean).sort().pop() as string;

const amazonChecked = new Map<string, string>();
for (const i of amazon.items as { set: string; checkedAt?: string }[]) if (i.checkedAt) amazonChecked.set(i.set, i.checkedAt);

/** Laatste keer dat de gegevens van een set gecontroleerd of gewijzigd zijn. */
export function setLastmod(id: string): string {
  const h = hist[id];
  return latest(products.fetchedAt, amazon.fetchedAt, amazonChecked.get(id), h?.[h.length - 1]?.d);
}

/** Meest recente datum in alle prijsgegevens, voor lijstpagina's. */
export const dataLastmod: string = latest(products.fetchedAt, amazon.fetchedAt, ...amazonChecked.values());
