import { Suspense } from 'react';
import type { CSSProperties } from 'react';
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { VERTICAL } from '@/verticals';
import { LogoMark } from '@/components/Logo';
import { Matomo } from '@/components/Matomo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: ${VERTICAL.tagline}`, template: `%s | ${SITE_NAME}` },
  description: VERTICAL.description,
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
  const matomoUrl = process.env.MATOMO_URL;
  const matomoId = process.env.MATOMO_SITE_ID;
  return (
    <html lang={VERTICAL.locale} style={theme}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@200..800&display=swap" />
        {process.env.DEMO === '1' ? <meta name="robots" content="noindex, nofollow" /> : null}
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
        {matomoUrl && matomoId ? (
          <Suspense fallback={null}><Matomo url={matomoUrl} siteId={matomoId} /></Suspense>
        ) : null}
      </body>
    </html>
  );
}
