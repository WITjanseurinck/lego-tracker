import { brandLabel, getCatalog, themeKey } from '@/lib/catalog';
import type { Locale } from '@/lib/i18n';

type L3 = Record<Locale, string>;

export interface ThemeInfo {
  name: L3;
  blurb: L3;
}

/** Thema's in de volgorde waarin ze in menu's staan. */
export const THEMES: Record<string, ThemeInfo> = {
  technic: {
    name: { nl: 'Technic', fr: 'Technic', en: 'Technic' },
    blurb: {
      nl: 'Auto’s, motoren, F1-wagens en machines met bewegende onderdelen. Technic-sets zijn groot en duur. Een verschil van enkele tientallen euro’s tussen shops komt hier vaak voor.',
      fr: 'Voitures, motos, F1 et engins avec pièces mobiles. Les sets Technic sont grands et chers : quelques dizaines d’euros d’écart se trouvent vite.',
      en: 'Cars, motorbikes, F1 cars and machines with moving parts. Technic sets are big and expensive, so a difference of a few tens of euros is easy to find.',
    },
  },
  'speed-champions': {
    name: { nl: 'Speed Champions', fr: 'Speed Champions', en: 'Speed Champions' },
    blurb: {
      nl: 'Compacte modellen van echte sportwagens en F1-auto’s. Handig om te verzamelen. Het zijn kleine sets, dus let op de prijs per set.',
      fr: 'Modèles compacts de vraies voitures de sport et de F1, parfaits à collectionner. Petits sets : surveillez le prix à l’unité.',
      en: 'Compact models of real sports cars and F1 cars, great to collect. Small sets, so keep an eye on the price per set.',
    },
  },
  creator: {
    name: { nl: 'Creator 3-in-1', fr: 'Creator 3-en-1', en: 'Creator 3-in-1' },
    blurb: {
      nl: 'Eén set, drie modellen. Je bouwt het ene en bouwt het daarna om tot het andere. Veel bouwplezier voor weinig geld.',
      fr: 'Un set, trois modèles : on construit l’un puis on peut refaire l’autre. Beaucoup de plaisir de construction pour peu d’argent.',
      en: 'One set, three models: build one, then rebuild it into another. A lot of building fun for little money.',
    },
  },
  icons: {
    name: { nl: 'Icons', fr: 'Icons', en: 'Icons' },
    blurb: {
      nl: 'Grote displaysets voor volwassenen: klassieke auto’s, gebouwen, film en muziek. De prijzen lopen hier snel op, dus vergelijken loont.',
      fr: 'Grands sets d’exposition pour adultes : voitures classiques, bâtiments, cinéma et musique. Les prix grimpent vite, comparer vaut la peine.',
      en: 'Large display sets for adults: classic cars, buildings, film and music. Prices climb quickly here, so comparing pays off.',
    },
  },
  ideas: {
    name: { nl: 'Ideas', fr: 'Ideas', en: 'Ideas' },
    blurb: {
      nl: 'Sets die fans bedachten en LEGO koos: van film en dieren tot hobby’s.',
      fr: 'Des sets imaginés par des fans et retenus par LEGO : du cinéma aux animaux et aux loisirs.',
      en: 'Sets designed by fans and picked by LEGO: from film to animals and hobbies.',
    },
  },
  'star-wars': {
    name: { nl: 'Star Wars', fr: 'Star Wars', en: 'Star Wars' },
    blurb: {
      nl: 'Schepen, helmen, droids en de grote UCS-sets. Ze zijn duur en vaak afgeprijsd, dus het loont om te vergelijken.',
      fr: 'Vaisseaux, casques, droïdes et grands sets UCS. Les sets Star Wars sont chers et souvent soldés : comparer en vaut la peine.',
      en: 'Ships, helmets, droids and the big UCS sets. Star Wars sets are pricey and often discounted, so comparing is worth it.',
    },
  },
  'harry-potter': {
    name: { nl: 'Harry Potter', fr: 'Harry Potter', en: 'Harry Potter' },
    blurb: {
      nl: 'Zweinstein, de Wegisweg en andere plekken uit de films. Van kleine sets tot het grote kasteel.',
      fr: 'Poudlard, le Chemin de Traverse et d’autres lieux des films, du petit set au grand château.',
      en: 'Hogwarts, Diagon Alley and other places from the films, from small sets to the big castle.',
    },
  },
  botanicals: {
    name: { nl: 'Botanicals', fr: 'Botanicals', en: 'Botanicals' },
    blurb: { nl: 'Bloemen en planten van LEGO-steentjes die nooit verwelken.', fr: 'Des fleurs et des plantes en briques LEGO qui ne fanent jamais.', en: 'Flowers and plants made from LEGO bricks that never wilt.' },
  },
  art: {
    name: { nl: 'Art', fr: 'Art', en: 'Art' },
    blurb: { nl: 'Mozaïeken en wanddecoratie om op te hangen.', fr: 'Mosaïques et décorations murales à accrocher.', en: 'Mosaics and wall decorations to hang up.' },
  },
  architecture: {
    name: { nl: 'Architectuur', fr: 'Architecture', en: 'Architecture' },
    blurb: { nl: 'Beroemde gebouwen en bezienswaardigheden als bouwmodel.', fr: 'Des monuments et bâtiments célèbres à construire.', en: 'Famous buildings and landmarks as build-it-yourself models.' },
  },
  disney: {
    name: { nl: 'Disney', fr: 'Disney', en: 'Disney' },
    blurb: { nl: 'Disney- en Pixar-figuren om te bouwen.', fr: 'Personnages Disney et Pixar à construire.', en: 'Disney and Pixar characters to build.' },
  },
  editions: {
    name: { nl: 'Editions', fr: 'Editions', en: 'Editions' },
    blurb: { nl: 'Helmen en voetballegendes: verzamelstukken voor fans.', fr: 'Casques et légendes du football : des pièces de collection pour les fans.', en: 'Helmets and football legends: collectables for fans.' },
  },
  city: {
    name: { nl: 'City', fr: 'City', en: 'City' },
    blurb: { nl: 'Politie, brandweer, voertuigen en stadsleven.', fr: 'Police, pompiers, véhicules et vie urbaine.', en: 'Police, fire, vehicles and city life.' },
  },
  duplo: {
    name: { nl: 'DUPLO', fr: 'DUPLO', en: 'DUPLO' },
    blurb: { nl: 'Grote blokken voor de allerkleinsten, vanaf 1,5 jaar. Treinen, boerderijen, dieren en figuren uit tekenfilms.', fr: 'De grands blocs pour les tout-petits, dès 1,5 an : trains, fermes, animaux et héros de dessins animés.', en: 'Big bricks for the youngest builders, from 1.5 years: trains, farms, animals and cartoon favourites.' },
  },
  friends: {
    name: { nl: 'Friends', fr: 'Friends', en: 'Friends' },
    blurb: { nl: 'Heartlake City met vriendinnen, dieren en alledaagse avonturen. Vaak met veel kleine details om mee te spelen.', fr: 'Heartlake City avec ses amies, ses animaux et ses aventures du quotidien, plein de petits détails pour jouer.', en: 'Heartlake City with friends, animals and everyday adventures, full of small details to play with.' },
  },
  ninjago: {
    name: { nl: 'NINJAGO', fr: 'NINJAGO', en: 'NINJAGO' },
    blurb: { nl: 'Ninja’s, draken en mecha’s. Er komen veel sets bij per jaar, dus vergelijken loont.', fr: 'Ninjas, dragons et mechas. De nombreux sets sortent chaque année : comparer vaut la peine.', en: 'Ninjas, dragons and mechs. Lots of new sets every year, so comparing pays off.' },
  },
  minecraft: {
    name: { nl: 'Minecraft', fr: 'Minecraft', en: 'Minecraft' },
    blurb: { nl: 'Bouw de wereld van het spel na, van kleine biomen tot grote Endermen-torens.', fr: 'Reconstruisez l’univers du jeu, des petits biomes aux grandes tours d’Enderman.', en: 'Build the world of the game, from small biomes to big Enderman towers.' },
  },
  marvel: {
    name: { nl: 'Marvel', fr: 'Marvel', en: 'Marvel' },
    blurb: { nl: 'Avengers, Spider-Man en X-Men als bouwset, figuur of buste.', fr: 'Avengers, Spider-Man et X-Men en set, figurine ou buste.', en: 'Avengers, Spider-Man and X-Men as sets, figures or busts.' },
  },
  dc: {
    name: { nl: 'Batman en DC', fr: 'Batman en DC', en: 'Batman en DC' },
    blurb: { nl: 'Batmobielen, Gotham en de helden van DC.', fr: 'Batmobiles, Gotham et les héros de DC.', en: 'Batmobiles, Gotham and the heroes of DC.' },
  },
  'jurassic-world': {
    name: { nl: 'Jurassic World', fr: 'Jurassic World', en: 'Jurassic World' },
    blurb: { nl: 'Dinosaurussen om te bouwen, van babydino’s tot een T. rex.', fr: 'Des dinosaures à construire, du bébé dino au T. rex.', en: 'Dinosaurs to build, from baby dinos to a T. rex.' },
  },
  classic: {
    name: { nl: 'Classic', fr: 'Classic', en: 'Classic' },
    blurb: { nl: 'Losse stenen in een doos om vrij mee te bouwen. Geen handleiding nodig.', fr: 'Des briques en vrac dans une boîte pour construire librement, sans notice.', en: 'Loose bricks in a box for free building, no instructions needed.' },
  },
  bluey: {
    name: { nl: 'Bluey', fr: 'Bluey', en: 'Bluey' },
    blurb: { nl: 'Bluey en haar familie als speelset, voor kleuters en jonge kinderen.', fr: 'Bluey et sa famille en set de jeu, pour les tout-petits et les jeunes enfants.', en: 'Bluey and her family as play sets, for toddlers and young children.' },
  },
  'super-mario': {
    name: { nl: 'Super Mario', fr: 'Super Mario', en: 'Super Mario' },
    blurb: { nl: 'Mario Kart, Game Boy en de klassieke Nintendo-wereld.', fr: 'Mario Kart, Game Boy et l’univers classique de Nintendo.', en: 'Mario Kart, Game Boy and the classic Nintendo world.' },
  },
  brickheadz: {
    name: { nl: 'BrickHeadz', fr: 'BrickHeadz', en: 'BrickHeadz' },
    blurb: { nl: 'Blokkige figuurtjes met een groot hoofd, leuk om te verzamelen.', fr: 'Des figurines en blocs à grosse tête, à collectionner.', en: 'Blocky figures with big heads, fun to collect.' },
  },
  sonic: {
    name: { nl: 'Sonic', fr: 'Sonic', en: 'Sonic' },
    blurb: { nl: 'Sonic en zijn vrienden tegen Dr. Eggman.', fr: 'Sonic et ses amis contre le Dr Eggman.', en: 'Sonic and friends against Dr. Eggman.' },
  },
  fortnite: {
    name: { nl: 'Fortnite', fr: 'Fortnite', en: 'Fortnite' },
    blurb: { nl: 'Sets uit het spel: de Battle Bus, Llama’s en figuren.', fr: 'Des sets tirés du jeu : le Battle Bus, les lamas et des personnages.', en: 'Sets from the game: the Battle Bus, llamas and characters.' },
  },
  'lord-of-the-rings': {
    name: { nl: 'The Lord of the Rings', fr: 'The Lord of the Rings', en: 'The Lord of the Rings' },
    blurb: { nl: 'Rivendel, de Gouw en Mordor in bouwstenen.', fr: 'Fondcombe, la Comté et le Mordor en briques.', en: 'Rivendell, the Shire and Mordor in bricks.' },
  },
  dreamzzz: {
    name: { nl: 'DREAMZzz', fr: 'DREAMZzz', en: 'DREAMZzz' },
    blurb: { nl: 'Droomwezens en nachtmerries die je kunt ombouwen.', fr: 'Des créatures de rêve et de cauchemar à transformer.', en: 'Dream creatures and nightmares you can rebuild.' },
  },
  'one-piece': {
    name: { nl: 'One Piece', fr: 'One Piece', en: 'One Piece' },
    blurb: { nl: 'Strohoed-piraten, schepen en scènes uit de anime.', fr: 'Les pirates au chapeau de paille, leurs navires et des scènes de l’anime.', en: 'The Straw Hat pirates, ships and scenes from the anime.' },
  },
  wicked: {
    name: { nl: 'Wicked', fr: 'Wicked', en: 'Wicked' },
    blurb: { nl: 'Emerald City, Glinda en Elphaba.', fr: 'La Cité d’Émeraude, Glinda et Elphaba.', en: 'Emerald City, Glinda and Elphaba.' },
  },
  wednesday: {
    name: { nl: 'Wednesday', fr: 'Wednesday', en: 'Wednesday' },
    blurb: { nl: 'Nimmermeer Academie en het huis van de familie Addams.', fr: 'L’académie Nevermore et la maison de la famille Addams.', en: 'Nevermore Academy and the Addams family home.' },
  },
  'monkie-kid': {
    name: { nl: 'Monkie Kid', fr: 'Monkie Kid', en: 'Monkie Kid' },
    blurb: { nl: 'Mecha’s en avonturen rond de Apenkoning.', fr: 'Mechas et aventures autour du Roi Singe.', en: 'Mechs and adventures around the Monkey King.' },
  },
  'stranger-things': {
    name: { nl: 'Stranger Things', fr: 'Stranger Things', en: 'Stranger Things' },
    blurb: { nl: 'Het huis van de familie Creel en figuren uit de serie.', fr: 'La maison de la famille Creel et des personnages de la série.', en: 'The Creel house and figures from the series.' },
  },
  minifiguren: {
    name: { nl: 'Minifiguren', fr: 'Minifiguren', en: 'Minifiguren' },
    blurb: { nl: 'Verzamelminifiguren en grote minifiguren om neer te zetten.', fr: 'Minifigurines à collectionner et grandes figurines à exposer.', en: 'Collectable minifigures and big minifigures to display.' },
  },
  'animal-crossing': {
    name: { nl: 'Animal Crossing', fr: 'Animal Crossing', en: 'Animal Crossing' },
    blurb: { nl: 'Het dorpsleven uit het spel als bouwset.', fr: 'La vie de village du jeu en set de construction.', en: 'The village life from the game as a build set.' },
  },
  'gabbys-dollhouse': {
    name: { nl: 'Gabby’s poppenhuis', fr: 'Gabby’s poppenhuis', en: 'Gabby’s poppenhuis' },
    blurb: { nl: 'Gabby en de kattenvriendjes, voor jonge kinderen.', fr: 'Gabby et ses amis les chats, pour les jeunes enfants.', en: 'Gabby and the cat friends, for young children.' },
  },
  overig: {
    name: { nl: 'Overige sets', fr: 'Autres sets', en: 'Other sets' },
    blurb: { nl: 'Sets uit kleinere reeksen en losse thema’s, van hobbysets tot seizoensdecoratie.', fr: 'Des sets de petites gammes et de thèmes isolés, des sets de loisir aux décorations de saison.', en: 'Sets from smaller ranges and one-off themes, from hobby sets to seasonal decorations.' },
  },
};

// Een thema dat LEGO later toevoegt en hier nog geen eigen tekst heeft, krijgt een nette standaardtekst.
for (const r of getCatalog()) {
  const k = themeKey(r.brand);
  if (THEMES[k]) continue;
  const n = brandLabel(r.brand);
  THEMES[k] = {
    name: { nl: n, fr: n, en: n },
    blurb: {
      nl: `Alle ${n}-sets van LEGO, met de prijzen van de Belgische webshops naast elkaar.`,
      fr: `Tous les sets ${n} de LEGO, avec les prix des boutiques belges côte à côte.`,
      en: `All LEGO ${n} sets, with the prices of the Belgian webshops side by side.`,
    },
  };
}

export const themeName = (slug: string, l: Locale) => THEMES[slug]?.name[l] ?? slug;

const D = {
  nl: {
    aboutTitle: 'Over deze set',
    piecesWord: 'stukjes',
    giftDisclosure: 'Reclame: dit zijn affiliate links. Koop je via een link, dan ontvangen wij een commissie van de shop. Voor jou verandert de prijs niet.',
    giftsLabel: 'Cadeau-ideeën',
    stockOut: 'tijdelijk uitverkocht',
    ageFact: 'Vanaf {a} jaar',
    buildFact: 'Bouwtijd ongeveer {t}',
    hoursUnit: 'uur',
    minutesUnit: 'min',
    themesLabel: 'Thema’s',
    themesTitle: 'LEGO-thema’s: vergelijk prijzen per reeks',
    themesLead: 'Kies een thema en zie alle sets met de prijzen van de Belgische webshops naast elkaar.',
    setsWord: 'sets',
    themeNav: 'Kies een reeks',
    moreIn: (n: string) => `Meer ${n}`,
    allThemes: 'Alle reeksen',
    themeH1: (n: string) => `LEGO ${n} goedkoopst kopen`,
    themeTitle: (n: string) => `LEGO ${n}: prijzen vergelijken bij de Belgische webshops`,
    themeDesc: (n: string, c: number, from: string) => `${c} LEGO ${n}-sets met de prijzen van de Belgische webshops naast elkaar, vanaf ${from}. Zie meteen waar elke set het goedkoopst is.`,
    themeCount: (c: number, from: string, to: string) => `${c} sets, van ${from} tot ${to}`,
    themeCrumb: 'Reeksen',
    related: { title: 'Meer uit dezelfde reeks', intro: 'Andere sets uit deze reeks, goedkoper, even duur of duurder.', cheaper: 'Goedkoper', similar: 'Ongeveer even duur', pricier: 'Duurder', from: 'vanaf' },
    finder: {
      nav: 'Keuzehulp',
      title: 'Keuzehulp: vind de juiste LEGO-set binnen je budget',
      h1: 'Vind de juiste LEGO-set',
      lead: 'Alle velden zijn optioneel. Vul in wat je weet en zie meteen welke sets er in België te koop zijn, met de laagste prijs van de Belgische webshops.',
      desc: 'Zoek een LEGO-set op budget, reeks, zoekwoord en leeftijd en vergelijk meteen de prijzen bij de Belgische webshops.',
      budget: 'Richtbudget (€)',
      budgetHelp: 'We tonen sets die ongeveer zoveel kosten, een beetje eronder en een beetje erboven.',
      budgetPh: 'bijv. 80',
      theme: 'Thema',
      anyTheme: 'Alle thema’s',
      keyword: 'Zoekwoord',
      keywordPh: 'bijv. dino, auto, film',
      age: 'Leeftijd',
      ageHelp: 'Leeftijd van wie de set krijgt. We tonen sets die daarvoor geschikt zijn.',
      time: 'Bouwtijd',
      timeHelp: 'Hoeveel tijd wil je aan de set besteden? Een schatting op basis van het aantal stukjes.',
      anyTime: 'Maakt niet uit',
      timeNone: (b: string, t: string) => `Een set van ${t} onder ${b} bestaat niet. Dit komt het dichtst.`,
      nearTime: (t: string, p: string) => `Wil je ${t} bouwen? Dan betaal je minstens ${p}.`,
      nearBudget: (b: string, t: string) => `Wil je onder ${b} blijven? Dan bouw je hooguit ${t}.`,
      timePh: 'bijv. 8',
      agePh: 'bijv. 9',
      submit: 'Toon sets',
      results: (n: number) => (n === 1 ? '1 set gevonden' : `${n} sets gevonden`),
      around: (lo: string, hi: string) => `Prijzen tussen ${lo} en ${hi}, de dichtste bij je budget eerst.`,
      none: 'Geen sets gevonden met deze keuzes. Laat een veld leeg of kies een ruimer budget.',
      reset: 'Wissen',
      ageLabel: (a: number) => `Vanaf ${a} jaar`,
    },
  },
  fr: {
    aboutTitle: 'À propos de ce set',
    piecesWord: 'pièces',
    giftDisclosure: 'Publicité : ce sont des liens d’affiliation. Si vous achetez via un lien, nous recevons une commission de la boutique. Pour vous, le prix ne change pas.',
    giftsLabel: 'Idées cadeaux',
    stockOut: 'temporairement épuisé',
    ageFact: 'Dès {a} ans',
    buildFact: 'Temps de montage : environ {t}',
    hoursUnit: 'h',
    minutesUnit: 'min',
    themesLabel: 'Thèmes',
    themesTitle: 'Thèmes LEGO : comparez les prix par gamme',
    themesLead: 'Choisissez un thème et voyez tous les sets avec les prix des boutiques en ligne belges côte à côte.',
    setsWord: 'sets',
    themeNav: 'Choisir une gamme',
    moreIn: (n: string) => `Plus de ${n}`,
    allThemes: 'Toutes les gammes',
    themeH1: (n: string) => `LEGO ${n} au meilleur prix`,
    themeTitle: (n: string) => `LEGO ${n} : comparer les prix dans les boutiques en ligne belges`,
    themeDesc: (n: string, c: number, from: string) => `${c} sets LEGO ${n} avec les prix des boutiques en ligne belges côte à côte, dès ${from}. Voyez tout de suite où chaque set est le moins cher.`,
    themeCount: (c: number, from: string, to: string) => `${c} sets, de ${from} à ${to}`,
    themeCrumb: 'Gammes',
    related: { title: 'Plus dans la même gamme', intro: 'D’autres sets de cette gamme, moins chers, au même prix ou plus chers.', cheaper: 'Moins cher', similar: 'À peu près le même prix', pricier: 'Plus cher', from: 'dès' },
    finder: {
      nav: 'Aide au choix',
      title: 'Aide au choix : trouvez le bon set LEGO dans votre budget',
      h1: 'Trouvez le bon set LEGO',
      lead: 'Tous les champs sont facultatifs. Remplissez ce que vous savez et voyez tout de suite quels sets sont en vente en Belgique, avec le prix le plus bas parmi les boutiques.',
      desc: 'Cherchez un set LEGO par budget, gamme, mot-clé et âge et comparez tout de suite les prix dans les boutiques en ligne belges.',
      budget: 'Budget indicatif (€)',
      budgetHelp: 'Nous affichons les sets qui coûtent à peu près ce montant, un peu moins et un peu plus.',
      budgetPh: 'ex. 80',
      theme: 'Thème',
      anyTheme: 'Tous les thèmes',
      keyword: 'Mot-clé',
      keywordPh: 'ex. dino, voiture, film',
      age: 'Âge',
      ageHelp: 'Âge de la personne qui recevra le set. Nous affichons les sets adaptés.',
      time: 'Temps de montage',
      timeHelp: 'Combien de temps voulez-vous y consacrer ? Estimation basée sur le nombre de pièces.',
      anyTime: "Peu importe",
      timeNone: (b: string, t: string) => `Un set de ${t} à moins de ${b} n'existe pas. Voici ce qui s'en rapproche le plus.`,
      nearTime: (t: string, p: string) => `Envie de ${t} de montage ? Comptez au moins ${p}.`,
      nearBudget: (b: string, t: string) => `Envie de rester sous ${b} ? Vous construirez au plus ${t}.`,
      timePh: 'ex. 8',
      agePh: 'ex. 9',
      submit: 'Afficher les sets',
      results: (n: number) => (n === 1 ? '1 set trouvé' : `${n} sets trouvés`),
      around: (lo: string, hi: string) => `Prix entre ${lo} et ${hi}, les plus proches de votre budget d’abord.`,
      none: 'Aucun set avec ces choix. Laissez un champ vide ou choisissez un budget plus large.',
      reset: 'Effacer',
      ageLabel: (a: number) => `Dès ${a} ans`,
    },
  },
  en: {
    aboutTitle: 'About this set',
    piecesWord: 'pieces',
    giftDisclosure: 'Advertisement: these are affiliate links. If you buy through a link, we receive a commission from the shop. The price does not change for you.',
    giftsLabel: 'Gift ideas',
    stockOut: 'temporarily sold out',
    ageFact: 'Ages {a}+',
    buildFact: 'Build time about {t}',
    hoursUnit: 'hours',
    minutesUnit: 'min',
    themesLabel: 'Themes',
    themesTitle: 'LEGO themes: compare prices per range',
    themesLead: 'Pick a theme and see all its sets with Belgian web shop prices side by side.',
    setsWord: 'sets',
    themeNav: 'Pick a range',
    moreIn: (n: string) => `More ${n}`,
    allThemes: 'All ranges',
    themeH1: (n: string) => `Buy LEGO ${n} for less`,
    themeTitle: (n: string) => `LEGO ${n}: compare prices at Belgian web shops`,
    themeDesc: (n: string, c: number, from: string) => `${c} LEGO ${n} sets with Belgian web shop prices side by side, from ${from}. See at a glance where each set is cheapest.`,
    themeCount: (c: number, from: string, to: string) => `${c} sets, from ${from} to ${to}`,
    themeCrumb: 'Ranges',
    related: { title: 'More from the same range', intro: 'Other sets in this range: cheaper, similarly priced or more expensive.', cheaper: 'Cheaper', similar: 'Similar price', pricier: 'More expensive', from: 'from' },
    finder: {
      nav: 'Finder',
      title: 'Finder: pick the right LEGO set for your budget',
      h1: 'Find the right LEGO set',
      lead: 'All fields are optional. Fill in what you know and see which sets are for sale in Belgium, with the lowest price from the Belgian web shops.',
      desc: 'Find a LEGO set by budget, range, keyword and age and compare prices at Belgian web shops right away.',
      budget: 'Target budget (€)',
      budgetHelp: 'We show sets that cost roughly this much: a little below and a little above.',
      budgetPh: 'e.g. 80',
      theme: 'Theme',
      anyTheme: 'All themes',
      keyword: 'Keyword',
      keywordPh: 'e.g. dino, car, film',
      age: 'Age',
      ageHelp: 'Age of the person who will get the set. We show sets that suit that age.',
      time: 'Build time',
      timeHelp: 'How much time do you want to spend building? An estimate based on the piece count.',
      anyTime: 'Any',
      timeNone: (b: string, t: string) => `A set of ${t} under ${b} does not exist. This comes closest.`,
      nearTime: (t: string, p: string) => `Want ${t} of building? Then you pay at least ${p}.`,
      nearBudget: (b: string, t: string) => `Want to stay under ${b}? Then you build at most ${t}.`,
      timePh: 'e.g. 8',
      agePh: 'e.g. 9',
      submit: 'Show sets',
      results: (n: number) => (n === 1 ? '1 set found' : `${n} sets found`),
      around: (lo: string, hi: string) => `Prices between ${lo} and ${hi}, closest to your budget first.`,
      none: 'No sets match these choices. Leave a field empty or try a wider budget.',
      reset: 'Clear',
      ageLabel: (a: number) => `Ages ${a}+`,
    },
  },
};

export const getDict2 = (l: Locale) => D[l];
export type Budget = 'u50' | '50-100' | '100-200' | '200+';
export const BUDGETS: Budget[] = ['u50', '50-100', '100-200', '200+'];
export const inBudget = (b: Budget, price: number) =>
  b === 'u50' ? price < 50 : b === '50-100' ? price >= 50 && price < 100 : b === '100-200' ? price >= 100 && price < 200 : price >= 200;

/** Schatting van de bouwtijd als bereik: Technic gaat trager dan gewone sets. */
export function buildTimeRange(pieces: number, theme: string, hours: string, minutes: string): string {
  const mid = buildHours(pieces, theme);
  const lo = mid * 0.83;
  const hi = mid * 1.17;
  if (hi < 1.5) {
    const r = (x: number) => Math.max(5, Math.round(x * 60 / 5) * 5);
    return `${r(lo)}-${r(hi)} ${minutes}`;
  }
  const r = (x: number) => (x < 5 ? Math.round(x * 2) / 2 : Math.round(x));
  const a = r(lo), b = r(hi);
  return a === b ? `${a} ${hours}` : `${a}-${b} ${hours}`;
}

/** Midden van de geschatte bouwtijd in uren. */
export function buildHours(pieces: number, theme: string): number {
  return pieces / (theme === 'technic' ? 300 : 400);
}

export const TIME_RANGES = [
  { v: '0-1', lo: 0, hi: 1, nl: 'tot 1 uur', fr: "jusqu'à 1 h", en: 'up to 1 hour' },
  { v: '1-3', lo: 1, hi: 3, nl: '1 tot 3 uur', fr: '1 à 3 h', en: '1 to 3 hours' },
  { v: '3-6', lo: 3, hi: 6, nl: '3 tot 6 uur', fr: '3 à 6 h', en: '3 to 6 hours' },
  { v: '6-10', lo: 6, hi: 10, nl: '6 tot 10 uur', fr: '6 à 10 h', en: '6 to 10 hours' },
  { v: '10-15', lo: 10, hi: 15, nl: '10 tot 15 uur', fr: '10 à 15 h', en: '10 to 15 hours' },
  { v: '15-99', lo: 15, hi: 99, nl: 'meer dan 15 uur', fr: 'plus de 15 h', en: 'more than 15 hours' },
] as const;
