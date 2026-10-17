import { buildAdapters } from './feeds.config.js';
import { ingestShop } from './ingest.js';
import { mirrorImages } from './images.js';
import { sendAlerts } from './alerts.js';
import { draftWeeklyDealsArticle } from './articles.js';
import { currentVertical } from './verticals/index.js';
import { db } from './db.js';

async function main() {
  const vertical = currentVertical();
  console.log(`Vertical ${vertical.id}, landen: ${vertical.countries.join(', ')}`);

  // Enkel shops die actief zijn en bij een land van deze vertical horen
  const { data: activeShops, error } = await db
    .from('shops')
    .select('slug')
    .eq('vertical', vertical.id)
    .eq('active', true)
    .in('country', vertical.countries);
  if (error) throw error;
  const allowed = new Set((activeShops ?? []).map((s) => s.slug));

  const adapters = buildAdapters(vertical).filter((a) => allowed.has(a.shopSlug));
  if (adapters.length === 0) {
    console.log('Geen feeds geconfigureerd voor actieve shops. Zet minstens een FEED_* of BOL_API_KEY in je env.');
    return;
  }

  for (const adapter of adapters) {
    const started = Date.now();
    try {
      const { matched, skipped } = await ingestShop(adapter, vertical);
      console.log(
        `${adapter.shopSlug}: ${matched} offers bijgewerkt, ${skipped} overgeslagen (${Math.round((Date.now() - started) / 1000)}s)`,
      );
    } catch (err) {
      // Een kapotte feed mag de rest niet blokkeren
      console.error(`${adapter.shopSlug}: mislukt`, err);
    }
  }

  const images = await mirrorImages(vertical);
  console.log(`Afbeeldingen: ${images.stored} bewaard, ${images.failed} mislukt`);

  const sent = await sendAlerts(vertical);
  console.log(`${sent} alertmails verstuurd`);

  // Op maandag een concept voor het wekelijkse dealartikel
  if (new Date().getDay() === 1) {
    const created = await draftWeeklyDealsArticle(vertical);
    console.log(created ? 'Conceptartikel aangemaakt' : 'Geen nieuw conceptartikel');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
