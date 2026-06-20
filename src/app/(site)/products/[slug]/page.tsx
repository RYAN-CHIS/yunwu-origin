import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import BuyButton from './BuyButton';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      series: true,
      materialsRelation: { include: { material: true } },
    },
  });

  if (!product || product.status !== 'published') notFound();

  // 相关作品：同序的其他作品
  const related = await prisma.product.findMany({
    where: {
      seriesId: product.seriesId,
      id: { not: product.id },
      status: 'published',
    },
    take: 4,
    include: { series: true },
  });

  return (
    <>
      <article className="pt-24">
        <div className="container-brand">
          {/* 面包屑 */}
          <nav className="flex items-center gap-2 text-xs text-yun-text/40 tracking-wider mb-12">
            <Link href="/" className="hover:text-yun-accent">首页</Link>
            <span>/</span>
            <Link href={`/series/${product.series.slug}`} className="hover:text-yun-accent">{product.series.name}</Link>
            <span>/</span>
            <span className="text-yun-text/60">{product.name}</span>
          </nav>

          {/* 产品布局 */}
          <div className="grid md:grid-cols-2 gap-16">
            {/* 左：封面 */}
            <div className="aspect-[3/4] bg-yun-grey/20 rounded-brand flex items-center justify-center">
              <span className="text-[12rem] leading-none font-display text-yun-text/10">
                {product.name.charAt(0)}
              </span>
            </div>

            {/* 右：信息 */}
            <div className="flex flex-col justify-center">
              <span className="tag-yun mb-4">{product.series.name}</span>
              <h1 className="text-3xl font-light tracking-[0.12em] mb-3">{product.name}</h1>
              <p className="text-sm text-yun-accent/80 tracking-wider mb-8">{product.theme}</p>

              <div className="space-y-4 mb-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-light tracking-wider">¥{product.salePrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-yun-text/30">SKU: {product.sku}</p>
              </div>

              {/* 购买按钮 */}
              <BuyButton productSlug={product.slug} productName={product.name} price={product.salePrice} />

              {/* 材料 */}
              {product.materialsRelation.length > 0 && (
                <div className="mt-8 pt-8 border-t border-yun-grey/30">
                  <h3 className="text-sm font-light tracking-wider mb-3">材料</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.materialsRelation.map((pm) => (
                      <Link
                        key={pm.id}
                        href="/materials"
                        className="text-xs text-yun-accent/70 hover:text-yun-accent tracking-wider transition-colors"
                      >
                        {pm.material.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 库存 */}
              {product.stock <= 10 && product.stock > 0 && (
                <p className="text-xs text-yun-accent/60 mt-4">仅剩 {product.stock} 件</p>
              )}
            </div>
          </div>

          {/* 作品故事 */}
          <section className="max-w-2xl mx-auto py-20">
            <h2 className="text-center text-sm font-light tracking-[0.15em] text-yun-text/40 mb-10">作品故事</h2>
            <div className="text-sm leading-loose text-yun-text/70 space-y-4">
              {product.story.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-yun-grey/30">
              <p className="text-xs text-yun-text/30">
                材料清单：{product.materials}
              </p>
            </div>
          </section>

          {/* 购买原则 */}
          <section className="max-w-2xl mx-auto pb-20">
            <div className="bg-yun-white border border-yun rounded-brand p-8">
              <h3 className="text-sm font-light tracking-wider mb-4">允物承诺</h3>
              <ul className="text-xs text-yun-text/50 space-y-2">
                <li>· 不神化器物，不承诺转运、招财、改命</li>
                <li>· 如实物与描述不符，支持7天无理由退换</li>
                <li>· 每一件作品都配有详细材质说明</li>
              </ul>
            </div>
          </section>
        </div>
      </article>

      {/* 相关推荐 */}
      {related.length > 0 && (
        <section className="pb-24">
          <div className="container-brand">
            <h2 className="text-center text-sm font-light tracking-[0.15em] text-yun-text/40 mb-12">
              同序推荐
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {related.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group">
                  <div className="aspect-[3/4] bg-yun-grey/20 rounded-brand mb-4 flex items-center justify-center">
                    <span className="text-5xl font-display text-yun-text/20">{p.name.charAt(0)}</span>
                  </div>
                  <h3 className="text-base font-light tracking-wider mb-1 group-hover:text-yun-accent transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-yun-text/50">¥{p.salePrice.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export const revalidate = 3600;
