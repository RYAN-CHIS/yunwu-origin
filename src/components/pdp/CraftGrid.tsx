// Craft Grid — 工艺信息 5 列展示
interface CraftData {
  craftMaterial: string | null;
  craft: string | null;
  craftOrigin: string | null;
  craftTechnique: string | null;
  craftFinish: string | null;
}

const labels = [
  { key: 'craftMaterial' as const, label: '材料' },
  { key: 'craft' as const, label: '工艺' },
  { key: 'craftOrigin' as const, label: '产地' },
  { key: 'craftTechnique' as const, label: '技法' },
  { key: 'craftFinish' as const, label: '质感' },
];

export default function CraftGrid({ data }: { data: CraftData }) {
  const items = labels.filter((l) => data[l.key]);

  if (!items.length) return null;

  return (
    <section className="py-16 border-b border-[var(--yun-border)]/20">
      <h2 className="text-[11px] tracking-[0.15em] text-[var(--yun-gray)] mb-10 text-center">工 艺</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {items.map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-2 reveal-on-scroll">
            <div className="w-6 h-[1px] bg-[var(--yun-jade)]/40 mb-1" />
            <span className="text-[10px] tracking-[0.12em] text-[var(--yun-gray)] uppercase">{label}</span>
            <span className="text-sm tracking-[0.06em] text-[var(--yun-ink)]/80 leading-relaxed">
              {data[key]}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
