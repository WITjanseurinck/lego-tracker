import type { Metadata } from 'next';
import { getI18n } from '@/lib/i18n-server';
import { pageMeta } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return pageMeta({ locale, path: '/privacy', title: t.privacy.title, description: t.privacy.intro });
}

export default async function Privacy() {
  const { t } = await getI18n();
  return (
    <div className="wrap page">
      <h1>{t.privacy.title}</h1>
      <p className="lead">{t.privacy.intro}</p>
      <div className="prose">
        {t.privacy.blocks.map(([h, b]) => (
          <div key={h}>
            <h2>{h}</h2>
            <p>{b}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
