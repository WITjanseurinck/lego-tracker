# buildthatset: prijstracker (whitelabel)

Een codebase voor prijsvergelijkers per product. Eerste vertical: **lego** (België). Daarna Nederland, daarna parfum.

## Opbouw
- `supabase/migrations/001_init.sql`: schema. Alles hangt aan een `vertical`.
- `web/`: Next.js-site (deals, productpagina met prijsgrafiek, verlanglijst, prijsalerts, nieuws voor Google Discover).
- `worker/`: haalt feeds binnen, schrijft prijshistoriek, kopieert officiële afbeeldingen, verstuurt alerts en maakt maandag een conceptartikel.

## Opstarten
1. Voer `001_init.sql` uit op je Supabase (SQL editor of `psql`).
2. Kopieer `.env.example` naar `.env` en vul de sleutels en feed-URL's in.
3. Lokaal: `cd web && npm install && npm run dev`, en `cd worker && npm install && npm run ingest`.
4. Op de VPS: voeg `docker-compose.yml` toe in Coolify. Maak een Scheduled Task die dagelijks `npm run ingest` draait in de worker.

## Land aanzetten
Nederland staat uit. Later: `update shops set active = true where vertical = 'lego' and country = 'NL';`, zet `COUNTRIES=BE,NL` en voeg de NL-feeds toe aan je env.

## Nieuwe vertical (parfum)
1. `worker/src/verticals/parfum.ts`: relevantie, SKU-regel (bv. EAN of merk-naam-ml), naamopschoning, toegestane beeldhosts.
2. `web/src/verticals/parfum.ts`: naam, kleuren, teksten, metaregel.
3. Registreer beide in de `index.ts` van die mappen, voeg shops toe met `vertical = 'parfum'`, en draai de site met `VERTICAL=parfum`.

## Afbeeldingen
De worker leest de afbeeldings-URL uit de feed van de merkshop (voor LEGO: `lego-be`), kopieert ze naar de Supabase-bucket `product-images` en toont enkel die kopie. Alleen hosts uit `officialImageHosts`, enkel https, max 5 MB. Controleer vooraf de voorwaarden van het LEGO-affiliateprogramma.

## Google Discover
Grote beelden (`max-image-preview:large`), Article-schema, sitemap en robots zijn ingesteld. Discover beloont eigen, bruikbare artikels: lees het wekelijkse concept na, voeg duiding toe en publiceer het via `update articles set status = 'published', published_at = now() where slug = '...'`. Gebruik per artikel een beeld van minstens 1200 px breed.

## Nog te doen
- Bevestigingsmail voor alerts (nu staat de link in de serverlogs).
- Kolomnamen van elke feed controleren tegen de echte CSV, en de bol-API testen.
- Beeldrechten en affiliatevoorwaarden per shop nalezen.

## Demo online zetten

Met `DEMO=1` (of zonder `SUPABASE_URL`) draait de site op voorbeelddata uit `web/src/lib/demo.ts`, met de foto's uit `web/public/demo`. Alle sets, prijzen en shops daarin zijn verzonnen. In Coolify: nieuwe applicatie op `web/` (Dockerfile), env `DEMO=1` en `SITE_URL=https://jouwdomein`. In demomodus staat `noindex` aan, zodat Google de demo niet indexeert. Vervang de foto's door de echte feed-afbeeldingen zodra de worker draait.

## Vanavond live in Coolify (demo)

1. Zet de map `lego-tracker` in een Git-repo (GitHub of je eigen Git) en push.
2. Coolify, nieuwe resource, Dockerfile-build. Base directory `web`, poort 3000.
3. Environment: `DEMO=1`, `SITE_URL=https://jouwdomein`, `GTM_ID=GTM-XXXXXXX`.
4. Domein koppelen, deploy. In demomodus is de site `noindex` en blokkeert robots.txt alles.
5. Analytics via Google Tag Manager met Consent Mode v2: tot de bezoeker accepteert staat alles op "denied". De site stuurt twee events naar de dataLayer: `virtual_pageview` (elke navigatie na de eerste) en `affiliate_click` (klik op een shoplink, met `link_url` en `link_text`). Zet in GTM de GA4-configuratietag op "All pages" en een GA4-eventtag per event, of zet "Page changes based on browser history events" aan.

Voor echte prijzen: haal `DEMO` weg, vul de Supabase-variabelen en de feed-URL's in en plan `npm run ingest` dagelijks (bijvoorbeeld `0 6 * * *`).
