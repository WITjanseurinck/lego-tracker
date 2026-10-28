import { defineConfig } from 'astro/config';

// De sitemap en robots.txt komen uit eigen routes (src/pages), omdat de URL-segmenten per taal verschillen.
export default defineConfig({
  site: process.env.SITE_URL || 'https://buildthatset.com',
  trailingSlash: 'never',
  build: { format: 'file' },
});
