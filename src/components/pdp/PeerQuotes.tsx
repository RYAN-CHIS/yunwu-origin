// Peer Quotes — 同行者引用 & UGC
interface PeerQuote {
  id: number;
  quote: string;
  author: string | null;
  source: string | null;
  imageUrl: string | null;
}

export default function PeerQuotes({ quotes }: { quotes: PeerQuote[] }) {
  if (!quotes.length) return null;

  return (
    <section className="py-16 border-b border-[var(--yun-border)]/20">
      <h2 className="text-[11px] tracking-[0.15em] text-[var(--yun-gray)] mb-10 text-center">同行者说</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quotes.map((q, i) => (
          <div
            key={q.id}
            className="bg-[var(--yun-hover)] rounded-[var(--yun-radius)] p-8 reveal-on-scroll"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {q.imageUrl && (
              <div className="w-full aspect-[4/3] rounded-lg mb-5 overflow-hidden bg-[var(--yun-border)]/10">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl text-[var(--yun-gray)]/20 font-display italic">UGC</span>
                </div>
              </div>
            )}
            <p className="text-sm tracking-[0.06em] text-[var(--yun-ink)]/70 leading-relaxed mb-4 italic">
              &ldquo;{q.quote}&rdquo;
            </p>
            {q.author && (
              <p className="text-[10px] tracking-[0.12em] text-[var(--yun-gray)]">
                — {q.author}
                {q.source && <span> · {q.source}</span>}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
