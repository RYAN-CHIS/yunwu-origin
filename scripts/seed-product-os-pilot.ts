/**
 * Product OS V2.2 — 首批 3 个真实产品录入脚本
 *
 * 产品：
 * 1. Longquan Celadon Cup（龙泉青瓷杯）— 既明序
 * 2. Qingtian Seal（青田石印）— 芙初序
 * 3. Sandalwood Incense（老山檀线香）— 既明序
 *
 * 依赖：V2.2 Prisma schema 已 push（含 Batch / RitualTaxonomy / CustomerQuote / CrossSellRelation）
 * 执行：npx tsx scripts/seed-product-os-pilot.ts
 */

import { PrismaClient } from "@prisma/client";
type LifecycleStatus = "DRAFT" | "DESIGNING" | "READY" | "ACTIVE" | "PAUSED" | "ARCHIVED";

const prisma = new PrismaClient();

function buildBatchCode(productCode: string, serialNumber: string, batchNumber: number) {
  const match = serialNumber.match(/^([A-Z]+)-(\d{4})-(\d{3})$/);
  if (!match) {
    throw new Error(`Invalid serialNumber for batchCode: ${serialNumber}`);
  }

  const [, serialPrefix, year, sequence] = match;
  const productPrefix = productCode.split("-")[0];
  if (serialPrefix !== productPrefix) {
    throw new Error(`Product code and serialNumber prefix mismatch: ${productCode} / ${serialNumber}`);
  }

  return `BATCH-${productPrefix}-${year}-${sequence}-${String(batchNumber).padStart(2, "0")}`;
}

async function main() {
  console.log("🌱 Product OS V2.2 — 首批 3 个产品录入\n");

  // ── Step 0: Ensure RitualTaxonomy seed data exists ──
  console.log("📦 Step 0: 确保 RitualTaxonomy 种子数据存在...");

  const rituals = [
    {
      code: "RITUAL-TEA",
      ritualType: "品茗 · 茶事",
      symbolicFunction: "定神 · 专注",
      emotionalState: "宜于独处静思之时",
      dailyContext: "午后独饮 / 友人小聚",
      description: "茶事仪式，以器物承载茶之真味，助饮者回归当下。",
    },
    {
      code: "RITUAL-SEAL",
      ritualType: "篆刻 · 印信",
      symbolicFunction: "铭记 · 立信",
      emotionalState: "宜于郑重落笔之时",
      dailyContext: "书房提跋 / 书画落款",
      description: "以印为信，每一次钤盖都是一次郑重的确认。",
    },
    {
      code: "RITUAL-INCENSE",
      ritualType: "焚香 · 静心",
      symbolicFunction: "清心 · 澄意",
      emotionalState: "宜于焚香静坐之时",
      dailyContext: "晨起一炷 / 夜深静室",
      description: "香气无形却有质，以味道连接内心与空间。",
    },
    {
      code: "RITUAL-WRITING",
      ritualType: "书案 · 笔墨",
      symbolicFunction: "抒怀 · 寄情",
      emotionalState: "宜于提笔书怀之时",
      dailyContext: "书房独处 / 信札往来",
      description: "笔墨之间，是思绪与心绪的流淌。",
    },
    {
      code: "RITUAL-DAILY",
      ritualType: "日用 · 随身",
      symbolicFunction: "陪伴 · 观照",
      emotionalState: "宜于日常随身之时",
      dailyContext: "通勤路上 / 办公案头",
      description: "器物入日常，提醒人在忙碌中不忘观照自己。",
    },
    {
      code: "RITUAL-GIFT",
      ritualType: "赠礼 · 寄意",
      symbolicFunction: "寄托 · 致意",
      emotionalState: "宜于赠予珍重之人时",
      dailyContext: "佳节赠礼 / 致谢友人",
      description: "以器物代言语，赠予值得珍重的人。",
    },
  ];

  const ritualMap: Record<string, number> = {};
  for (const r of rituals) {
    const ritual = await prisma.ritualTaxonomy.upsert({
      where: { code: r.code },
      update: {
        ritualType: r.ritualType,
        symbolicFunction: r.symbolicFunction,
        emotionalState: r.emotionalState,
        dailyContext: r.dailyContext,
        description: r.description,
      },
      create: r,
    });
    ritualMap[r.code] = ritual.id;
    console.log(`   ✅ Ritual: ${r.code}`);
  }
  console.log(`   ✅ RitualTaxonomy 就绪 (${Object.keys(ritualMap).length} 条)\n`);

  // ── Step 1: Ensure Series exist ──
  console.log("📦 Step 1: 确保 Series 存在...");
  const seriesDefs = [
    { code: "fuchu", name: "芙初", sortOrder: 1 },
    { code: "qichi", name: "栖迟", sortOrder: 2 },
    { code: "fusu", name: "扶苏", sortOrder: 3 },
    { code: "cangming", name: "沧溟", sortOrder: 4 },
    { code: "jiming", name: "既明", sortOrder: 5 },
    { code: "guanfu", name: "观复", sortOrder: 6 },
    { code: "cangzhen", name: "藏真", sortOrder: 7 },
  ];

  const seriesMap: Record<string, number> = {};
  for (const s of seriesDefs) {
    const series = await prisma.series.upsert({
      where: { code: s.code },
      update: { name: s.name, sortOrder: s.sortOrder },
      create: s,
    });
    seriesMap[s.code] = series.id;
    console.log(`   ✅ Series: ${s.name} (${s.code})`);
  }
  console.log(`   ✅ Series 就绪\n`);

  // ── Step 2: 录入 3 个产品 ──
  console.log("📦 Step 2: 录入 3 个产品...\n");

  type ProductDef = {
    productCode: string;
    seriesCode: string;
    workName: string;
    workCode: string;
    productName: string;
    status: LifecycleStatus;
    description: string;
    valueBullets: string[];
    materialOrigin: string;
    craftMethod: string;
    originPlace: string;
    technique: string;
    finish: string;
    completionDate: Date;
    serialNumber: string;
    creationStory: string;
    emotionalState: string;
    artisanStory: string;
    ritualCode: string;
    batchNumber: number;
    batchTotal: number;
    batchRemaining: number;
    skuName: string;
    skuPrice: number;
    companionsCount: number;
    quotes: { customerName: string; content: string }[];
    crossSells: { toProductCode: string; reason: string }[];
  };

  const products: ProductDef[] = [
    // ═══════════════════════════════════════
    // 1. 龙泉青瓷杯 — 既明序
    // ═══════════════════════════════════════
    {
      productCode: "LC-001",
      seriesCode: "jiming",
      workName: "青瓷",
      workCode: "W-JIMING-CELADON",
      productName: "龙泉青瓷杯",
      status: LifecycleStatus.ACTIVE,
      description:
        "取龙泉梅子青釉色，手工拉坯成型，每一只杯子的釉色变化都是窑火与时间的独白。",
      valueBullets: [
        "手工拉坯成型",
        "龙泉原矿釉料",
        "1300°C 高温还原焰",
        "每件釉色独一无二",
        "一器一世界",
      ],
      materialOrigin: "龙泉原矿紫金土",
      craftMethod: "手工拉坯",
      originPlace: "浙江·龙泉",
      technique: "跳刀纹装饰",
      finish: "素烧 → 施梅子青釉 → 还原焰 1300°C",
      completionDate: new Date("2026-06-15"),
      serialNumber: "LC-2026-001",
      creationStory:
        "此杯取法宋代龙泉窑之韵致，不求形似，而在釉色之温润。梅子青，是青瓷中最难烧成的釉色之一，需在还原气氛中精确控制窑温与冷却曲线。每一只杯子的釉色深浅、气泡密度、开片纹理皆不相同——这正是火的不可控性带来的生命感。",
      emotionalState: "宜于独处静思之时",
      artisanStory:
        "陈师傅，龙泉青瓷非遗传承人，从业 35 年。他的拉坯台前挂着同一句话：「泥是有生命的，你要做的不是塑造它，是帮助它成为它想成为的样子。」",
      ritualCode: "RITUAL-TEA",
      batchNumber: 1,
      batchTotal: 50,
      batchRemaining: 32,
      skuName: "龙泉青瓷杯 · 梅子青",
      skuPrice: 680,
      companionsCount: 18,
      quotes: [
        {
          customerName: "林先生",
          content:
            "杯中茶汤映着梅子青的釉色，像是把春天的光收在了掌心。每次用这只杯子喝茶，都提醒自己慢下来。",
        },
        {
          customerName: "苏女士",
          content:
            "第一次用青瓷杯喝茶，被釉面的温润触感惊艳到。每一只都不一样的釉色变化很奇妙，像是在和火对话。",
        },
      ],
      crossSells: [
        { toProductCode: "SI-001", reason: "同属既明序 · 茶事与焚香，静心之境相辅相成" },
      ],
    },

    // ═══════════════════════════════════════
    // 2. 青田石印 — 芙初序
    // ═══════════════════════════════════════
    {
      productCode: "QTS-001",
      seriesCode: "fuchu",
      workName: "石印",
      workCode: "W-FUCHU-SEAL",
      productName: "青田石印",
      status: LifecycleStatus.ACTIVE,
      description:
        "取浙江青田封门青石材，质地温润如玉，以传统篆刻刀法精心刻制。一印一世界，方寸之间见天地。",
      valueBullets: [
        "青田封门青老料",
        "手工篆刻",
        "每印独一无二",
        "方正之间见天地",
        "可定制印文",
      ],
      materialOrigin: "浙江青田 · 封门青",
      craftMethod: "手工篆刻",
      originPlace: "浙江·青田",
      technique: "冲刀法 + 切刀法",
      finish: "粗雕 → 细刻 → 抛光 → 上油养护",
      completionDate: new Date("2026-06-10"),
      serialNumber: "QTS-2026-001",
      creationStory:
        "青田石自宋代即入印材，封门青更被金石家誉为「石中君子」。此印选材不求大，而在质之纯、润之透。篆刻一道，七分在思、三分在刻——印文布局先于刀法，方寸之间的疏密、方圆、朱白的平衡，是一枚印章的灵魂所在。",
      emotionalState: "宜于郑重落笔之时",
      artisanStory:
        "王老师，西泠印社社员，治印 40 年。他说：「刻印如修心，每一刀都是不可逆的，所以下刀之前要想清楚——做人也是这个道理。」",
      ritualCode: "RITUAL-SEAL",
      batchNumber: 1,
      batchTotal: 30,
      batchRemaining: 15,
      skuName: "青田石印 · 封门青",
      skuPrice: 1280,
      companionsCount: 15,
      quotes: [
        {
          customerName: "周先生",
          content:
            "拿到印章的那一刻就被石头的温润感打动了。封门青的质地确实名不虚传，刻出来的印文线条干净利落。",
        },
        {
          customerName: "陈女士",
          content:
            "定制了一枚闲章送给父亲，他喜欢得不得了。说现在的印章大多是机器刻的，手刻的线条是有温度的。",
        },
      ],
      crossSells: [
        { toProductCode: "LC-001", reason: "书案之上，品茗与钤印同属静心之习" },
        { toProductCode: "SI-001", reason: "焚香静心后，落笔更从容" },
      ],
    },

    // ═══════════════════════════════════════
    // 3. 老山檀线香 — 既明序
    // ═══════════════════════════════════════
    {
      productCode: "SI-001",
      seriesCode: "jiming",
      workName: "檀香",
      workCode: "W-JIMING-INCENSE",
      productName: "老山檀线香",
      status: LifecycleStatus.ACTIVE,
      description:
        "取印度迈索尔老山檀，经传统合香工艺制成。香气醇厚而不烈，留香悠长，是焚香静心之上选。",
      valueBullets: [
        "印度迈索尔老山檀",
        "30 年陈化木料",
        "传统合香工艺",
        "无化学添加",
        "醇厚悠长",
      ],
      materialOrigin: "印度 · 迈索尔老山檀",
      craftMethod: "传统合香工艺",
      originPlace: "印度 · 迈索尔",
      technique: "研磨 → 过筛 → 合香 → 挤压成型 → 阴干",
      finish: "去除边皮 → 打粉 → 120目过筛 → 陈化 → 合香成型 → 自然阴干",
      completionDate: new Date("2026-06-01"),
      serialNumber: "SI-2026-001",
      creationStory:
        "老山檀以印度迈索尔所产为最上，因其树龄愈老，油脂愈厚，香气愈醇。此香选用 30 年以上树龄之老料，去其边皮，只取芯材，经传统合香之法——檀香为主，辅以微量天然黏粉，不添任何化学香精。香气初闻如山间晨雾，继而转为乳脂般的醇厚，余韵是清冽的木香。",
      emotionalState: "宜于焚香静坐之时",
      artisanStory:
        "林师傅，合香世家第四代传人。他坚持每批香材至少陈化半年再使用：「香气的层次感，时间是唯一的催化剂。」",
      ritualCode: "RITUAL-INCENSE",
      batchNumber: 3,
      batchTotal: 200,
      batchRemaining: 85,
      skuName: "老山檀线香 · 30g 装",
      skuPrice: 198,
      companionsCount: 127,
      quotes: [
        {
          customerName: "吴先生",
          content:
            "点了一支，烟气很稳，香气醇而不呛。一直用到大半才舍得灭，第二天走进书房还能闻到淡淡的余香。",
        },
        {
          customerName: "赵女士",
          content:
            "朋友推荐的，果然没失望。老山檀的醇厚度和市面上的化学香完全不是一个层次。已经回购了。",
        },
      ],
      crossSells: [
        { toProductCode: "LC-001", reason: "茶配清香，同为既明序 · 静心之境" },
      ],
    },
  ];

  // ═══════════════════════════════════════
  // 录入逻辑
  // ═══════════════════════════════════════

  const productCodeMap: Record<string, number> = {}; // productCode → DB id

  // ── Step 2: Upsert Works / Products / SKU / Batch / Quote ──
  for (const def of products) {
    const seriesId = seriesMap[def.seriesCode];
    if (!seriesId) {
      throw new Error(`Series not found: ${def.seriesCode}`);
    }

    const ritualTaxonomyId = ritualMap[def.ritualCode];
    if (!ritualTaxonomyId) {
      throw new Error(`RitualTaxonomy not found: ${def.ritualCode}`);
    }

    const workData = {
      name: def.workName,
      seriesId,
      status: def.status,
      materialOrigin: def.materialOrigin,
      craftMethod: def.craftMethod,
      completionDate: def.completionDate,
      serialNumber: def.serialNumber,
      creationStory: def.creationStory,
      emotionalState: def.emotionalState,
      companionsCount: def.companionsCount,
      remainingQty: def.batchRemaining,
    };

    const work = await prisma.works.upsert({
      where: { code: def.workCode },
      update: workData,
      create: {
        code: def.workCode,
        ...workData,
      },
    });
    console.log(`  ✅ 作品: ${def.workName} (${def.workCode})`);

    const productData = {
      name: def.productName,
      workId: work.id,
      status: def.status,
      description: def.description,
      valueBullets: def.valueBullets,
      materialOrigin: def.materialOrigin,
      craftMethod: def.craftMethod,
      originPlace: def.originPlace,
      technique: def.technique,
      finish: def.finish,
      completionDate: def.completionDate,
      serialNumber: def.serialNumber,
      creationStory: def.creationStory,
      emotionalState: def.emotionalState,
      artisanStory: def.artisanStory,
      ritualTaxonomyId,
      companionsCount: def.companionsCount,
      remainingQty: def.batchRemaining,
    };

    const product = await prisma.products.upsert({
      where: { code: def.productCode },
      update: productData,
      create: {
        code: def.productCode,
        ...productData,
      },
    });
    console.log(`  ✅ 产品: ${def.productName} (${def.productCode})`);
    productCodeMap[def.productCode] = product.id;

    const skuCode = `${def.productCode}-S01`;
    await prisma.productSku.upsert({
      where: { code: skuCode },
      update: {
        name: def.skuName,
        productId: product.id,
        status: LifecycleStatus.ACTIVE,
        price: def.skuPrice,
        finishedStock: def.batchRemaining,
      },
      create: {
        code: skuCode,
        name: def.skuName,
        productId: product.id,
        status: LifecycleStatus.ACTIVE,
        price: def.skuPrice,
        finishedStock: def.batchRemaining,
      },
    });
    console.log(`  ✅ SKU: ${def.skuName} ¥${def.skuPrice}`);

    const batchCode = buildBatchCode(def.productCode, def.serialNumber, def.batchNumber);
    await prisma.batch.upsert({
      where: {
        productId_batchNumber: {
          productId: product.id,
          batchNumber: def.batchNumber,
        },
      },
      update: {
        batchCode,
        totalQty: def.batchTotal,
        remainingQty: def.batchRemaining,
      },
      create: {
        productId: product.id,
        batchNumber: def.batchNumber,
        batchCode,
        totalQty: def.batchTotal,
        remainingQty: def.batchRemaining,
      },
    });
    console.log(`  ✅ Batch: ${batchCode}`);

    for (const [index, q] of def.quotes.entries()) {
      const existingQuote = await prisma.customerQuote.findFirst({
        where: {
          productId: product.id,
          customerName: q.customerName,
          content: q.content,
        },
      });
      if (!existingQuote) {
        await prisma.customerQuote.create({
          data: {
            productId: product.id,
            customerName: q.customerName,
            content: q.content,
            isApproved: true,
            sortOrder: index,
          },
        });
        console.log(`  ✅ Quote: ${q.customerName}`);
      } else {
        await prisma.customerQuote.update({
          where: { id: existingQuote.id },
          data: {
            isApproved: true,
            sortOrder: index,
          },
        });
        console.log(`  ✅ Quote: ${q.customerName}`);
      }
    }

    console.log();
  }

  // ── Step 3: 全产品 upsert 完成后，再统一创建 Cross-Sell ──
  console.log("📦 Step 3: 创建 CrossSellRelation...");
  const seenCrossSells = new Set<string>();

  for (const def of products) {
    for (const [sortOrder, cs] of def.crossSells.entries()) {
      const fromProductId = productCodeMap[def.productCode];
      const toProductId = productCodeMap[cs.toProductCode];
      if (!fromProductId || !toProductId) {
        throw new Error(`Cross-sell product not found: ${def.productCode} → ${cs.toProductCode}`);
      }

      const dedupeKey = `${fromProductId}:${toProductId}`;
      if (seenCrossSells.has(dedupeKey)) {
        continue;
      }
      seenCrossSells.add(dedupeKey);

      await prisma.crossSellRelation.upsert({
        where: {
          fromProductId_toProductId: {
            fromProductId,
            toProductId,
          },
        },
        update: {
          reason: cs.reason,
          sortOrder,
        },
        create: {
          fromProductId,
          toProductId,
          reason: cs.reason,
          sortOrder,
        },
      });
      console.log(`  ✅ CrossSell: ${def.productCode} → ${cs.toProductCode}`);
    }
  }
  console.log();

  // ═══════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════
  console.log("═══════════════════════════════");
  console.log("🎉 Product OS V2.2 录入完成！");
  console.log("═══════════════════════════════");
  console.log(`  产品: ${await prisma.products.count()}`);
  console.log(`  Batch: ${await prisma.batch.count()}`);
  console.log(`  RitualTaxonomy: ${await prisma.ritualTaxonomy.count()}`);
  console.log(`  CustomerQuote: ${await prisma.customerQuote.count()}`);
  console.log(`  CrossSellRelation: ${await prisma.crossSellRelation.count()}`);
  console.log("═══════════════════════════════\n");

  // 展示录入的 3 个产品的数据汇总
  console.log("首批 3 个产品：");
  for (const def of products) {
    const p = await prisma.products.findUnique({
      where: { code: def.productCode },
      include: { batches: true, quotes: true },
    });
    if (p) {
      console.log(`  ${p.code} · ${p.name}`);
      console.log(`    产品 ID: ${p.id}`);
      console.log(`    价值子弹: ${JSON.stringify(p.valueBullets)}`);
      console.log(`    Ritual ID: ${p.ritualTaxonomyId}`);
      console.log(`    批次: ${p.batches.length} 批`);
      console.log(`    语录: ${p.quotes.length} 条`);
      console.log();
    }
  }
}

main()
  .catch((e) => {
    console.error("❌ 录入失败:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
