import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import BuyButton from './BuyButton';
import SectionWrapper from '@/components/ui/SectionWrapper';
import ProductGallery from '@/components/ui/ProductGallery';
import { getPublishedProduct, getPublishedProducts } from '@/lib/product-os';
import { getSeoConfig, SITE_URL, toMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

// ── 动态 SEO Metadata ──
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);

  if (!product) return {};

  const productsSeo = await getSeoConfig('products');
  const title = `${product.name}｜允物`;
  const description = product.story || productsSeo.description;

  return toMetadata(productsSeo, {
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: product.coverImage || productsSeo.ogImage,
    canonical: `${SITE_URL}/products/${product.slug}`,
    keywords: [
      '允物', product.name, product.seriesName || '',
      product.objectCategory || '', '东方器物',
    ].filter(Boolean),
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);

  if (!product) notFound();

  // 相关作品：同序的其他作品
  const related = (await getPublishedProducts())
    .filter((p) => p.seriesId === product.seriesId && p.slug !== product.slug)
    .slice(0, 4);

  // ── JSON-LD 结构化数据 ──
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.story || product.theme || '',
    sku: product.code || '',
    offers: {
      '@type': 'Offer',
      price: product.salePrice,
      priceCurrency: 'CNY',
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    brand: {
      '@type': 'Brand',
      name: '允物',
    },
    ...(product.coverImage && { image: product.coverImage }),
  };

  return (
    <main className="bg-[var(--yun-paper)] min-h-screen">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pt-28">
        <SectionWrapper>
          {/* 面包屑 */}
          <nav className="flex items-center gap-2 text-xs text-[var(--yun-gray)] tracking-wider mb-12">
            <Link href="/" className="hover:text-[var(--yun-jade)] transition-colors">首页</Link>
            <span>/</span>
            <Link href={`/series/${product.seriesSlug}`} className="hover:text-[var(--yun-jade)] transition-colors">{product.seriesName}</Link>
            <span>/</span>
            <span className="text-[var(--yun-ink)]">{product.name}</span>
          </nav>

          {/* 产品布局 */}
          <div className="grid md:grid-cols-2 gap-16">
            {/* 左：产品相册 */}
            <ProductGallery
              images={[product.coverImage, ...product.gallery].filter(Boolean) as string[]}
              productName={product.name}
            />

            {/* 右：信息 */}
            <div className="flex flex-col justify-center">
              <span className="text-xs tracking-[0.15em] text-[var(--yun-jade)] bg-[var(--yun-jade)]/5 rounded-full px-3 py-1 inline-block w-fit mb-4">
                {product.seriesName}
              </span>
              <h1 className="text-3xl font-light tracking-[0.12em] text-[var(--yun-ink)] mb-3">{product.name}</h1>
              <p className="text-sm text-[var(--yun-gray)] tracking-wider mb-8">{product.theme}</p>

              <div className="space-y-4 mb-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-light tracking-wider text-[var(--yun-ink)]">¥{product.salePrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-[var(--yun-gray)]">SKU: {product.code}</p>
              </div>

              {/* 购买按钮 */}
              <BuyButton productSlug={product.slug} productName={product.name} price={product.salePrice} />

              {/* 材料 */}
              {product.materialsRelation.length > 0 && (
                <div className="mt-8 pt-8 border-t border-[var(--yun-border)]/30">
                  <h3 className="text-sm font-light tracking-wider text-[var(--yun-ink)] mb-3">材料</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.materialsRelation.map((pm) => (
                      <Link
                        key={pm.id}
                        href="/materials"
                        className="text-xs text-[var(--yun-jade)]/70 hover:text-[var(--yun-jade)] tracking-wider transition-colors"
                      >
                        {pm.material.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 库存 */}
              {product.stock <= 10 && product.stock > 0 && (
                <p className="text-xs text-[var(--yun-jade)]/60 mt-4">仅剩 {product.stock} 件</p>
              )}
            </div>
          </div>

          {/* 作品故事 */}
          <section className="max-w-2xl mx-auto py-20">
            <h2 className="text-center text-sm font-light tracking-[0.15em] text-[var(--yun-gray)] mb-10">作品故事</h2>
            <div className="text-sm leading-loose text-[var(--yun-ink)]/70 space-y-4">
              {product.story.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-[var(--yun-border)]/30">
              <p className="text-xs text-[var(--yun-gray)]">
                材料清单：{product.materials}
              </p>
            </div>
          </section>

          {/* 允许承诺 */}
          <section className="max-w-2xl mx-auto pb-20">
            <div className="bg-[var(--yun-hover)] border border-[var(--yun-border)]/20 rounded-[var(--yun-radius)] p-8">
              <h3 className="text-sm font-light tracking-wider text-[var(--yun-ink)] mb-4">允物承诺</h3>
              <ul className="text-xs text-[var(--yun-gray)] space-y-2">
                <li>· 不神化器物，不承诺转运、招财、改命</li>
                <li>· 如实物与描述不符，支持7天无理由退换</li>
                <li>· 每一件作品都配有详细材质说明</li>
              </ul>
            </div>
          </section>
        </SectionWrapper>
      </article>

      {/* 相关推荐 */}
      {related.length > 0 && (
        <SectionWrapper className="bg-[var(--yun-hover)]">
          <h2 className="text-center text-sm font-light tracking-[0.15em] text-[var(--yun-gray)] mb-12">
            同序推荐
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {related.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="group">
                <div className="aspect-[3/4] bg-[var(--yun-paper)] rounded-[var(--yun-radius)] mb-4 flex items-center justify-center border border-[var(--yun-border)]/10 hover:-translate-y-1 hover:shadow-[var(--yun-shadow-hover)] transition-all duration-300">
                  <span className="text-5xl font-display text-[var(--yun-ink)]/10 group-hover:text-[var(--yun-jade)]/20 transition-colors">{p.name.charAt(0)}</span>
                </div>
                <h3 className="text-base font-light tracking-wider text-[var(--yun-ink)] mb-1 group-hover:text-[var(--yun-jade)] transition-colors">
                  {p.name}
                </h3>
                <p className="text-sm text-[var(--yun-gray)]">¥{p.salePrice.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </SectionWrapper>
      )}
    </main>
  );
}

export const revalidate = 3600;
