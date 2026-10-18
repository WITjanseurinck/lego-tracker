import { articlePaths, findArticleBySlug } from '@/lib/articles';
import { localizePath, type Locale } from '@/lib/i18n';

/** Publieke URL van de huidige pagina in een andere taal (artikels hebben per taal een eigen slug). */
export function switchPath(internalPath: string, from: Locale, to: Locale): string {
  const m = internalPath.match(/^\/gids\/([^/?]+)/);
  if (m) {
    const a = findArticleBySlug(from, decodeURIComponent(m[1]));
    if (a) return localizePath(to, articlePaths(a)[to]);
    return localizePath(to, '/gids');
  }
  return localizePath(to, internalPath);
}
