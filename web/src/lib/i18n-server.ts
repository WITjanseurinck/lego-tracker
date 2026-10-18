import { headers } from 'next/headers';
import { getDict } from '@/lib/dict';
import { DEFAULT_LOCALE, LOCALE_TAG, isLocale, localizePath, type Locale } from '@/lib/i18n';

/** Taal en hulpfuncties voor de huidige request (de middleware zet x-locale). */
export async function getI18n() {
  const h = await headers();
  const raw = h.get('x-locale');
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const internalPath = h.get('x-internal-path') ?? '/';
  return {
    locale,
    tag: LOCALE_TAG[locale],
    t: getDict(locale),
    internalPath,
    href: (p: string) => localizePath(locale, p),
  };
}
