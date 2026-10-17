import { VERTICAL } from '@/verticals';

export const SITE_URL = (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
export const SITE_NAME = VERTICAL.siteName;
