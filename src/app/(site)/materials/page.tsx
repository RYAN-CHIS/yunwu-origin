import Link from 'next/link';
import prisma from '@/lib/prisma';

export const metadata = {
  title: '东方材料｜允物 Yunwu Origin',
  description: '探索允物使用的天然材质：白水晶、粉晶、南红、沉香、老山檀、绿松石、青金石。每一种材料都有它的来历和故事。',
};

export default async function MaterialsPage() {
  const materials = await prisma.material.findMany({
    include: {
      productMaterials: {
        include: { product: { include: { series: true } } },
      },
    },
  });

  return (
    <>
      <section className="min-h-[40vh] flex items-center justify-center pt-16">
        <div className="text-center max-w-2xl px-6">
          <p className="font-display text-lg text-yun-accent/60 tracking-[0.2em] mb-2">Materials</p>
          <h1 className="text-3xl font-light tracking-[0.15em] mb-6">东方材料</h1>
          <div className="divider mb-8" />
          <p className="text-sm text-yun-text/50 leading-loose max-w-xl mx-auto">
            每一种材料都有它的来历、性格和故事。
            <br />
            水晶是大地亿万年的结晶，沉香是树木受伤后的自我修复，檀木是数十年缓慢生长的年轮。
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-brand space-y-24">
          {materials.map((m) => (
            <div key={m.id} className="grid md:grid-cols-2 gap-16 items-center">
              {/* 图 */}
              <div className="aspect-square bg-yun-grey/20 rounded-brand flex items-center justify-center">
                <span className="text-[8rem] font-display text-yun-text/10">{m.name.charAt(0)}</span>
              </div>

              {/* 文 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="tag-yun">{m.type}</span>
                  <span className="text-xs text-yun-text/30 tracking-wider">{m.origin}</span>
                </div>
                <h2 className="text-2xl font-light tracking-[0.1em] mb-6">{m.name}</h2>
                <p className="text-sm text-yun-text/70 leading-loose">{m.description}</p>

                {/* 关联作品 */}
                {m.productMaterials.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-yun-grey/30">
                    <h3 className="text-xs text-yun-text/40 tracking-wider mb-3">应用作品</h3>
                    <div className="flex flex-wrap gap-2">
                      {m.productMaterials.map((pm) => (
                        <Link
                          key={pm.id}
                          href={`/products/${pm.product.slug}`}
                          className="text-sm text-yun-accent/70 hover:text-yun-accent tracking-wider transition-colors"
                        >
                          {pm.product.series.name} · {pm.product.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export const revalidate = 3600;
