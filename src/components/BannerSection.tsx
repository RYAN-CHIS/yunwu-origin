import Link from "next/link";
import { getPublishedBannersByPlacement, type BannerRecord } from "@/lib/banners";
import { SectionWrapper } from "@/components/ui";

/**
 * 统一 Banner 展示位（服务端组件）。
 *
 * 仅渲染后台已发布且当前时间有效的 Banner，按 placement 区分页面区域。
 * - 支持零条（不渲染任何内容）、一条、多条。
 * - 多条时纵向堆叠，不引入轮播/复杂动画。
 * - 移动端优先使用 mobile_image_url，缺省回退 image_url。
 * - 仅当 link_url 存在时整体可点击（CTA）。
 * - 图片必须包含 alt。
 */
export default async function BannerSection({
  placement,
}: {
  placement: string;
}) {
  let banners: BannerRecord[] = [];
  try {
    banners = await getPublishedBannersByPlacement(placement);
  } catch {
    banners = [];
  }
  if (!banners.length) return null;

  return (
    <SectionWrapper>
      <div className="grid gap-6">
        {banners.map((b) => {
          const img = b.mobile_image_url || b.image_url;
          if (!img) return null; // 缺少图片的 Banner 不渲染，避免破图

          const inner = (
            <div className="relative w-full overflow-hidden rounded-[var(--yun-radius)] border border-[var(--yun-border)]/20 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={b.title || "Banner"}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                style={{ maxHeight: 460 }}
              />
              {(b.title || b.subtitle) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/25">
                  {b.title && (
                    <h2 className="text-2xl md:text-4xl font-light tracking-[0.15em] text-white mb-3 drop-shadow">
                      {b.title}
                    </h2>
                  )}
                  {b.subtitle && (
                    <p className="text-sm md:text-base text-white/90 mb-5 drop-shadow">
                      {b.subtitle}
                    </p>
                  )}
                  {b.link_url && (
                    <span className="inline-block px-6 py-2 border border-white/80 text-white text-sm tracking-wider rounded hover:bg-white hover:text-[var(--yun-ink)] transition-colors">
                      {b.btn_text || "了解更多"}
                    </span>
                  )}
                </div>
              )}
            </div>
          );

          return (
            <div key={b.id}>
              {b.link_url ? (
                <Link href={b.link_url} aria-label={b.title || "Banner"}>
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
