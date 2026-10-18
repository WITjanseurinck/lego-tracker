import { VERTICAL } from '@/verticals';

const PUBLIC_URL = 'https://buildthatset.com';
const rawUrl = (process.env.SITE_URL ?? '').trim();
// Een localhost-URL in productie geeft kapotte og:image-links bij het delen; val dan terug op het echte domein.
const isLocal = !rawUrl || /localhost|127\.0\.0\.1/.test(rawUrl);
export const SITE_URL = (isLocal && process.env.NODE_ENV === 'production' ? PUBLIC_URL : rawUrl || 'http://localhost:3000').replace(/\/$/, '');
export const SITE_NAME = VERTICAL.siteName;

/** Zet NOINDEX=1 om de site (tijdelijk) uit Google te houden, bv. op een testomgeving. */
export const NOINDEX = process.env.NOINDEX === '1';
