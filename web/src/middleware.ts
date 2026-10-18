import { NextResponse, type NextRequest } from 'next/server';
import { internalize } from '@/lib/i18n';

/**
 * Taalroutes: /fr/... en /en/... worden herschreven naar dezelfde pagina's als het Nederlands
 * (zonder prefix), met de taal in een requestheader. De pagina's lezen die via getI18n().
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const { locale, path } = internalize(pathname);

  // Oude nieuws-URL's verhuisden naar de gidsen.
  if (locale === 'nl' && (path === '/nieuws' || path.startsWith('/nieuws/'))) {
    const url = req.nextUrl.clone();
    url.pathname = '/gids';
    url.search = '';
    return NextResponse.redirect(url, 308);
  }

  const headers = new Headers(req.headers);
  headers.set('x-locale', locale);
  headers.set('x-internal-path', `${path}${search}`);
  const url = req.nextUrl.clone();
  url.pathname = path;
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ['/((?!_next/|api/|og(?:/|$)|demo/|.*\\..*).*)'],
};
