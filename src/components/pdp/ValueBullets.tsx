// Value Bullets — 价值主张 4 列展示
interface Props {
  bullets: string[];
}

const bulletIcons: Record<string, string> = {
  '纯': '✧',
  '小': '◈',
  '天': '○',
  '件': '◇',
};

export default function ValueBullets({ bullets }: Props) {
  if (!bullets.length) return null;

  return (
    <section className="py-16 border-b border-[var(--yun-border)]/20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--yun-border)]/20">
        {bullets.map((bullet, i) => {
          const icon = bulletIcons[bullet.charAt(0)] || '·';
          return (
            <div
              key={i}
              className="bg-[var(--yun-paper)] py-8 px-6 flex flex-col items-center text-center gap-3 reveal-on-scroll"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-xl text-[var(--yun-jade)]/60 font-display italic select-none">{icon}</span>
              <span className="text-xs tracking-[0.12em] text-[var(--yun-ink)]/70 leading-relaxed">
                {bullet}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
