import Link from 'next/link';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { ObjectCategory } from '@prisma/client';
import SectionWrapper from '@/components/ui/SectionWrapper';

export const metadata: Metadata = {
  title: '东方器物｜允物 ORIGIN',
  description: '允物器物中心。珠串、香器、印章、瓷器、珐琅、文房——以东方文化为根，以器物回应当代人的精神生活。',
};

const categoryConfig: Record<ObjectCategory, { name: string; english: string; desc: string; icon: string }> = {
  BRACELET: { name: '珠串', english: 'Bracelets', desc: '人与材质的关系', icon: '○' },
  INCENSE:  { name: '香器', english: 'Incense Objects', desc: '人与气味的关系', icon: '△' },
  SEAL:     { name: '印章', english: 'Seals', desc: '人与文字的关系', icon: '□' },
  CERAMIC:  { name: '瓷器', english: 'Ceramics', desc: '人与日常的关系', icon: '◇' },
  ENAMEL:   { name: '珐琅', english: 'Enamel', desc: '人与工艺的关系', icon: '☆' },
  SCHOLAR:  { name: '文房', english: 'Scholar Objects', desc: '人与精神空间的关系', icon: '一' },
};

export default async function ObjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category as ObjectCategory | undefined;

  const where = {
    status: 'PUBLISHED',
    ...(activeCategory ? { objectCategory: activeCategory } : {}),
  };

  const products = await prisma.product.findMany({
    where,
    include: { series: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-[var(--yun-paper)]">
      {/* Hero */}
      <SectionWrapper className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto fade-in">
          <p className="font-display text-6xl md:text-8xl text-[var(--yun-ink)]/5 tracking-widest leading-none mb-8">
            OBJECTS
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-[var(--yun-ink)] tracking-wide mb-6">
            东方器物
          </h1>
          <p className="text-sm text-[var(--yun-gray)] max-w-lg mx-auto leading-loose">
            器物不仅被使用，
            <br />
            也被观看、触摸、陪伴与记忆。
          </p>
        </div>
      </SectionWrapper>

      {/* 分类导航 */}
      <SectionWrapper className="pb-0">
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="/objects"
            className={`px-5 py-2 text-sm tracking-wider border rounded-full transition-all duration-300 ${
              !activeCategory
                ? 'bg-[var(--yun-ink)] text-[var(--yun-paper)] border-[var(--yun-ink)]'
                : 'bg-transparent text-[var(--yun-gray)] border-[var(--yun-border)] hover:bg-[var(--yun-ink)] hover:text-[var(--yun-paper)] hover:border-[var(--yun-ink)]'
            }`}
          >
            全部
          </a>
          {Object.entries(categoryConfig).map(([key, cfg]) => (
            <a
              key={key}
              href={`/objects?category=${key}`}
              className={`px-5 py-2 text-sm tracking-wider border rounded-full transition-all duration-300 ${
                activeCategory === key
                  ? 'bg-[var(--yun-ink)] text-[var(--yun-paper)] border-[var(--yun-ink)]'
                  : 'bg-transparent text-[var(--yun-gray)] border-[var(--yun-border)] hover:bg-[var(--yun-ink)] hover:text-[var(--yun-paper)] hover:border-[var(--yun-ink)]'
              }`}
            >
              {cfg.name}
            </a>
          ))}
        </div>
      </SectionWrapper>

      {/* 器物网格 */}
      <SectionWrapper>
        {products.length === 0 ? (
          /* 空态：展示六大门类入口 */
          <div>
            <p className="text-center text-[var(--yun-gray)]/60 text-sm mb-16">
              {activeCategory
                ? `${categoryConfig[activeCategory]?.name}系列正在筹备中，敬请期待。`
                : '器物陆续上架，敬请期待。'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[var(--yun-border)]/20 rounded-[var(--yun-radius)] overflow-hidden">
              {Object.entries(categoryConfig).map(([key, cfg]) => (
                <a
                  key={key}
                  href={`/objects?category=${key}`}
                  className="group bg-[var(--yun-paper)] p-8 md:p-10 hover:bg-[var(--yun-hover)] transition-colors text-center"
                >
                  <div className="text-3xl text-[var(--yun-jade)]/20 group-hover:text-[var(--yun-jade)]/50 transition-colors mb-4 font-light">
                    {cfg.icon}
                  </div>
                  <h3 className="text-base font-light tracking-[0.12em] mb-1 group-hover:text-[var(--yun-jade)] transition-colors text-[var(--yun-ink)]">
                    {cfg.name}
                  </h3>
                  <p className="text-xs text-[var(--yun-gray)] tracking-widest mb-2">{cfg.english}</p>
                  <p className="text-xs text-[var(--yun-gray)]/60 leading-relaxed">{cfg.desc}</p>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
            {products.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="group">
                <div className="aspect-[3/4] bg-[var(--yun-hover)] rounded-[var(--yun-radius)] mb-4 flex items-center justify-center overflow-hidden border border-[var(--yun-border)]/10 hover:-translate-y-1 hover:shadow-[var(--yun-shadow-hover)] transition-all duration-300">
                  <span className="text-[var(--yun-ink)]/10 text-6xl font-display">
                    {p.name.charAt(0)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[var(--yun-jade)]/60 tracking-wider">
                    {categoryConfig[p.objectCategory]?.name}
                  </span>
                  <span className="text-xs text-[var(--yun-gray)]/30">·</span>
                  <span className="text-xs text-[var(--yun-gray)] tracking-wider">{p.series.name}</span>
                </div>
                <h3 className="text-base font-light tracking-wider mb-1 group-hover:text-[var(--yun-jade)] transition-colors text-[var(--yun-ink)]">
                  {p.name}
                </h3>
                <p className="text-sm text-[var(--yun-gray)]">¥{p.salePrice.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        )}
      </SectionWrapper>
    </main>
  );
}
