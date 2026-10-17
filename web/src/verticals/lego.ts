import type { VerticalConfig } from './types';

export const lego: VerticalConfig = {
  id: 'lego',
  siteName: 'Brickprijs',
  label: 'Lego',
  brand: 'LEGO',
  tagline: 'Lego prijzen in België',
  description: 'Volg de prijs van Lego-sets bij Belgische shops, met prijshistoriek en prijsalerts.',
  productNoun: 'set',
  productNounPlural: 'sets',
  skuPattern: /^\d{4,6}$/,
  searchPlaceholder: 'Setnummer of naam, bv. 99003',
  displayName: (sku, name) => `LEGO ${sku} ${name}`,
  metaLine: (p) => [p.sku, p.category, p.attrs.pieces ? `${p.attrs.pieces} stukjes` : null].filter(Boolean).join(' · '),
  accent: '#FFC52E',
  background: '#ffffff',
  countries: ['BE'],
  locale: 'nl-BE',
  homeCountryLabel: 'België',
};
