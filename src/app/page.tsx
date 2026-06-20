import Link from 'next/link';
import prisma from '@/lib/prisma';

// 六大器物门类
const objectCategories = [
  {
    key: 'BRACELET',
    name: '珠串',
    english: 'Bracelets',
    desc: '人与材质的关系',
    icon: '○',
  },
  {
    key: 'INCENSE',
    name: '香器',
    english: 'Incense Objects',
    desc: '人与气味的关系',
    icon: '△',
  },
  {
    key: 'SEAL',
    name: '印章',
    english: 'Seals',
    desc: '人与文字的关系',
    icon: '□',
  },
  {
    key: 'CERAMIC',
    name: '瓷器',
    english: 'Ceramics',
    desc: '人与日常的关系',
    icon: '◇',
  },
  {
    key: 'ENAMEL',
    name: '珐琅',
    english: 'Enamel',
    desc: '人与工艺的关系',
    icon: '☆',
  },
  {
    key: 'SCHOLAR',
    name: '文房',
    english: 'Scholar Objects',
    desc: '人与精神空间的关系',
    icon: '一',
  },
];

export default async function HomePage() {
  const series = await prisma.series.findMany({ orderBy: { sortOrder: 'asc' } });
  const featured = await prisma.product.findMany({
    where: { status: 'published' },
    include: { series: true },
    take: 8,
    orderBy: { createdAt: 'desc' },
  });
  const materials = await prisma.material.findMany({ take: 6 });

  return (
    <>
      {/* ═══ Hero ═══ */}
      <section className="min-h-screen flex items-center justify-center relative pt-16">
        <div className="text-center px-6 max-w-3xl fade-in">
          <p className="font-display text-7xl md:text-9xl text-yun-accent/15 tracking-widest leading-none mb-6">
            ORIGIN
          </p>
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.15em] text-yun-text mb-4">
            允物
          </h1>
          <div className="divider mb-8" />
          <p className="text-xl md:text-2xl font-light tracking-[0.12em] text-yun-text/80 mb-2">
            器以载道
          </p>
          <p className="text-xl md:text-2xl font-light tracking-[0.12em] text-yun-text/80 mb-10">
            物以见心
          </p>
          <p className="text-sm text-yun-text/50 tracking-wider max-w-md mx-auto leading-loose mb-12">
            以东方文化为根，<br />
            以器物回应当代人的精神生活。<br />
            让物归物，让心归心。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/objects" className="btn-primary">
              探索器物
            </Link>
            <Link href="/series/fuchu" className="btn-outline">
              进入七序
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 东方器物体系 ═══ */}
      <section className="py-24 bg-yun-white">
        <div className="container-brand">
          <div className="text-center mb-16">
            <p className="font-display text-lg text-yun-accent/60 tracking-[0.2em] mb-2">Eastern Objects</p>
            <h2 className="text-2xl font-light tracking-[0.15em]">东方器物</h2>
            <div className="divider mt-6" />
            <p className="text-sm text-yun-text/50 mt-6 max-w-xl mx-auto leading-loose">
              器物不仅被使用，<br />
              也被观看、触摸、陪伴与记忆。
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-yun-grey/20">
            {objectCategories.map((cat) => (
              <Link
                key={cat.key}
                href={`/objects?category=${cat.key}`}
                className="group bg-yun-white p-8 md:p-10 hover:bg-yun-bg/60 transition-colors text-center"
              >
                <div className="text-3xl md:text-4xl text-yun-accent/30 group-hover:text-yun-accent/60 transition-colors mb-5 font-light">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-light tracking-[0.12em] mb-1 group-hover:text-yun-accent transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-yun-text/40 tracking-widest mb-3">{cat.english}</p>
                <p className="text-xs text-yun-text/50 leading-relaxed">{cat.desc}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/objects" className="btn-outline">
              进入器物中心
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 七序世界观 ═══ */}
      <section className="py-24">
        <div className="container-brand">
          <div className="text-center mb-16">
            <p className="font-display text-lg text-yun-accent/60 tracking-[0.2em] mb-2">The Seven States</p>
            <h2 className="text-2xl font-light tracking-[0.15em]">七序世界观</h2>
            <div className="divider mt-6" />
            <p className="text-sm text-yun-text/50 mt-6 max-w-xl mx-auto leading-loose">
              七序不是产品分类，而是七种人生状态。<br />
              没有绝对高低，只是不断循环往复。
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-px bg-yun-grey/30">
            {series.slice(0, 4).map((s) => (
              <Link
                key={s.id}
                href={`/series/${s.slug}`}
                className="group bg-yun-white p-8 hover:bg-yun-white/50 transition-colors"
              >
                <p className="text-xs text-yun-accent tracking-[0.15em] mb-3">
                  {String(s.sortOrder).padStart(2, '0')}
                </p>
                <h3 className="text-xl font-light tracking-wider mb-2 group-hover:text-yun-accent transition-colors">
                  {s.name}
                </h3>
                <p className="text-sm text-yun-text/50 leading-relaxed line-clamp-3">
                  {s.description.split('。')[0]}。
                </p>
              </Link>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-yun-grey/30">
            {series.slice(4).map((s) => (
              <Link
                key={s.id}
                href={`/series/${s.slug}`}
                className="group bg-yun-white p-8 hover:bg-yun-white/50 transition-colors"
              >
                <p className="text-xs text-yun-accent tracking-[0.15em] mb-3">
                  {String(s.sortOrder).padStart(2, '0')}
                </p>
                <h3 className="text-xl font-light tracking-wider mb-2 group-hover:text-yun-accent transition-colors">
                  {s.name}
                </h3>
                <p className="text-sm text-yun-text/50 leading-relaxed line-clamp-3">
                  {s.description.split('。')[0]}。
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 当季器物 ═══ */}
      <section className="py-24 bg-yun-white">
        <div className="container-brand">
          <div className="text-center mb-16">
            <p className="font-display text-lg text-yun-accent/60 tracking-[0.2em] mb-2">Current Season</p>
            <h2 className="text-2xl font-light tracking-[0.15em]">当季器物</h2>
            <div className="divider mt-6" />
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {featured.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group"
              >
                {/* 占位封面 */}
                <div className="aspect-[3/4] bg-yun-grey/20 rounded-brand mb-4 flex items-center justify-center overflow-hidden">
                  <span className="text-yun-text/20 text-6xl font-display">
                    {p.name.charAt(0)}
                  </span>
                </div>
                <p className="text-xs text-yun-accent tracking-wider mb-1">{p.series.name}</p>
                <h3 className="text-base font-light tracking-wider mb-1 group-hover:text-yun-accent transition-colors">
                  {p.name}
                </h3>
                <p className="text-sm text-yun-text/50">
                  ¥{p.salePrice.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/objects" className="btn-outline">
              浏览全部器物
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 为什么是器物 ═══ */}
      <section className="py-24 bg-yun-dark text-yun-grey">
        <div className="container-brand max-w-3xl text-center">
          <p className="font-display text-lg text-yun-accent tracking-[0.2em] mb-2">Why Objects</p>
          <h2 className="text-2xl font-light tracking-[0.15em] text-yun-white mb-10">为什么是器物</h2>
          <div className="space-y-6 text-sm leading-loose opacity-80">
            <p>器物无法改变命运。</p>
            <p>
              它不能替我们做决定，<br />
              不能替我们承担责任。
            </p>
            <p>但器物可以陪伴。</p>
            <p className="text-yun-accent/80">
              在一次次使用中，<br />
              提醒我们看见自己。
            </p>
            <p>
              允物希望重新建立一种真实、<br />
              克制且有温度的人与物的关系。
            </p>
          </div>
          <div className="mt-10">
            <Link href="/about" className="btn-outline border-yun-grey text-yun-grey hover:bg-yun-grey hover:text-yun-dark">
              了解允物
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 材料研究 ═══ */}
      <section className="py-24">
        <div className="container-brand">
          <div className="text-center mb-16">
            <p className="font-display text-lg text-yun-accent/60 tracking-[0.2em] mb-2">Material Studies</p>
            <h2 className="text-2xl font-light tracking-[0.15em]">材料研究</h2>
            <div className="divider mt-6" />
            <p className="text-sm text-yun-text/50 mt-6 max-w-xl mx-auto leading-loose">
              材料不是主角，器物才是。<br />
              但每一种材料都有它的来历、性格与故事。
            </p>
          </div>

          <div className="grid md:grid-cols-6 gap-4">
            {materials.map((m) => (
              <div key={m.id} className="text-center group">
                <div className="aspect-square bg-yun-grey/10 rounded-brand mb-3 flex items-center justify-center hover:bg-yun-grey/20 transition-colors">
                  <span className="text-4xl font-display text-yun-accent/20 group-hover:text-yun-accent/40 transition-colors">
                    {m.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-sm font-light tracking-wider mb-1">{m.name}</h3>
                <p className="text-xs text-yun-text/40 tracking-wider">{m.type}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/materials" className="btn-outline">
              材料知识库
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 品牌志预览 ═══ */}
      <section className="py-24 bg-yun-white border-t border-yun-grey/20">
        <div className="container-brand">
          <div className="text-center mb-12">
            <p className="font-display text-lg text-yun-accent/60 tracking-[0.2em] mb-2">Journal</p>
            <h2 className="text-2xl font-light tracking-[0.15em]">品牌志</h2>
            <div className="divider mt-6" />
            <p className="text-sm text-yun-text/50 mt-6 max-w-xl mx-auto leading-loose">
              器物之道，不在拥有，而在观照。
            </p>
          </div>
          <div className="text-center">
            <Link href="/journal" className="btn-outline">
              阅读品牌志
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
