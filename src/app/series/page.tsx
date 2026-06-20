import Link from 'next/link';
import prisma from '@/lib/prisma';

// ── 七序数据映射（来自《允物品牌宪章》第七篇）──
const seriesConstitution: Record<string, {
  subtitle: string;
  poem: string;
  description: string;
  keywords: string;
  works: string;
}> = {
  fuchu: {
    subtitle: '本真之序',
    poem: '清水出芙蓉，天然去雕饰',
    description: '人生最珍贵的状态，不是成功，而是第一次看见世界时的欢喜。',
    keywords: '本真 · 喜悦 · 爱 · 美好 · 纯粹 · 生命力',
    works: '初见 · 欢颜 · 月白 · 拾光 · 清欢',
  },
  qichi: {
    subtitle: '归心之序',
    poem: '衡门之下，可以栖迟',
    description: '允许自己停下来，允许自己不那么着急。',
    keywords: '松弛 · 治愈 · 安住 · 归心 · 安顿',
    works: '小隐 · 归心 · 松风 · 静川 · 忘机',
  },
  fusu: {
    subtitle: '生长之序',
    poem: '山有扶苏，隰有荷华',
    description: '向阳而生，成为更好的自己。',
    keywords: '成长 · 行动 · 创造 · 丰盛',
    works: '启程 · 向阳 · 丰年 · 长风 · 凌云',
  },
  cangming: {
    subtitle: '格局之序',
    poem: '北冥有鱼，其名为鲲',
    description: '从关注自己，到连接更大的世界。',
    keywords: '机遇 · 人脉 · 连接 · 格局 · 资源',
    works: '汇川 · 和鸣 · 观海 · 长鲸 · 九万里',
  },
  jiming: {
    subtitle: '觉知之序',
    poem: '不知东方之既白',
    description: '看见世界之后，开始看见自己。',
    keywords: '智慧 · 沉淀 · 定力 · 觉知',
    works: '守拙 · 定境 · 观止 · 听雨 · 知止',
  },
  guanfu: {
    subtitle: '收藏之序',
    poem: '万物并作，吾以观复',
    description: '看遍繁华，终归本心。',
    keywords: '收藏 · 美学 · 回归 · 时间',
    works: '山居 · 云隐 · 观山 · 归藏 · 天工',
  },
  cangzhen: {
    subtitle: '传承之序',
    poem: '真者，受于天也，自然不可易也',
    description: '最终留下的，只有真实。',
    keywords: '孤品 · 匠心 · 传承 · 永恒',
    works: '甲辰壹号 · 岁月留香 · 天成 · 无双',
  },
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
            七种人生状态
          </p>
          <p className="text-sm text-yun-text/50 leading-loose max-w-xl mx-auto mt-4">
            七序不是等级，不是价格体系，不是会员制度。它们是人生不同阶段的映照——不是向上的阶梯，而是向内的旅程。你在七序中看到的，其实是不同阶段的自己。
          </p>
        </div>
      </section>

      {/* 七序全览 */}
      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* 第一行：前 4 序 */}
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            {series.slice(0, 4).map((s) => {
              const data = seriesConstitution[s.slug] || { subtitle: '', poem: '', description: '', keywords: '', works: '' };
              return (
                <Link
                  key={s.id}
                  href={`/series/${s.slug}`}
                  className="group bg-white p-6 md:p-8 hover:shadow-md transition-all duration-300 border border-yun-line hover:border-yun-accent/20"
                >
                  <p className="text-xs text-yun-accent tracking-[0.15em] mb-3 font-medium">
                    第{chineseOrdinals[s.sortOrder - 1]}序 · {data.subtitle}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-light tracking-wider mb-3 group-hover:text-yun-accent transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-sm text-yun-text/60 font-light italic mb-3 leading-relaxed">
                    {data.poem}
                  </p>
                  <p className="text-xs text-yun-text/50 leading-relaxed mb-3">
                    {data.description}
                  </p>
                  <p className="text-[11px] text-yun-accent/60 tracking-wider mb-3">{data.keywords}</p>
                  <p className="text-[10px] text-yun-border tracking-wider border-t border-yun-line/50 pt-3">
                    作品体系：{data.works}
                  </p>
                </Link>
              );
            })}
          </div>

          {/* 第二行：后 3 序 */}
          <div className="grid md:grid-cols-3 gap-4">
            {series.slice(4).map((s) => {
              const data = seriesConstitution[s.slug] || { subtitle: '', poem: '', description: '', keywords: '', works: '' };
              return (
                <Link
                  key={s.id}
                  href={`/series/${s.slug}`}
                  className="group bg-white p-6 md:p-8 hover:shadow-md transition-all duration-300 border border-yun-line hover:border-yun-accent/20"
                >
                  <p className="text-xs text-yun-accent tracking-[0.15em] mb-3 font-medium">
                    第{chineseOrdinals[s.sortOrder - 1]}序 · {data.subtitle}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-light tracking-wider mb-3 group-hover:text-yun-accent transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-sm text-yun-text/60 font-light italic mb-3 leading-relaxed">
                    {data.poem}
                  </p>
                  <p className="text-xs text-yun-text/50 leading-relaxed mb-3">
                    {data.description}
                  </p>
                  <p className="text-[11px] text-yun-accent/60 tracking-wider mb-3">{data.keywords}</p>
                  <p className="text-[10px] text-yun-border tracking-wider border-t border-yun-line/50 pt-3">
                    作品体系：{data.works}
                  </p>
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
