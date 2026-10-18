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
  kiezen: { nl: 'kiezen', fr: 'choisir', en: 'finder' },
};

export function isLocale(v: string | null | undefined): v is Locale {
  return v === 'nl' || v === 'fr' || v === 'en';
}

/** Interne pad (bv. /gids/abc) naar de publieke URL in een taal (bv. /fr/guide/abc). */
export function localizePath(locale: Locale, internal: string): string {
  const [pathPart, ...rest] = internal.split('?');
  const query = rest.length ? `?${rest.join('?')}` : '';
  const segs = pathPart.split('/').filter(Boolean);
  if (segs[0] && SEGMENTS[segs[0]]) segs[0] = SEGMENTS[segs[0]][locale];
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
  return { locale, path: `/${segs.join('/')}` };
}
