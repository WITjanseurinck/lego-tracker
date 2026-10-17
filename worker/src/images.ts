import { db } from './db.js';
import { isOfficialImage } from './ingest.js';
import type { Vertical } from './types.js';

const BUCKET = 'product-images';
const MAX_BYTES = 5 * 1024 * 1024;
const EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

/**
 * Kopieert de officiele afbeelding (URL uit de feed van de merkshop) naar eigen opslag.
 * Enkel hosts uit vertical.officialImageHosts, enkel https, maximaal 5 MB, enkel jpeg, png of webp.
 * De site toont uitsluitend de kopie, dus er wordt niet gehotlinkt.
 *
 * Controleer vooraf of de voorwaarden van het affiliateprogramma van het merk dit toelaten.
 */
export async function mirrorImages(vertical: Vertical, limit = 100): Promise<{ stored: number; failed: number }> {
  const { data: products, error } = await db
    .from('products')
    .select('id, sku, image_source_url')
    .eq('vertical', vertical.id)
    .is('image_path', null)
    .not('image_source_url', 'is', null)
    .limit(limit);
  if (error) throw error;

  let stored = 0;
  let failed = 0;

  for (const p of products ?? []) {
    try {
      if (!isOfficialImage(vertical, p.image_source_url)) throw new Error('host niet toegestaan');

      const res = await fetch(p.image_source_url, { signal: AbortSignal.timeout(15_000) });
      if (!res.ok) throw new Error(`status ${res.status}`);

      const type = (res.headers.get('content-type') ?? '').split(';')[0].trim();
      const ext = EXT[type];
      if (!ext) throw new Error(`type ${type || 'onbekend'}`);

      const bytes = Buffer.from(await res.arrayBuffer());
      if (bytes.length > MAX_BYTES) throw new Error('te groot');

      const path = `${vertical.id}/${p.sku}.${ext}`;
      const { error: upErr } = await db.storage.from(BUCKET).upload(path, bytes, { contentType: type, upsert: true });
      if (upErr) throw upErr;

      await db.from('products').update({ image_path: path }).eq('id', p.id);
      stored++;
    } catch (err) {
      failed++;
      console.warn(`Afbeelding voor ${p.sku} mislukt:`, err instanceof Error ? err.message : err);
    }
  }
  return { stored, failed };
}
