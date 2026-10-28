'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window { dataLayer?: unknown[]; }
}

const KEY = 'consent-analytics';

// gtag.js en GTM verwachten het "arguments"-object in de dataLayer, geen gewone array.
function gtag(..._args: unknown[]) {
  // eslint-disable-next-line prefer-rest-params
  (window.dataLayer = window.dataLayer || []).push(arguments);
}

function applyConsent(granted: boolean) {
  const v = granted ? 'granted' : 'denied';
  gtag('consent', 'update', { analytics_storage: v, ad_storage: v, ad_user_data: v, ad_personalization: v });
}

/**
 * Google Tag Manager of rechtstreeks Google Analytics 4 (gtag.js), met Consent Mode v2: alles staat standaard op "denied" tot de bezoeker accepteert.
 * Stuurt een virtual_pageview bij elke navigatie en een affiliate_click bij elke link naar een shop.
 */
export function Gtm({ id, ga }: { id?: string; ga?: string }) {
  const pathname = usePathname();
  const search = useSearch();
  const first = useRef(true);
  const [ask, setAsk] = useState(false);

  useEffect(() => {
    if (document.getElementById('gtm-js') || document.getElementById('ga-js')) return;
    window.dataLayer = window.dataLayer || [];
    gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
    let stored: string | null = null;
    try { stored = localStorage.getItem(KEY); } catch { /* geen opslag beschikbaar */ }
    if (stored === 'granted') applyConsent(true);
    if (stored === null) setAsk(true);
    const s = document.createElement('script');
    s.async = true;
    if (id) {
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      s.id = 'gtm-js';
      s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
    } else if (ga) {
      s.id = 'ga-js';
      s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`;
      gtag('js', new Date());
      gtag('config', ga, { send_page_view: false });
      gtag('event', 'page_view', { page_path: window.location.pathname + window.location.search, page_title: document.title });
    } else return;
    document.head.appendChild(s);
  }, [id, ga]);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const info = { page_path: window.location.pathname + window.location.search, page_title: document.title };
    if (id) (window.dataLayer = window.dataLayer || []).push({ event: 'virtual_pageview', ...info });
    else gtag('event', 'page_view', info);
  }, [pathname, search, id]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[rel~="sponsored"]') as HTMLAnchorElement | null;
      if (!a) return;
      const info = { link_url: a.href, link_text: a.textContent?.trim(), shop: a.dataset.affiliate, page_path: window.location.pathname };
      if (id) (window.dataLayer = window.dataLayer || []).push({ event: 'affiliate_click', ...info });
      else gtag('event', 'affiliate_click', info);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [id]);

  const choose = (granted: boolean) => {
    try { localStorage.setItem(KEY, granted ? 'granted' : 'denied'); } catch { /* negeren */ }
    applyConsent(granted);
    setAsk(false);
  };

  if (!ask) return null;
  return (
    <div className="consent" role="dialog" aria-label="Cookies voor statistieken">
      <p>We meten anoniem hoe de site gebruikt wordt met Google Analytics. Dat mag alleen als jij het goedvindt.</p>
      <div className="acts">
        <button type="button" className="btn" onClick={() => choose(false)}>Weigeren</button>
        <button type="button" className="btn dark" onClick={() => choose(true)}>Accepteren</button>
      </div>
    </div>
  );
}

function useSearch() {
  return useSearchParams();
}
