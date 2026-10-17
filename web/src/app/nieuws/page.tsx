import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticles } from '@/lib/data';
import { formatDate } from '@/lib/format';
import { productImageUrl } from '@/lib/images';
import { photoTint } from '@/lib/themes';
import { VERTICAL } from '@/verticals';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: `${VERTICAL.label} nieuws en deals`,
  description: `De beste ${VERTICAL.label}-deals en prijsdalingen van de week in ${VERTICAL.homeCountryLabel}.`,
};

export default async function Nieuws() {
  const articles = await getArticles(60);
  return (
    <div className="wrap page">
      <h1>{VERTICAL.label} nieuws en deals</h1>
      <p className="lead">Wekelijks de opvallendste prijsdalingen, met uitleg of ze echt een goede deal zijn.</p>
      {articles.length === 0 ? <div className="empty">Nog geen artikels gepubliceerd.</div> : null}
      <div className="news" style={{ marginTop: 48 }}>
        {articles.map((a, i) => (
          <article className="art" key={a.slug}>
            <Link href={`/nieuws/${a.slug}`}>
              <div className="pic" style={{ background: photoTint(i) }}>{a.hero_image_url ? <img src={productImageUrl(a.hero_image_url) ?? a.hero_image_url} alt="" loading="lazy" /> : null}</div>
              <p className="date">{a.published_at ? formatDate(a.published_at) : ''}</p>
              <h3>{a.title}</h3>
            </Link>
            <p className="s">{a.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
