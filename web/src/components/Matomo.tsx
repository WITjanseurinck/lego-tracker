'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window { _paq?: unknown[][]; }
}

/**
 * Matomo zonder cookies (geen toestemmingsbanner nodig).
 * De eerste paginaweergave telt via de script-init, volgende navigaties via deze effect.
 */
export function Matomo({ url, siteId }: { url: string; siteId: string }) {
  const pathname = usePathname();
  const search = useSearchParams();
  const first = useRef(true);

  useEffect(() => {
    const base = url.replace(/\/$/, '');
    const paq = (window._paq = window._paq || []);
    if (!document.getElementById('matomo-js')) {
      paq.push(['disableCookies']);
      paq.push(['enableLinkTracking']);
      paq.push(['setTrackerUrl', `${base}/matomo.php`]);
      paq.push(['setSiteId', siteId]);
      const s = document.createElement('script');
      s.id = 'matomo-js';
      s.async = true;
      s.src = `${base}/matomo.js`;
      document.head.appendChild(s);
    }
    if (first.current) {
      first.current = false;
    } else {
      paq.push(['setCustomUrl', window.location.href]);
      paq.push(['setDocumentTitle', document.title]);
    }
    paq.push(['trackPageView']);
  }, [pathname, search, url, siteId]);

  return null;
}
