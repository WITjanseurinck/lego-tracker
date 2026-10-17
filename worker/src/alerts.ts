import nodemailer from 'nodemailer';
import { db } from './db.js';
import type { Vertical } from './types.js';

const SITE_URL = process.env.SITE_URL ?? 'http://localhost:3000';

function transport() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
}

interface AlertRow {
  id: number;
  email: string;
  product_id: number;
  target_eur: number;
  unsubscribe_token: string;
  last_notified_at: string | null;
  products: { vertical: string; sku: string; name: string } | null;
}

export async function sendAlerts(vertical: Vertical): Promise<number> {
  const mail = transport();
  if (!mail) {
    console.log('SMTP_HOST niet ingesteld, alerts overgeslagen');
    return 0;
  }

  const { data: alerts, error } = await db
    .from('alerts')
    .select('id, email, product_id, target_eur, unsubscribe_token, last_notified_at, products!inner(vertical, sku, name)')
    .eq('products.vertical', vertical.id)
    .not('confirmed_at', 'is', null);
  if (error) throw error;

  let sent = 0;
  for (const a of (alerts ?? []) as unknown as AlertRow[]) {
    // Maximaal 1 mail per alert per 7 dagen
    if (a.last_notified_at && Date.now() - Date.parse(a.last_notified_at) < 7 * 864e5) continue;

    const { data: best } = await db
      .from('best_offers')
      .select('price_eur, product_url, affiliate_url, shop_id')
      .eq('product_id', a.product_id)
      .maybeSingle();
    if (!best || Number(best.price_eur) > Number(a.target_eur)) continue;

    const { data: shop } = await db.from('shops').select('name').eq('id', best.shop_id).single();
    const name = `${a.products?.sku ?? ''} ${a.products?.name ?? ''}`.trim();
    const price = `€ ${Number(best.price_eur).toFixed(2)}`;

    await mail.sendMail({
      from: process.env.MAIL_FROM ?? 'alerts@localhost',
      to: a.email,
      subject: `Prijsdaling: ${name} nu ${price}`,
      text: [
        `Je prijsalert voor ${name} is bereikt.`,
        `Nu ${price} bij ${shop?.name ?? 'een shop'} (jouw drempel: € ${Number(a.target_eur).toFixed(2)}).`,
        '',
        best.affiliate_url ?? best.product_url,
        '',
        `Alert stopzetten: ${SITE_URL}/alert/stop/${a.unsubscribe_token}`,
      ].join('\n'),
    });

    await db.from('alerts').update({ last_notified_at: new Date().toISOString() }).eq('id', a.id);
    sent++;
  }
  return sent;
}
