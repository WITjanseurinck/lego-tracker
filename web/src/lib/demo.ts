/**
 * Demodata. Alle sets, prijzen en shops hieronder zijn voorbeeldwaarden,
 * geen echte prijzen. Staat DEMO=1 aan (of ontbreekt SUPABASE_URL), dan draait
 * de site hierop zonder database.
 */
export const isDemo = process.env.DEMO === '1' || !process.env.SUPABASE_URL;

export interface DemoProduct {
  id: number;
  sku: string;
  name: string;
  category: string;
  rrp_eur: number;
  image_path: string;
  attrs: { pieces?: number };
  ean: string | null;
  brand: string;
  best: number;
  low: number;
  /** [maanden geleden, prijs] in oplopende volgorde van tijd */
  series: [number, number][];
  shops: { name: string; extra: number; stock: boolean }[];
}

const SHOPS = (extras: number[], stock: boolean[] = [true, true, true, true]) =>
  ['Dreamland', 'bol', 'MediaMarkt', 'Smyths Toys'].map((name, i) => ({ name, extra: extras[i], stock: stock[i] }));

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 1, sku: '99003', name: 'Single Trooper Aerial Platform', category: 'Star Wars', rrp_eur: 99.99,
    image_path: '/demo/aerial-platform.png', attrs: { pieces: 1100 }, ean: null, brand: 'LEGO',
    best: 71.99, low: 71.99,
    series: [[12, 99.99], [9, 99.99], [7, 84.99], [5, 84.99], [3, 89.99], [2, 76.99], [1, 76.99], [0, 71.99]],
    shops: SHOPS([0, 4, 8, 18]),
  },
  {
    id: 2, sku: '99005', name: 'Audi Revolut F1 Team Race Car', category: 'Speed Champions', rrp_eur: 26.99,
    image_path: '/demo/audi-f1.png', attrs: { pieces: 267 }, ean: null, brand: 'LEGO',
    best: 21.99, low: 19.99,
    series: [[12, 26.99], [9, 24.99], [6, 24.99], [4, 19.99], [3, 24.99], [1, 23.99], [0, 21.99]],
    shops: SHOPS([0, 1, 3, 5]),
  },
  {
    id: 3, sku: '99002', name: 'Megatron en zijn tank', category: 'BrickHeadz', rrp_eur: 44.99,
    image_path: '/demo/megatron.png', attrs: { pieces: 413 }, ean: null, brand: 'LEGO',
    best: 36.99, low: 36.99,
    series: [[11, 44.99], [8, 44.99], [6, 39.99], [3, 39.99], [1, 41.99], [0, 36.99]],
    shops: SHOPS([0, 2, 5, 8], [true, true, true, false]),
  },
  {
    id: 4, sku: '99004', name: 'Hogwarts-kasteel: de brug', category: 'Harry Potter', rrp_eur: 89.99,
    image_path: '/demo/hogwarts-brug.png', attrs: { pieces: 1000 }, ean: null, brand: 'LEGO',
    best: 74.99, low: 69.99,
    series: [[12, 89.99], [10, 84.99], [7, 84.99], [5, 69.99], [4, 79.99], [2, 79.99], [0, 74.99]],
    shops: SHOPS([0, 5, 6, 15]),
  },
  {
    id: 5, sku: '99001', name: 'Paasboom met eierlampions', category: 'Seizoen', rrp_eur: 19.99,
    image_path: '/demo/paasboom.png', attrs: { pieces: 220 }, ean: null, brand: 'LEGO',
    best: 14.99, low: 14.99,
    series: [[6, 19.99], [4, 19.99], [2, 17.99], [1, 16.99], [0, 14.99]],
    shops: SHOPS([0, 1, 2, 5]),
  },
];

export interface DemoArticle {
  slug: string;
  title: string;
  summary: string;
  hero_image_url: string | null;
  published_at: string;
  updated_at: string;
  body: string;
}

export const DEMO_ARTICLES: DemoArticle[] = [];
