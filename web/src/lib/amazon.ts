import data from '@/data/amazon-deals.json';

export interface AmazonDeal {
  set: string;
  name: string;
  price: number;
  strikethrough: number;
  asin: string;
}

// Tracking-ID van het Belgische Associates-account, staat ook in elke publieke link.
const TAG = process.env.AMAZON_TAG || 'witaffiliate-21';

export function amazonAffiliateUrl(asin: string): string {
  return `https://www.amazon.com.be/dp/${encodeURIComponent(asin)}?tag=${encodeURIComponent(TAG)}`;
}

export const amazonFetchedAt: string = data.fetchedAt;

export function getAmazonDeals(): AmazonDeal[] {
  return (data.items as AmazonDeal[]).filter((d) => /^\d{4,6}$/.test(d.set) && /^B0[A-Z0-9]{8}$/.test(d.asin));
}
