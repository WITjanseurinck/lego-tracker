import overrides from '@/data/topic-overrides.json';
import rules from '@/data/topic-rules.json';
import { getCatalog, type CatalogRow } from '@/lib/catalog';
import { getCompareDeals, type CompareDeal } from '@/lib/deals';
import type { Locale } from '@/lib/i18n';

type L3 = Record<Locale, string>;

/** Thema-overschrijdende landingspagina's. De regels staan in data/topic-rules.json, handmatige correcties in data/topic-overrides.json. */
export const TOPIC_KEYS = ['autos', 'ruimte', 'dieren', 'dinos', 'film'] as const;
export type TopicKey = (typeof TOPIC_KEYS)[number];

export interface TopicCopy {
  name: L3;
  h1: L3;
  lead: L3;
}

export const TOPICS: Record<TopicKey, TopicCopy> = {
  autos: {
    name: { nl: 'Auto’s', fr: 'Voitures', en: 'Cars' },
    h1: { nl: 'LEGO® auto’s goedkoopst kopen', fr: 'LEGO® voitures au meilleur prix', en: 'Buy LEGO® cars at the lowest price' },
    lead: {
      nl: 'Van Technic-hypercars en F1-wagens tot Speed Champions, politiewagens en het karretje van Mario. Hier staan alle LEGO-auto’s met de prijzen van de Belgische shops naast elkaar. Kies bovenaan een reeks als je enkel Technic of Speed Champions wil zien.',
      fr: 'Des hypercars Technic et monoplaces de F1 aux Speed Champions, voitures de police et karts de Mario. Toutes les voitures LEGO avec les prix des boutiques belges côte à côte. Choisissez une gamme en haut si vous ne voulez voir que Technic ou Speed Champions.',
      en: 'From Technic hypercars and F1 cars to Speed Champions, police cars and Mario’s kart. Every LEGO car with the prices of the Belgian shops side by side. Pick a theme at the top if you only want Technic or Speed Champions.',
    },
  },
  ruimte: {
    name: { nl: 'Ruimte', fr: 'Espace', en: 'Space' },
    h1: { nl: 'LEGO® ruimtesets goedkoopst kopen', fr: 'LEGO® espace au meilleur prix', en: 'Buy LEGO® space sets at the lowest price' },
    lead: {
      nl: 'Raketten, shuttles, telescopen en alles wat met sterren en planeten te maken heeft. Weinig sets, maar wel vaak groot en duur, dus vergelijken loont. Kies bovenaan een reeks om te filteren.',
      fr: 'Fusées, navettes, télescopes et tout ce qui touche aux étoiles et aux planètes. Peu de sets, mais souvent grands et chers : comparer vaut la peine. Choisissez une gamme en haut pour filtrer.',
      en: 'Rockets, shuttles, telescopes and everything about stars and planets. Not many sets, but often big and pricey, so comparing pays off. Pick a theme at the top to filter.',
    },
  },
  dieren: {
    name: { nl: 'Dieren', fr: 'Animaux', en: 'Animals' },
    h1: { nl: 'LEGO® dierensets goedkoopst kopen', fr: 'LEGO® animaux au meilleur prix', en: 'Buy LEGO® animal sets at the lowest price' },
    lead: {
      nl: 'Honden, katten, paarden, pandas, papegaaien en alles wat daartussen zit: van Duplo-dieren voor de kleinsten tot de Creator-dieren die je kan ombouwen. Kies bovenaan een reeks om te filteren.',
      fr: 'Chiens, chats, chevaux, pandas, perroquets et tout ce qui se trouve entre les deux : des animaux Duplo pour les plus petits aux animaux Creator à construire et à transformer. Choisissez une gamme en haut pour filtrer.',
      en: 'Dogs, cats, horses, pandas, parrots and everything in between: from Duplo animals for the little ones to Creator animals you build and rebuild. Pick a theme at the top to filter.',
    },
  },
  dinos: {
    name: { nl: 'Dino’s', fr: 'Dinosaures', en: 'Dinosaurs' },
    h1: { nl: 'LEGO® dino’s goedkoopst kopen', fr: 'LEGO® dinosaures au meilleur prix', en: 'Buy LEGO® dinosaurs at the lowest price' },
    lead: {
      nl: 'T. rex, raptors, triceratops en andere dinosaurussen, van Jurassic World tot Duplo en Creator. Kies bovenaan een reeks om te filteren.',
      fr: 'T. rex, vélociraptors, tricératops et autres dinosaures, de Jurassic World à Duplo et Creator. Choisissez une gamme en haut pour filtrer.',
      en: 'T. rex, raptors, triceratops and other dinosaurs, from Jurassic World to Duplo and Creator. Pick a theme at the top to filter.',
    },
  },
  film: {
    name: { nl: 'Film', fr: 'Cinéma', en: 'Film' },
    h1: { nl: 'LEGO® filmsets goedkoopst kopen', fr: 'LEGO® cinéma au meilleur prix', en: 'Buy LEGO® movie sets at the lowest price' },
    lead: {
      nl: 'Sets rond films en filmreeksen: Star Wars, Harry Potter, Disney, Marvel, De Hobbit, Back to the Future en meer. Kies bovenaan een reeks om te filteren.',
      fr: 'Des sets autour des films et des sagas : Star Wars, Harry Potter, Disney, Marvel, Le Seigneur des anneaux, Retour vers le futur et plus encore. Choisissez une gamme en haut pour filtrer.',
      en: 'Sets built around films and film series: Star Wars, Harry Potter, Disney, Marvel, The Lord of the Rings, Back to the Future and more. Pick a theme at the top to filter.',
    },
  },
};

export function isTopic(v: string): v is TopicKey {
  return (TOPIC_KEYS as readonly string[]).includes(v);
}

interface Rule {
  themes: string[];
  in: string;
  out: string;
  review: { re: string; why: string; alone?: boolean }[];
}
interface Overrides {
  include: Record<string, string[]>;
  exclude: Record<string, string[]>;
  review: Record<string, Record<string, string>>;
}

const plain = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const re = (s: string) => (s ? new RegExp(s) : null);

const compiled = Object.fromEntries(
  TOPIC_KEYS.map((k) => {
    const r = (rules as Record<string, Rule>)[k];
    return [k, { themes: r.themes, in: re(r.in)!, out: re(r.out), review: r.review.map((x) => ({ re: new RegExp(x.re), why: x.why, alone: !!x.alone })) }];
  }),
);

export type TopicVerdict = { status: 'in' } | { status: 'review'; why: string } | { status: 'no' };

/** Beoordeelt een set voor één onderwerp op naam, URL-naam en thema. */
export function judge(topic: TopicKey, row: Pick<CatalogRow, 'set' | 'name' | 'slug' | 'brand'>): TopicVerdict {
  const o = overrides as Overrides;
  if (o.exclude[topic]?.includes(row.set)) return { status: 'no' };
  if (o.include[topic]?.includes(row.set)) return { status: 'in' };
  const forced = o.review[topic]?.[row.set];
  if (forced) return { status: 'review', why: forced };
  const c = compiled[topic];
  const text = plain(`${row.slug.replace(/-/g, ' ')} ${row.name}`);
  const brand = row.brand.replace(/^LEGO®\s*/i, '').replace(/™|®/g, '').trim();
  const outHit = !!c.out && c.out.test(text);
  const inn = (c.themes.includes(brand) && !(outHit && topic !== 'film')) || (c.in.test(text) && !outHit);
  const rev = c.review.find((x) => x.re.test(text) && (inn || (x.alone && !outHit)));
  if (rev) return { status: 'review', why: rev.why };
  return inn ? { status: 'in' } : { status: 'no' };
}

let memo: Record<TopicKey, Set<string>> | null = null;
function sets(): Record<TopicKey, Set<string>> {
  if (memo) return memo;
  const out = Object.fromEntries(TOPIC_KEYS.map((k) => [k, new Set<string>()])) as Record<TopicKey, Set<string>>;
  for (const row of getCatalog()) for (const k of TOPIC_KEYS) if (judge(k, row).status === 'in') out[k].add(row.set);
  memo = out;
  return out;
}

export function dealsByTopic(topic: TopicKey): CompareDeal[] {
  const s = sets()[topic];
  return getCompareDeals().filter((d) => s.has(d.set));
}
