import type { Metadata } from 'next';
import Link from 'next/link';
import { allArticles, articleHeroSet } from '@/lib/articles';
import { getCompareDeal } from '@/lib/deals';
import { formatDate } from '@/lib/format';
import { getI18n } from '@/lib/i18n-server';
import { pageMeta } from '@/lib/seo';
import { photoTint } from '@/lib/themes';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return pageMeta({ locale, path: '/gids', title: t.guides.metaTitle, description: t.guides.metaDesc });
}

export default async function Gidsen() {
  const { locale, t, href } = await getI18n();
  const articles = allArticles();
  return (
    <div className="wrap page">
      <h1>{t.guides.h1}</h1>
      <p className="lead">{t.guides.lead}</p>
      {articles.length === 0 ? <div className="empty">{t.guides.empty}</div> : null}
      <div className="news" style={{ marginTop: 48 }}>
        {articles.map((a, i) => (
          <article className="art" key={a.id}>
            <Link href={href(`/gids/${a.text[locale].slug}`)}>
              <div className="pic" style={{ background: photoTint(i) }}>
                {(() => {
                  const d = getCompareDeal(articleHeroSet(a) ?? '');
                  return d?.image ? <img src={d.image} alt={`LEGO ${d.set} ${d.name}`} loading="lazy" referrerPolicy="no-referrer" /> : null;
                })()}
              </div>
              <p className="date">{formatDate(a.published, locale)}</p>
              <h3>{a.text[locale].title}</h3>
            </Link>
            <p className="s">{a.text[locale].summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
