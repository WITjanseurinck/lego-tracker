import { getCompareDeals } from '@/lib/deals';
import { LOCALES, localizePath } from '@/lib/i18n';

/**
 * nginx-map van de oude set-URL's (alleen het nummer) naar de nieuwe URL met naam.
 * Wordt bij de build in dist gezet. De Dockerfile verhuist het naar nginx en haalt het uit de publieke map.
 */
export function GET() {
  const rows: string[] = [];
  for (const d of getCompareDeals()) {
    for (const l of LOCALES) {
      const oldPath = l === 'nl' ? `/set/${d.set}` : `/${l}/set/${d.set}`;
      const next = localizePath(l, `/set/${d.set}`);
      if (next === oldPath) continue;
      rows.push(`  ${oldPath} ${next};`, `  ${oldPath}/ ${next};`);
    }
  }
  const body = `map $uri $set_redirect {\n  default "";\n${rows.join('\n')}\n}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
