const strip = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Zoekwoorden die niet letterlijk in een setnaam staan, maar wel iets zeggen over de set. */
const GROUPS: { keys: string[]; terms: string[]; themes: string[] }[] = [
  { keys: ['auto', 'autos', 'car', 'cars', 'voiture', 'voitures', 'wagen', 'racewagen', 'sportwagen'], terms: ['auto', 'car', 'wagen', 'racewagen', 'sportauto', 'supersport', 'hypercar', 'f1', 'bronco', 'mustang', 'suv', 'jeep', 'porsche', 'ferrari', 'lamborghini', 'bugatti', 'mclaren', 'mercedes', 'ford', 'aston martin', 'jaguar', 'corvette', 'supra', 'bmw', 'audi', 'toyota', 'dodge'], themes: ['speed-champions'] },
  { keys: ['f1', 'formule', 'formula'], terms: ['f1'], themes: [] },
  { keys: ['dino', 'dinos', 'dinosaurus', 'dinosaur', 'dinosaure'], terms: ['dino', 'fossiel', 'fossil', 'rex'], themes: [] },
  { keys: ['film', 'films', 'movie', 'movies', 'cinema', 'cinéma'], terms: ['mandalorian', 'home alone', 'e.t.', 'gremlins', 'twilight', 'wallace', 'tintin', 'pixar', 'stranger things', 'back to the future', 'lord of the rings', 'bliksem'], themes: ['star-wars', 'harry-potter', 'disney'] },
  { keys: ['motor', 'motorfiets', 'moto', 'motorbike'], terms: ['motor', 'ducati', 'kawasaki', 'moto'], themes: [] },
  { keys: ['bloem', 'bloemen', 'plant', 'planten', 'fleur', 'fleurs', 'flower', 'flowers'], terms: ['bloem', 'boeket', 'orchidee', 'plant', 'tuin', 'paddenstoel', 'cosmos'], themes: ['botanicals'] },
  { keys: ['schip', 'boot', 'bateau', 'ship', 'boat', 'piraat', 'pirate'], terms: ['schip', 'boot', 'stoomboot', 'piraat', 'galjoen'], themes: [] },
  { keys: ['ruimte', 'space', 'espace', 'raket', 'rocket'], terms: ['ruimte', 'raket', 'artemis', 'hubble', 'maan', 'starfighter', 'falcon', 'death star'], themes: [] },
  { keys: ['dier', 'dieren', 'animal', 'animals', 'animaux', 'hond', 'kat', 'dog', 'cat'], terms: ['dier', 'hond', 'kat', 'puppy', 'panda', 'paard', 'otter', 'haai', 'dolfijn', 'leeuw', 'flamingo', 'tiger', 'bird', 'snoopy'], themes: [] },
  { keys: ['kasteel', 'chateau', 'château', 'castle'], terms: ['kasteel', 'slot', 'zweinstein', 'castle', 'neuschwanstein'], themes: [] },
];

export interface Keyword {
  terms: string[];
  themes: string[];
}

export function expandKeyword(raw: string): Keyword | null {
  const q = strip(raw.trim()).replace(/[^a-z0-9 .'&-]/g, '');
  if (!q) return null;
  const terms = new Set<string>([q]);
  const themes = new Set<string>();
  for (const g of GROUPS) {
    if (g.keys.some((k) => strip(k) === q)) {
      g.terms.forEach((t) => terms.add(strip(t)));
      g.themes.forEach((t) => themes.add(t));
    }
  }
  return { terms: [...terms], themes: [...themes] };
}

export const matchesKeyword = (kw: Keyword, haystack: string, theme: string) => {
  const h = strip(haystack);
  return kw.themes.includes(theme) || kw.terms.some((t) => h.includes(t));
};
