import type { Metadata } from 'next';
import prisma from '@/lib/prisma';

const SITE_URL = 'https://www.yunwuorigin.com';

type SeoPageKey = 'home' | 'products' | 'journal' | string;

export interface SeoConfig {
  pageKey: string;
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  robots?: string;
}

const FALLBACK_SEO: Record<string, SeoConfig> = {
  home: {
    pageKey: 'home',
    title: '允物｜东方器物品牌',
    description: '允物是一个东方审美现代器物品牌，以七序世界观为精神脉络，传承东方手作美学。让物归物，让心归心。',
    keywords: ['允物', '东方器物', '手串', '篆刻', '沉香', '水晶', '东方美学', '品牌故事', '七序', '见素抱朴'],
    canonical: SITE_URL,
  },
  products: {
    pageKey: 'products',
    title: '全部作品｜允物',
    description: '浏览允物全部作品，探索七序体系中的每一件器物。每一件作品都是东方审美与现代生活的相遇。',
    keywords: ['允物', '东方器物', '作品', '器物', '七序'],
    canonical: `${SITE_URL}/products`,
  },
  journal: {
    pageKey: 'journal',
    title: '允物品牌志｜器物之道，不在拥有，而在观照',
    description: '器物、材料、工艺、东海、创作、哲思。允物品牌志记录东方器物美学的探索之路。',
    keywords: ['允物', '品牌志', '器物', '材料', '工艺', '东方美学'],
    canonical: `${SITE_URL}/journal`,
  },
};

function fallbackFor(pageKey: SeoPageKey): SeoConfig {
  return FALLBACK_SEO[pageKey] || {
    pageKey,
    title: '允物｜东方器物品牌',
    description: FALLBACK_SEO.home.description,
    keywords: FALLBACK_SEO.home.keywords,
    canonical: `${SITE_URL}/${pageKey}`,
  };
}

function splitKeywords(value: unknown, fallback: string[]) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value !== 'string' || !value.trim()) return fallback;
  return value.split(/[,，\n]/).map((item) => item.trim()).filter(Boolean);
}

function absoluteUrl(value?: string | null) {
  if (!value) return undefined;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  if (value.startsWith('/')) return `${SITE_URL}${value}`;
  return value;
}

export async function getSeoConfig(pageKey: SeoPageKey): Promise<SeoConfig> {
  const fallback = fallbackFor(pageKey);

  try {
    const rows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT page_key, title, description, keywords, og_title, og_description, og_image, canonical, robots
       FROM seo_configs
       WHERE page_key = $1
       LIMIT 1`,
      pageKey,
    );
    const row = rows[0];
    if (!row) return fallback;

    return {
      pageKey,
      title: row.title || fallback.title,
      description: row.description || fallback.description,
      keywords: splitKeywords(row.keywords, fallback.keywords),
      ogTitle: row.og_title || row.title || fallback.ogTitle,
      ogDescription: row.og_description || row.description || fallback.ogDescription,
      ogImage: row.og_image || fallback.ogImage,
      canonical: row.canonical || fallback.canonical,
      robots: row.robots || fallback.robots,
    };
  } catch {
    return fallback;
  }
}

export function toMetadata(seo: SeoConfig, overrides?: Partial<SeoConfig>): Metadata {
  const merged = { ...seo, ...overrides };
  const canonical = absoluteUrl(merged.canonical);
  const ogImage = absoluteUrl(merged.ogImage);

  return {
    title: merged.title,
    description: merged.description,
    keywords: merged.keywords,
    openGraph: {
      title: merged.ogTitle || merged.title,
      description: merged.ogDescription || merged.description,
      type: 'website',
      locale: 'zh_CN',
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(merged.robots ? { robots: merged.robots } : {}),
  };
}

export { SITE_URL };
