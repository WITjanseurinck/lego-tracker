import type { Metadata } from 'next';
import { LOCALES, LOCALE_TAG, OG_LOCALE, localizePath, type Locale } from '@/lib/i18n';
import { getDict } from '@/lib/dict';
import { SITE_NAME } from '@/lib/site';

export interface PageMetaInput {
  locale: Locale;
  /** Interne pad zonder taalprefix, bv. /set/31387. */
  path: string;
  title: string;
  /** true: titel zonder " | buildthatset" erachter (voor de homepage). */
  absoluteTitle?: boolean;
  description: string;
  /** Extra query voor de deelafbeelding, bv. { set: '31387' }. */
  og?: Record<string, string>;
  type?: 'website' | 'article';
  /** Interne pad per taal wanneer die verschilt (artikels met vertaalde slug). */
  paths?: Partial<Record<Locale, string>>;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export function ogImageUrl(locale: Locale, extra: Record<string, string> = {}) {
  const q = new URLSearchParams({ l: locale, ...extra });
  return `/og?${q.toString()}`;
}

/** Volledige metadata voor een pagina: canonical, hreflang, Open Graph en Twitter, in de juiste taal. */
export function pageMeta(i: PageMetaInput): Metadata {
  const pathFor = (l: Locale) => i.paths?.[l] ?? i.path;
  const url = localizePath(i.locale, pathFor(i.locale));
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[LOCALE_TAG[l].split('-')[0] === 'en' ? 'en' : LOCALE_TAG[l]] = localizePath(l, pathFor(l));
  languages['x-default'] = localizePath('nl', pathFor('nl'));
  const fullTitle = i.absoluteTitle ? `${i.title} | ${SITE_NAME}` : i.title;
  const alt = getDict(i.locale).og.alt;
  const image = { url: ogImageUrl(i.locale, i.og), width: 1200, height: 630, alt, type: 'image/png' };
  return {
    title: i.absoluteTitle ? { absolute: fullTitle } : i.title,
    description: i.description,
    alternates: { canonical: url, languages },
    ...(i.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: fullTitle,
      description: i.description,
      url,
      siteName: SITE_NAME,
      locale: OG_LOCALE[i.locale],
      alternateLocale: LOCALES.filter((l) => l !== i.locale).map((l) => OG_LOCALE[l]),
      type: i.type ?? 'website',
      images: [image],
      ...(i.publishedTime ? { publishedTime: i.publishedTime } : {}),
      ...(i.modifiedTime ? { modifiedTime: i.modifiedTime } : {}),
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description: i.description, images: [image] },
  };
}
