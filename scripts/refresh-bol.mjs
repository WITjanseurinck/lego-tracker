// Ververst prijzen in data/products.json via de bol Marketing Catalog API.
// Gebruik:  BOL_CLIENT_ID=... BOL_CLIENT_SECRET=... node scripts/refresh-bol.mjs [--probe] [--limit N]
// --probe: haalt 1 product op en toont de ruwe respons (zonder te schrijven), om de veldnamen te controleren.
// Afbeeldingen, namen en urls blijven ongemoeid: enkel price, strikethrough, seller en stock veranderen.
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

// Zoekt tolerant naar prijsvelden, omdat het exacte schema bij de eerste run met --probe bevestigd wordt.
function pick(o) {
  const offer = o.offer || o.bestOffer || (Array.isArray(o.offers) ? o.offers[0] : o.offers) || {};
  const num = (v) => (v == null ? null : typeof v === 'object' ? num(v.price ?? v.value ?? v.amount) : +v);
  const price = num(offer.price ?? offer.bestPrice ?? o.price);
  const strike = num(offer.strikethroughPrice ?? offer.listPrice ?? offer.advisedPrice ?? offer.refPrice);
  const seller = offer.sellerName ?? offer.seller?.name ?? offer.retailer?.name ?? null;
  const avail = String(offer.availabilityCode ?? offer.availability ?? offer.deliveryDescription ?? '');
  return { price: Number.isFinite(price) ? price : null, strike: Number.isFinite(strike) ? strike : null, seller, avail };
}

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
let tok = await token();
let changed = 0, out = 0, failed = 0, n = 0;

for (const it of data.items) {
  if (n++ >= limit) break;
  if (Date.now() > tok.until) tok = await token();
  const r = await fetch(`https://api.bol.com/marketing/catalog/v1/products/${it.bolId}?country-code=BE&include-offer=true`, {
    headers: { Authorization: `Bearer ${tok.value}`, 'Accept-Language': 'nl', Accept: 'application/json' },
  });
  if (r.status === 429 || r.status === 403) { console.error('gestopt: HTTP', r.status, 'bij', it.set); break; }
  if (!r.ok) { failed++; console.error(it.set, 'HTTP', r.status); await sleep(500); continue; }
  const j = await r.json();
  if (probe) { console.log(JSON.stringify(j, null, 2).slice(0, 3000)); break; }
  const p = pick(j);
  if (p.price == null) { if (it.stock !== 'out') { it.stock = 'out'; changed++; } out++; }
  else {
    const before = JSON.stringify([it.price, it.strikethrough, it.seller, it.stock]);
    it.price = p.price;
    if (p.strike != null) it.strikethrough = p.strike;
    if (p.seller) it.seller = p.seller;
    delete it.stock;
    if (JSON.stringify([it.price, it.strikethrough, it.seller, it.stock]) !== before) changed++;
  }
  await sleep(400);
}

if (!probe) {
  // Prijshistoriek (zelfde formaat als kaoru): per set een lijst { d: datum, p: prijs }, enkel bij een wijziging.
  const HIST = path.join(path.dirname(FILE), 'history.json');
  const hist = fs.existsSync(HIST) ? JSON.parse(fs.readFileSync(HIST, 'utf8')) : {};
  const day = new Date().toISOString().slice(0, 10);
  for (const it of data.items) {
    if (it.stock === 'out') continue;
    const h = (hist[it.set] ||= []);
    if (!h.length || h[h.length - 1].p !== it.price) h.push({ d: day, p: it.price });
  }
  fs.writeFileSync(HIST, JSON.stringify(hist));
  data.fetchedAt = new Date().toISOString().slice(0, 10);
  data.source = 'bol Marketing Catalog API';
  fs.writeFileSync(FILE, JSON.stringify(data));
  console.log({ changed, uitVoorraad: out, mislukt: failed });
}
