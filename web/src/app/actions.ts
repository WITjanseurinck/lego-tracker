'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { dbWrite } from '@/lib/supabase';
import { VERTICAL } from '@/verticals';
import { isDemo } from '@/lib/demo';

const DEMO_COOKIE = 'wishlist_demo';

const COOKIE = 'wishlist';

async function productId(sku: string): Promise<number | null> {
  if (!VERTICAL.skuPattern.test(sku)) return null;
  const { data } = await dbWrite().from('products').select('id').eq('vertical', VERTICAL.id).eq('sku', sku).maybeSingle();
  return data?.id ?? null;
}

async function ensureWishlistToken(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(COOKIE)?.value;
  const db = dbWrite();

  if (existing) {
    const { data } = await db.from('wishlists').select('token').eq('token', existing).maybeSingle();
    if (data) return existing;
  }

  const { data, error } = await db.from('wishlists').insert({}).select('token').single();
  if (error || !data) throw new Error('Verlanglijst aanmaken mislukt');
  jar.set(COOKIE, data.token, { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 365, path: '/' });
  return data.token;
}

export async function toggleWishlist(formData: FormData) {
  const sku = String(formData.get('sku') ?? '');
  if (isDemo) {
    const jar = await cookies();
    const list = (jar.get(DEMO_COOKIE)?.value ?? '').split(',').filter(Boolean);
    const next = list.includes(sku) ? list.filter((s) => s !== sku) : [...list, sku];
    jar.set(DEMO_COOKIE, next.join(','), { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30, path: '/' });
    redirect(`/p/${sku}`);
  }
  const id = await productId(sku);
  if (!id) return;

  const token = await ensureWishlistToken();
  const db = dbWrite();

  const { data } = await db
    .from('wishlist_items').select('product_id').eq('token', token).eq('product_id', id).maybeSingle();

  if (data) {
    await db.from('wishlist_items').delete().eq('token', token).eq('product_id', id);
  } else {
    await db.from('wishlist_items').insert({ token, product_id: id });
  }

  redirect(`/p/${sku}`);
}

export async function createAlert(formData: FormData) {
  const sku = String(formData.get('sku') ?? '');
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const target = Number(String(formData.get('target') ?? '').replace(',', '.'));
  if (isDemo) {
    const ok = VERTICAL.skuPattern.test(sku) && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && target > 0;
    redirect(`/p/${sku}?alert=${ok ? 'demo' : 'ongeldig'}`);
  }
  const id = await productId(sku);

  if (!id || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !(target > 0)) {
    redirect(`/p/${sku}?alert=ongeldig`);
  }

  const { data, error } = await dbWrite()
    .from('alerts')
    .insert({ email, product_id: id, target_eur: target })
    .select('confirm_token')
    .single();
  if (error || !data) redirect(`/p/${sku}?alert=fout`);

  // De bevestigingsmail is een volgende stap: tot dan staat de link in de serverlogs
  console.log(`Alert bevestigen: ${process.env.SITE_URL ?? ''}/alert/bevestig/${data.confirm_token}`);
  redirect(`/p/${sku}?alert=verstuurd`);
}
