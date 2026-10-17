import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Alleen lezen, voor pagina's */
export function dbRead() {
  if (!url || !anon) throw new Error('SUPABASE_URL en SUPABASE_ANON_KEY ontbreken');
  return createClient(url, anon, { auth: { persistSession: false } });
}

/** Schrijven (alerts, verlanglijst), enkel gebruiken in server actions */
export function dbWrite() {
  if (!url || !service) throw new Error('SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY ontbreken');
  return createClient(url, service, { auth: { persistSession: false } });
}
