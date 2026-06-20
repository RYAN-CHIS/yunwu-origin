import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import SectionWrapper from '@/components/ui/SectionWrapper';
import ProductCard from '@/components/ui/ProductCard';

interface Props {
  params: Promise<{ slug: string }>;
}

const chineseOrdinals = ['一', '二', '三', '四', '五', '六', '七'];

// ── 取自《允物品牌宪章》第七篇 ──
const seriesConstitution: Record<string, {
  subtitle: string;
  poem: string;
  keywords: string;
  works: string;
}> = {
  fuchu: { subtitle: '本真之序', poem: '清水出芙蓉，天然去雕饰', keywords: '本真 · 喜悦 · 爱 · 美好 · 纯粹 · 生命力', works: '初见 · 欢颜 · 月白 · 拾光 · 清欢' },
  qichi: { subtitle: '归心之序', poem: '衡门之下，可以栖迟', keywords: '松弛 · 治愈 · 安住 · 归心 · 安顿', works: '小隐 · 归心 · 松风 · 静川 · 忘机' },
  fusu: { subtitle: '生长之序', poem: '山有扶苏，隰有荷华', keywords: '成长 · 行动 · 创造 · 丰盛', works: '启程 · 向阳 · 丰年 · 长风 · 凌云' },
  cangming: { subtitle: '格局之序', poem: '北冥有鱼，其名为鲲', keywords: '机遇 · 人脉 · 连接 · 格局 · 资源', works: '汇川 · 和鸣 · 观海 · 长鲸 · 九万里' },
  jiming: { subtitle: '觉知之序', poem: '不知东方之既白', keywords: '智慧 · 沉淀 · 定力 · 觉知', works: '守拙 · 定境 · 观止 · 听雨 · 知止' },
  guanfu: { subtitle: '收藏之序', poem: '万物并作，吾以观复', keywords: '收藏 · 美学 · 回归 · 时间', works: '山居 · 云隐 · 观山 · 归藏 · 天工' },
  cangzhen: { subtitle: '传承之序', poem: '真者，受于天也，自然不可易也', keywords: '孤品 · 匠心 · 传承 · 永恒', works: '甲辰壹号 · 岁月留香 · 天成 · 无双' },
};

// ── 动态 SEO Metadata ──
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const series = await prisma.series.findUnique({ where: { slug } });
  if (!series) return {};

  return {
    title: `${series.name}｜七序世界观｜允物`,
    description: series.description || `允物七序之${series.name} — ${series.heroText || ''}`,
    openGraph: {
      title: `${series.name}｜允物`,
      description: series.description || '',
      type: 'website',
    },
    keywords: ['允物', '七序', series.name, '东方器物'],
  };
}

export default async function SeriesPage({ params }: Props) {
  const { slug } = await params;
  const series = await prisma.series.findUnique({
    where: { slug },
    include: {
      products: {
        where: { status: 'PUBLISHED' },
        orderBy: { salePrice: 'asc' },
      },
    },
  });

  if (!series) notFound();

  const extra = seriesConstitution[series.slug];

  return (
    <main className="bg-[var(--yun-paper)] min-h-screen">
      {/* Hero */}
      <SectionWrapper className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center max-w-2xl fade-in">
          <p className="text-xs text-[var(--yun-jade)] tracking-[0.2em] mb-4">
            第{chineseOrdinals[series.sortOrder - 1]}序{extra ? ` · ${extra.subtitle}` : ''}
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.12em] text-[var(--yun-ink)] mb-6">
            {series.name}
          </h1>
          <div className="divider mb-8" />
          <p className="text-lg font-light tracking-wider text-[var(--yun-jade)]/80 mb-4 leading-relaxed italic">
            「{series.heroText}」
          </p>
          <p className="text-sm text-[var(--yun-gray)] leading-loose max-w-xl mx-auto">
            {series.description}
          </p>
          {extra && (
            <div className="mt-6 flex flex-col gap-2 items-center">
              <p className="text-xs text-[var(--yun-jade)]/50 tracking-wider">{extra.keywords}</p>
              <p className="text-[11px] text-[var(--yun-gray)] tracking-wider">
                作品体系：{extra.works}
              </p>
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* 作品列表 */}
      <SectionWrapper>
        <h2 className="text-center text-sm font-light tracking-[0.15em] text-[var(--yun-gray)] mb-12">
          {series.name} · 作品
        </h2>

        {series.products.length === 0 ? (
          <p className="text-center text-sm text-[var(--yun-gray)]">作品筹备中</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {series.products.map((p) => (
              <ProductCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                coverImage={p.coverImage}
                seriesName={series.name}
                seriesSlug={series.slug}
                salePrice={p.salePrice}
                objectCategory={p.objectCategory}
              />
            ))}
          </div>
        )}
      </SectionWrapper>

      {/* 返回导航 */}
      <div className="text-center pb-24">
        <Link href="/series" className="text-sm text-[var(--yun-jade)] tracking-wider hover:opacity-70 transition-opacity">
          ← 返回七序总览
        </Link>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const series = await prisma.series.findMany({ select: { slug: true } });
  return series.map((s) => ({ slug: s.slug }));
}

export const revalidate = 3600;
