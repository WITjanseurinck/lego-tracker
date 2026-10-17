export interface Theme {
  slug: string;
  name: string;
  count: number;
  bg: string;
  fg: string;
}

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Primaire kleuren. Een kleur komt nooit twee keer naast of onder zichzelf voor: we lopen er op volgorde doorheen. */
const TILE = [
  { bg: '#1E55A8', fg: '#ffffff' }, // blauw
  { bg: '#C8202B', fg: '#ffffff' }, // rood
  { bg: '#F7C52B', fg: '#0F1722' }, // geel
  { bg: '#1F7A4D', fg: '#ffffff' }, // groen
  { bg: '#0F1722', fg: '#ffffff' }, // inkt
  { bg: '#E8731A', fg: '#0F1722' }, // oranje
];

/** Welke kleur bij welk thema past. Staat een kleur al in de laatste vijf tegels, dan nemen we de eerstvolgende vrije. */
const PREFERRED: Record<string, number> = {
  technic: 4, // inkt: zwart en grijs
  city: 0, // blauw
  'star-wars': 2, // geel, zoals het logo
  icons: 3, // groen
  'harry-potter': 1, // rood
  'speed-champions': 5, // oranje
  ideas: 0,
  friends: 1,
  disney: 0,
  marvel: 1,
  ninjago: 3,
  minecraft: 3,
  jurassic: 5,
  seizoen: 5,
  brickheadz: 5,
};

export function makeThemes(counts: Map<string, number>): Theme[] {
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const used: number[] = [];
  return sorted.map(([name, count], i) => {
    const slug = slugify(name);
    const pref = PREFERRED[slug] ?? i % TILE.length;
    const recent = used.slice(-5);
    let pick = pref;
    for (let k = 0; k < TILE.length && recent.includes(pick); k++) pick = (pref + k + 1) % TILE.length;
    used.push(pick);
    return { slug, name, count, ...TILE[pick] };
  });
}

/** Fotoachtergrond per positie in een raster van 4 kolommen: 5 kleuren, dus nooit dezelfde kleur naast of onder elkaar. */
const PHOTO = ['#1E55A8', '#C8202B', '#F7C52B', '#1F7A4D', '#E8731A'];
export const photoTint = (index: number) => PHOTO[index % PHOTO.length];
