import Link from 'next/link';
import prisma from '@/lib/prisma';

export const metadata = {
  title: '全部作品｜允物 Yunwu Origin',
  description: '浏览允物全部作品，探索七序体系中的每一件器物。每一件作品都是东方审美与现代生活的相遇。',
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { status: 'published' },
    include: { series: true },
    orderBy: [{ series: { sortOrder: 'asc' } }, { salePrice: 'asc' }],
  });

  // 按序分组
  const grouped: Record<string, typeof products> = {};
  for (const p of products) {
    const key = p.series.name;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(p);
  }

  return (
    <>
      <section className="min-h-[40vh] flex items-center justify-center pt-16">
        <div className="text-center px-6">
          <p className="font-display text-lg text-yun-accent/60 tracking-[0.2em] mb-2">All Works</p>
          <h1 className="text-3xl font-light tracking-[0.15em] mb-4">全部作品</h1>
          <div className="divider" />
        </div>
      </section>

      <section className="pb-24">
        <div className="container-brand">
          {Object.entries(grouped).map(([seriesName, items]) => (
            <div key={seriesName} className="mb-20">
              <h2 className="text-lg font-light tracking-[0.1em] mb-8 pb-4 border-b border-yun-grey/30">
                {seriesName}
                <span className="text-sm text-yun-text/30 ml-2">{items.length} 件作品</span>
              </h2>

              <div className="grid md:grid-cols-4 gap-8">
                {items.map((p) => (
                  <Link key={p.id} href={`/products/${p.slug}`} className="group">
                    <div className="aspect-[3/4] bg-yun-grey/20 rounded-brand mb-4 flex items-center justify-center">
                      <span className="text-5xl font-display text-yun-text/20 group-hover:text-yun-accent/30 transition-colors">
                        {p.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-base font-light tracking-wider mb-1 group-hover:text-yun-accent transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-yun-text/40 mb-2 line-clamp-2">{p.theme}</p>
                    <p className="text-sm text-yun-text/50">¥{p.salePrice.toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export const revalidate = 3600;
