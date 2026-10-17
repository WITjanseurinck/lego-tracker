import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticle } from '@/lib/data';
import { productImageUrl } from '@/lib/images';
import { formatDate } from '@/lib/format';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { VERTICAL } from '@/verticals';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.summary,
    alternates: { canonical: `/nieuws/${a.slug}` },
    openGraph: {
      type: 'article',
      title: a.title,
      description: a.summary,
      publishedTime: a.published_at ?? undefined,
      modifiedTime: a.updated_at,
      images: a.hero_image_url
        ? [{ url: a.hero_image_url, width: a.hero_width ?? 1200, height: a.hero_height ?? 675 }]
        : undefined,
    },
  };
}

export default async function Artikel({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.summary,
    image: a.hero_image_url ? [productImageUrl(a.hero_image_url) ?? a.hero_image_url] : undefined,
    datePublished: a.published_at,
    dateModified: a.updated_at,
    mainEntityOfPage: `${SITE_URL}/nieuws/${a.slug}`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };

  return (
    <article className="wrap page"><div className="prose">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1>{a.title}</h1>
      <p className="lead">{a.summary}</p>
      {a.hero_image_url ? (
        <img src={productImageUrl(a.hero_image_url) ?? a.hero_image_url} alt="" fetchPriority="high" />
      ) : null}
      <p className="muted">
        {a.published_at ? `Gepubliceerd op ${formatDate(a.published_at)}` : ''}
        {a.updated_at && a.published_at && formatDate(a.updated_at) !== formatDate(a.published_at)
          ? ` · bijgewerkt op ${formatDate(a.updated_at)}`
          : ''}
      </p>
      {String(a.body).split(/\n{2,}/).map((p: string, i: number) => (
        <p key={i} style={{ fontSize: '1.05rem' }}>{p}</p>
      ))}
    </div></article>
  );
}
