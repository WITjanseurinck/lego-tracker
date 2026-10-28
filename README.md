# buildthatset: LEGO-prijsvergelijker (BE)

Astro-site (statisch), volgens de standaard voor de affiliate-sites (zie het projectdocument "Affiliate websites, standaard tech-stack"). Gebouwd door nginx geserveerd.

## Data
- `data/products.json`: bol-prijzen per set (verversd door `scripts/refresh-bol.mjs`)
- `data/amazon.json`: Amazon-prijzen per set
- `data/history.json`: prijsverloop per set, `{ "<set>": [ { "d": "JJJJ-MM-DD", "p": 32.7 } ] }`, een punt per wijziging
- `src/data/`: catalogus (`lego-catalog.json`), teksten (`descriptions.json`) en onderwerpregels (`topic-*.json`)

## Prijzen verversen
`npm run refresh:bol` (env `BOL_CLIENT_ID`, `BOL_CLIENT_SECRET`, `BOL_SITE_ID`). Het script werkt `products.json` en `history.json` bij; de gedeelde `ops-prijsronde` commit en pusht, waarna Coolify bouwt. Test met `--probe`.

## Opstarten
`npm install && npm run dev`. Deelbeelden (`/og/*.png`) en 404-pagina's komen bij de build. Op de VPS: Dockerfile als build pack in Coolify, poort 80, build variables `SITE_URL`, `GTM_ID`, `NOINDEX`.
