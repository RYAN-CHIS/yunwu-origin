/**
 * PDP 首批真实产品 Seed
 *
 * 创建 7 序 + 3 个核心产品 + 各批次
 * 运行: npx tsx prisma/seed-pdp.mts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌿 允物 PDP Seed — 首批真实产品\n');

  // ── 1. 创建七序 ──
  const seriesData = [
    { slug: 'fuchu', name: '芙初', description: '人生最珍贵的状态，不是成功，而是第一次看见世界时的欢喜。', sortOrder: 1 },
    { slug: 'qichi', name: '栖迟', description: '允许自己停下来，允许自己不那么着急。', sortOrder: 2 },
    { slug: 'fusu', name: '扶苏', description: '向阳而生，成为更好的自己。', sortOrder: 3 },
    { slug: 'cangming', name: '沧溟', description: '从关注自己，到连接更大的世界。', sortOrder: 4 },
    { slug: 'jiming', name: '既明', description: '看见世界之后，开始看见自己。', sortOrder: 5 },
    { slug: 'guanfu', name: '观复', description: '看遍繁华，终归本心。', sortOrder: 6 },
    { slug: 'cangzhen', name: '藏真', description: '最终留下的，只有真实。', sortOrder: 7 },
  ];

  const seriesMap = new Map<string, number>();
  for (const s of seriesData) {
    const existing = await prisma.series.findUnique({ where: { slug: s.slug } });
    if (existing) {
      seriesMap.set(s.slug, existing.id);
      console.log(`  ↪ 序已存在: ${s.name} (id=${existing.id})`);
    } else {
      const created = await prisma.series.create({ data: s });
      seriesMap.set(s.slug, created.id);
      console.log(`  ✓ 创建序: ${s.name}`);
    }
  }

  // ── 2. 创建 3 个核心产品 ──

  // ── 龙泉青瓷杯（观复·CERAMIC）──
  const celadonCup = await createOrUpdateProduct({
    sku: 'LQ-CELADON-001',
    name: '龙泉青瓷杯',
    slug: 'longquan-celadon-cup',
    seriesSlug: 'guanfu',
    objectCategory: 'CERAMIC',
    theme: '温润如玉，静谧如初',
    story: `龙泉青瓷，始于三国，盛于南宋。

一枚青瓷杯，从取土到出窑，历时三个月。

取龙泉本地紫金土，经淘洗、陈腐、揉泥，方得一杯之胎。

手工拉坯，在辘轳车上，匠人以掌心感受泥土的旋转。每一道弧线，都是人与材料的对话。

施以梅子青釉——龙泉青瓷最经典的釉色。多次施釉，层层叠加，在 1300°C 的还原焰中，釉面呈现出温润如玉的质感。

出窑的那一刻，青色从火中浮现。

温润，静谧。不张扬，却让人忍不住多看几眼。

这就是龙泉青瓷。这就是允物选择它的理由。`,
    salePrice: 699,
    stock: 18,
    valueBullets: JSON.stringify([
      '纯手工拉坯成型',
      '小批次限量制作',
      '天然原矿紫金土',
      '件件开片纹理独一无二',
    ]),
    craftMaterial: '龙泉原矿紫金土',
    craft: '手工拉坯',
    craftOrigin: '浙江龙泉',
    craftTechnique: '多次施釉 · 还原焰 1300°C 烧制',
    craftFinish: '梅子青釉 · 温润如玉 · 自然开片',
    ritualType: '品茗 · 静观',
    ritualFunction: '安定心神 · 回归当下',
    ritualEmotion: '静 · 安 · 宁',
    ritualContext: '一日一茶 · 独处时光 · 晨起第一杯',
  }, seriesMap);

  // ── 青田石印章（既明·SEAL）──
  const qingtianSeal = await createOrUpdateProduct({
    sku: 'QT-SEAL-001',
    name: '青田石印章',
    slug: 'qingtian-seal',
    seriesSlug: 'jiming',
    objectCategory: 'SEAL',
    theme: '一方印，一个立场',
    story: `印章，是人与文字之间最亲密的器物。

青田石，产于浙江青田，中国四大印章石之一。石质温润细腻，刀感爽利，是篆刻家钟爱的材料。

每一方印章，都由匠人手工篆刻。

从选石、磨平、设计印稿、水印上石，到执刀刻制——冲刀、切刀、双刀，每一种刀法都决定了线条的气质。

刻完后，手工打磨至镜面般光滑。

它不是用来观看的，是用来"留下"的。

刻下你的字，就是刻下你的态度。`,
    salePrice: 899,
    stock: 12,
    valueBullets: JSON.stringify([
      '纯手工篆刻',
      '青田原石（封门青）',
      '可定制印文',
      '每方独一无二',
    ]),
    craftMaterial: '浙江青田石（封门青）',
    craft: '手工篆刻',
    craftOrigin: '浙江青田',
    craftTechnique: '冲刀 · 切刀 · 双刀 · 手工打磨',
    craftFinish: '镜面抛光 · 朱砂印泥适配',
    ritualType: '铭志 · 留痕',
    ritualFunction: '确认自我立场',
    ritualEmotion: '定 · 立 · 真',
    ritualContext: '书房案头 · 重要决定时 · 新年伊始',
  }, seriesMap);

  // ── 檀香（栖迟·INCENSE）──
  const sandalwood = await createOrUpdateProduct({
    sku: 'SD-INCENSE-001',
    name: '檀香',
    slug: 'sandalwood-incense',
    seriesSlug: 'qichi',
    objectCategory: 'INCENSE',
    theme: '一缕烟，心安处',
    story: `檀香，是东方最古老的香气之一。

允物选用的老山檀香木，产自印度迈索尔地区，树龄超过六十年，采伐后陈化十年以上。

陈化的过程，是檀香木去燥存醇的过程。新伐的檀香木香气浓烈刺鼻，经过十年以上的自然陈化，木质中的油脂逐渐稳定，香气变得醇厚悠长，层次丰富。

古法冷压成型——不添加任何化学粘合剂，仅以檀香木粉自身的油脂粘合。

点燃时，烟雾轻缓升起，香气纯净清透。

一缕烟，是空间与时间的边界。`,
    salePrice: 399,
    stock: 35,
    valueBullets: JSON.stringify([
      '天然老山檀香木',
      '陈化十年以上',
      '古法冷压 · 无化学添加',
      '可持续森林取材',
    ]),
    craftMaterial: '印度老山檀香木（迈索尔）',
    craft: '古法冷压成型',
    craftOrigin: '印度迈索尔',
    craftTechnique: '陈化十年 · 冷压成型 · 自然阴干',
    craftFinish: '天然木香 · 醇厚悠长 · 无烟处理',
    ritualType: '焚香 · 静坐',
    ritualFunction: '净化空间 · 安神定心',
    ritualEmotion: '缓 · 静 · 清',
    ritualContext: '冥想时刻 · 睡前仪式 · 阅读时光 · 茶席',
  }, seriesMap);

  // ── 3. 创建各产品批次 ──
  const batchData = [
    { productId: celadonCup.id,   batchNumber: '01', batchTotal: 50, remaining: 18 },
    { productId: qingtianSeal.id, batchNumber: '03', batchTotal: 30, remaining: 12 },
    { productId: sandalwood.id,   batchNumber: '02', batchTotal: 100, remaining: 35 },
  ];

  for (const b of batchData) {
    const existing = await prisma.batch.findFirst({
      where: { productId: b.productId, batchNumber: b.batchNumber },
    });
    if (existing) {
      await prisma.batch.update({
        where: { id: existing.id },
        data: b,
      });
    } else {
      await prisma.batch.create({ data: b });
    }
  }
  console.log('  ✓ 创建各产品批次');

  console.log('\n✅ 3 个核心产品 + 批次已就绪');
  console.log(`   ${celadonCup.name}  (id=${celadonCup.id}, 观复·CERAMIC)`);
  console.log(`   ${qingtianSeal.name} (id=${qingtianSeal.id}, 既明·SEAL)`);
  console.log(`   ${sandalwood.name}   (id=${sandalwood.id}, 栖迟·INCENSE)`);
}

// ── 辅助函数：创建或更新产品 ──
async function createOrUpdateProduct(
  data: {
    sku: string;
    name: string;
    slug: string;
    seriesSlug: string;
    objectCategory: string;
    theme: string;
    story: string;
    salePrice: number;
    stock: number;
    valueBullets: string;
    craftMaterial: string | null;
    craft: string | null;
    craftOrigin: string | null;
    craftTechnique: string | null;
    craftFinish: string | null;
    ritualType: string | null;
    ritualFunction: string | null;
    ritualEmotion: string | null;
    ritualContext: string | null;
  },
  seriesMap: Map<string, number>,
) {
  const seriesId = seriesMap.get(data.seriesSlug);
  if (!seriesId) throw new Error(`Series not found: ${data.seriesSlug}`);

  const payload = {
    sku: data.sku,
    name: data.name,
    slug: data.slug,
    seriesId,
    objectCategory: data.objectCategory as any,
    theme: data.theme,
    story: data.story,
    salePrice: data.salePrice,
    stock: data.stock,
    status: 'PUBLISHED',
    valueBullets: data.valueBullets,
    craftMaterial: data.craftMaterial,
    craft: data.craft,
    craftOrigin: data.craftOrigin,
    craftTechnique: data.craftTechnique,
    craftFinish: data.craftFinish,
    ritualType: data.ritualType,
    ritualFunction: data.ritualFunction,
    ritualEmotion: data.ritualEmotion,
    ritualContext: data.ritualContext,
  };

  const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existing) {
    await prisma.product.update({ where: { id: existing.id }, data: payload });
    console.log(`  ↪ 更新产品: ${data.name}`);
    return { ...existing, ...payload };
  }
  const created = await prisma.product.create({ data: payload });
  console.log(`  ✓ 创建产品: ${data.name}`);
  return created;
}

main()
  .catch((err) => {
    console.error('❌ Seed 失败:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
