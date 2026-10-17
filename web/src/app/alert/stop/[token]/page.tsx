import type { Metadata } from 'next';
import { dbWrite } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Alert stopzetten', robots: { index: false, follow: false } };

export default async function Stop({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let ok = false;
  if (/^[0-9a-f-]{36}$/i.test(token)) {
    const { data } = await dbWrite().from('alerts').delete().eq('unsubscribe_token', token).select('id');
    ok = Boolean(data && data.length);
  }
  return (
    <>
      <h1>{ok ? 'Alert stopgezet' : 'Link ongeldig'}</h1>
      <p className="lead">{ok ? 'Je krijgt geen mails meer voor dit alert.' : 'Dit alert bestaat niet meer.'}</p>
    </>
  );
}
