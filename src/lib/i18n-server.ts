import { getDict } from '@/lib/dict';
import { LOCALE_TAG, localizePath, type Locale } from '@/lib/i18n';

/** Taal en hulpfuncties voor een pagina. Bij een statische build komen taal en pad uit de route. */
export function getI18n(locale: Locale, internalPath = '/') {
  return {
    locale,
    tag: LOCALE_TAG[locale],
    t: getDict(locale),
    internalPath,
    href: (p: string) => localizePath(locale, p),
  };
}
