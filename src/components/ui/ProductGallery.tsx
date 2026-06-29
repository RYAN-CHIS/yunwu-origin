"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  /** All available images (coverImage + gallery[]), pre-combined & filtered */
  images: string[];
  /** Product name for fallback text & alt text */
  productName: string;
}

/**
 * ProductGallery — Interactive gallery for the PDP Hero area.
 *
 * Features:
 * - Main image display (covers full aspect-[3/4] area)
 * - Thumbnail strip for multi-image navigation
 * - Mobile swipe gesture (touch start / end delta > 50px)
 * - Fallback to product name first character when no images
 * - Image wraps around (previous from first → last, next from last → first)
 */
export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);

  const allImages = images.filter(Boolean);
  const hasMultiple = allImages.length > 1;
  const currentImage = allImages[activeIndex] ?? null;

  // ── No images → character fallback ──
  if (!allImages.length) {
    return (
      <div className="aspect-[3/4] bg-[var(--yun-hover)] rounded-[var(--yun-radius)] flex items-center justify-center">
        <span className="text-[12rem] leading-none font-display text-[var(--yun-ink)]/5 select-none">
          {productName.charAt(0)}
        </span>
      </div>
    );
  }

  // ── Navigation helpers ──
  const goTo = (index: number) => {
    if (index < 0) index = allImages.length - 1;
    if (index >= allImages.length) index = 0;
    setActiveIndex(index);
  };

  // ── Mobile swipe ──
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      goTo(activeIndex + (delta > 0 ? 1 : -1));
    }
  };

  return (
    <div className="space-y-3">
      {/* ══ Main image ══ */}
      <div
        className="aspect-[3/4] bg-[var(--yun-hover)] rounded-[var(--yun-radius)] overflow-hidden relative cursor-pointer select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={currentImage}
          alt={`${productName} — ${activeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority={activeIndex === 0}
        />
      </div>

      {/* ══ Thumbnails (only when > 1 image) ══ */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-[var(--yun-border)]">
          {allImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                i === activeIndex
                  ? "border-[var(--yun-jade)] opacity-100 shadow-sm"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
              aria-label={`${productName} — 第 ${i + 1} 张图`}
            >
              <Image
                src={img}
                alt={`${productName} — ${i + 1}`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
