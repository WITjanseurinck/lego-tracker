import { LANG_NAME, LOCALES, LOCALE_TAG, type Locale } from '@/lib/i18n';
import { switchPath } from '@/lib/switch';

export function LanguageSwitcher({ locale, internalPath, label }: { locale: Locale; internalPath: string; label: string }) {
  return (
    <ul className="lang" aria-label={label}>
      {LOCALES.map((l) => (
        <li key={l}>
          <a
            href={switchPath(internalPath, locale, l)}
            lang={LOCALE_TAG[l].split('-')[0]}
            hrefLang={LOCALE_TAG[l].split('-')[0]}
            aria-current={l === locale ? 'true' : undefined}
            title={LANG_NAME[l]}
          >
            {l}
          </a>
        </li>
      ))}
    </ul>
  );
}
