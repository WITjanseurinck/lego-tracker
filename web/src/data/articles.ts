import type { Article } from '@/lib/articles';

/**
 * Gidsen in drie talen. Alle uitspraken over LEGO zijn op 18 oktober 2026 nagekeken aan de
 * bronnen hieronder. Die staan niet op de site, maar zet er geen claim in zonder bron of voorbehoud.
 */

export const SOURCES = {
  BRICKSET: { label: 'Brickset: Has LEGO become more expensive?', url: 'https://brickset.com/article/80205/has-lego-become-more-expensive' },
  BRICKFACT: { label: 'Brickfact: LEGO age guide for Duplo and classic bricks', url: 'https://brickfact.com/blog/guidebooks/lego-from-which-age-guide-for-duplo-and-co' },
  DUPLO: { label: 'Wikipedia: Lego Duplo', url: 'https://en.wikipedia.org/wiki/Lego_Duplo' },
  GALAXUS: { label: 'Galaxus: LEGO age ranges, recommendation rather than reality', url: 'https://www.galaxus.at/en/page/lego-age-ranges-recommendation-rather-than-reality-15025' },
  BRICKPICKER: { label: 'BrickPicker: LEGO set retirement (EOL)', url: 'https://brickpicker.com/blog/2014-11-16-lego-set-retirement-unlock-the-secrets-of-eol' },
  BAM: { label: 'BAM Good Bricks: guide to LEGO set retirement', url: 'https://bamgoodbricks.com/blogs/lego-news/the-complete-guide-to-lego%C2%AE-set-retirement-what-it-means-for-collectors' },
  HSE: { label: 'HSE University: retired LEGO sets as an investment', url: 'https://community.hse.ru/en/news/research/536477053.html' },
  BRICKFANATICS_OCT26: { label: 'Brick Fanatics: every LEGO set releasing in October 2026', url: 'https://www.brickfanatics.com/every-lego-set-releasing-in-october-2026-doomsday' },
  NEWELEMENTARY_OCT26: { label: 'New Elementary: new October 2026 LEGO sets and gifts', url: 'https://www.newelementary.com/2026/10/new-october-2026-lego-sets-and-gifts.html' },
  JAYS_OCT26: { label: 'Jay\'s Brick Blog: every new LEGO set releasing October 2026', url: 'https://jaysbrickblog.com/news/buying-guide-every-new-lego-set-releasing-october-2026/' },
};

export const ARTICLES: Article[] = [
  {
    id: 'when-to-buy',
    published: '2026-10-18T08:00:00Z',
    updated: '2026-10-18T08:00:00Z',
    text: {
      nl: {
        slug: 'lego-set-kopen-nu-of-wachten',
        title: 'LEGO-set kopen: nu of wachten op een lagere prijs?',
        summary: 'Wat we weten over het prijsverloop van LEGO-sets, wanneer wachten loont en wanneer je beter nu bestelt.',
        body: [
          { h2: 'Elke shop bepaalt zijn eigen prijs' },
          { p: 'LEGO geeft een adviesprijs, maar een winkel mag zelf kiezen wat hij vraagt. Daarom kan dezelfde set in de ene shop meer of minder kosten dan in de andere. Bij een nieuwe set liggen de prijzen vaak dicht bij elkaar. Later gaan shops hun eigen weg, bijvoorbeeld met acties rond de feestdagen of bij het opruimen van voorraad. Een vaste regel voor het prijsverloop bestaat niet.' },
          { h2: 'Hoe lang een set in de winkel ligt' },
          { p: 'LEGO haalt sets na een tijd uit het assortiment. Schattingen van verzamelaarssites komen uit op gemiddeld ongeveer twee jaar, waarbij populaire sets soms vier jaar of langer blijven. LEGO maakt zelden vooraf bekend wanneer een set verdwijnt. Een diepe korting kan een teken zijn dat het einde nadert, maar zeker is dat nooit.' },
          { h2: 'Wat er na het verdwijnen gebeurt' },
          { p: 'Is de voorraad in de winkels op, dan vind je de set enkel nog op de tweedehandsmarkt. Onderzoek van HSE University naar sets uit 1987 tot 2015 vond dat de prijzen daar gemiddeld ongeveer 10 tot 11 procent per jaar stegen, vaak pas twee tot drie jaar na het verdwijnen uit de winkels. Verzamelaarssites wijzen er ook op dat veel sets gelijk blijven of zakken. Reken er dus niet op dat een set meer waard wordt.' },
          { h2: 'Wanneer wachten loont' },
          { ul: [
            'Je hebt geen haast en de set is overal ruim beschikbaar.',
            'De set staat nog op of dicht bij de adviesprijs.',
            'Je hebt een richtprijs in gedachten en vergelijkt meerdere shops.',
          ] },
          { h2: 'Wanneer je beter nu bestelt' },
          { ul: [
            'Je hebt de set nodig voor een verjaardag of een andere vaste datum.',
            'De set is bijna uitverkocht of staat als uitslaand aangeduid.',
            'Je ziet al een prijs die ruim onder de adviesprijs ligt.',
          ] },
          { h2: 'Zo pak je het slim aan' },
          { p: 'Bepaal vooraf welke prijs je redelijk vindt, bijvoorbeeld een bepaald bedrag onder de adviesprijs. Vergelijk daarna de shops. Wacht je langer dan gepland, controleer dan ook of de set nog leverbaar is. Op buildthatset zie je per set naast elkaar wat de shops vragen.' },
        ],
      },
      fr: {
        slug: 'acheter-set-lego-maintenant-ou-attendre',
        title: 'Acheter un set LEGO : maintenant ou attendre une baisse de prix ?',
        summary: 'Ce que l’on sait de l’évolution du prix des sets LEGO, quand attendre vaut la peine et quand il vaut mieux commander tout de suite.',
        body: [
          { h2: 'Chaque boutique fixe son propre prix' },
          { p: 'LEGO donne un prix conseillé, mais un magasin choisit lui-même ce qu’il demande. Le même set peut donc coûter plus ou moins cher d’une boutique à l’autre. Pour un nouveau set, les prix sont souvent proches. Plus tard, les boutiques font chacune leurs promotions, par exemple autour des fêtes ou pour écouler leur stock. Il n’existe pas de règle fixe pour l’évolution du prix.' },
          { h2: 'Combien de temps un set reste en magasin' },
          { p: 'LEGO retire ses sets du catalogue après un certain temps. Selon les estimations de sites de collectionneurs, un set reste en moyenne environ deux ans, et les sets populaires parfois quatre ans ou plus. LEGO annonce rarement à l’avance le retrait d’un set. Une forte réduction peut indiquer que la fin approche, mais ce n’est jamais certain.' },
          { h2: 'Ce qui se passe après le retrait' },
          { p: 'Quand le stock des magasins est épuisé, le set ne se trouve plus que sur le marché de l’occasion. Une étude de HSE University portant sur des sets de 1987 à 2015 y a relevé une hausse moyenne d’environ 10 à 11 % par an, souvent seulement deux à trois ans après le retrait des magasins. Des sites de collectionneurs soulignent aussi que beaucoup de sets restent stables ou baissent. Ne comptez donc pas sur une prise de valeur.' },
          { h2: 'Quand attendre vaut la peine' },
          { ul: [
            'Vous n’êtes pas pressé et le set est largement disponible partout.',
            'Le set est encore au prix conseillé ou proche de celui-ci.',
            'Vous avez un prix cible en tête et vous comparez plusieurs boutiques.',
          ] },
          { h2: 'Quand il vaut mieux commander maintenant' },
          { ul: [
            'Vous avez besoin du set pour un anniversaire ou une autre date précise.',
            'Le set est presque épuisé ou signalé comme retiré du catalogue.',
            'Vous voyez déjà un prix nettement inférieur au prix conseillé.',
          ] },
          { h2: 'Comment s’y prendre intelligemment' },
          { p: 'Décidez à l’avance quel prix vous semble raisonnable, par exemple un certain montant sous le prix conseillé. Comparez ensuite les boutiques. Si vous attendez plus longtemps que prévu, vérifiez aussi que le set est encore disponible. Sur buildthatset, vous voyez pour chaque set ce que demandent les boutiques, côte à côte.' },
        ],
      },
      en: {
        slug: 'buy-lego-set-now-or-wait',
        title: 'Buying a LEGO set: now or wait for a lower price?',
        summary: 'What we know about how LEGO set prices develop, when waiting pays off and when you are better off ordering now.',
        body: [
          { h2: 'Every shop sets its own price' },
          { p: 'LEGO gives a recommended price, but a shop is free to choose what it charges. That is why the same set can cost more or less in one shop than in another. For a new set the prices are often close together. Later, shops go their own way, for example with promotions around the holidays or when clearing stock. There is no fixed rule for how a price develops.' },
          { h2: 'How long a set stays in the shops' },
          { p: 'LEGO removes sets from its range after a while. Estimates from collector sites put the average at about two years, with popular sets sometimes staying four years or longer. LEGO rarely announces in advance when a set will go. A deep discount can be a sign that the end is near, but it is never certain.' },
          { h2: 'What happens after a set disappears' },
          { p: 'Once shop stock runs out, the set can only be found on the second-hand market. A study by HSE University of sets from 1987 to 2015 found that prices there rose by about 10 to 11 percent a year on average, often only two to three years after the set left the shops. Collector sites also point out that many sets stay flat or fall in value. So do not count on a set becoming worth more.' },
          { h2: 'When waiting pays off' },
          { ul: [
            'You are in no hurry and the set is widely available everywhere.',
            'The set is still at or close to the recommended price.',
            'You have a target price in mind and compare several shops.',
          ] },
          { h2: 'When you are better off ordering now' },
          { ul: [
            'You need the set for a birthday or another fixed date.',
            'The set is nearly sold out or marked as retiring.',
            'You already see a price well below the recommended price.',
          ] },
          { h2: 'How to go about it smartly' },
          { p: 'Decide beforehand what price you find reasonable, for example a certain amount below the recommended price. Then compare the shops. If you wait longer than planned, also check that the set is still in stock. On buildthatset you see for each set what the shops charge, side by side.' },
        ],
      },
    },
  },
  {
    id: 'age-guide',
    published: '2026-10-18T07:00:00Z',
    updated: '2026-10-18T07:00:00Z',
    text: {
      nl: {
        slug: 'lego-set-kind-leeftijd-kiezen',
        title: 'LEGO voor een kind kiezen: zo lees je de leeftijdsaanduiding',
        summary: 'Wat het getal op de doos je vertelt, waar het veiligheidsadvies voor jonge kinderen begint en waar je op let bij een cadeau.',
        body: [
          { h2: 'Wat de leeftijdsaanduiding zegt' },
          { p: 'Op elke LEGO-doos staat een leeftijd, zoals 4+, 6+ of 9+. Die helpt je de moeilijkheid van een set in te schatten. Het aantal stukjes alleen zegt daar weinig over, want ook de mate van detail en de grootte van de set spelen mee. Het label is een richtlijn. Sommige kinderen bouwen sets boven hun leeftijdsadvies zonder moeite.' },
          { h2: 'Heel jonge kinderen' },
          { p: 'LEGO Duplo is gemaakt voor kinderen van ongeveer anderhalf tot vijf jaar. De blokken zijn in elke richting twee keer zo groot als gewone LEGO-stenen, waardoor ze makkelijker te hanteren zijn en minder snel ingeslikt worden. Gewone sets met kleine stukjes zijn niet geschikt voor kinderen onder de drie, ook niet onder toezicht. Sets met standaardstenen starten bij sommige reeksen vanaf 4 jaar. De doos geeft altijd het exacte advies.' },
          { h2: 'Tips voor een cadeau' },
          { ul: [
            'Kies een thema dat het kind al kent, zoals een film, een voertuig of een dier.',
            'Kies liever een iets kleinere set die het kind zelf kan afmaken dan een grote set die blijft liggen.',
            'Sets met 18+ op de doos richten zich op volwassen fans.',
            'Bekijk de afbeelding en het aantal stukjes in de shop, zo weet je wat je in huis haalt.',
          ] },
          { h2: 'Vergelijk daarna de prijs' },
          { p: 'Heb je een set gekozen, vergelijk dan de shops. Dezelfde set kan van shop tot shop verschillen in prijs. Op buildthatset zie je naast elkaar wat de shops vragen.' },
        ],
      },
      fr: {
        slug: 'choisir-set-lego-enfant-age',
        title: 'Choisir un LEGO pour un enfant : comment lire l’âge indiqué',
        summary: 'Ce que vous apprend le chiffre sur la boîte, à partir de quand s’applique l’avertissement de sécurité et à quoi faire attention pour un cadeau.',
        body: [
          { h2: 'Ce que dit l’âge indiqué' },
          { p: 'Chaque boîte LEGO porte un âge, comme 4+, 6+ ou 9+. Il vous aide à estimer la difficulté d’un set. Le nombre de pièces seul en dit peu, car le niveau de détail et la taille du set comptent aussi. Cet âge est une indication. Certains enfants construisent sans problème des sets au-dessus de l’âge recommandé.' },
          { h2: 'Les très jeunes enfants' },
          { p: 'LEGO Duplo est conçu pour les enfants d’environ un an et demi à cinq ans. Ses briques sont deux fois plus grandes que celles de LEGO classique dans chaque dimension, ce qui les rend plus faciles à manipuler et moins faciles à avaler. Les sets classiques à petites pièces ne conviennent pas aux enfants de moins de trois ans, même sous surveillance. Certaines gammes de sets en briques standard démarrent à 4 ans. La boîte donne toujours la recommandation exacte.' },
          { h2: 'Conseils pour un cadeau' },
          { ul: [
            'Choisissez un thème que l’enfant connaît déjà, comme un film, un véhicule ou un animal.',
            'Préférez un set un peu plus petit que l’enfant peut terminer seul à un grand set qui reste dans la boîte.',
            'Les sets marqués 18+ sur la boîte s’adressent aux fans adultes.',
            'Regardez l’image et le nombre de pièces dans la boutique, vous saurez ce que vous ramenez à la maison.',
          ] },
          { h2: 'Comparez ensuite le prix' },
          { p: 'Une fois le set choisi, comparez les boutiques. Le même set peut coûter un prix différent d’une boutique à l’autre. Sur buildthatset, vous voyez côte à côte ce que demandent les boutiques.' },
        ],
      },
      en: {
        slug: 'choose-lego-set-for-child-age',
        title: 'Choosing LEGO for a child: how to read the age rating',
        summary: 'What the number on the box tells you, where the safety advice for young children starts and what to look for when buying a gift.',
        body: [
          { h2: 'What the age rating tells you' },
          { p: 'Every LEGO box shows an age, such as 4+, 6+ or 9+. It helps you judge how hard a set is. The number of pieces alone says little about that, because the level of detail and the size of the set matter too. The label is a guideline. Some children build sets above their recommended age without trouble.' },
          { h2: 'Very young children' },
          { p: 'LEGO Duplo is made for children from about one and a half to five. Its bricks are twice the size of standard LEGO bricks in every direction, which makes them easier to handle and harder to swallow. Regular sets with small pieces are not suitable for children under three, even under supervision. Some ranges with standard bricks start at 4 years. The box always gives the exact recommendation.' },
          { h2: 'Tips for a gift' },
          { ul: [
            'Pick a theme the child already knows, such as a film, a vehicle or an animal.',
            'Go for a slightly smaller set the child can finish alone over a large set that stays in the box.',
            'Sets marked 18+ on the box are aimed at adult fans.',
            'Check the picture and the number of pieces in the shop, so you know what you are bringing home.',
          ] },
          { h2: 'Then compare the price' },
          { p: 'Once you have chosen a set, compare the shops. The same set can cost a different price from shop to shop. On buildthatset you see what the shops charge, side by side.' },
        ],
      },
    },
  },
  {
    id: 'price-per-piece',
    published: '2026-10-18T06:00:00Z',
    updated: '2026-10-18T06:00:00Z',
    text: {
      nl: {
        slug: 'goede-prijs-lego-set',
        title: 'Wat is een goede prijs voor een LEGO-set? Reken met de prijs per steentje',
        summary: 'Met één deling zie je of een set duur of goedkoop is, en wanneer die vuistregel minder goed werkt.',
        body: [
          { h2: 'Zo bereken je de prijs per steentje' },
          { p: 'Deel de prijs van de set door het aantal stukjes. Een set van 1000 stukjes voor 100 euro kost 10 cent per stukje. Dezelfde set aan 80 euro komt op 8 cent per stukje. Het aantal stukjes staat op de doos en in elke shop bij de productgegevens.' },
          { h2: 'Een vuistregel om mee te vergelijken' },
          { p: 'Onder LEGO-fans geldt ongeveer 10 cent per stukje als goede prijs. De site Brickset noemt sets onder die grens een koopje. Bij licentiesets zoals Star Wars lag de prijs er vaak tussen 12 en 20 cent. Die cijfers zijn in Amerikaanse dollars, dus gebruik ze als grove richtlijn voor België.' },
          { h2: 'Wanneer de vuistregel minder goed werkt' },
          { ul: [
            'Grote sets komen per stukje vaak lager uit dan 10 cent. Kleine sets liggen er vaak boven, omdat verpakking en ontwerp zwaarder doorwegen.',
            'Sets met een licentie, zoals een film of een sportster, kosten per stukje vaak meer. Reeksen zonder licentie, zoals Technic, Creator, Ninjago en Friends, scoren volgens Brickset vaak beter.',
            'Stukjes verschillen in grootte. Een set met grote gegoten onderdelen telt anders dan een set met veel kleine stukjes.',
            'Minifiguren en speciale onderdelen zijn voor veel kopers een reden om te kopen, ook als de prijs per stukje hoog uitvalt.',
          ] },
          { h2: 'Gebruik het om kortingen te beoordelen' },
          { p: 'De prijs per stukje helpt om te zien of een korting echt de moeite loont. Een doorstreepprijs zegt niet altijd hoe de set eerder in de winkel stond, dus reken zelf even na wat je per stukje betaalt.' },
          { h2: 'Dezelfde set, meerdere prijzen' },
          { p: 'Op buildthatset zie je per set de prijzen van de shops naast elkaar. Zo zie je meteen waar dezelfde set het goedkoopst is.' },
        ],
      },
      fr: {
        slug: 'bon-prix-set-lego',
        title: 'Quel est un bon prix pour un set LEGO ? Calculez le prix par pièce',
        summary: 'Une simple division suffit pour voir si un set est cher ou bon marché, et quand cette règle pratique fonctionne moins bien.',
        body: [
          { h2: 'Comment calculer le prix par pièce' },
          { p: 'Divisez le prix du set par le nombre de pièces. Un set de 1000 pièces à 100 euros coûte 10 centimes par pièce. Le même set à 80 euros revient à 8 centimes par pièce. Le nombre de pièces figure sur la boîte et dans la fiche produit de chaque boutique.' },
          { h2: 'Une règle pratique pour comparer' },
          { p: 'Parmi les fans de LEGO, environ 10 centimes par pièce passent pour un bon prix. Le site Brickset qualifie d’affaire les sets sous ce seuil. Pour les sets sous licence comme Star Wars, le prix se situait souvent entre 12 et 20 centimes. Ces chiffres sont en dollars américains, utilisez-les donc comme repère approximatif pour la Belgique.' },
          { h2: 'Quand la règle fonctionne moins bien' },
          { ul: [
            'Les grands sets reviennent souvent à moins de 10 centimes par pièce. Les petits sets dépassent souvent ce seuil, car l’emballage et la conception pèsent davantage.',
            'Les sets sous licence, comme un film ou un sportif, coûtent souvent plus par pièce. Les gammes sans licence, comme Technic, Creator, Ninjago et Friends, s’en sortent souvent mieux selon Brickset.',
            'Les pièces diffèrent par la taille. Un set avec de grandes pièces moulées ne se compte pas comme un set de nombreuses petites pièces.',
            'Les minifigurines et les pièces spéciales sont pour beaucoup d’acheteurs une raison d’acheter, même si le prix par pièce est élevé.',
          ] },
          { h2: 'Utilisez-la pour juger les réductions' },
          { p: 'Le prix par pièce aide à voir si une réduction en vaut vraiment la peine. Un prix barré ne dit pas toujours à quel prix le set était vendu auparavant, alors calculez vous-même ce que vous payez par pièce.' },
          { h2: 'Le même set, plusieurs prix' },
          { p: 'Sur buildthatset, vous voyez pour chaque set les prix des boutiques côte à côte. Vous repérez ainsi tout de suite où le même set est le moins cher.' },
        ],
      },
      en: {
        slug: 'good-price-lego-set',
        title: 'What is a good price for a LEGO set? Work it out per piece',
        summary: 'One division shows whether a set is expensive or cheap, and when that rule of thumb works less well.',
        body: [
          { h2: 'How to calculate the price per piece' },
          { p: 'Divide the price of the set by the number of pieces. A set of 1000 pieces for 100 euros costs 10 cents per piece. The same set at 80 euros comes to 8 cents per piece. The number of pieces is on the box and in the product details of every shop.' },
          { h2: 'A rule of thumb to compare with' },
          { p: 'Among LEGO fans, about 10 cents per piece counts as a good price. The site Brickset calls sets below that line a bargain. For licensed sets such as Star Wars, the price was often between 12 and 20 cents. Those figures are in US dollars, so use them as a rough guide for Belgium.' },
          { h2: 'When the rule of thumb works less well' },
          { ul: [
            'Large sets often come out below 10 cents per piece. Small sets often sit above it, because packaging and design weigh more heavily.',
            'Licensed sets, such as a film or a sports star, often cost more per piece. Unlicensed ranges such as Technic, Creator, Ninjago and Friends often score better according to Brickset.',
            'Pieces differ in size. A set with large moulded parts counts differently from a set with many small pieces.',
            'Minifigures and special parts are a reason to buy for many people, even when the price per piece is high.',
          ] },
          { h2: 'Use it to judge discounts' },
          { p: 'The price per piece helps you see whether a discount is really worth it. A crossed-out price does not always tell you how the set was priced before, so work out for yourself what you pay per piece.' },
          { h2: 'The same set, several prices' },
          { p: 'On buildthatset you see the shop prices side by side for each set. That shows you right away where the same set is cheapest.' },
        ],
      },
    },
  },
  {
    id: 'bol-below-rrp-2026-10-19',
    published: '2026-10-19T12:30:00Z',
    updated: '2026-10-19T12:30:00Z',
    text: {
      nl: {
        slug: 'lego-sets-bij-bol-onder-de-adviesprijs-19-oktober',
        title: 'Acht LEGO-sets die bij bol ruim onder de adviesprijs staan',
        summary: 'Op 19 oktober 2026 staan acht LEGO-sets bij bol.com/be een derde of meer onder de adviesprijs, van Kevin en Dug tot de Hubble-telescoop.',
        body: [
          { p: 'Bij bol staan op 19 oktober 2026 een aantal LEGO-sets ruim onder de adviesprijs van LEGO. We keken elke prijs na op de productpagina van bol.com/be. Alle acht sets hieronder verkoopt bol zelf, ze zijn op voorraad en de verzending is inbegrepen.' },
          { h2: 'De acht sets, van groot naar klein verschil' },
          { ul: [
            'Disney Kevin en Dug (43290): € 29,99 bij bol, adviesprijs € 59,99. Dat is € 30,00 lager, ongeveer 50 procent.',
            'Botanicals Bloemenwand (11503): € 49,99 bij bol, adviesprijs € 89,99. Dat is € 40,00 lager, ongeveer 44 procent.',
            'Star Wars Grogu (75446): € 79,00 bij bol, adviesprijs € 129,99. Dat is € 50,99 lager, ongeveer 39 procent.',
            'McLaren MP4/4 en Ayrton Senna (10330): € 51,28 bij bol, adviesprijs € 79,99. Dat is € 28,71 lager, ongeveer 36 procent.',
            'KPop Demon Hunters Derpy Tiger en Sussie Bird (72537): € 44,99 bij bol, adviesprijs € 69,99. Dat is € 25,00 lager, ongeveer 36 procent.',
            'Botanicals Boeket met zonnebloemen (11502): € 38,99 bij bol, adviesprijs € 59,99. Dat is € 21,00 lager, ongeveer 35 procent.',
            'Scuderia Ferrari HP: helm van Lewis Hamilton (43022): € 59,99 bij bol, adviesprijs € 89,99. Dat is € 30,00 lager, ongeveer 33 procent.',
            'Icons Ruimtetelescoop Hubble (11382): € 87,77 bij bol, adviesprijs € 129,99. Dat is € 42,22 lager, ongeveer 32 procent.',
          ] },
          { h2: 'Wat opvalt' },
          { ul: [
            'Twee Botanicals-sets staan in de lijst: de Bloemenwand en het Boeket met zonnebloemen.',
            'De Ferrari-helm van Lewis Hamilton staat een derde onder de adviesprijs. Andere helmen uit dezelfde reeks hebben we niet nagekeken.',
            'De Grogu-set van 1200 onderdelen heeft het grootste verschil in euro: ruim 50 euro.',
          ] },
          { h2: 'Zo lees je deze prijzen' },
          { p: 'De adviesprijs is de prijs die LEGO aanbeveelt, zoals bol hem op de productpagina toont. Een winkel mag zelf kiezen wat hij vraagt en past prijzen vaak van dag tot dag aan. De bedragen hierboven gelden op 19 oktober 2026. Kijk de actuele prijs dus altijd na voor je bestelt. Op buildthatset zie je per set de prijzen van de shops naast elkaar.' },
        ],
      },
      fr: {
        slug: 'sets-lego-chez-bol-sous-le-prix-conseille-19-octobre',
        title: 'Huit sets LEGO nettement sous le prix conseillé chez bol',
        summary: 'Le 19 octobre 2026, huit sets LEGO sont à un tiers ou plus sous le prix conseillé chez bol.com/be, de Kevin et Dug au télescope Hubble.',
        body: [
          { p: 'Le 19 octobre 2026, plusieurs sets LEGO sont nettement sous le prix conseillé de LEGO chez bol. Nous avons vérifié chaque prix sur la fiche produit de bol.com/be. Les huit sets ci-dessous sont vendus par bol lui-même, ils sont en stock et la livraison est comprise.' },
          { h2: 'Les huit sets, de l’écart le plus fort au plus faible' },
          { ul: [
            'Disney Kevin et Dug (43290) : 29,99 € chez bol, prix conseillé 59,99 €. Soit 30,00 € de moins, environ 50 %.',
            'Botanicals Mur de fleurs (11503) : 49,99 € chez bol, prix conseillé 89,99 €. Soit 40,00 € de moins, environ 44 %.',
            'Star Wars Grogu (75446) : 79,00 € chez bol, prix conseillé 129,99 €. Soit 50,99 € de moins, environ 39 %.',
            'McLaren MP4/4 et Ayrton Senna (10330) : 51,28 € chez bol, prix conseillé 79,99 €. Soit 28,71 € de moins, environ 36 %.',
            'KPop Demon Hunters Derpy Tiger et Sussie Bird (72537) : 44,99 € chez bol, prix conseillé 69,99 €. Soit 25,00 € de moins, environ 36 %.',
            'Botanicals Bouquet de tournesols (11502) : 38,99 € chez bol, prix conseillé 59,99 €. Soit 21,00 € de moins, environ 35 %.',
            'Scuderia Ferrari HP : casque de Lewis Hamilton (43022) : 59,99 € chez bol, prix conseillé 89,99 €. Soit 30,00 € de moins, environ 33 %.',
            'Icons Télescope spatial Hubble (11382) : 87,77 € chez bol, prix conseillé 129,99 €. Soit 42,22 € de moins, environ 32 %.',
          ] },
          { h2: 'Ce qui frappe' },
          { ul: [
            'Deux sets Botanicals figurent dans la liste : le Mur de fleurs et le Bouquet de tournesols.',
            'Le casque Ferrari de Lewis Hamilton est un tiers sous le prix conseillé. Nous n’avons pas vérifié les autres casques de la même série.',
            'Le set Grogu de 1200 pièces affiche le plus grand écart en euros : plus de 50 euros.',
          ] },
          { h2: 'Comment lire ces prix' },
          { p: 'Le prix conseillé est celui que LEGO recommande, tel que bol l’affiche sur la fiche produit. Un magasin fixe lui-même son prix et le modifie souvent d’un jour à l’autre. Les montants ci-dessus valent pour le 19 octobre 2026. Vérifiez donc toujours le prix actuel avant de commander. Sur buildthatset, vous voyez pour chaque set les prix des boutiques côte à côte.' },
        ],
      },
      en: {
        slug: 'lego-sets-at-bol-below-the-recommended-price-19-october',
        title: 'Eight LEGO sets priced well below the recommended price at bol',
        summary: 'On 19 October 2026, eight LEGO sets at bol.com/be sit a third or more below the recommended price, from Kevin and Dug to the Hubble telescope.',
        body: [
          { p: 'On 19 October 2026, a number of LEGO sets at bol sit well below the price LEGO recommends. We checked every price on the product page at bol.com/be. bol itself sells all eight sets below, they are in stock and shipping is included.' },
          { h2: 'The eight sets, from biggest to smallest difference' },
          { ul: [
            'Disney Kevin and Dug (43290): €29.99 at bol, recommended price €59.99. That is €30.00 lower, about 50 percent.',
            'Botanicals Flower Wall (11503): €49.99 at bol, recommended price €89.99. That is €40.00 lower, about 44 percent.',
            'Star Wars Grogu (75446): €79.00 at bol, recommended price €129.99. That is €50.99 lower, about 39 percent.',
            'McLaren MP4/4 and Ayrton Senna (10330): €51.28 at bol, recommended price €79.99. That is €28.71 lower, about 36 percent.',
            'KPop Demon Hunters Derpy Tiger and Sussie Bird (72537): €44.99 at bol, recommended price €69.99. That is €25.00 lower, about 36 percent.',
            'Botanicals Sunflower Bouquet (11502): €38.99 at bol, recommended price €59.99. That is €21.00 lower, about 35 percent.',
            'Scuderia Ferrari HP: Lewis Hamilton helmet (43022): €59.99 at bol, recommended price €89.99. That is €30.00 lower, about 33 percent.',
            'Icons Hubble Space Telescope (11382): €87.77 at bol, recommended price €129.99. That is €42.22 lower, about 32 percent.',
          ] },
          { h2: 'What stands out' },
          { ul: [
            'Two Botanicals sets are in the list: the Flower Wall and the Sunflower Bouquet.',
            'The Ferrari helmet of Lewis Hamilton is a third below the recommended price. We did not check the other helmets of the same series.',
            'The 1200-piece Grogu set has the biggest difference in euros: more than 50 euros.',
          ] },
          { h2: 'How to read these prices' },
          { p: 'The recommended price is the one LEGO suggests, as bol shows it on the product page. A shop is free to choose what it charges and often changes prices from one day to the next. The amounts above apply on 19 October 2026, so always confirm the current price before you order. On buildthatset you see the shop prices for each set side by side.' },
        ],
      },
    },
  },
  {
    id: 'new-sets-october-2026',
    published: '2026-10-19T12:31:00Z',
    updated: '2026-10-19T12:31:00Z',
    text: {
      nl: {
        slug: 'nieuwe-lego-sets-oktober-2026-prijzen-bij-bol',
        title: 'Nieuwe LEGO-sets van oktober: wat ze bij bol kosten en wanneer ze er zijn',
        summary: 'Avengers: Doomsday, Boekensteun, Downton Abbey en Executor: wat de nieuwe LEGO-sets van oktober 2026 bij bol.com/be kosten en wanneer ze leverbaar zijn.',
        body: [
          { p: 'LEGO bracht voor oktober 2026 ongeveer twintig nieuwe sets en extra’s uit, onder meer Avengers: Doomsday, Winter Village en Downton Abbey. We keken op 19 oktober na wat vijf ervan bij bol.com/be kosten en wanneer je ze krijgt. Bij elke set verkoopt bol zelf, tenzij we iets anders melden.' },
          { h2: 'Nu leverbaar bij bol' },
          { ul: [
            'Boekensteun: Boekhandel (11379): € 105,59, adviesprijs € 129,99. Op voorraad, verzending inbegrepen, morgen in huis bij bestelling voor 23:59.',
            'Marvel Ultieme strijd: Avengers: Doomsday (76348): € 77,99, adviesprijs € 99,99. Op voorraad, verzending inbegrepen.',
          ] },
          { h2: 'Te reserveren bij bol' },
          { ul: [
            'Downton Abbey (21373): € 289,99 bij bol, adviesprijs € 299,99. Bol toont “nog niet verschenen” met 4 januari 2027 als beschikbaarheidsdatum.',
            'Executor Super Star Destroyer (75457): € 749,00 bij bol, adviesprijs € 749,99. Bol toont “nog niet verschenen” met 1 februari 2027 als beschikbaarheidsdatum.',
          ] },
          { h2: 'Niet leverbaar bij bol' },
          { p: 'Wallace & Gromit (21371) staat op 19 oktober bij bol als niet leverbaar, met de mogelijkheid om een bericht te vragen. De adviesprijs is € 99,99.' },
          { h2: 'Zo ga je ermee om' },
          { p: 'Bij een nieuwe set liggen de prijzen vaak dicht bij de adviesprijs, en twee van deze sets staan bij bol al een stuk lager. Reserveer je een set die pas later komt, kijk dan nog eens na wat prijs en leverdatum bij de winkel zijn voor je bestelt. De bedragen hierboven gelden op 19 oktober 2026.' },
        ],
      },
      fr: {
        slug: 'nouveaux-sets-lego-octobre-2026-prix-chez-bol',
        title: 'Nouveaux sets LEGO d’octobre : leur prix chez bol et leur date de livraison',
        summary: 'Avengers: Doomsday, Bookshop, Downton Abbey et Executor : ce que coûtent les nouveaux sets LEGO d’octobre 2026 chez bol.com/be et quand ils arrivent.',
        body: [
          { p: 'LEGO a prévu une vingtaine de nouveaux sets et extras pour octobre 2026, dont Avengers: Doomsday, Winter Village et Downton Abbey. Le 19 octobre, nous avons vérifié le prix de cinq d’entre eux chez bol.com/be et la date à laquelle vous les recevez. Pour chaque set, c’est bol qui vend, sauf mention contraire.' },
          { h2: 'Disponibles chez bol' },
          { ul: [
            'Bookshop : Book Nook (11379) : 105,59 €, prix conseillé 129,99 €. En stock, livraison comprise, chez vous demain pour toute commande avant 23 h 59.',
            'Marvel Bataille ultime : Avengers: Doomsday (76348) : 77,99 €, prix conseillé 99,99 €. En stock, livraison comprise.',
          ] },
          { h2: 'À réserver chez bol' },
          { ul: [
            'Downton Abbey (21373) : 289,99 € chez bol, prix conseillé 299,99 €. Bol indique « pas encore paru » avec le 4 janvier 2027 comme date de disponibilité.',
            'Executor Super Star Destroyer (75457) : 749,00 € chez bol, prix conseillé 749,99 €. Bol indique « pas encore paru » avec le 1er février 2027 comme date de disponibilité.',
          ] },
          { h2: 'Indisponible chez bol' },
          { p: 'Wallace & Gromit (21371) est indiqué comme indisponible chez bol le 19 octobre, avec la possibilité de demander un message. Le prix conseillé est de 99,99 €.' },
          { h2: 'Comment s’y prendre' },
          { p: 'Pour un nouveau set, les prix restent souvent proches du prix conseillé, et deux de ces sets sont déjà nettement plus bas chez bol. Si vous réservez un set qui n’arrive que plus tard, vérifiez encore le prix et la date de livraison dans la boutique avant de commander. Les montants ci-dessus valent pour le 19 octobre 2026.' },
        ],
      },
      en: {
        slug: 'new-lego-sets-october-2026-prices-at-bol',
        title: 'New LEGO sets of October: what they cost at bol and when they arrive',
        summary: 'Avengers: Doomsday, Bookshop, Downton Abbey and Executor: what the new LEGO sets of October 2026 cost at bol.com/be and when you can get them.',
        body: [
          { p: 'LEGO planned about twenty new sets and extras for October 2026, among them Avengers: Doomsday, Winter Village and Downton Abbey. On 19 October we checked what five of them cost at bol.com/be and when you get them. bol itself sells every set unless we say otherwise.' },
          { h2: 'Available at bol now' },
          { ul: [
            'Bookshop: Book Nook (11379): €105.59, recommended price €129.99. In stock, shipping included, at your door tomorrow if you order before 23:59.',
            'Marvel Epic Battle: Avengers: Doomsday (76348): €77.99, recommended price €99.99. In stock, shipping included.',
          ] },
          { h2: 'Available to reserve at bol' },
          { ul: [
            'Downton Abbey (21373): €289.99 at bol, recommended price €299.99. bol shows “not yet released” with 4 January 2027 as the availability date.',
            'Executor Super Star Destroyer (75457): €749.00 at bol, recommended price €749.99. bol shows “not yet released” with 1 February 2027 as the availability date.',
          ] },
          { h2: 'Not available at bol' },
          { p: 'Wallace & Gromit (21371) is listed at bol as not available on 19 October, with the option to ask for a message. The recommended price is €99.99.' },
          { h2: 'How to handle it' },
          { p: 'With a new set, prices often sit close to the recommended price, and two of these sets are already a good bit lower at bol. If you reserve a set that only arrives later, check the price and delivery date at the shop again before you order. The amounts above apply on 19 October 2026.' },
        ],
      },
    },
  },
  {
    id: 'advent-calendars-2026',
    published: '2026-10-19T12:32:00Z',
    updated: '2026-10-19T12:32:00Z',
    text: {
      nl: {
        slug: 'lego-adventskalenders-2026-op-een-rij',
        title: 'Alle LEGO-adventskalenders van 2026 op een rij: prijs en inhoud bij bol',
        summary: 'Vijf LEGO-adventskalenders van 2026 naast elkaar: Star Wars, Marvel, Disney Princess, City en Friends, met de prijs bij bol.com/be en wat erin zit.',
        body: [
          { p: 'Vijf LEGO-adventskalenders voor 2026 liggen bij bol.com/be klaar. We zetten ze naast elkaar met de prijs van 19 oktober 2026 en wat je achter de 24 deurtjes vindt. Bol verkoopt ze zelf en alle vijf zijn op voorraad.' },
          { h2: 'LEGO Star Wars (75456): € 27,99' },
          { p: 'Adviesprijs € 34,99, 293 onderdelen, vanaf 6 jaar. Je vindt minifiguren van de Mandalorian, Moff Gideon, Grogu, een Pit Droid, Carson Teva, een Jawa en IG-11 in kerstoutfits, plus zeven minivoertuigen, onder meer de Razor Crest en een X-wing in kerstkleuren.' },
          { h2: 'LEGO Marvel (76340): € 27,99' },
          { p: 'Adviesprijs € 34,99, 317 onderdelen, vanaf 6 jaar. Zes minifiguren met winterse details: Spider-Man, Iron Man, Dr. Doom, Ghost-Spider, Captain America en Wolverine, plus kleine bouwsets zoals een sneeuwballenkanon, een helikopter en een X-Jet-slee.' },
          { h2: 'LEGO Disney Princess (43298): € 27,99' },
          { p: 'Adviesprijs € 34,99, 290 onderdelen, vanaf 5 jaar. Met onder meer Ariel, Sebastian, Assepoester, Vaiana, Pua, Mulan en Mushu. De doos verandert in een bordspel met een draaiwiel voor maximaal acht spelers.' },
          { h2: 'LEGO City (60510): € 21,99' },
          { p: 'Adviesprijs € 26,99, 252 onderdelen, vanaf 5 jaar. De Kerstman, de Kerstvrouw, drie elfen, een sneeuwman en een babyrendier, met een speelmat van de werkplaats van de Kerstman.' },
          { h2: 'LEGO Friends (42698): € 21,99' },
          { p: 'Adviesprijs € 26,99, 211 onderdelen, vanaf 6 jaar. Drie minifiguren (Nova, Liann en Aliya) en zes diertjes: een zeehond, een pony, een wezel, een ijsbeer, een pinguïn en een konijn.' },
          { h2: 'Prijs per deurtje' },
          { ul: [
            'City en Friends: ongeveer € 0,92 per deurtje.',
            'Star Wars, Marvel en Disney Princess: ongeveer € 1,17 per deurtje.',
          ] },
          { h2: 'Verzending' },
          { p: 'Bol verstuurt gratis vanaf € 25. City en Friends liggen met € 21,99 net onder die grens, dus bestel je er één alleen, dan komt de verzendkost erbij. Neem je er twee, of voeg je iets toe, dan betaal je geen verzending. De prijzen gelden op 19 oktober 2026, kijk de actuele prijs dus altijd na bij de winkel.' },
        ],
      },
      fr: {
        slug: 'calendriers-de-l-avent-lego-2026-comparatif',
        title: 'Tous les calendriers de l’Avent LEGO 2026 : prix et contenu chez bol',
        summary: 'Cinq calendriers de l’Avent LEGO 2026 côte à côte : Star Wars, Marvel, Disney Princess, City et Friends, avec le prix chez bol.com/be et leur contenu.',
        body: [
          { p: 'Cinq calendriers de l’Avent LEGO 2026 sont disponibles chez bol.com/be. Nous les comparons avec le prix du 19 octobre 2026 et ce que vous trouvez derrière les 24 portes. Bol les vend lui-même et les cinq sont en stock.' },
          { h2: 'LEGO Star Wars (75456) : 27,99 €' },
          { p: 'Prix conseillé 34,99 €, 293 pièces, à partir de 6 ans. Vous y trouvez des minifigurines du Mandalorian, de Moff Gideon, de Grogu, d’un Pit Droid, de Carson Teva, d’un Jawa et d’IG-11 en tenues de Noël, plus sept mini-véhicules, dont le Razor Crest et un X-wing aux couleurs de Noël.' },
          { h2: 'LEGO Marvel (76340) : 27,99 €' },
          { p: 'Prix conseillé 34,99 €, 317 pièces, à partir de 6 ans. Six minifigurines aux détails hivernaux : Spider-Man, Iron Man, Dr Doom, Ghost-Spider, Captain America et Wolverine, plus de petits modèles comme un canon à boules de neige, un hélicoptère et un traîneau X-Jet.' },
          { h2: 'LEGO Disney Princess (43298) : 27,99 €' },
          { p: 'Prix conseillé 34,99 €, 290 pièces, à partir de 5 ans. Avec notamment Ariel, Sébastien, Cendrillon, Vaiana, Pua, Mulan et Mushu. La boîte se transforme en jeu de plateau avec une roue pour huit joueurs au maximum.' },
          { h2: 'LEGO City (60510) : 21,99 €' },
          { p: 'Prix conseillé 26,99 €, 252 pièces, à partir de 5 ans. Le Père Noël, la Mère Noël, trois lutins, un bonhomme de neige et un bébé renne, avec un tapis de jeu représentant l’atelier du Père Noël.' },
          { h2: 'LEGO Friends (42698) : 21,99 €' },
          { p: 'Prix conseillé 26,99 €, 211 pièces, à partir de 6 ans. Trois minifigurines (Nova, Liann et Aliya) et six petits animaux : un phoque, un poney, une belette, un ours polaire, un pingouin et un lapin.' },
          { h2: 'Prix par porte' },
          { ul: [
            'City et Friends : environ 0,92 € par porte.',
            'Star Wars, Marvel et Disney Princess : environ 1,17 € par porte.',
          ] },
          { h2: 'Livraison' },
          { p: 'Bol livre gratuitement à partir de 25 €. City et Friends, à 21,99 €, sont juste en dessous de ce seuil : si vous en commandez un seul, les frais de livraison s’ajoutent. Avec deux calendriers, ou un autre article en plus, la livraison est gratuite. Les prix valent pour le 19 octobre 2026 : vérifiez donc toujours le prix actuel dans la boutique.' },
        ],
      },
      en: {
        slug: 'lego-advent-calendars-2026-compared',
        title: 'All LEGO advent calendars of 2026 side by side: price and contents at bol',
        summary: 'Five 2026 LEGO advent calendars side by side: Star Wars, Marvel, Disney Princess, City and Friends, with the price at bol.com/be and what is inside.',
        body: [
          { p: 'Five LEGO advent calendars for 2026 are available at bol.com/be. We put them side by side with the price of 19 October 2026 and what you find behind the 24 doors. bol sells them itself and all five are in stock.' },
          { h2: 'LEGO Star Wars (75456): €27.99' },
          { p: 'Recommended price €34.99, 293 pieces, ages 6 and up. You get minifigures of the Mandalorian, Moff Gideon, Grogu, a Pit Droid, Carson Teva, a Jawa and IG-11 in Christmas outfits, plus seven mini vehicles, among them the Razor Crest and an X-wing in Christmas colours.' },
          { h2: 'LEGO Marvel (76340): €27.99' },
          { p: 'Recommended price €34.99, 317 pieces, ages 6 and up. Six minifigures with wintry details: Spider-Man, Iron Man, Dr. Doom, Ghost-Spider, Captain America and Wolverine, plus small builds such as a snowball cannon, a helicopter and an X-Jet sleigh.' },
          { h2: 'LEGO Disney Princess (43298): €27.99' },
          { p: 'Recommended price €34.99, 290 pieces, ages 5 and up. With Ariel, Sebastian, Cinderella, Moana, Pua, Mulan and Mushu, among others. The box turns into a board game with a spinning wheel for up to eight players.' },
          { h2: 'LEGO City (60510): €21.99' },
          { p: 'Recommended price €26.99, 252 pieces, ages 5 and up. Santa, Mrs. Claus, three elves, a snowman and a baby reindeer, with a play mat of Santa’s workshop.' },
          { h2: 'LEGO Friends (42698): €21.99' },
          { p: 'Recommended price €26.99, 211 pieces, ages 6 and up. Three minifigures (Nova, Liann and Aliya) and six small animals: a seal, a pony, a weasel, a polar bear, a penguin and a bunny.' },
          { h2: 'Price per door' },
          { ul: [
            'City and Friends: about €0.92 per door.',
            'Star Wars, Marvel and Disney Princess: about €1.17 per door.',
          ] },
          { h2: 'Shipping' },
          { p: 'bol ships for free from €25. City and Friends, at €21.99, sit just under that line, so if you order one on its own, shipping is added. Take two, or add something else, and you pay no shipping. The prices apply on 19 October 2026, so always confirm the current price at the shop.' },
        ],
      },
    },
  },
  {
    id: 'secondhand-buying-guide',
    published: '2026-10-23T09:00:00Z',
    updated: '2026-10-23T09:00:00Z',
    text: {
      nl: {
        slug: 'tweedehands-lego-kopen-waar-check-je-op',
        title: 'Tweedehands LEGO kopen: waar check je op?',
        summary: 'Een doos die goed oogt zegt niet veel. Zo controleer je of een tweedehands LEGO-set compleet, echt en zijn prijs waard is.',
        body: [
          { h2: 'Een doos die goed oogt zegt niet veel' },
          { p: 'Je vindt een set op een tweedehandsite. De foto\'s zien er prima uit, de verkoper reageert snel. Toch weet je op dat moment nog niets over wat er echt in die zak steentjes zit. Dat kom je pas te weten als je even doorvraagt en zelf kijkt.' },
          { h2: 'Check de inventaris' },
          { p: 'Elke set heeft een vaste lijst van onderdelen, terug te vinden bij de bouwinstructies op lego.com of op een fansite zoals Rebrickable. Loop die lijst af, of vraag de verkoper om een foto van alle stukjes samen. Let vooral op de unieke onderdelen, zoals een speciaal gevormd paneel of een minifiguur die alleen in die set zit. Die zijn moeilijker te vervangen dan een gewoon steentje.' },
          { h2: 'Kijk naar de stukjes zelf' },
          { ul: [
            'Krassen of verkleuring, vooral bij witte en lichte kleuren.',
            'Beet- of tandafdrukken, die wijzen op een set die bij jonge kinderen heeft gelegen.',
            'Scheurtjes bij kleine, kwetsbare onderdelen zoals scharnieren en klikjes.',
            'Bij minifiguren: hoofd, torso, benen en accessoires samen, niet los van elkaar.',
          ] },
          { h2: 'Is het wel LEGO' },
          { p: 'Echte steentjes hebben het LEGO-logo in de nop gestempeld. Bij klonen ontbreekt dat vaak, of staat het er onscherp op. Een doos en instructies in goede staat zijn een pluspunt, maar zeggen zelf niets over de inhoud. Vertrouw op de stukjes, niet op de verpakking.' },
          { h2: 'Mist er een stukje? Dat lost zich meestal op' },
          { p: 'Een paar ontbrekende steentjes zijn geen reden om af te haken. Via de Bricks & Pieces-service van LEGO zelf bestel je losse onderdelen met het achtcijferige setnummer, meestal voor een klein bedrag per stuk plus verzending. Ontbreken er hele zakjes, dan contacteer je best de klantendienst met het setnummer en welke zak je mist. Let wel: beschadigde of beschimmelde stukjes vervangt LEGO soms gratis, verloren stukjes betaal je zelf.' },
          { h2: 'Vergelijk de prijs ook hier' },
          { p: 'Een korting ten opzichte van de adviesprijs zegt niet automatisch dat je een goede koop doet, zeker niet als er onderdelen missen of als de set elders nog nieuw te vinden is. Kijk dus ook wat de set nieuw kost voor je toehapt. Op buildthatset zie je per set de prijzen van de shops naast elkaar.' },
        ],
      },
      fr: {
        slug: 'acheter-lego-occasion-a-quoi-faire-attention',
        title: 'Acheter du LEGO d’occasion : à quoi faire attention',
        summary: 'Une boîte qui a l’air en bon état ne dit pas grand-chose. Voici comment vérifier si un set LEGO d’occasion est complet, authentique et vaut son prix.',
        body: [
          { h2: 'Une boîte qui a l’air en bon état ne dit pas grand-chose' },
          { p: 'Vous trouvez un set sur un site de seconde main. Les photos sont correctes, le vendeur répond vite. Pourtant, à ce stade, vous ne savez encore rien de ce qui se trouve vraiment dans ce sac de pièces. Vous ne le saurez qu’en posant quelques questions et en regardant vous-même.' },
          { h2: 'Vérifiez l’inventaire' },
          { p: 'Chaque set a une liste fixe de pièces, que vous retrouvez avec les instructions de montage sur lego.com ou sur un site de fans comme Rebrickable. Parcourez cette liste, ou demandez au vendeur une photo de toutes les pièces réunies. Portez une attention particulière aux pièces uniques, comme un panneau de forme spéciale ou une minifigurine propre à ce set. Elles sont plus difficiles à remplacer qu’une brique ordinaire.' },
          { h2: 'Regardez les pièces elles-mêmes' },
          { ul: [
            'Rayures ou décoloration, surtout sur les teintes blanches et claires.',
            'Traces de dents ou de morsures, signe qu’un jeune enfant a joué avec le set.',
            'Petites fissures sur les éléments fragiles, comme les charnières et les clips.',
            'Pour les minifigurines : tête, torse, jambes et accessoires réunis, pas dispersés.',
          ] },
          { h2: 'Est-ce vraiment du LEGO' },
          { p: 'Les vraies pièces portent le logo LEGO estampé sur le plot. Chez les contrefaçons, il manque souvent, ou il est flou. Une boîte et des instructions en bon état sont un plus, mais ne disent rien du contenu en soi. Faites confiance aux pièces, pas à l’emballage.' },
          { h2: 'Il manque une pièce ? Ça se règle souvent' },
          { p: 'Quelques pièces manquantes ne sont pas une raison d’abandonner. Via le service Bricks & Pieces de LEGO lui-même, vous commandez des pièces détachées avec le numéro de set à huit chiffres, le plus souvent pour un petit montant par pièce plus les frais de port. S’il manque des sachets entiers, contactez plutôt le service client avec le numéro de set et le sachet concerné. Attention : LEGO remplace parfois gratuitement les pièces abîmées ou moisies, mais vous payez vous-même les pièces perdues.' },
          { h2: 'Comparez le prix ici aussi' },
          { p: 'Une réduction par rapport au prix conseillé ne signifie pas automatiquement une bonne affaire, surtout s’il manque des pièces ou si le set se trouve encore neuf ailleurs. Vérifiez donc aussi ce que coûte le set à l’état neuf avant de vous décider. Sur buildthatset, vous voyez pour chaque set les prix des boutiques côte à côte.' },
        ],
      },
      en: {
        slug: 'buying-secondhand-lego-what-to-check',
        title: 'Buying secondhand LEGO: what to check',
        summary: 'A box that looks fine does not tell you much. Here is how to check whether a secondhand LEGO set is complete, genuine and worth its price.',
        body: [
          { h2: 'A box that looks fine does not tell you much' },
          { p: 'You find a set on a secondhand site. The photos look decent, the seller replies fast. Even so, at that point you still know nothing about what is really inside that bag of pieces. You only find that out by asking a few questions and looking for yourself.' },
          { h2: 'Check the inventory' },
          { p: 'Every set has a fixed parts list, found alongside the building instructions on lego.com or on a fan site such as Rebrickable. Go through that list, or ask the seller for a photo of all the pieces together. Pay close attention to the unique parts, such as a specially shaped panel or a minifigure that only comes with that set. Those are harder to replace than an ordinary brick.' },
          { h2: 'Look at the pieces themselves' },
          { ul: [
            'Scratches or discolouration, especially on white and light colours.',
            'Bite or tooth marks, a sign the set has been handled by young children.',
            'Small cracks in fragile parts such as hinges and clips.',
            'For minifigures: head, torso, legs and accessories together, not scattered.',
          ] },
          { h2: 'Is it actually LEGO' },
          { p: 'Genuine pieces have the LEGO logo stamped into the stud. Clones often lack it, or it comes out blurry. A box and instructions in good shape are a plus, but say nothing about the contents by themselves. Trust the pieces, not the packaging.' },
          { h2: 'Missing a piece? That usually sorts itself out' },
          { p: 'A few missing pieces are no reason to walk away. Through LEGO\'s own Bricks & Pieces service you can order loose parts using the eight-digit set number, usually for a small amount per piece plus shipping. If whole bags are missing, contact customer service instead with the set number and which bag is gone. One thing to note: LEGO sometimes replaces damaged or mouldy pieces for free, but pieces you lost yourself you pay for.' },
          { h2: 'Compare the price here too' },
          { p: 'A discount against the recommended price does not automatically mean a good deal, especially if pieces are missing or the set is still available new elsewhere. So check what the set costs new before you commit. On buildthatset you see the shop prices for each set side by side.' },
        ],
      },
    },
  },
  {
    "id": "bol-below-rrp-2026-10-26",
    "published": "2026-10-26T10:15:00.000Z",
    "updated": "2026-10-26T10:15:00.000Z",
    "text": {
      "nl": {
        "slug": "lego-sets-bij-bol-onder-de-adviesprijs-26-oktober",
        "title": "Acht LEGO-sets die bij bol minstens een kwart onder de adviesprijs staan",
        "summary": "Op 26 oktober 2026 staan acht LEGO-sets bij bol.com/be minstens een kwart onder de adviesprijs, van Paasei versieren tot Pikachu en Poké Ball.",
        "body": [
          {
            "p": "Op 26 oktober 2026 staan er bij bol weer LEGO-sets ruim onder de adviesprijs van LEGO. We lazen elke prijs na op de productpagina van bol.com/be. Alle acht sets verkoopt bol zelf en ze zijn op voorraad. Bij sets onder € 25 komt er € 2,99 verzending bij, de andere worden gratis geleverd."
          },
          {
            "h2": "De acht sets, van groot naar klein verschil"
          },
          {
            "ul": [
              "Paasei versieren (40816): € 10,39 bij bol, adviesprijs € 19,99. Dat is € 9,60 lager, ongeveer 48 procent. Met verzending € 13,38.",
              "Editions Lionel Messi (43018): € 99,99 bij bol, adviesprijs € 179,99. Dat is € 80,00 lager, ongeveer 44 procent.",
              "Editions Lionel Messi, Voetbalhoogtepunten (43011): € 16,99 bij bol, adviesprijs € 29,99. Dat is € 13,00 lager, ongeveer 43 procent. Met verzending € 19,98.",
              "Pokémon Pikachu en Poké Ball (72152): € 115,00 bij bol, adviesprijs € 199,99. Dat is € 84,99 lager, ongeveer 42 procent.",
              "Editions Lionel Messi, voetballegende (43015): € 49,99 bij bol, adviesprijs € 79,99. Dat is € 30,00 lager, ongeveer 38 procent.",
              "Editions Scuderia Ferrari HP, helm van Charles Leclerc (43014): € 59,99 bij bol, adviesprijs € 89,99. Dat is € 30,00 lager, ongeveer 33 procent.",
              "Editions Vinicius Jr., collectorplaat (43027): € 19,99 bij bol, adviesprijs € 29,99. Dat is € 10,00 lager, ongeveer 33 procent. Met verzending € 22,98.",
              "Speed Champions Jaguar Project 7 en Land Rover Defender (77264): € 40,00 bij bol, adviesprijs € 54,99. Dat is € 14,99 lager, ongeveer 27 procent."
            ]
          },
          {
            "h2": "Wat opvalt"
          },
          {
            "ul": [
              "Vijf van de acht sets komen uit de Editions-reeks rond voetbal en Formule 1, met drie sets over Lionel Messi.",
              "Pikachu en Poké Ball heeft het grootste verschil in euro: bijna 85 euro onder de adviesprijs.",
              "Twee sets die we in onze lijst nog boven de drempel zagen vielen af. Cristiano Ronaldo, voetballegende (43016) staat op € 60,04, net minder dan een kwart onder de adviesprijs van € 79,99. F1 Academy racewagen (77258) staat op € 21,99 bij een adviesprijs van € 27,99."
            ]
          },
          {
            "h2": "Zo lees je deze prijzen"
          },
          {
            "p": "We vergelijken met de adviesprijs die bol bij de set toont, en dat is niet altijd de laagste prijs van de voorbije maanden. Prijzen veranderen vaak, soms binnen een dag. Alle bedragen zijn gecontroleerd op 26 oktober 2026 op de productpagina van bol.com/be. Kijk de actuele prijs altijd na voor je bestelt."
          }
        ]
      },
      "fr": {
        "slug": "sets-lego-chez-bol-sous-le-prix-conseille-26-octobre",
        "title": "Huit sets LEGO au moins un quart sous le prix conseillé chez bol",
        "summary": "Le 26 octobre 2026, huit sets LEGO sont chez bol.com/be au moins un quart sous le prix conseillé, de Décorer l’œuf de Pâques à Pikachu et Poké Ball.",
        "body": [
          {
            "p": "Le 26 octobre 2026, bol propose à nouveau des sets LEGO nettement sous le prix conseillé par LEGO. Nous avons relu chaque prix sur la page produit de bol.com/be. Bol vend lui-même ces huit sets et tous sont en stock. Pour les sets sous 25 €, 2,99 € de livraison s’ajoutent, les autres sont livrés gratuitement."
          },
          {
            "h2": "Les huit sets, de la plus grande à la plus petite différence"
          },
          {
            "ul": [
              "Décorer l’œuf de Pâques (40816) : 10,39 € chez bol, prix conseillé 19,99 €. Soit 9,60 € de moins, environ 48 pour cent. Livraison comprise : 13,38 €.",
              "Editions Lionel Messi (43018) : 99,99 € chez bol, prix conseillé 179,99 €. Soit 80,00 € de moins, environ 44 pour cent.",
              "Editions Lionel Messi, Temps forts du football (43011) : 16,99 € chez bol, prix conseillé 29,99 €. Soit 13,00 € de moins, environ 43 pour cent. Livraison comprise : 19,98 €.",
              "Pokémon Pikachu et Poké Ball (72152) : 115,00 € chez bol, prix conseillé 199,99 €. Soit 84,99 € de moins, environ 42 pour cent.",
              "Editions Lionel Messi, légende du football (43015) : 49,99 € chez bol, prix conseillé 79,99 €. Soit 30,00 € de moins, environ 38 pour cent.",
              "Editions Scuderia Ferrari HP, casque de Charles Leclerc (43014) : 59,99 € chez bol, prix conseillé 89,99 €. Soit 30,00 € de moins, environ 33 pour cent.",
              "Editions Vinicius Jr., plaque de collection (43027) : 19,99 € chez bol, prix conseillé 29,99 €. Soit 10,00 € de moins, environ 33 pour cent. Livraison comprise : 22,98 €.",
              "Speed Champions Jaguar Project 7 et Land Rover Defender (77264) : 40,00 € chez bol, prix conseillé 54,99 €. Soit 14,99 € de moins, environ 27 pour cent."
            ]
          },
          {
            "h2": "Ce qui frappe"
          },
          {
            "ul": [
              "Cinq des huit sets viennent de la gamme Editions autour du football et de la Formule 1, dont trois consacrés à Lionel Messi.",
              "Pikachu et Poké Ball affiche la plus grande différence en euros : près de 85 euros sous le prix conseillé.",
              "Deux sets qui figuraient encore au-dessus du seuil dans notre liste sont tombés. Cristiano Ronaldo, légende du football (43016) est à 60,04 €, un peu moins d’un quart sous le prix conseillé de 79,99 €. La voiture de course F1 Academy (77258) est à 21,99 € pour un prix conseillé de 27,99 €."
            ]
          },
          {
            "h2": "Comment lire ces prix"
          },
          {
            "p": "Nous comparons avec le prix conseillé que bol affiche pour le set, ce qui n’est pas toujours le prix le plus bas des derniers mois. Les prix changent souvent, parfois en une journée. Tous les montants ont été vérifiés le 26 octobre 2026 sur la page produit de bol.com/be. Vérifiez toujours le prix actuel avant de commander."
          }
        ]
      },
      "en": {
        "slug": "lego-sets-at-bol-below-the-recommended-price-26-october",
        "title": "Eight LEGO sets at least a quarter below the recommended price at bol",
        "summary": "On 26 October 2026, eight LEGO sets at bol.com/be are at least a quarter below the recommended price, from the Easter egg set to Pikachu and Poké Ball.",
        "body": [
          {
            "p": "On 26 October 2026, bol again has LEGO sets well below the price LEGO recommends. We read every price on the product page at bol.com/be. Bol sells all eight sets itself and all are in stock. Sets under €25 carry €2.99 shipping, the others ship free."
          },
          {
            "h2": "The eight sets, from largest to smallest difference"
          },
          {
            "ul": [
              "Decorate the Easter Egg (40816): €10.39 at bol, recommended price €19.99. That is €9.60 lower, about 48 percent. With shipping €13.38.",
              "Editions Lionel Messi (43018): €99.99 at bol, recommended price €179.99. That is €80.00 lower, about 44 percent.",
              "Editions Lionel Messi, Football Highlights (43011): €16.99 at bol, recommended price €29.99. That is €13.00 lower, about 43 percent. With shipping €19.98.",
              "Pokémon Pikachu and Poké Ball (72152): €115.00 at bol, recommended price €199.99. That is €84.99 lower, about 42 percent.",
              "Editions Lionel Messi, football legend (43015): €49.99 at bol, recommended price €79.99. That is €30.00 lower, about 38 percent.",
              "Editions Scuderia Ferrari HP, Charles Leclerc helmet (43014): €59.99 at bol, recommended price €89.99. That is €30.00 lower, about 33 percent.",
              "Editions Vinicius Jr., collector plaque (43027): €19.99 at bol, recommended price €29.99. That is €10.00 lower, about 33 percent. With shipping €22.98.",
              "Speed Champions Jaguar Project 7 and Land Rover Defender (77264): €40.00 at bol, recommended price €54.99. That is €14.99 lower, about 27 percent."
            ]
          },
          {
            "h2": "What stands out"
          },
          {
            "ul": [
              "Five of the eight sets come from the Editions line around football and Formula 1, with three about Lionel Messi.",
              "Pikachu and Poké Ball has the biggest difference in euros: almost €85 below the recommended price.",
              "Two sets that looked above the threshold in our list dropped out. Cristiano Ronaldo, football legend (43016) is €60.04, just under a quarter below the €79.99 recommended price. The F1 Academy race car (77258) is €21.99 against a recommended price of €27.99."
            ]
          },
          {
            "h2": "How to read these prices"
          },
          {
            "p": "We compare with the recommended price bol shows for the set, which is not always the lowest price of recent months. Prices change often, sometimes within a day. All amounts were checked on 26 October 2026 on the product page at bol.com/be. Always check the current price before you order."
          }
        ]
      }
    }
  },
  {
    "id": "new-sets-wednesday-avengers-2026-10-26",
    "published": "2026-10-26T10:17:00.000Z",
    "updated": "2026-10-26T10:17:00.000Z",
    "text": {
      "nl": {
        "slug": "nieuwe-lego-sets-wednesday-avengers-wallace-gromit-bij-bol",
        "title": "Nieuwe LEGO-sets van oktober, deel twee: Wednesday, Avengers en Wallace & Gromit bij bol",
        "summary": "Wednesday, Avengers: Doomsday en Wallace & Gromit: wat deze nieuwe LEGO-sets bij bol.com/be kosten en welke nu leverbaar zijn. Gecontroleerd op 26 oktober.",
        "body": [
          {
            "p": "Vorige week bekeken we vijf nieuwe sets van oktober. Volgens de lijst van New Elementary behoren ook deze vijf tot de LEGO-nieuwigheden van oktober 2026. We keken op 26 oktober op bol.com/be wat ze kosten en of je ze kunt bestellen."
          },
          {
            "h2": "Nu leverbaar bij bol"
          },
          {
            "ul": [
              "Wednesday Rugzak (76787), 401 onderdelen: € 32,49, adviesprijs € 39,99. Op voorraad, verzending inbegrepen.",
              "Wednesday Nevermore Academie (76788), 890 onderdelen en 3 figuren: € 53,13, adviesprijs € 69,99. Op voorraad, verzending inbegrepen.",
              "Marvel Avengers: Doomsday Quinjet (76347): € 45,54, adviesprijs € 59,99. Op voorraad, verzending inbegrepen.",
              "Marvel Avengers: Doomsday Nieuwe Avengers Toren (76352): € 87,00, adviesprijs € 109,99. Op voorraad, verzending inbegrepen."
            ]
          },
          {
            "p": "Bij alle vier verkoopt bol zelf en zegt de pagina \"morgen in huis\" bij een bestelling voor sluitingstijd."
          },
          {
            "h2": "Nog niet te bestellen"
          },
          {
            "ul": [
              "Ideas Wallace & Gromit (21371): bol toont de set als niet leverbaar, zonder prijs of datum. Je kunt er een bericht voor aanvragen."
            ]
          },
          {
            "h2": "Wat opvalt"
          },
          {
            "p": "Alle vier de leverbare sets staan onder de adviesprijs, tussen 19 en 24 procent. De Avengers Toren heeft het grootste verschil in euro: € 22,99, ongeveer 21 procent. In procent zitten de Nevermore Academie en de Quinjet het hoogst, met ongeveer 24 procent. Prijzen kunnen snel weer veranderen."
          },
          {
            "h2": "Bronnen"
          },
          {
            "src": [
              {
                "label": "New Elementary: new October 2026 LEGO sets and gifts",
                "url": "https://www.newelementary.com/2026/10/new-october-2026-lego-sets-and-gifts.html"
              }
            ]
          },
          {
            "p": "Prijzen veranderen vaak, soms binnen een dag. Alle bedragen zijn gecontroleerd op 26 oktober 2026 op de productpagina van bol.com/be. Kijk de actuele prijs altijd na voor je bestelt."
          }
        ]
      },
      "fr": {
        "slug": "nouveaux-sets-lego-wednesday-avengers-wallace-gromit-chez-bol",
        "title": "Nouveaux sets LEGO d’octobre, deuxième partie : Wednesday, Avengers et Wallace & Gromit chez bol",
        "summary": "Wednesday, Avengers : Doomsday et Wallace & Gromit : prix chez bol.com/be de ces nouveaux sets LEGO et ceux qui sont disponibles. Vérifié le 26 octobre.",
        "body": [
          {
            "p": "La semaine dernière, nous avons regardé cinq nouveautés d’octobre. D’après la liste de New Elementary, ces cinq-ci font aussi partie des nouveautés LEGO d’octobre 2026. Le 26 octobre, nous avons vérifié sur bol.com/be leur prix et s’il est possible de les commander."
          },
          {
            "h2": "Disponibles maintenant chez bol"
          },
          {
            "ul": [
              "Wednesday Sac à dos (76787), 401 pièces : 32,49 €, prix conseillé 39,99 €. En stock, livraison comprise.",
              "Wednesday Académie Nevermore (76788), 890 pièces et 3 figurines : 53,13 €, prix conseillé 69,99 €. En stock, livraison comprise.",
              "Marvel Avengers : Doomsday Quinjet (76347) : 45,54 €, prix conseillé 59,99 €. En stock, livraison comprise.",
              "Marvel Avengers : Doomsday Nouvelle tour des Avengers (76352) : 87,00 €, prix conseillé 109,99 €. En stock, livraison comprise."
            ]
          },
          {
            "p": "Pour ces quatre sets, bol est le vendeur et la page annonce « demain chez vous » pour une commande avant l’heure limite."
          },
          {
            "h2": "Pas encore commandable"
          },
          {
            "ul": [
              "Ideas Wallace & Gromit (21371) : bol affiche le set comme indisponible, sans prix ni date. Vous pouvez demander à être prévenu."
            ]
          },
          {
            "h2": "Ce qui frappe"
          },
          {
            "p": "Les quatre sets disponibles sont sous le prix conseillé, entre 19 et 24 pour cent. La Tour des Avengers affiche la plus grande différence en euros : 22,99 €, soit environ 21 pour cent. En pourcentage, l’Académie Nevermore et le Quinjet arrivent en tête, avec environ 24 pour cent. Les prix peuvent vite changer."
          },
          {
            "h2": "Sources"
          },
          {
            "src": [
              {
                "label": "New Elementary: new October 2026 LEGO sets and gifts",
                "url": "https://www.newelementary.com/2026/10/new-october-2026-lego-sets-and-gifts.html"
              }
            ]
          },
          {
            "p": "Les prix changent souvent, parfois en une journée. Tous les montants ont été vérifiés le 26 octobre 2026 sur la page produit de bol.com/be. Vérifiez toujours le prix actuel avant de commander."
          }
        ]
      },
      "en": {
        "slug": "new-lego-sets-wednesday-avengers-wallace-gromit-at-bol",
        "title": "New LEGO sets of October, part two: Wednesday, Avengers and Wallace & Gromit at bol",
        "summary": "Wednesday, Avengers: Doomsday and Wallace & Gromit: what these new LEGO sets cost at bol.com/be and which you can order now. Checked on 26 October.",
        "body": [
          {
            "p": "Last week we looked at five new sets from October. According to the New Elementary list, these five are also among the LEGO novelties of October 2026. On 26 October we checked at bol.com/be what they cost and whether you can order them."
          },
          {
            "h2": "Available now at bol"
          },
          {
            "ul": [
              "Wednesday Backpack (76787), 401 pieces: €32.49, recommended price €39.99. In stock, shipping included.",
              "Wednesday Nevermore Academy (76788), 890 pieces and 3 figures: €53.13, recommended price €69.99. In stock, shipping included.",
              "Marvel Avengers: Doomsday Quinjet (76347): €45.54, recommended price €59.99. In stock, shipping included.",
              "Marvel Avengers: Doomsday New Avengers Tower (76352): €87.00, recommended price €109.99. In stock, shipping included."
            ]
          },
          {
            "p": "Bol sells all four itself, and the page says \"delivered tomorrow\" for an order before the cut-off time."
          },
          {
            "h2": "Not yet available"
          },
          {
            "ul": [
              "Ideas Wallace & Gromit (21371): bol shows the set as unavailable, with no price or date. You can ask to be notified."
            ]
          },
          {
            "h2": "What stands out"
          },
          {
            "p": "All four available sets are below the recommended price, between 19 and 24 percent. The Avengers Tower has the biggest difference in euros: €22.99, about 21 percent. In percent, the Nevermore Academy and the Quinjet lead, with about 24 percent. Prices can change quickly."
          },
          {
            "h2": "Sources"
          },
          {
            "src": [
              {
                "label": "New Elementary: new October 2026 LEGO sets and gifts",
                "url": "https://www.newelementary.com/2026/10/new-october-2026-lego-sets-and-gifts.html"
              }
            ]
          },
          {
            "p": "Prices change often, sometimes within a day. All amounts were checked on 26 October 2026 on the product page at bol.com/be. Always check the current price before you order."
          }
        ]
      }
    }
  },
  {
    "id": "christmas-sets-2026",
    "published": "2026-10-26T10:19:00.000Z",
    "updated": "2026-10-26T10:19:00.000Z",
    "text": {
      "nl": {
        "slug": "lego-kerstsets-2026-prijs-per-steen-bij-bol",
        "title": "Vijf LEGO-kerstsets voor tafel en boom: prijs en prijs per steen bij bol",
        "summary": "Vijf LEGO-kerstsets bij bol.com/be van € 9,00 tot € 119,99, met aantal stenen en prijs per steen. Gecontroleerd op 26 oktober 2026.",
        "body": [
          {
            "p": "Met Sinterklaas en kerst in zicht zetten we vijf LEGO-sets in de sfeer van de feestdagen op een rij, van klein naar groot. Bol verkoopt ze alle vijf zelf en ze zijn op voorraad. De prijs per steen is de setprijs gedeeld door het aantal stenen, zonder verzending."
          },
          {
            "h2": "Sneeuwpopornamenten (40812): ongeveer € 0,05 per steen"
          },
          {
            "p": "Twee hangende sneeuwmannen van 168 stenen voor € 9,00, adviesprijs € 12,99. Onder de € 25 komt er € 2,99 verzending bij, samen € 11,99."
          },
          {
            "h2": "Kersttafeldecoratie met kaars en sterren (40743): ongeveer € 0,08 per steen"
          },
          {
            "p": "433 stenen voor € 32,99, adviesprijs € 39,99, verzending inbegrepen. Bol toont er het label \"LEGO laatste kans\" bij."
          },
          {
            "h2": "2-in-1 kersthuisje met Santa-kamer (40809): ongeveer € 0,07 per steen"
          },
          {
            "p": "498 stenen voor € 32,99, adviesprijs € 39,99, verzending inbegrepen."
          },
          {
            "h2": "Icons Kerstster Poinsettia (10370): ongeveer € 0,08 per steen"
          },
          {
            "p": "608 stenen voor € 49,99, verzending inbegrepen. Bol toont geen adviesprijs."
          },
          {
            "h2": "Icons Feestelijke Kersttrein (10361): ongeveer € 0,13 per steen"
          },
          {
            "p": "956 stenen voor € 119,99, verzending inbegrepen. Bol toont geen adviesprijs. Dit is de grootste set van de vijf."
          },
          {
            "h2": "Zo kies je"
          },
          {
            "ul": [
              "Voor een klein Sinterklaascadeau past het sneeuwmannenduo, zeker samen met een tweede set zodat de verzending wegvalt.",
              "Voor de kersttafel kijk je naar de Kersttafeldecoratie of het kersthuisje, die op dezelfde prijs staan.",
              "Voor een bouwproject voor volwassenen zijn de Poinsettia en de Kersttrein de Icons-sets in dit lijstje."
            ]
          },
          {
            "p": "Prijzen veranderen vaak, soms binnen een dag. Alle bedragen zijn gecontroleerd op 26 oktober 2026 op de productpagina van bol.com/be. Kijk de actuele prijs altijd na voor je bestelt."
          }
        ]
      },
      "fr": {
        "slug": "sets-lego-noel-2026-prix-par-brique-chez-bol",
        "title": "Cinq sets LEGO de Noël pour la table et le sapin : prix et prix par brique chez bol",
        "summary": "Cinq sets LEGO de Noël chez bol.com/be de 9,00 € à 119,99 €, avec nombre de briques et prix par brique. Vérifié le 26 octobre 2026.",
        "body": [
          {
            "p": "À l’approche de la Saint-Nicolas et de Noël, nous avons aligné cinq sets LEGO aux couleurs des fêtes, du plus petit au plus grand. Bol vend lui-même ces cinq sets et tous sont en stock. Le prix par brique est le prix du set divisé par le nombre de briques, livraison non comprise."
          },
          {
            "h2": "Ornements bonhommes de neige (40812) : environ 0,05 € par brique"
          },
          {
            "p": "Deux bonhommes de neige à suspendre, 168 briques, pour 9,00 €, prix conseillé 12,99 €. Sous 25 €, 2,99 € de livraison s’ajoutent, soit 11,99 €."
          },
          {
            "h2": "Décoration de table de Noël, bougie et étoiles (40743) : environ 0,08 € par brique"
          },
          {
            "p": "433 briques pour 32,99 €, prix conseillé 39,99 €, livraison comprise. Bol y ajoute l’étiquette « LEGO dernière chance »."
          },
          {
            "h2": "Maisonnette de Noël 2 en 1 avec salon du Père Noël (40809) : environ 0,07 € par brique"
          },
          {
            "p": "498 briques pour 32,99 €, prix conseillé 39,99 €, livraison comprise."
          },
          {
            "h2": "Icons Étoile de Noël Poinsettia (10370) : environ 0,08 € par brique"
          },
          {
            "p": "608 briques pour 49,99 €, livraison comprise. Bol n’affiche pas de prix conseillé."
          },
          {
            "h2": "Icons Train de Noël festif (10361) : environ 0,13 € par brique"
          },
          {
            "p": "956 briques pour 119,99 €, livraison comprise. Bol n’affiche pas de prix conseillé. C’est le plus grand set des cinq."
          },
          {
            "h2": "Comment choisir"
          },
          {
            "ul": [
              "Pour un petit cadeau de Saint-Nicolas, le duo de bonhommes de neige convient, surtout avec un deuxième set pour éviter les frais de livraison.",
              "Pour la table de Noël, regardez la décoration de table ou la maisonnette, au même prix.",
              "Pour un projet de construction adulte, la Poinsettia et le train de Noël sont les sets Icons de cette liste."
            ]
          },
          {
            "p": "Les prix changent souvent, parfois en une journée. Tous les montants ont été vérifiés le 26 octobre 2026 sur la page produit de bol.com/be. Vérifiez toujours le prix actuel avant de commander."
          }
        ]
      },
      "en": {
        "slug": "lego-christmas-sets-2026-price-per-piece-at-bol",
        "title": "Five LEGO Christmas sets for table and tree: price and price per piece at bol",
        "summary": "Five LEGO Christmas sets at bol.com/be from €9.00 to €119.99, with piece count and price per piece. Checked on 26 October 2026.",
        "body": [
          {
            "p": "With Sinterklaas and Christmas in sight, we lined up five LEGO sets with a holiday feel, from small to large. Bol sells all five itself and all are in stock. Price per piece is the set price divided by the piece count, shipping not included."
          },
          {
            "h2": "Snowman Ornaments (40812): about €0.05 per piece"
          },
          {
            "p": "Two hanging snowmen of 168 pieces for €9.00, recommended price €12.99. Under €25, €2.99 shipping is added, €11.99 in total."
          },
          {
            "h2": "Christmas Table Decoration with candle and stars (40743): about €0.08 per piece"
          },
          {
            "p": "433 pieces for €32.99, recommended price €39.99, shipping included. Bol adds a \"LEGO last chance\" label."
          },
          {
            "h2": "2-in-1 Christmas house with Santa room (40809): about €0.07 per piece"
          },
          {
            "p": "498 pieces for €32.99, recommended price €39.99, shipping included."
          },
          {
            "h2": "Icons Poinsettia Christmas Star (10370): about €0.08 per piece"
          },
          {
            "p": "608 pieces for €49.99, shipping included. Bol shows no recommended price."
          },
          {
            "h2": "Icons Festive Christmas Train (10361): about €0.13 per piece"
          },
          {
            "p": "956 pieces for €119.99, shipping included. Bol shows no recommended price. This is the largest of the five."
          },
          {
            "h2": "How to choose"
          },
          {
            "ul": [
              "For a small Sinterklaas gift, the snowman pair fits, especially with a second set so the shipping drops away.",
              "For the Christmas table, look at the table decoration or the Christmas house, at the same price.",
              "For an adult building project, the Poinsettia and the Christmas Train are the Icons sets on this list."
            ]
          },
          {
            "p": "Prices change often, sometimes within a day. All amounts were checked on 26 October 2026 on the product page at bol.com/be. Always check the current price before you order."
          }
        ]
      }
    }
  },
];
