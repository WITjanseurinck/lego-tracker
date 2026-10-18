import { VERTICAL } from '@/verticals';

const PUBLIC_URL = 'https://buildthatset.com';
const rawUrl = (process.env.SITE_URL ?? '').trim();
// Een localhost-URL in productie geeft kapotte og:image-links bij het delen; val dan terug op het echte domein.
const isLocal = !rawUrl || /localhost|127\.0\.0\.1/.test(rawUrl);
export const SITE_URL = (isLocal && process.env.NODE_ENV === 'production' ? PUBLIC_URL : rawUrl || 'http://localhost:3000').replace(/\/$/, '');
export const SITE_NAME = VERTICAL.siteName;

/** Demo-installaties blijven uit Google, tenzij ALLOW_INDEX=1 gezet is (echte deals, echt domein). */
export const NOINDEX = process.env.DEMO === '1' && process.env.ALLOW_INDEX !== '1';
