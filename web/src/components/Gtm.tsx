'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window { dataLayer?: unknown[]; }
}

const KEY = 'consent-analytics';

function push(...args: unknown[]) {
  (window.dataLayer = window.dataLayer || []).push(args as unknown as object);
}
const gtag = (...args: unknown[]) => push(...args);

function applyConsent(granted: boolean) {
  const v = granted ? 'granted' : 'denied';
  gtag('consent', 'update', { analytics_storage: v, ad_storage: v, ad_user_data: v, ad_personalization: v });
}

/**
 * Google Tag Manager met Consent Mode v2: alles staat standaard op "denied" tot de bezoeker accepteert.
 * Stuurt een virtual_pageview bij elke navigatie en een affiliate_click bij elke link naar een shop.
 */
export function Gtm({ id }: { id: string }) {
  const pathname = usePathname();
  const search = useSearch();
  const first = useRef(true);
  const [ask, setAsk] = useState(false);

  useEffect(() => {
    if (document.getElementById('gtm-js')) return;
    window.dataLayer = window.dataLayer || [];
    gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
    let stored: string | null = null;
    try { stored = localStorage.getItem(KEY); } catch { /* geen opslag beschikbaar */ }
    if (stored === 'granted') applyConsent(true);
    if (stored === null) setAsk(true);
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const s = document.createElement('script');
    s.id = 'gtm-js';
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(s);
  }, [id]);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    (window.dataLayer = window.dataLayer || []).push({
      event: 'virtual_pageview', page_path: window.location.pathname + window.location.search, page_title: document.title,
    });
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[rel~="sponsored"]') as HTMLAnchorElement | null;
      if (!a) return;
      (window.dataLayer = window.dataLayer || []).push({
        event: 'affiliate_click', link_url: a.href, link_text: a.textContent?.trim(), page_path: window.location.pathname,
      });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

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
