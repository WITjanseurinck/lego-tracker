import { getDict2 } from '@/lib/dict2';
import { Suspense } from 'react';
import type { CSSProperties } from 'react';
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';
import { NOINDEX, SITE_NAME, SITE_URL } from '@/lib/site';
import { VERTICAL } from '@/verticals';
import { LogoMark } from '@/components/Logo';
import { Gtm } from '@/components/Gtm';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { getI18n } from '@/lib/i18n-server';
import { LOCALE_TAG, OG_LOCALE, localizePath } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${SITE_NAME}: ${t.tagline}`, template: `%s | ${SITE_NAME}` },
    description: t.description,
    applicationName: SITE_NAME,
    // Nodig voor grote beelden in Google Discover
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
    openGraph: { siteName: SITE_NAME, locale: OG_LOCALE[locale], type: 'website' },
    twitter: { card: 'summary_large_image' },
  };
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0F1722' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, t, href, internalPath } = await getI18n();
  const home = `${SITE_URL}${localizePath(locale, '/')}`.replace(/\/$/, '');
  const theme = { '--accent': VERTICAL.accent } as CSSProperties;
  const gtmId = process.env.GTM_ID;
  // Het meet-ID van GA4 staat ook in elke pagina-bron. Met GTM_ID ingesteld loopt alles via GTM.
  const gaId = gtmId ? undefined : process.env.GA_ID || 'G-733CL2WZSR';
  return (
    <html lang={locale} style={theme}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@200..800&display=swap" />
        {NOINDEX ? <meta name="robots" content="noindex, nofollow" /> : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [
            { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: home || SITE_URL, name: SITE_NAME, inLanguage: LOCALE_TAG[locale], description: t.description, potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}${href('/zoeken')}?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
            { '@type': 'Organization', '@id': `${SITE_URL}/#org`, name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/icon` },
          ] }) }}
        />
      </head>
      <body>
        <header className="site">
          <div className="wrap">
            <Link href={href('/')} className="logo" aria-label={t.homeAria(SITE_NAME)}>
              <LogoMark />{SITE_NAME}
            </Link>
            <nav aria-label={t.nav.main}>
              <Link href={href('/')}>{t.nav.deals}</Link>
              <Link href={href('/gids')}>{t.nav.guides}</Link>
              <Link href={href('/themas')}>{getDict2(locale).themesLabel}</Link>
              <Link href={href('/kiezen')}>{getDict2(locale).finder.nav}</Link>
              <Link href={href('/zoeken')}>{t.nav.search}</Link>
              <span className="country">{t.country}</span>
              <LanguageSwitcher locale={locale} internalPath={internalPath} label={t.nav.language} />
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site">
          <div className="wrap">
            <span className="logo"><LogoMark size={26} />{SITE_NAME}</span>
            <div className="txt">
              <p>{t.footer[0]}</p>
              <p>{t.footer[1]}</p>
            </div>
          </div>
        </footer>
        {gtmId ? (
          <>
            <noscript>
              <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} title="gtm" />
            </noscript>
            <Suspense fallback={null}><Gtm id={gtmId} /></Suspense>
          </>
        ) : gaId ? (
          <Suspense fallback={null}><Gtm ga={gaId} /></Suspense>
        ) : null}
      </body>
    </html>
  );
}
