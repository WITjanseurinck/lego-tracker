import type { CompareDeal } from '@/lib/deals';
import type { Locale } from '@/lib/i18n';

export const GIFT_SLUGS = ['sinterklaas', 'verjaardag', 'kerstmis'] as const;
export type GiftSlug = (typeof GIFT_SLUGS)[number];
export const isGiftSlug = (s: string): s is GiftSlug => (GIFT_SLUGS as readonly string[]).includes(s);

type L3<T> = Record<Locale, T>;

/** Leeftijdsgroepen volgens de leeftijd die op de set staat. */
export const AGE_GROUPS = [
  { v: '3', lo: 0, hi: 3, label: { nl: 'Tot 3 jaar', fr: 'Jusqu’à 3 ans', en: 'Up to 3 years' } },
  { v: '6', lo: 4, hi: 6, label: { nl: '4 tot 6 jaar', fr: '4 à 6 ans', en: '4 to 6 years' } },
  { v: '8', lo: 7, hi: 8, label: { nl: '7 tot 8 jaar', fr: '7 à 8 ans', en: '7 to 8 years' } },
  { v: '10', lo: 9, hi: 10, label: { nl: '9 tot 10 jaar', fr: '9 à 10 ans', en: '9 to 10 years' } },
  { v: '13', lo: 11, hi: 13, label: { nl: '11 tot 13 jaar', fr: '11 à 13 ans', en: '11 to 13 years' } },
  { v: '17', lo: 14, hi: 17, label: { nl: '14 tot 17 jaar', fr: '14 à 17 ans', en: '14 to 17 years' } },
  { v: '18', lo: 18, hi: 99, label: { nl: 'Volwassene', fr: 'Adulte', en: 'Adult' } },
] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];

export const TIER_LABELS: L3<[string, string, string]> = {
  nl: ['Een kleine verrassing', 'Het mooie cadeau', 'De grote droom'],
  fr: ['Une petite surprise', 'Le beau cadeau', 'Le grand rêve'],
  en: ['A small surprise', 'The nice gift', 'The big dream'],
};

export interface GiftCopy {
  nav: string;
  title: string;
  desc: string;
  h1: string;
  lead: string;
  intro: string;
  ageTitle: string;
  ageHelp: string;
  picksTitle: (ageLabel: string) => string;
  midTitle: string;
  midText: string;
  endTitle: string;
  endText: string;
}

export interface GiftDef {
  tiers: [[number, number], [number, number], [number, number]];
  copy: L3<GiftCopy>;
}

export const GIFTS: Record<GiftSlug, GiftDef> = {
  sinterklaas: {
    tiers: [[0, 40], [40, 90], [90, 250]],
    copy: {
      nl: {
        nav: 'Sinterklaas',
        title: 'LEGO voor Sinterklaas: welke set kan de Sint brengen?',
        desc: 'Kies de leeftijd en krijg drie LEGO voorstellen voor Sinterklaas, met de laagste prijs uit Belgische webshops.',
        h1: 'Welke set kan Sinterklaas brengen?',
        lead: 'Op 6 december komt de Sint langs. De avond ervoor zet je schoen klaar.',
        intro: 'Een LEGO set past in elke schoen, op voorwaarde dat het geen grote schoen hoeft te zijn. Kies hieronder de leeftijd van wie de Sint verwacht. Je krijgt drie voorstellen: een kleine verrassing, een mooi cadeau en een grote droom. De prijzen komen uit Belgische webshops en de goedkoopste staat telkens vooraan.',
        ageTitle: 'Hoe oud is wie de Sint verwacht?',
        ageHelp: 'Kies de leeftijd van wie de set krijgt.',
        picksTitle: (a) => `Drie voorstellen voor ${a}`,
        midTitle: 'Heeft de Sint al een idee?',
        midText: 'Misschien weet je al dat het iets met auto’s moet zijn, of ligt het budget vast. Vul hieronder in wat je weet en je krijgt drie andere voorstellen. Alle velden zijn optioneel.',
        endTitle: 'Klaar voor de nacht van 5 december',
        endText: 'Prijzen veranderen geregeld, zeker rond de feestdagen. Klik door naar de shop voor de actuele prijs en de levertijd. Bestel op tijd, want een pakje dat op 5 december nog onderweg is, haalt de schoen niet meer.',
      },
      fr: {
        nav: 'Saint-Nicolas',
        title: 'LEGO pour la Saint-Nicolas : quel set peut apporter le saint ?',
        desc: 'Choisissez l’âge et recevez trois idées LEGO pour la Saint-Nicolas, au meilleur prix parmi les boutiques en ligne belges.',
        h1: 'Quel set Saint-Nicolas peut-il apporter ?',
        lead: 'Le 6 décembre, Saint-Nicolas passe chez vous. La veille, vous placez la chaussure devant la cheminée ou la porte.',
        intro: 'Un set LEGO tient dans n’importe quelle chaussure, à condition que ce ne soit pas une grande. Choisissez ci-dessous l’âge de la personne que le saint attend. Vous recevez trois propositions : une petite surprise, un beau cadeau et un grand rêve. Les prix viennent de boutiques en ligne belges et le moins cher est toujours en tête.',
        ageTitle: 'Quel âge a la personne que le saint attend ?',
        ageHelp: 'Choisissez l’âge de la personne qui recevra le set.',
        picksTitle: (a) => `Trois idées pour ${a}`,
        midTitle: 'Saint-Nicolas a déjà une idée ?',
        midText: 'Vous savez peut-être déjà que ce sera quelque chose avec des voitures, ou que le budget est fixé. Indiquez ce que vous savez et vous recevez trois autres propositions. Tous les champs sont facultatifs.',
        endTitle: 'Prêt pour la nuit du 5 décembre',
        endText: 'Les prix changent souvent, surtout autour des fêtes. Rendez-vous dans la boutique pour le prix actuel et le délai de livraison. Commandez à temps : un colis encore en route le 5 décembre n’arrivera plus dans la chaussure.',
      },
      en: {
        nav: 'Sinterklaas',
        title: 'LEGO for Sinterklaas: which set can the Saint bring?',
        desc: 'Pick an age and get three LEGO ideas for Sinterklaas, with the lowest price from Belgian web shops.',
        h1: 'Which set can Sinterklaas bring?',
        lead: 'Sinterklaas visits on 6 December. The evening before, you put your shoe out.',
        intro: 'A LEGO set fits in any shoe, as long as it does not need to be a big shoe. Pick the age of whoever is expecting the Saint below. You get three suggestions: a small surprise, a nice gift and a big dream. Prices come from Belgian web shops and the cheapest is always first.',
        ageTitle: 'How old is whoever the Saint is visiting?',
        ageHelp: 'Pick the age of whoever gets the set.',
        picksTitle: (a) => `Three suggestions for ${a}`,
        midTitle: 'Does the Saint already have an idea?',
        midText: 'Maybe you already know it has to be something with cars, or the budget is fixed. Fill in what you know and you get three other suggestions. All fields are optional.',
        endTitle: 'Ready for the night of 5 December',
        endText: 'Prices change often, especially around the holidays. Click through to the shop for the current price and delivery time. Order in time: a parcel that is still on its way on 5 December will not make it into the shoe.',
      },
    },
  },
  verjaardag: {
    tiers: [[0, 40], [40, 100], [100, 300]],
    copy: {
      nl: {
        nav: 'Verjaardag',
        title: 'LEGO als verjaardagscadeau: welke set past bij de jarige?',
        desc: 'Kies de leeftijd van de jarige en krijg drie LEGO voorstellen als verjaardagscadeau, met de laagste prijs uit Belgische webshops.',
        h1: 'Welke LEGO set past bij een verjaardag?',
        lead: 'Een verjaardagscadeau moet raak zijn.',
        intro: 'Een LEGO set levert eerst een middag bouwen op, en daarna een model dat blijft staan. Kies hieronder de leeftijd van de jarige. Je krijgt drie voorstellen: een kleine verrassing, een mooi cadeau en een grote droom. De prijzen komen uit Belgische webshops en de goedkoopste staat telkens vooraan.',
        ageTitle: 'Hoe oud wordt de jarige?',
        ageHelp: 'Kies de leeftijd van wie de set krijgt.',
        picksTitle: (a) => `Drie voorstellen voor ${a}`,
        midTitle: 'Weet je al waar de jarige van houdt?',
        midText: 'Dan vind je sneller iets dat past. Vul in wat je weet, bijvoorbeeld een thema, een zoekwoord of een budget, en je krijgt drie andere voorstellen. Alle velden zijn optioneel.',
        endTitle: 'Cadeau gevonden',
        endText: 'Controleer de prijs in de shop en kijk meteen naar de levertijd, zodat het pakje er voor de feestdag is. Is de gekozen set uitverkocht, dan helpt de keuzehulp je verder.',
      },
      fr: {
        nav: 'Anniversaire',
        title: 'LEGO en cadeau d’anniversaire : quel set pour la personne fêtée ?',
        desc: 'Choisissez l’âge et recevez trois idées LEGO comme cadeau d’anniversaire, au meilleur prix parmi les boutiques en ligne belges.',
        h1: 'Quel set LEGO pour un anniversaire ?',
        lead: 'Un cadeau d’anniversaire doit faire mouche.',
        intro: 'Un set LEGO offre d’abord un après-midi de construction, puis un modèle qui reste exposé. Choisissez ci-dessous l’âge de la personne fêtée. Vous recevez trois propositions : une petite surprise, un beau cadeau et un grand rêve. Les prix viennent de boutiques en ligne belges et le moins cher est toujours en tête.',
        ageTitle: 'Quel âge fête la personne ?',
        ageHelp: 'Choisissez l’âge de la personne qui recevra le set.',
        picksTitle: (a) => `Trois idées pour ${a}`,
        midTitle: 'Vous savez déjà ce qui lui plaît ?',
        midText: 'Vous trouverez alors plus vite ce qui convient. Indiquez ce que vous savez, par exemple un thème, un mot-clé ou un budget, et vous recevez trois autres propositions. Tous les champs sont facultatifs.',
        endTitle: 'Cadeau trouvé',
        endText: 'Vérifiez le prix dans la boutique et regardez tout de suite le délai de livraison, pour que le colis arrive avant la fête. Si le set choisi est épuisé, l’aide au choix vous guide vers une autre idée.',
      },
      en: {
        nav: 'Birthday',
        title: 'LEGO as a birthday gift: which set suits the birthday child?',
        desc: 'Pick the age and get three LEGO ideas as a birthday gift, with the lowest price from Belgian web shops.',
        h1: 'Which LEGO set suits a birthday?',
        lead: 'A birthday gift has to hit the mark.',
        intro: 'A LEGO set gives you an afternoon of building first, and then a model that stays on display. Pick the age of the birthday person below. You get three suggestions: a small surprise, a nice gift and a big dream. Prices come from Belgian web shops and the cheapest is always first.',
        ageTitle: 'How old is the birthday person turning?',
        ageHelp: 'Pick the age of whoever gets the set.',
        picksTitle: (a) => `Three suggestions for ${a}`,
        midTitle: 'Do you already know what they like?',
        midText: 'Then you find a fit faster. Fill in what you know, for example a theme, a keyword or a budget, and you get three other suggestions. All fields are optional.',
        endTitle: 'Gift found',
        endText: 'Check the price in the shop and look at the delivery time right away, so the parcel arrives before the day. If the set you picked is sold out, the finder helps you on.',
      },
    },
  },
  kerstmis: {
    tiers: [[20, 60], [60, 130], [130, 400]],
    copy: {
      nl: {
        nav: 'Kerstmis',
        title: 'LEGO onder de kerstboom: welke set past in het pakje?',
        desc: 'Kies de leeftijd en krijg drie LEGO voorstellen voor een pakje onder de kerstboom, met de laagste prijs uit Belgische webshops.',
        h1: 'Welke LEGO set ligt onder de kerstboom?',
        lead: 'Een groot pakje onder de boom is vaak een set.',
        intro: 'Kies hieronder de leeftijd van wie het pakje krijgt. Je krijgt drie voorstellen: een kleine verrassing, een mooi cadeau en een grote droom. De prijzen komen uit Belgische webshops en de goedkoopste staat telkens vooraan.',
        ageTitle: 'Voor wie is het pakje?',
        ageHelp: 'Kies de leeftijd van wie de set krijgt.',
        picksTitle: (a) => `Drie voorstellen voor ${a}`,
        midTitle: 'Heb je al een idee?',
        midText: 'Misschien weet je al dat het een auto moet worden, of ligt het budget vast. Vul in wat je weet en je krijgt drie andere voorstellen. Alle velden zijn optioneel.',
        endTitle: 'Het pakje is bijna klaar',
        endText: 'Een set bouw je niet in een uur, en tijdens de kerstvakantie is daar tijd voor. Bestel op tijd, zodat het pakje voor de feestdagen in huis is en nog ingepakt kan worden. Prijzen veranderen geregeld, dus controleer ze in de shop.',
      },
      fr: {
        nav: 'Noël',
        title: 'LEGO sous le sapin : quel set pour le paquet ?',
        desc: 'Choisissez l’âge et recevez trois idées LEGO pour un paquet sous le sapin, au meilleur prix parmi les boutiques en ligne belges.',
        h1: 'Quel set LEGO sous le sapin ?',
        lead: 'Un gros paquet sous le sapin, c’est souvent un set.',
        intro: 'Choisissez ci-dessous l’âge de la personne qui recevra le paquet. Vous recevez trois propositions : une petite surprise, un beau cadeau et un grand rêve. Les prix viennent de boutiques en ligne belges et le moins cher est toujours en tête.',
        ageTitle: 'Pour qui est le paquet ?',
        ageHelp: 'Choisissez l’âge de la personne qui recevra le set.',
        picksTitle: (a) => `Trois idées pour ${a}`,
        midTitle: 'Vous avez déjà une idée ?',
        midText: 'Vous savez peut-être déjà que ce sera une voiture, ou que le budget est fixé. Indiquez ce que vous savez et vous recevez trois autres propositions. Tous les champs sont facultatifs.',
        endTitle: 'Le paquet est presque prêt',
        endText: 'Un set ne se monte pas en une heure, et les vacances de Noël laissent le temps. Commandez à temps, pour que le paquet soit là avant les fêtes et puisse encore être emballé. Les prix changent souvent : vérifiez-les dans la boutique.',
      },
      en: {
        nav: 'Christmas',
        title: 'LEGO under the Christmas tree: which set fits the parcel?',
        desc: 'Pick the age and get three LEGO ideas for a parcel under the Christmas tree, with the lowest price from Belgian web shops.',
        h1: 'Which LEGO set goes under the Christmas tree?',
        lead: 'A big parcel under the tree is often a set.',
        intro: 'Pick the age of whoever gets the parcel below. You get three suggestions: a small surprise, a nice gift and a big dream. Prices come from Belgian web shops and the cheapest is always first.',
        ageTitle: 'Who is the parcel for?',
        ageHelp: 'Pick the age of whoever gets the set.',
        picksTitle: (a) => `Three suggestions for ${a}`,
        midTitle: 'Do you already have an idea?',
        midText: 'Maybe you already know it has to be a car, or the budget is fixed. Fill in what you know and you get three other suggestions. All fields are optional.',
        endTitle: 'The parcel is almost ready',
        endText: 'You do not build a set in an hour, and the Christmas break leaves time for it. Order in time, so the parcel is home before the holidays and can still be wrapped. Prices change often, so check them in the shop.',
      },
    },
  },
};

const price = (d: CompareDeal) => d.offers[0].price;

/** Drie voorstellen: een per prijsklasse, bij voorkeur uit drie verschillende thema's. */
export function pickTrio(all: CompareDeal[], group: AgeGroup, tiers: GiftDef['tiers']): { tier: number; deal: CompareDeal }[] {
  const eligible = all.filter((d) => d.age !== null && d.age >= group.lo && d.age <= group.hi);
  const chosen: { tier: number; deal: CompareDeal }[] = [];
  tiers.forEach(([lo, hi], tier) => {
    const free = eligible.filter((d) => !chosen.some((c) => c.deal.set === d.set));
    const inTier = free.filter((d) => price(d) >= lo && price(d) < hi);
    const fresh = inTier.filter((d) => !chosen.some((c) => c.deal.theme === d.theme));
    const pool = fresh.length ? fresh : inTier;
    const best = [...pool].sort((a, b) => b.bestDiscount - a.bestDiscount || price(a) - price(b))[0];
    const mid = (lo + Math.min(hi, lo * 3)) / 2;
    const fallback = [...free].sort((a, b) => Math.abs(price(a) - mid) - Math.abs(price(b) - mid))[0];
    const pick = best ?? fallback;
    if (pick) chosen.push({ tier, deal: pick });
  });
  return chosen;
}
