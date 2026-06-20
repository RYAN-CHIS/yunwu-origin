import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const series = [
  {
    slug: 'fuchu',
    name: '芙初',
    description: '生命最本真的开端，未经世故的清澈与喜悦。',
    heroText: '清水出芙蓉，天然去雕饰',
    sortOrder: 1,
  },
  {
    slug: 'qichi',
    name: '棲迟',
    description: '慢下来，安住当下，是心归之所。',
    heroText: '衡门之下，可以栖迟',
    sortOrder: 2,
  },
  {
    slug: 'fusu',
    name: '扶苏',
    description: '如草木初生，向上生长的力量。',
    heroText: '山有扶苏，隰有荷华',
    sortOrder: 3,
  },
  {
    slug: 'cangming',
    name: '沧溟',
    description: '天地之大，格局之深。',
    heroText: '北冥有鱼，其名为鲲',
    sortOrder: 4,
  },
  {
    slug: 'jiming',
    name: '既明',
    description: '觉知之后的澄明与智慧。',
    heroText: '不知东方之既白',
    sortOrder: 5,
  },
  {
    slug: 'guanfu',
    name: '观复',
    description: '万物并作，回归本心。',
    heroText: '万物并作，吾以观复',
    sortOrder: 6,
  },
  {
    slug: 'cangzhen',
    name: '藏真',
    description: '传承匠心，不随时光褪色的本质。',
    heroText: '真者，受于天也，自然不可易也',
    sortOrder: 7,
  },
];

async function main() {
  console.log('🌿 注入允物七序数据...\n');

  for (const s of series) {
    await prisma.series.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
    console.log(`  ✓ ${s.name} (${s.slug})`);
  }

  const count = await prisma.series.count();
  console.log(`\n✅ 完成。共 ${count} 条七序数据。`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
