import { OG_SIZE, renderOg } from '@/lib/og';
import { VERTICAL } from '@/verticals';

export const alt = `${VERTICAL.siteName}: ${VERTICAL.tagline}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return renderOg({
    kicker: 'Prijzen vergelijken in België',
    title: 'Lego-sets bij bol en Amazon naast elkaar',
    lines: ['Dagelijkse deals', 'Altijd de laagste prijs'],
  });
}
