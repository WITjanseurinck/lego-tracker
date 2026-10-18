import { ARTICLES } from '@/data/articles';
import type { Locale } from '@/lib/i18n';

export type Block = { h2: string } | { p: string } | { ul: string[] } | { src: { label: string; url: string }[] };

export interface ArticleText {
  slug: string;
  title: string;
  summary: string;
  body: Block[];
}

export interface Article {
  id: string;
  published: string; // ISO
  updated: string; // ISO
  text: Record<Locale, ArticleText>;
}



export const allArticles = (): Article[] =>
  [...ARTICLES].sort((a, b) => b.published.localeCompare(a.published));

export const findArticleById = (id: string) => ARTICLES.find((a) => a.id === id);

export const findArticleBySlug = (locale: Locale, slug: string) =>
  ARTICLES.find((a) => a.text[locale].slug === slug);

/** Interne paden van een artikel per taal, voor hreflang en de taalkiezer. */
export function articlePaths(a: Article): Record<Locale, string> {
  return { nl: `/gids/${a.text.nl.slug}`, fr: `/gids/${a.text.fr.slug}`, en: `/gids/${a.text.en.slug}` };
}

/** Set waarvan de productfoto bij een gids hoort. De foto komt uit de prijsdata, dus hij volgt mee als die wisselt. */
const HERO_SET: Record<string, string> = { 'when-to-buy': '42206', 'age-guide': '31387', 'price-per-piece': '75419' };

export const articleHeroSet = (a: Article): string | undefined => HERO_SET[a.id];
