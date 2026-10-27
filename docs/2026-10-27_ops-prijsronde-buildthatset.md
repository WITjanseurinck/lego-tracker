# buildthatset in de gedeelde prijsronde

Dit document beschrijft hoe buildthatset meedraait in de gedeelde Coolify-service "ops-prijsronde", dezelfde service die nu al elke dag de prijzen van kaoru, maestri, maisoncoquine en voiturebalai ververst. Doel: één aanpak voor de dagelijkse prijsronde over alle vijf sites, zoals besloten.

## Waarom buildthatset anders werkt dan de andere vier

Kaoru, maestri, maisoncoquine en voiturebalai zijn stateless: een script haalt de bol-prijzen op, schrijft ze in een JSON-bestand in de repo, commit en pusht. Coolify bouwt de site daarna opnieuw bij de push.

buildthatset werkt niet zo. De worker (`worker/`) doet veel meer dan een prijsronde:
- hij haalt niet alleen bol op, maar ook feeds van andere shops via Awin en Daisycon (mediamarkt, dreamland, fun, smyths, intertoys, bart smit), telkens als de bijhorende `FEED_*`-omgevingsvariabele gezet is;
- hij houdt prijshistoriek bij per set, nodig voor de prijsgrafiek op de productpagina;
- hij kopieert productfoto's naar een eigen bucket;
- hij verstuurt prijsalertmails naar wie zich inschreef;
- hij maakt elke maandag een conceptartikel voor de wekelijkse deals.

Dat alles staat in een zelfgehoste Supabase, niet in een git-bestand. Een JSON-bestand in de repo kan geen historiek bijhouden, geen mailadressen van alertabonnees bewaren en geen artikelconcepten opslaan. Buildthatset omzetten naar het JSON-patroon van de andere vier zou die functies schrappen.

## Wat "één aanpak" hier wel betekent

Niet het datamodel gelijktrekken, wel de manier waarop de dagelijkse ronde draait: dezelfde ops-prijsronde-container, hetzelfde patroon van een gebakken script plus een Coolify Scheduled Task, in plaats van een aparte GitHub Action of een eigen Coolify-app met eigen cron. Concreet:

1. Een `/scripts/buildthatset.sh` in de ops-prijsronde-Dockerfile, net als de andere vier, dat:
   - de repo clonet (`WITjanseurinck/lego-tracker`);
   - in `worker/` draait;
   - `npm ci` en dan `npm run ingest` uitvoert, met de Supabase- en bol-omgevingsvariabelen als env;
   - niets commit of pusht, want er verandert niets in de repo. De worker schrijft rechtstreeks naar Supabase.
2. Een Coolify Scheduled Task "Prijzen buildthatset" op de ops-prijsronde-app, met hetzelfde commando-patroon (`bash /scripts/buildthatset.sh`).

Dat is dezelfde operationele aanpak als de andere vier: één container, één soort Scheduled Task, geen GitHub Actions meer nodig. Het verschil zit enkel in wat het script doet zodra het draait, omdat buildthatset nu eenmaal een andere databehoefte heeft.

## Wat nog ontbreekt voor dit kan draaien

- **Supabase zelf**: de worker heeft `SUPABASE_URL` en `SUPABASE_SERVICE_ROLE_KEY` nodig van een draaiende, zelfgehoste Supabase-instantie. Staat die al op je server? Zo niet, moet die er eerst zijn voor er iets te verversen valt.
- **BOL_SITE_ID voor buildthatset**: de vijf bol-credentials die je al doorgaf, waren telkens enkel client ID en secret. buildthatset heeft daarnaast een eigen SiteId nodig (zoals kaoru en maestri die ook hebben). Welke is dat?
- **DEMO-modus**: de site draait nu met `DEMO=1` (voorbeelddata, `noindex`). Zodra de worker echte data in Supabase zet, moet de web-app van buildthatset.com die variabele kwijt en de echte Supabase-variabelen krijgen om ze te tonen. Dat is een aparte stap, los van deze prijsronde.
- **Awin/Daisycon-feeds**: optioneel. Zonder die `FEED_*`-variabelen slaat de worker die shops gewoon over en blijft enkel bol actief. Kan later bijgevoegd worden zonder dat dit script moet veranderen.

## Volgende stap

Zodra Supabase draait en de BOL_SITE_ID gekend is: het script en de Scheduled Task toevoegen op dezelfde manier als bij kaoru, maestri en maisoncoquine.
