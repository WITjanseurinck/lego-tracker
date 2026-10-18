import Link from 'next/link';
import { getI18n } from '@/lib/i18n-server';

export default async function NotFound() {
  const { t, href } = await getI18n();
  return (
    <div className="wrap page">
      <h1>{t.notFound.title}</h1>
      <p className="lead">{t.notFound.text}</p>
      <p style={{ marginTop: 32 }}><Link href={href('/')} className="btn dark">{t.notFound.back}</Link></p>
    </div>
  );
}
