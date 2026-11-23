#!/bin/sh
# Dagelijkse prijsronde, gestart door de gedeelde Coolify-service ops-prijsronde.
# De service kloont deze repo en roept dit script aan: sh scripts/prijsronde.sh [probe | probe-search | resolve [limiet]]
# Env (in ops-prijsronde): BUILDTHATSET_BOL_CLIENT_ID, BUILDTHATSET_BOL_CLIENT_SECRET,
# en voor Amazon (Creators API, optioneel): BUILDTHATSET_AMAZON_CLIENT_ID, BUILDTHATSET_AMAZON_CLIENT_SECRET.
# Lukt de API niet, dan stopt het script met een foutcode en schrijft niets.
set -e
cd "$(dirname "$0")/.."
export BOL_CLIENT_ID="$BUILDTHATSET_BOL_CLIENT_ID"
export BOL_CLIENT_SECRET="$BUILDTHATSET_BOL_CLIENT_SECRET"
export BOL_SITE_ID="${BOL_SITE_ID:-1550851}"

if [ "$1" = "probe" ]; then
  exec node scripts/refresh-bol.mjs --probe
fi
if [ "$1" = "probe-amazon" ]; then
  export AMAZON_CLIENT_ID="$BUILDTHATSET_AMAZON_CLIENT_ID"
  export AMAZON_CLIENT_SECRET="$BUILDTHATSET_AMAZON_CLIENT_SECRET"
  exec node scripts/refresh-amazon.mjs --probe
fi
if [ "$1" = "probe-search" ]; then
  exec node scripts/resolve-eans.mjs --probe
fi

if [ "$1" = "resolve" ]; then
  # Eenmalig: zoekt de EAN per set op. Gebruik: sh scripts/prijsronde.sh resolve [limiet]
  if [ -n "$2" ]; then node scripts/resolve-eans.mjs --limit "$2"; else node scripts/resolve-eans.mjs; fi
  git config user.name "buildthatset-bot"
  git config user.email "buildthatset-bot@users.noreply.github.com"
  git add data/products.json
  if git diff --cached --quiet; then echo "Geen wijzigingen."; else git commit -q -m "EAN's per set"; git push -q; echo "EAN's gepusht."; fi
  exit 0
fi

node scripts/refresh-bol.mjs

# Amazon: een mislukte Amazon-ronde (of ontbrekende sleutels) mag de bol-prijzen niet tegenhouden.
AMAZON_CLIENT_ID="$BUILDTHATSET_AMAZON_CLIENT_ID" AMAZON_CLIENT_SECRET="$BUILDTHATSET_AMAZON_CLIENT_SECRET" \
  node scripts/refresh-amazon.mjs || echo "Amazon-ronde mislukt, data/amazon.json blijft zoals het was."

git config user.name "buildthatset-bot"
git config user.email "buildthatset-bot@users.noreply.github.com"
git add data/products.json data/history.json data/amazon.json
if git diff --cached --quiet; then
  echo "Geen wijzigingen."
else
  git commit -q -m "Prijzen $(date -u +%F)"
  git push -q
  echo "Prijzen gepusht."
fi
