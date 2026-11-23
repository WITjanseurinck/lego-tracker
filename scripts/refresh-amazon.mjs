#!/usr/bin/env node
// Ververst de Amazon-prijzen (amazon.com.be) in data/amazon.json via de Amazon Creators API.
// Gebruik: AMAZON_CLIENT_ID=... AMAZON_CLIENT_SECRET=... node scripts/refresh-amazon.mjs [--probe] [--dry] [--limit N]
//   --probe: vraagt 1 groepje op en toont het ruwe antwoord, zonder iets te schrijven (om de veldnamen te controleren).
//   --dry:   doet alles behalve het wegschrijven.
//
// data/amazon.json: { country, source, fetchedAt, items: [ { set, asin, price, strikethrough, stock?, checkedAt, ... } ] }
// Per item met een ASIN veranderen enkel price, strikethrough, stock en checkedAt. Naam, afbeelding, thema en rest blijven staan.
//  - Prijs gevonden:        price = nieuwe prijs, stock verdwijnt, checkedAt = vandaag.
//                           strikethrough blijft staan zolang hij hoger is dan de prijs, anders null.
//  - Item zonder aanbod:    stock = 'out', de laatste prijs blijft staan, checkedAt = vandaag.
//  - Item niet in antwoord: ongewijzigd.
// Zonder sleutels slaat het script zichzelf over (uitgangscode 0). Een mislukte run laat het bestand ongemoeid.
// Opgezet naar het script van Maestri (scripts/refresh-amazon.mjs). Token via api.amazon.co.uk (EU, credentialversie 3.2).
// De plaats van de prijs in het antwoord (offersV2.listings[].price.money.amount) staat niet in de documentatie:
// bij de eerste echte run toont het log een diagnoseregel als er geen prijs uit komt, of gebruik --probe.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/amazon.json');
const probe = process.argv.includes('--probe');
const dry = process.argv.includes('--dry');
const li = process.argv.indexOf('--limit');
const limit = li > 0 ? +process.argv[li + 1] : Infinity;
const DELAY_MS = Number(process.env.AMAZON_DELAY_MS ?? 1100);
const MAX_ERROR_SHARE = Number(process.env.AMAZON_MAX_ERROR_SHARE ?? 0.1);
const { AMAZON_CLIENT_ID, AMAZON_CLIENT_SECRET } = process.env;
const TAG = process.env.AMAZON_PARTNER_TAG_BE || process.env.AMAZON_TAG || 'witaffiliate-21';
if (!AMAZON_CLIENT_ID || !AMAZON_CLIENT_SECRET) {
  console.log('Amazon-sleutels ontbreken: Amazon-prijzen worden overgeslagen.');
  process.exit(0);
}

const TOKEN_URL = process.env.AMAZON_TOKEN_URL ?? 'https://api.amazon.co.uk/auth/o2/token'; // EU-regio
const API = process.env.AMAZON_API_URL ?? 'https://creatorsapi.amazon';
const HOST = 'www.amazon.com.be';
const RESOURCES = ['offersV2.listings.price', 'offersV2.listings.merchantInfo', 'offersV2.listings.availability'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let token = null;
let tokenUntil = 0;
async function getToken() {
  if (token && Date.now() < tokenUntil) return token;
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credentials', client_id: AMAZON_CLIENT_ID, client_secret: AMAZON_CLIENT_SECRET, scope: 'creatorsapi::default' }),
  });
  if (!res.ok) throw new Error(`token: HTTP ${res.status}`);
  const j = await res.json();
  token = j.access_token;
  tokenUntil = Date.now() + Math.max(60, (j.expires_in ?? 3600) - 120) * 1000;
  return token;
}

async function getItems(asins) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(`${API}/catalog/v1/getItems`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${await getToken()}`, 'Content-Type': 'application/json', 'x-marketplace': HOST },
      body: JSON.stringify({ itemIds: asins, itemIdType: 'ASIN', marketplace: HOST, partnerTag: TAG, resources: RESOURCES }),
    });
    if (res.status === 429 || res.status >= 500) { await sleep(1500 * attempt * attempt); continue; }
    if (!res.ok) {
      const body = (await res.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400);
      throw new Error(`getItems: HTTP ${res.status} ${body}`);
    }
    return res.json();
  }
  throw new Error('getItems blijft mislukken');
}

// null = geen bruikbaar aanbod; { price } = prijs gevonden.
function readOffer(item) {
  const l = (item?.offersV2?.listings ?? item?.offers_v2?.listings ?? [])[0];
  if (!l) return null;
  const price = l.price?.money?.amount ?? l.price?.amount ?? null;
  if (typeof price !== 'number' || !(price > 0)) return null;
  if (/OUT_OF_STOCK|UNAVAILABLE/i.test(l.availability?.type ?? 'IN_STOCK')) return null;
  return { price };
}

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const entries = data.items.filter((it) => /^B0[A-Z0-9]{8}$/.test(it.asin ?? '')).slice(0, limit);
console.log(`Amazon-producten met ASIN: ${entries.length}`);
const today = new Date().toISOString().slice(0, 10);
const stats = { updated: 0, out: 0, unchanged: 0, errors: 0 };
let debugLeft = 3; // hoogstens drie diagnoseregels in het log, zonder sleutels

for (let i = 0; i < entries.length; i += 10) {
  const chunk = entries.slice(i, i + 10);
  try {
    const j = await getItems(chunk.map((it) => it.asin));
    if (probe) { console.log(JSON.stringify(j, null, 1).slice(0, 4000)); process.exit(0); }
    const items = j?.itemResults?.items ?? j?.itemsResult?.items ?? j?.items ?? [];
    if (j?.errors?.length && debugLeft > 0) { debugLeft--; console.error('Amazon meldt fouten:', JSON.stringify(j.errors).slice(0, 600)); }
    for (const it of chunk) {
      const found = items.find((x) => (x.asin ?? x.ASIN) === it.asin);
      if (!found) { stats.unchanged++; continue; }
      const got = readOffer(found);
      if (got) {
        it.price = Math.round(got.price * 100) / 100;
        if (typeof it.strikethrough === 'number' && !(it.strikethrough > it.price)) it.strikethrough = null;
        delete it.stock;
        it.checkedAt = today;
        stats.updated++;
      } else {
        if (debugLeft > 0) { debugLeft--; console.error(`Geen prijs uit antwoord voor ${it.asin}:`, JSON.stringify(found.offersV2 ?? found.offers_v2 ?? Object.keys(found)).slice(0, 600)); }
        it.stock = 'out';
        it.checkedAt = today;
        stats.out++;
      }
    }
  } catch (err) { stats.errors += chunk.length; console.error(err.message); }
  await sleep(DELAY_MS);
}
console.log(JSON.stringify(stats));
if (stats.errors / Math.max(1, entries.length) > MAX_ERROR_SHARE) { console.error('Te veel technische fouten, amazon.json blijft ongewijzigd.'); process.exit(2); }
if (dry) { console.log('--dry: niets weggeschreven'); process.exit(0); }
data.fetchedAt = today;
fs.writeFileSync(FILE, JSON.stringify(data, null, 1)); // zelfde opmaak als het bestaande bestand (inspringing 1, geen slotregel)
