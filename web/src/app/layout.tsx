import { Suspense } from 'react';
import type { CSSProperties } from 'react';
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';
import { NOINDEX, SITE_NAME, SITE_URL } from '@/lib/site';
import { VERTICAL } from '@/verticals';
import { LogoMark } from '@/components/Logo';
import { Gtm } from '@/components/Gtm';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: ${VERTICAL.tagline}`, template: `%s | ${SITE_NAME}` },
  description: VERTICAL.description,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  // Nodig voor grote beelden in Google Discover
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  openGraph: { siteName: SITE_NAME, locale: VERTICAL.locale.replace('-', '_'), type: 'website' },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0F1722' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = { '--accent': VERTICAL.accent } as CSSProperties;
  const gtmId = process.env.GTM_ID;
  return (
    <html lang={VERTICAL.locale} style={theme}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@200..800&display=swap" />
        {NOINDEX ? <meta name="robots" content="noindex, nofollow" /> : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [
            { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, inLanguage: VERTICAL.locale, description: VERTICAL.description, potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/zoeken?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
            { '@type': 'Organization', '@id': `${SITE_URL}/#org`, name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/icon` },
          ] }) }}
        />
      </head>
      <body>
        <header className="site">
          <div className="wrap">
            <Link href="/" className="logo" aria-label={`${SITE_NAME}, naar de startpagina`}>
              <LogoMark />{SITE_NAME}
            </Link>
            <nav aria-label="Hoofdmenu">
              <Link href="/">Selectie</Link>
              <Link href="/themas">Thema’s</Link>
              <Link href="/nieuws">Nieuws</Link>
              <Link href="/verlanglijst">Verlanglijst</Link>
              <span className="country">{VERTICAL.homeCountryLabel}</span>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site">
          <div className="wrap">
            <span className="logo"><LogoMark size={26} />{SITE_NAME}</span>
            <div className="txt">
              <p>
                Prijzen worden dagelijks bijgewerkt en kunnen intussen veranderd zijn. Sommige links zijn affiliate
                links: jij betaalt niets extra, wij krijgen een kleine commissie.
              </p>
              <p>
                {SITE_NAME} is een onafhankelijke site en niet verbonden aan de LEGO Group. LEGO is een handelsmerk
                van de LEGO Group.
              </p>
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
        ) : null}
      </body>
    </html>
  );
}
