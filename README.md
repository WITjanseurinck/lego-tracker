# buildthatset: LEGO-prijsvergelijker (BE)

Next.js-site in `web/`. Alle data staat als JSON in `web/src/data/` en wordt bij de build gelezen:
- `lego-catalog.json`: catalogus van lego.com (prijs, adviesprijs, beschikbaarheid, afbeelding)
- `bol-deals.json`, `amazon-deals.json`: prijzen per set
- `price-history.json`: prijshistoriek per set, `[datum, prijs]` bij elke wijziging
- `descriptions.json`, `topic-rules.json`, `topic-overrides.json`: teksten en onderwerppagina's

## Prijzen verversen
Dagelijks via de gedeelde ops-prijsronde: `web/scripts/refresh-bol.mjs` (env `BOL_CLIENT_ID`, `BOL_CLIENT_SECRET`) werkt `bol-deals.json` en `price-history.json` bij, commit en push. Coolify bouwt de site daarna opnieuw. Test met `--probe`.

## Opstarten
`cd web && npm install && npm run dev`. Op de VPS: `docker-compose.yml` als resource in Coolify (env: `SITE_URL`, `BOL_SITE_ID`, `RAKUTEN_ID`, `LEGO_MID`, `GTM_ID`).
