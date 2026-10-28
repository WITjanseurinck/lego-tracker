import { LOCALES, LOCALE_TAG, OG_LOCALE, localizePath, type Locale } from '@/lib/i18n';
import { getDict } from '@/lib/dict';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export interface PageMetaInput {
  locale: Locale;
  /** Interne pad zonder taalprefix, bv. /set/31387. */
  path: string;
  title: string;
  /** true: titel zonder " | buildthatset" erachter (voor de homepage). */
  absoluteTitle?: boolean;
  description: string;
  /** Naam van het deelbeeld: een setnummer, of leeg voor het algemene beeld van de taal. */
  ogSet?: string;
  type?: 'website' | 'article';
  /** Interne pad per taal wanneer die verschilt (artikels met vertaalde slug). */
  paths?: Partial<Record<Locale, string>>;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export interface PageHead {
  title: string;
  description: string;
  canonical: string;
  languages: Record<string, string>;
  noindex: boolean;
  og: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    locale: string;
    alternateLocale: string[];
    type: string;
    image: { url: string; width: number; height: number; alt: string };
    publishedTime?: string;
    modifiedTime?: string;
  };
}

/** Deelbeelden worden bij de build gemaakt (scripts/og.mjs): /og/<taal>-<set>.png en /og/<taal>.png. */
export function ogImageUrl(locale: Locale, set?: string) {
  return `${SITE_URL}/og/${locale}${set ? `-${set}` : ''}.png`;
}

/** Volledige koptekstgegevens voor een pagina: canonical, hreflang, Open Graph en Twitter, in de juiste taal. */
export function pageMeta(i: PageMetaInput): PageHead {
  const pathFor = (l: Locale) => i.paths?.[l] ?? i.path;
  const abs = (l: Locale) => `${SITE_URL}${localizePath(l, pathFor(l))}`.replace(/\/$/, '') || SITE_URL;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[LOCALE_TAG[l].split('-')[0] === 'en' ? 'en' : LOCALE_TAG[l]] = abs(l);
  languages['x-default'] = abs('nl');
  const fullTitle = i.absoluteTitle ? i.title : `${i.title} | ${SITE_NAME}`;
  return {
    title: fullTitle,
    description: i.description,
    canonical: abs(i.locale),
    languages,
    noindex: Boolean(i.noindex),
    og: {
      title: fullTitle,
      description: i.description,
      url: abs(i.locale),
      siteName: SITE_NAME,
      locale: OG_LOCALE[i.locale],
      alternateLocale: LOCALES.filter((l) => l !== i.locale).map((l) => OG_LOCALE[l]),
      type: i.type ?? 'website',
      image: { url: ogImageUrl(i.locale, i.ogSet), width: 1200, height: 630, alt: getDict(i.locale).og.alt },
      ...(i.publishedTime ? { publishedTime: i.publishedTime } : {}),
      ...(i.modifiedTime ? { modifiedTime: i.modifiedTime } : {}),
    },
  };
}
