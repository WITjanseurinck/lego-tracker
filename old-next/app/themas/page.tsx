import type { Metadata } from 'next';
import Link from 'next/link';
import { dealsByTheme } from '@/lib/deals';
import { THEMES, getDict2, themeName } from '@/lib/dict2';
import { formatEur } from '@/lib/format';
import { getI18n } from '@/lib/i18n-server';
import { pageMeta } from '@/lib/seo';
import { photoTint } from '@/lib/themes';
import { TOPICS, TOPIC_KEYS } from '@/lib/topics';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();
  const t2 = getDict2(locale);
  return pageMeta({ locale, path: '/themas', title: t2.themesTitle, description: t2.themesLead });
}

export default async function Themas() {
  const { locale, href } = await getI18n();
  const t2 = getDict2(locale);
  const list = Object.keys(THEMES)
    .map((k) => ({ k, deals: dealsByTheme(k) }))
    .filter((x) => x.deals.length > 0 && x.k !== 'overig')
    .sort((a, b) => b.deals.length - a.deals.length);

  return (
    <div className="wrap page">
      <h1>{t2.themesTitle}</h1>
      <p className="lead">{t2.themesLead}</p>
      <ul className="chips" style={{ margin: '20px 0 8px' }}>
        {TOPIC_KEYS.map((k) => <li key={k}><Link href={href(`/onderwerp/${k}`)}>{TOPICS[k].name[locale]}</Link></li>)}
      </ul>
      <div className="themegrid">
        {list.map(({ k, deals }, i) => {
          const prices = deals.map((d) => d.offers[0].price);
          const img = deals.find((d) => d.image)?.image;
          return (
            <Link key={k} href={href(`/thema/${k}`)} className="themecard">
              <span className="pic" style={{ background: photoTint(i) }}>{img ? <img src={img} alt="" loading="lazy" referrerPolicy="no-referrer" /> : null}</span>
              <span className="tname">{themeName(k, locale)}</span>
              <span className="tmeta">{deals.length} {t2.setsWord} · {formatEur(Math.min(...prices), locale)} – {formatEur(Math.max(...prices), locale)}</span>
              <span className="tblurb">{THEMES[k].blurb[locale]}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
