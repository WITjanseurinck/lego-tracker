import { getCompareDeal } from '@/lib/deals';
import { formatEur } from '@/lib/format';
import { OG_SIZE, renderOg } from '@/lib/og';

export const alt = 'LEGO prijsvergelijking';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';

export default async function Image({ params }: { params: Promise<{ set: string }> }) {
  const { set } = await params;
  const deal = getCompareDeal(set);
  if (!deal) return renderOg({ title: 'LEGO prijzen vergelijken' });
  return renderOg({
    kicker: `LEGO ${deal.set}`,
    title: deal.name,
    badge: deal.bestDiscount > 0 ? `-${deal.bestDiscount}%` : undefined,
    lines: deal.offers.map((o) => `${o.shop} ${formatEur(o.price)}`),
  });
}
