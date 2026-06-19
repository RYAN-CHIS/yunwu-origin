import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function HomePage() {
  const series = await prisma.series.findMany({ orderBy: { sortOrder: 'asc' } });
  const featured = await prisma.product.findMany({
    where: { status: 'published' },
    include: { series: true },
    take: 20,
  });
  const materials = await prisma.material.findMany({ take: 7 });

  return (
    <>
      {/* ═══ Hero ═══ */}
      <section className="min-h-screen flex items-center justify-center relative pt-16">
        <div className="text-center px-6 max-w-3xl fade-in">
          <p className="font-display text-7xl md:text-9xl text-yun-accent/20 tracking-widest leading-none mb-6">
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
            以东方文化为根，以天然材质为骨，以器物回应当代人的精神生活。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/series/fuchu" className="btn-primary">
              进入七序
            </Link>
            <Link href="/products" className="btn-outline">
              浏览作品
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 七序介绍 ═══ */}
      <section className="py-24">
        <div className="container-brand">
          <div className="text-center mb-16">
            <p className="font-display text-lg text-yun-accent/60 tracking-[0.2em] mb-2">The Seven States</p>
            <h2 className="text-2xl font-light tracking-[0.15em]">七序世界观</h2>
            <div className="divider mt-6" />
            <p className="text-sm text-yun-text/50 mt-6 max-w-xl mx-auto leading-loose">
              七序不是产品分类，而是七种人生状态。没有绝对高低，只是不断循环往复。
              在七序中看到的，其实是不同阶段的自己。
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

      {/* ═══ 精选作品 ═══ */}
      <section className="py-24 bg-yun-white">
        <div className="container-brand">
          <div className="text-center mb-16">
            <p className="font-display text-lg text-yun-accent/60 tracking-[0.2em] mb-2">Selected Works</p>
            <h2 className="text-2xl font-light tracking-[0.15em]">精选作品</h2>
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
            <Link href="/products" className="btn-outline">
              浏览全部作品
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 品牌故事 ═══ */}
      <section className="py-24 bg-yun-dark text-yun-grey">
        <div className="container-brand max-w-3xl text-center">
          <p className="font-display text-lg text-yun-accent tracking-[0.2em] mb-2">Our Story</p>
          <h2 className="text-2xl font-light tracking-[0.15em] text-yun-white mb-10">允物为何存在</h2>
          <div className="space-y-6 text-sm leading-loose opacity-80">
            <p>
              我们生活在一个被过度包装的时代。越来越多的产品被赋予超出其本身的意义：一串珠子被承诺改变命运，一块木头被包装成身份象征，一件器物被讲述成遥不可及的传奇。
            </p>
            <p>
              允物不试图让器物承担本不属于它的责任。不让一串珠子背负改变命运的神话，不让一块木头成为身份焦虑的证明，不让消费变成对自我价值的确认。
            </p>
            <p className="text-yun-accent/80">
              我们只是希望：在这个一切都被过度包装的时代，重新建立一种真实、克制且有温度的人与物的关系。
            </p>
            <p>这便是允物存在的意义。</p>
          </div>
          <div className="mt-10">
            <Link href="/about" className="btn-outline border-yun-grey text-yun-grey hover:bg-yun-grey hover:text-yun-dark">
              了解更多
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 东方材料 ═══ */}
      <section className="py-24">
        <div className="container-brand">
          <div className="text-center mb-16">
            <p className="font-display text-lg text-yun-accent/60 tracking-[0.2em] mb-2">Materials</p>
            <h2 className="text-2xl font-light tracking-[0.15em]">东方材料</h2>
            <div className="divider mt-6" />
            <p className="text-sm text-yun-text/50 mt-6 max-w-xl mx-auto leading-loose">
              每一种材料都有它的来历、性格和故事。允物选择与天然材质同行，而非制造。
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {materials.map((m) => (
              <div key={m.id} className="text-center group">
                <div className="aspect-square bg-yun-grey/10 rounded-brand mb-4 flex items-center justify-center">
                  <span className="text-5xl font-display text-yun-accent/20 group-hover:text-yun-accent/40 transition-colors">
                    {m.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-base font-light tracking-wider mb-1">{m.name}</h3>
                <p className="text-xs text-yun-text/40 tracking-wider">{m.type}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/materials" className="btn-outline">
              探索全部材料
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
