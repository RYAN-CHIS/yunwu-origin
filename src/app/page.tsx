import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getPublishedProducts } from '@/lib/product-os';
import { Button, ProductCard, ContentCard, SectionWrapper } from '@/components/ui';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Metadata } from 'next';

// ── SEO Metadata ──
export const metadata: Metadata = {
  title: '允物｜东方器物品牌',
  description:
    '允物是一个东方审美现代器物品牌，以七序世界观为精神脉络，传承东方手作美学。让物归物，让心归心。',
  openGraph: {
    title: '允物｜东方器物品牌',
    description:
      '允物是一个东方审美现代器物品牌，以七序世界观为精神脉络，传承东方手作美学。',
    type: 'website',
    locale: 'zh_CN',
  },
  keywords: [
    '允物', '东方器物', '手串', '篆刻', '沉香', '水晶', '东方美学',
    '品牌故事', '七序', '见素抱朴',
  ],
};

// ── 读取站点配置 ──
async function getSiteSettings() {
  try {
    const filePath = join(process.cwd(), 'src/data/site-settings.json');
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {
      hero: {
        brandName: '允物',
        tagline: '让物归物，让心归心',
        subtitle: '东方生活器物品牌',
        ctaPrimary: '进入作品',
        ctaSecondary: '进入世界',
      },
      brandNarrative: {
        title: '关于允物',
        shortText:
          '允物是一个东方审美现代器物品牌。我们相信，器物不是被拥有的对象，而是同行者。每一件作品，都是材料、时间与人心的对话。',
      },
    };
  }
}

export default async function HomePage() {
  // ── 并行获取所有数据 ──
  const [siteSettings, featuredProducts, seriesList, journalPosts] =
    await Promise.all([
      getSiteSettings(),
      // Featured Products: latest 8
      getPublishedProducts({ take: 8, orderBy: 'newest' }),
      // Series
      prisma.series.findMany({
        orderBy: { sortOrder: 'asc' },
      }),
      // Journal
      prisma.journalPost.findMany({
        where: { status: 'PUBLISHED' },
        take: 3,
        orderBy: { publishedAt: 'desc' },
      }),
    ]);

  const { hero, brandNarrative } = siteSettings;

  return (
    <>
      {/* ═══════════════════════════════════════
          1️⃣ Hero
          ═══════════════════════════════════════ */}
      <SectionWrapper className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center max-w-3xl mx-auto fade-in">
          {/* 品牌标语 */}
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.15em] text-[var(--yun-ink)] mb-6 leading-normal">
            {hero.tagline.split(' / ').length > 1
              ? hero.tagline.split(' / ').map((line: string, i: number) => (
                  <span key={i}>
                    {line}
                    {i === 0 && <br />}
                  </span>
                ))
              : hero.tagline}
          </h1>

          <p className="text-base md:text-lg font-light tracking-[0.12em] text-[var(--yun-jade)] mb-4">
            {hero.subtitle}
          </p>

          <div className="divider mb-8" />

          <p className="text-sm text-[var(--yun-gray)] tracking-wider max-w-md mx-auto leading-loose mb-12">
            通过器物重新建立人与自己、
            <br />
            人与时间、人与生活的连接。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" href="/objects">
              探索器物
            </Button>
            <Button variant="ghost" size="lg" href="/series">
              {hero.ctaSecondary}
            </Button>
          </div>
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════
          2️⃣ Brand Narrative（品牌叙事）
          ═══════════════════════════════════════ */}
      <SectionWrapper dark>
        <div className="text-center max-w-3xl mx-auto fade-in">
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.15em] text-[var(--yun-paper)] mb-8">
            {brandNarrative.title}
          </h2>
          <p className="text-base md:text-lg leading-loose text-[var(--yun-gray)] max-w-2xl mx-auto mb-10">
            {brandNarrative.shortText}
          </p>
          <Button variant="ghost" size="md" href="/about" className="border-[var(--yun-paper)]/30 text-[var(--yun-paper)]/80 hover:bg-[var(--yun-paper)] hover:text-[var(--yun-ink)]">
            了解完整品牌故事 →
          </Button>
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════
          3️⃣ 当下器物
          ═══════════════════════════════════════ */}
      <SectionWrapper>
        <div className="text-center mb-16 fade-in">
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.15em] text-[var(--yun-ink)] mb-4">
            当下器物
          </h2>
          <p className="text-sm text-[var(--yun-gray)] max-w-xl mx-auto leading-loose">
            允物当前出品器物系列。
            <br />
            每一件器物，都承载着材料、工艺与时间的温度。
          </p>
        </div>

        {featuredProducts.length === 0 ? (
          <p className="text-center text-[var(--yun-gray)] py-16">作品筹备中</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                name={product.name}
                coverImage={product.coverImage}
                seriesName={product.seriesName}
                seriesSlug={product.seriesSlug}
                salePrice={product.salePrice}
                objectCategory={product.objectCategory}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="ghost" size="md" href="/objects">
            探索器物 →
          </Button>
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════
          4️⃣ Series Preview（系列预览）
          ═══════════════════════════════════════ */}
      <SectionWrapper className="bg-[var(--yun-hover)]">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.15em] text-[var(--yun-ink)] mb-4">
            七序世界观
          </h2>
          <p className="text-sm text-[var(--yun-gray)] max-w-xl mx-auto leading-loose">
            七种人生状态，而非七个产品系列。
            <br />
            每一序，都是人与器物关系的不同阶段。
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {seriesList.map((s, idx) => (
            <Link
              key={s.id}
              href={`/series/${s.slug}`}
              className="group block text-center p-6 bg-[var(--yun-paper)] rounded-[var(--yun-radius)] border border-[var(--yun-border)]/20 hover:-translate-y-1 hover:shadow-[var(--yun-shadow-hover)] transition-all duration-300 fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <span className="text-xs tracking-[0.15em] text-[var(--yun-gray)] mb-2 block">
                序{idx + 1}
              </span>
              <h3 className="text-lg md:text-xl font-light tracking-[0.1em] text-[var(--yun-ink)] group-hover:text-[var(--yun-jade)] transition-colors">
                {s.name}
              </h3>
              <p className="text-xs text-[var(--yun-gray)] mt-2 line-clamp-2 leading-relaxed">
                {s.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="ghost" size="md" href="/series">
            了解完整七序 →
          </Button>
        </div>
      </SectionWrapper>

      {/* ═══════════════════════════════════════
          5️⃣ Journal Preview（内容预览）
          ═══════════════════════════════════════ */}
      <SectionWrapper>
        <div className="flex items-center justify-between mb-12 fade-in">
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.15em] text-[var(--yun-ink)]">
            品牌志
          </h2>
          <Link
            href="/journal"
            className="text-xs tracking-[0.1em] text-[var(--yun-jade)] hover:text-[var(--yun-ink)] transition-colors"
          >
            阅读全部 →
          </Link>
        </div>

        {journalPosts.length === 0 ? (
          <p className="text-center text-[var(--yun-gray)] py-16">暂无内容</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {journalPosts.map((post, idx) => (
              <div key={post.id} className="fade-in" style={{ animationDelay: `${idx * 0.15}s` }}>
                <ContentCard
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  coverImage={post.coverImage}
                  category={post.category}
                  categoryLabel={
                    post.category === 'OBJECT' ? '器物'
                    : post.category === 'MATERIAL' ? '材料'
                    : post.category === 'CRAFT' ? '工艺'
                    : post.category === 'DONGHAI' ? '东海'
                    : post.category === 'CREATION' ? '创作'
                    : '哲思'
                  }
                  publishedAt={post.publishedAt}
                />
              </div>
            ))}
          </div>
        )}
      </SectionWrapper>
    </>
  );
}
