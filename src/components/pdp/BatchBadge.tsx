// Batch Badge — 批次追踪展示
interface BatchData {
  batchNumber: string;
  batchTotal: number;
  remaining: number;
}

export default function BatchBadge({ batch }: { batch: BatchData | null }) {
  if (!batch) return null;

  return (
    <section className="py-10 border-b border-[var(--yun-border)]/20">
      <div className="flex items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-3 px-5 py-3 border border-[var(--yun-border)]/30 rounded-full bg-[var(--yun-paper)]">
          <span className="text-[11px] tracking-[0.12em] text-[var(--yun-gray)]">
            批次
          </span>
          <span className="w-px h-4 bg-[var(--yun-border)]/30" />
          <span className="text-xs tracking-[0.06em] text-[var(--yun-ink)]/80 font-mono">
            Batch {batch.batchNumber}
          </span>
        </div>
        <span className="text-[10px] tracking-[0.08em] text-[var(--yun-border)]">/</span>
        <div className="flex items-center gap-2 text-[11px] tracking-[0.1em] text-[var(--yun-gray)]">
          <span>共{batch.batchTotal}件</span>
          <span>·</span>
          <span className="text-[var(--yun-jade)]">{batch.remaining}件余</span>
        </div>
      </div>
    </section>
  );
}
