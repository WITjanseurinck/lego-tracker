import type { Metadata } from 'next';
import { dbWrite } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Alert bevestigen', robots: { index: false, follow: false } };

export default async function Bevestig({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let ok = false;
  if (/^[0-9a-f-]{36}$/i.test(token)) {
    const { data } = await dbWrite()
      .from('alerts').update({ confirmed_at: new Date().toISOString() }).eq('confirm_token', token).select('id');
    ok = Boolean(data && data.length);
  }
  return (
    <>
      <h1>{ok ? 'Alert bevestigd' : 'Link ongeldig'}</h1>
      <p className="lead">
        {ok ? 'We mailen je zodra de prijs onder jouw drempel zakt.' : 'Deze bevestigingslink bestaat niet of is al gebruikt.'}
      </p>
    </>
  );
}
