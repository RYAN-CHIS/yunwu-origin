// Ritual Card — 仪式情境展示
interface RitualData {
  ritualType: string | null;
  ritualFunction: string | null;
  ritualEmotion: string | null;
  ritualContext: string | null;
}

const fields = [
  { key: 'ritualType' as const, label: '仪式类型', icon: '◈' },
  { key: 'ritualFunction' as const, label: '象征意义', icon: '◇' },
  { key: 'ritualEmotion' as const, label: '心境', icon: '○' },
  { key: 'ritualContext' as const, label: '日常场景', icon: '✧' },
];

export default function RitualCard({ data }: { data: RitualData }) {
  const items = fields.filter((f) => data[f.key]);

  if (!items.length) return null;

  return (
    <section className="py-16 border-b border-[var(--yun-border)]/20">
      <h2 className="text-[11px] tracking-[0.15em] text-[var(--yun-gray)] mb-10 text-center">仪 式</h2>
      <div className="bg-[var(--yun-hover)] rounded-[var(--yun-radius)] p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-10">
          {items.map(({ key, label, icon }) => (
            <div key={key} className="flex items-start gap-4 reveal-on-scroll">
              <span className="text-lg text-[var(--yun-jade)]/50 font-display italic mt-0.5 select-none">{icon}</span>
              <div>
                <span className="text-[10px] tracking-[0.12em] text-[var(--yun-gray)] block mb-1">{label}</span>
                <span className="text-sm tracking-[0.06em] text-[var(--yun-ink)]/80 leading-relaxed">
                  {data[key]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
