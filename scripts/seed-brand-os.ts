// Brand OS V1 Seed — 品牌宪章基准数据
// 七序名称/排序/文案以《允物品牌宪章》为唯一准则

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // ═══════════════════════════════════════════════════
  // 七序体系（来自《允物品牌宪章》）
  // ═══════════════════════════════════════════════════
  const series = [
    { name: '芙初', slug: 'fuchu', shortDesc: '清水出芙蓉，天然去雕饰', longDesc: '第一序：本真之序。人生最澄澈的时刻，如初绽之芙蓉，不染尘埃。此序同仁正在寻找自己与世界的相处方式，以纯真之眼看待万物，不设防备，不存偏见。器物于此，是自我认知的线索。', sortOrder: 1 },
    { name: '栖迟', slug: 'qichi', shortDesc: '衡门之下，可以栖迟', longDesc: '第二序：归心之序。在外奔波之后，需要一个地方安住身心。慢下来，不是停滞，而是让灵魂跟上脚步。此序同仁懂得在忙碌中找到自己的节奏，器物是日常的锚点，让人在不确定中守住一份确定。', sortOrder: 2 },
    { name: '扶苏', slug: 'fusu', shortDesc: '山有扶苏，隰有荷华', longDesc: '第三序：生长之序。不再停留于本真，开始主动面向世界并扩展自己。此序同仁处于事业的上升期，充满行动力与创造力。器物是伴随成长的见证，见证从迷茫到清晰、从单薄到丰盛的过程。', sortOrder: 3 },
    { name: '沧溟', slug: 'cangming', shortDesc: '北冥有鱼，其名为鲲', longDesc: '第四序：格局之序。视野开阔，不再纠结于眼前得失。此序同仁已经积累了足够的人生经验与资源，开始思考更大的命题。器物在这个阶段，不再是功能性的需要，而是一种胸怀与格局的外化。', sortOrder: 4 },
    { name: '既明', slug: 'jiming', shortDesc: '不知东方之既白', longDesc: '第五序：觉知之序。经历了向外扩展的阶段后，开始向内回归。此序同仁拥有更深的智慧与沉淀，对器物有了新的理解——不再追求多与贵，而是追求内在的共鸣。器物是觉知的媒介。', sortOrder: 5 },
    { name: '观复', slug: 'guanfu', shortDesc: '万物并作，吾以观复', longDesc: '第六序：收藏之序。对万物的循环往复有了深刻的体认。此序同仁懂得欣赏时间在器物上留下的痕迹，收藏不仅是对物件的拥有，更是对美学的坚守与对时间的敬畏。', sortOrder: 6 },
    { name: '藏真', slug: 'cangzhen', shortDesc: '真者，受于天也，自然不可易也', longDesc: '第七序：传承之序。经历了一切，回归最本质的真实。此序同仁已经完成了内外合一的旅程，器物在此成为可以传递的孤品，承载匠心，也承载一代人的故事与精神。', sortOrder: 7 },
  ];

  for (const s of series) {
    await prisma.series.upsert({
      where: { slug: s.slug },
      create: s,
      update: { name: s.name, shortDesc: s.shortDesc, longDesc: s.longDesc, sortOrder: s.sortOrder },
    });
  }
  console.log(`  ✅ Series: ${series.length} records`);

  // ═══════════════════════════════════════════════════
  // 器物体系（初始化六大门类）
  // ═══════════════════════════════════════════════════
  const categories = [
    { name: '珠串', slug: 'bracelet', description: '串珠为饰，佩于腕间。每一颗珠子都承载着材料与时间的故事。', sortOrder: 1 },
    { name: '香器', slug: 'incense', description: '焚香之器，一炉一世界。烟火日常中寻得片刻宁静。', sortOrder: 2 },
    { name: '印章', slug: 'seal', description: '以刀为笔，以石为纸。每一次落刀都是与时间的对话。', sortOrder: 3 },
    { name: '瓷器', slug: 'ceramic', description: '泥土经火，成为器物。时间与温度共同完成的艺术。', sortOrder: 4 },
    { name: '珐琅', slug: 'enamel', description: '金属与釉彩的相遇。慢工艺价值的极致呈现。', sortOrder: 5 },
    { name: '文房', slug: 'scholar', description: '笔墨纸砚，文人精神的栖息地。器物承载书写与思考。', sortOrder: 6 },
  ];

  for (const c of categories) {
    await prisma.objectCategory.upsert({
      where: { slug: c.slug },
      create: c,
      update: { name: c.name, description: c.description, sortOrder: c.sortOrder },
    });
  }
  console.log(`  ✅ ObjectCategory: ${categories.length} records`);

  // ═══════════════════════════════════════════════════
  // SiteSettings 品牌默认值
  // ═══════════════════════════════════════════════════
  const settings: Record<string, string> = {
    brand_name: '允物',
    brand_philosophy: '见素抱朴',
    brand_tagline: '让物归物，让心归心',
    brand_description: '允物是一个关于人与器物关系的东方审美现代器物品牌。我们不试图让器物承担本不属于它的责任，而是希望重新建立一种真实、克制且有温度的人与物的关系。',
    brand_origin: '允物创立于东海之滨。创始人多年来浸淫于传统手工艺的研究与实践，从篆刻、大漆、瓷器到珠串，逐渐形成了对器物与人的关系的独特理解。在当代消费语境中，器物往往被赋予过多的符号意义——身份的象征、财富的证明、命运的寄托。允物试图做的是减法：减去过度包装的神话，减去焦虑驱动的消费，减去符号化的身份标签。让器物回归器物本身，让人回归人本身。',
    brand_name_meaning: '"允"字取诚信、允诺之意，"物"指器物。允物——对器物诚实，对同行者诚实。品牌相信，一件好的器物不需要神话来加持，材料、工艺与时间本身就是最好的故事。',
    wechat: 'yunwu_origin',
    email: 'hello@yunwuorigin.com',
    xiaohongshu: 'https://www.xiaohongshu.com/user/允物',
    icp: '浙ICP备XXXXXXXX号',
    copyright: '© 2026 允物 Yunwu Origin. All rights reserved.',
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSettings.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }
  console.log(`  ✅ SiteSettings: ${Object.keys(settings).length} records`);

  console.log('\n🎉 Brand OS V1 种子数据注入完成');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
