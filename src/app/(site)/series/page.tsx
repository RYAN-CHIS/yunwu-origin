import Link from 'next/link';
import prisma from '@/lib/prisma';

// ── 七序诗词映射（来自《允物品牌宪章》）──
const seriesPoetry: Record<string, { poem: string; subtitle: string; keywords: string }> = {
  fuchu: { poem: '清水出芙蓉，天然去雕饰', subtitle: '本真之序', keywords: '本真 · 喜悦 · 纯粹' },
  qichi: { poem: '衡门之下，可以栖迟', subtitle: '归心之序', keywords: '松弛 · 治愈 · 安住' },
  fusu: { poem: '山有扶苏，隰有荷华', subtitle: '生长之序', keywords: '成长 · 行动 · 创造' },
  cangming: { poem: '北冥有鱼，其名为鲲', subtitle: '格局之序', keywords: '机遇 · 人脉 · 格局' },
  jiming: { poem: '不知东方之既白', subtitle: '觉知之序', keywords: '智慧 · 沉淀 · 觉知' },
  guanfu: { poem: '万物并作，吾以观复', subtitle: '收藏之序', keywords: '收藏 · 美学 · 回归' },
  cangzhen: { poem: '真者，受于天也，自然不可易也', subtitle: '传承之序', keywords: '孤品 · 匠心 · 传承' },
};

const chineseOrdinals = ['一', '二', '三', '四', '五', '六', '七'];

export default async function SeriesIndexPage() {
  const series = await prisma.series.findMany({ orderBy: { sortOrder: 'asc' } });

  return (
    <main className="min-h-screen bg-yun-bg">
      {/* Hero */}
      <section className="py-24 md:py-32 px-6 md:px-12 pt-32 md:pt-40">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-display text-6xl md:text-8xl text-yun-accent/10 tracking-widest leading-none mb-8">
            SEQUENCE
          </p>
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-yun-text mb-6">
            七序
          </h1>
          <div className="divider mt-0 mb-6" />
          <p className="text-lg md:text-xl text-yun-subtext leading-relaxed max-w-2xl mx-auto">
            人生不同阶段的映照
          </p>
          <p className="text-sm text-yun-text/50 leading-loose max-w-xl mx-auto mt-4">
            七序不是等级，不是价格体系，而是每个人与自己相处的不同阶段。
            每个阶段都有自己的课题和审美，器物是这些阶段的注脚。
          </p>
        </div>
      </section>

      {/* 七序全览 */}
      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* 第一行：前 4 序 */}
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            {series.slice(0, 4).map((s) => {
              const poetry = seriesPoetry[s.slug] || { poem: '', subtitle: '', keywords: '' };
              return (
                <Link
                  key={s.id}
                  href={`/series/${s.slug}`}
                  className="group bg-white p-8 md:p-10 hover:shadow-md transition-all duration-300 border border-yun-line hover:border-yun-accent/20"
                >
                  <p className="text-xs text-yun-accent tracking-[0.15em] mb-4 font-medium">
                    第{chineseOrdinals[s.sortOrder - 1]}序
                  </p>
                  <h3 className="text-2xl md:text-3xl font-light tracking-wider mb-2 group-hover:text-yun-accent transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-xs text-yun-subtext tracking-wider mb-4">{poetry.subtitle}</p>
                  <p className="text-sm text-yun-text/60 font-light italic mb-3 leading-relaxed">
                    {poetry.poem}
                  </p>
                  <p className="text-[11px] text-yun-accent/60 tracking-wider">{poetry.keywords}</p>
                </Link>
              );
            })}
          </div>

          {/* 第二行：后 3 序 */}
          <div className="grid md:grid-cols-3 gap-4">
            {series.slice(4).map((s) => {
              const poetry = seriesPoetry[s.slug] || { poem: '', subtitle: '', keywords: '' };
              return (
                <Link
                  key={s.id}
                  href={`/series/${s.slug}`}
                  className="group bg-white p-8 md:p-10 hover:shadow-md transition-all duration-300 border border-yun-line hover:border-yun-accent/20"
                >
                  <p className="text-xs text-yun-accent tracking-[0.15em] mb-4 font-medium">
                    第{chineseOrdinals[s.sortOrder - 1]}序
                  </p>
                  <h3 className="text-2xl md:text-3xl font-light tracking-wider mb-2 group-hover:text-yun-accent transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-xs text-yun-subtext tracking-wider mb-4">{poetry.subtitle}</p>
                  <p className="text-sm text-yun-text/60 font-light italic mb-3 leading-relaxed">
                    {poetry.poem}
                  </p>
                  <p className="text-[11px] text-yun-accent/60 tracking-wider">{poetry.keywords}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 返回 */}
      <div className="text-center pb-20">
        <Link href="/" className="text-sm text-yun-accent tracking-wider hover:opacity-70 transition-opacity">
          ← 返回首页
        </Link>
      </div>
    </main>
  );
}
