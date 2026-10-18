import { VERTICAL } from '@/verticals';

export const SITE_URL = (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
export const SITE_NAME = VERTICAL.siteName;

/** Demo-installaties blijven uit Google, tenzij ALLOW_INDEX=1 gezet is (echte deals, echt domein). */
export const NOINDEX = process.env.DEMO === '1' && process.env.ALLOW_INDEX !== '1';
