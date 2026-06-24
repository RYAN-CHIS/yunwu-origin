import Link from 'next/link';

// Cross Sell Section — 搭配推荐
interface CrossSellItem {
  targetId: number;
  reason: string | null;
  target: {
    slug: string;
    name: string;
    salePrice: number;
    coverImage: string | null;
  };
}

export default function CrossSellSection({ crossSells }: { crossSells: CrossSellItem[] }) {
  if (!crossSells.length) return null;

  return (
    <section className="py-16 border-b border-[var(--yun-border)]/20">
      <h2 className="text-[11px] tracking-[0.15em] text-[var(--yun-gray)] mb-10 text-center">搭配推荐</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {crossSells.map((cs) => (
          <Link
            key={cs.targetId}
            href={`/products/${cs.target.slug}`}
            className="group flex items-center gap-6 bg-[var(--yun-hover)] rounded-[var(--yun-radius)] p-6 border border-transparent hover:border-[var(--yun-border)]/30 transition-all duration-300"
          >
            {/* 缩略图占位 */}
            <div className="w-20 h-20 rounded-lg bg-[var(--yun-paper)] flex items-center justify-center flex-shrink-0 border border-[var(--yun-border)]/10">
              <span className="text-3xl font-display text-[var(--yun-gray)]/20 group-hover:text-[var(--yun-jade)]/30 transition-colors">
                {cs.target.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-sm tracking-[0.08em] text-[var(--yun-ink)] group-hover:text-[var(--yun-jade)] transition-colors">
                {cs.target.name}
              </h3>
              {cs.reason && (
                <p className="text-[10px] tracking-[0.06em] text-[var(--yun-gray)] mt-1">
                  {cs.reason}
                </p>
              )}
              <p className="text-xs text-[var(--yun-gray)] mt-1">
                ¥{cs.target.salePrice.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
