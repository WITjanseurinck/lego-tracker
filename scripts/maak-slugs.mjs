// Maakt src/lib/set-slugs.json uit data/names.json: per setnummer een slug per taal (nl, fr, en).
// Draai `node scripts/maak-slugs.mjs` na elke update van data/names.json.
import { readFileSync, writeFileSync } from 'node:fs';

const names = JSON.parse(readFileSync(new URL('../data/names.json', import.meta.url), 'utf8'));

export function slugify(s) {
  const out = s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[™®©]/g, '')
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (out.length <= 70) return out;
  const cut = out.slice(0, 70);
  const i = cut.lastIndexOf('-');
  return (i > 20 ? cut.slice(0, i) : cut).replace(/-+$/, '');
}

const slugs = {};
for (const [id, n] of Object.entries(names)) {
  slugs[id] = [slugify(n.nl), slugify(n.fr), slugify(n.en)];
}
writeFileSync(new URL('../src/lib/set-slugs.json', import.meta.url), JSON.stringify(slugs));
console.log(`${Object.keys(slugs).length} sets`);
