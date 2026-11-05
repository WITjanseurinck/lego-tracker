import SET_SLUGS from './set-slugs.json';

export const LOCALES = ['nl', 'fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'nl';

/** Tag voor Intl en hreflang. */
export const LOCALE_TAG: Record<Locale, string> = { nl: 'nl-BE', fr: 'fr-BE', en: 'en-GB' };
export const OG_LOCALE: Record<Locale, string> = { nl: 'nl_BE', fr: 'fr_BE', en: 'en_GB' };
export const LANG_NAME: Record<Locale, string> = { nl: 'Nederlands', fr: 'Français', en: 'English' };

/**
 * Interne routenaam naar de URL-segmenten per taal. Routes die hier niet in staan
 * (set, thema, p, ...) hebben in elke taal dezelfde naam.
 */
const SEGMENTS: Record<string, Record<Locale, string>> = {
  gids: { nl: 'gids', fr: 'guide', en: 'guides' },
  zoeken: { nl: 'zoeken', fr: 'recherche', en: 'search' },
  thema: { nl: 'thema', fr: 'theme', en: 'theme' },
  themas: { nl: 'themas', fr: 'themes', en: 'themes' },
  cadeau: { nl: 'cadeau', fr: 'cadeau', en: 'gift' },
  kiezen: { nl: 'kiezen', fr: 'choisir', en: 'finder' },
  onderwerp: { nl: 'onderwerp', fr: 'sujet', en: 'topic' },
  privacy: { nl: 'privacy-en-cookies', fr: 'confidentialite-et-cookies', en: 'privacy-and-cookies' },
};

export function isLocale(v: string | null | undefined): v is Locale {
  return v === 'nl' || v === 'fr' || v === 'en';
}

/** Setnummer met de naam in de taal ervoor (bv. 43280 wordt strandplezier-met-lilo-en-stitch-43280). Zonder naam blijft het nummer. */
export function setSegment(locale: Locale, id: string): string {
  const slugs = (SET_SLUGS as Record<string, string[]>)[id];
  const slug = slugs?.[LOCALES.indexOf(locale)];
  return slug ? `${slug}-${id}` : id;
}

/** Interne pad (bv. /gids/abc) naar de publieke URL in een taal (bv. /fr/guide/abc). */
export function localizePath(locale: Locale, internal: string): string {
  const [pathPart, ...rest] = internal.split('?');
  const query = rest.length ? `?${rest.join('?')}` : '';
  const segs = pathPart.split('/').filter(Boolean);
  if (segs[0] && SEGMENTS[segs[0]]) segs[0] = SEGMENTS[segs[0]][locale];
  if (segs[0] === 'set' && segs[1]) segs[1] = setSegment(locale, segs[1]);
  const body = segs.join('/');
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  const full = `${prefix}${body ? `/${body}` : ''}` || '/';
  return `${full}${query}`;
}

/** Publiek pad (bv. /fr/guide/abc) naar taal en intern pad (bv. /gids/abc). */
export function internalize(pathname: string): { locale: Locale; path: string } {
  const segs = pathname.split('/').filter(Boolean);
  let locale: Locale = DEFAULT_LOCALE;
  if (segs[0] === 'fr' || segs[0] === 'en') {
    locale = segs[0];
    segs.shift();
  }
  if (segs[0]) {
    for (const [internal, names] of Object.entries(SEGMENTS)) {
      if (segs[0] === names[locale]) {
        segs[0] = internal;
        break;
      }
    }
  }
  if (segs[0] === 'set' && segs[1]) {
    const m = segs[1].match(/-(\d{4,6})$/);
    if (m) segs[1] = m[1];
  }
  return { locale, path: `/${segs.join('/')}` };
}
