// Zoekt per set de EAN op via de bol Marketing Catalog API en bewaart die als `ean` in data/products.json.
// De API werkt met een EAN, niet met de 16-cijferige bol-id (`bolId`), die HTTP 400 geeft.
// Gebruik:  BOL_CLIENT_ID=... BOL_CLIENT_SECRET=... node scripts/resolve-eans.mjs [--limit N] [--probe]
// Een zoekresultaat telt enkel als de bolId in de product-url voorkomt. Sets waarvoor dat niet lukt blijven
// zonder `ean` en worden door refresh-bol.mjs overgeslagen. Reeds opgeloste sets worden niet opnieuw gezocht.
// --probe: toont de ruwe respons voor de eerste set (zonder te schrijven).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/products.json');
const ID = process.env.BOL_CLIENT_ID;
const SECRET = process.env.BOL_CLIENT_SECRET;
if (!ID || !SECRET) { console.error('BOL_CLIENT_ID en BOL_CLIENT_SECRET ontbreken'); process.exit(1); }
const probe = process.argv.includes('--probe');
const li = process.argv.indexOf('--limit');
const limit = li > 0 ? +process.argv[li + 1] : Infinity;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function token() {
  const r = await fetch('https://login.bol.com/token?grant_type=client_credentials', {
    method: 'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(`${ID}:${SECRET}`).toString('base64') },
  });
  if (!r.ok) throw new Error('token ' + r.status);
  const j = await r.json();
  return { value: j.access_token, until: Date.now() + (j.expires_in - 30) * 1000 };
}

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
let tok = await token();
let found = 0, missing = 0, failed = 0, n = 0;

for (const it of data.items) {
  if (it.ean) continue;
  if (n++ >= limit) break;
  if (Date.now() > tok.until) tok = await token();
  const url = new URL('https://api.bol.com/marketing/catalog/v1/products/search');
  url.searchParams.set('search-term', `LEGO ${it.set}`);
  url.searchParams.set('country-code', 'BE');
  url.searchParams.set('page-size', '12');
  const r = await fetch(url, {
    headers: { Authorization: `Bearer ${tok.value}`, 'Accept-Language': 'nl', Accept: 'application/json' },
  });
  if (r.status === 429 || r.status === 403) { console.error('gestopt: HTTP', r.status, 'bij', it.set); break; }
  if (!r.ok) { failed++; console.error(it.set, 'HTTP', r.status, (await r.text()).slice(0, 200)); await sleep(500); continue; }
  const j = await r.json();
  if (probe) { console.log(JSON.stringify(j, null, 2).slice(0, 3000)); break; }
  const hit = (j.results ?? []).find((p) => p.ean && String(p.url ?? '').includes(String(it.bolId)));
  if (hit) { it.ean = String(hit.ean); found++; }
  else { missing++; console.error(it.set, 'geen resultaat met bolId', it.bolId); }
  await sleep(400);
}

if (!probe) {
  if (found) fs.writeFileSync(FILE, JSON.stringify(data));
  console.log({ gevonden: found, nietGevonden: missing, mislukt: failed });
  if (!found && (missing || failed)) process.exit(1);
}
