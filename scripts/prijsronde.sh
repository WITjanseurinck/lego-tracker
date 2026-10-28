#!/bin/sh
# Dagelijkse prijsronde, gestart door de gedeelde Coolify-service ops-prijsronde.
# De service kloont deze repo en roept dit script aan: sh scripts/prijsronde.sh [probe]
# Env (in ops-prijsronde): BUILDTHATSET_BOL_CLIENT_ID, BUILDTHATSET_BOL_CLIENT_SECRET.
# Lukt de API niet, dan stopt het script met een foutcode en schrijft niets.
set -e
cd "$(dirname "$0")/.."
export BOL_CLIENT_ID="$BUILDTHATSET_BOL_CLIENT_ID"
export BOL_CLIENT_SECRET="$BUILDTHATSET_BOL_CLIENT_SECRET"
export BOL_SITE_ID="${BOL_SITE_ID:-1550851}"

if [ "$1" = "probe" ]; then
  exec node scripts/refresh-bol.mjs --probe
fi

node scripts/refresh-bol.mjs
git config user.name "buildthatset-bot"
git config user.email "buildthatset-bot@users.noreply.github.com"
git add data/products.json data/history.json
if git diff --cached --quiet; then
  echo "Geen wijzigingen."
else
  git commit -q -m "Prijzen bol $(date -u +%F)"
  git push -q
  echo "Prijzen gepusht."
fi
