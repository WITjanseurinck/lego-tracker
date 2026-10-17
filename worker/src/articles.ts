import { db } from './db.js';
import type { Vertical } from './types.js';

function isoWeek(d: Date): { year: number; week: number } {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return { year: t.getUTCFullYear(), week: Math.ceil(((t.getTime() - yearStart.getTime()) / 864e5 + 1) / 7) };
}

const eur = (n: number | string) => `€ ${Number(n).toFixed(2).replace('.', ',')}`;

/**
 * Maakt wekelijks een conceptartikel met de grootste prijsdalingen.
 * Het blijft een concept (status 'draft'): lees het na, voeg eigen duiding toe
 * en publiceer pas dan. Volledig automatisch gegenereerde content scoort slecht in Discover.
 */
export async function draftWeeklyDealsArticle(vertical: Vertical): Promise<boolean> {
  const { year, week } = isoWeek(new Date());
  const slug = `${vertical.id}-deals-week-${week}-${year}`;

  const { data: existing } = await db.from('articles').select('id').eq('vertical', vertical.id).eq('slug', slug).maybeSingle();
  if (existing) return false;

  const { data: deals } = await db
    .from('daily_deals')
    .select('sku, name, price_eur, rrp_eur, discount_pct, is_all_time_low, image_path')
    .eq('vertical', vertical.id)
    .order('discount_pct', { ascending: false })
    .limit(8);
  if (!deals || deals.length < 3) return false;

  const lows = deals.filter((d) => d.is_all_time_low).length;
  const body = [
    `Deze week zakken ${deals.length} ${vertical.label}-producten duidelijk onder hun adviesprijs.${lows ? ` ${lows} ervan staan op hun laagste prijs ooit.` : ''}`,
    ...deals.map(
      (d) =>
        `${vertical.brand} ${d.sku} ${d.name}: nu ${eur(d.price_eur)} in plaats van ${eur(d.rrp_eur)} (${Math.round(Number(d.discount_pct))}% korting).${d.is_all_time_low ? ' Dat is de laagste prijs die we tot nu toe gezien hebben.' : ''}`,
    ),
    'TODO redactie: voeg eigen duiding toe (welke deal is echt interessant, wat verdwijnt binnenkort uit het assortiment).',
  ].join('\n\n');

  const publicBase = process.env.SUPABASE_PUBLIC_URL ?? process.env.SUPABASE_URL;
  const hero = deals[0].image_path && publicBase
    ? `${publicBase}/storage/v1/object/public/product-images/${deals[0].image_path}`
    : null;

  const { error } = await db.from('articles').insert({
    vertical: vertical.id,
    slug,
    title: `${vertical.label}-deals van week ${week}: de ${deals.length} grootste prijsdalingen`,
    summary: `De grootste ${vertical.label}-prijsdalingen van week ${week}, met korting tot ${Math.round(Number(deals[0].discount_pct))}% op de adviesprijs.`,
    body,
    hero_image_url: hero,
    kind: 'deals',
    status: 'draft',
  });
  if (error) throw error;
  return true;
}
