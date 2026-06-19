import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌿 开始播种允物数据...\n');

  // ── 1. 七序 ──
  const seriesData = [
    {
      slug: 'fuchu',
      name: '芙初',
      description: '本真之序。「清水出芙蓉，天然去雕饰。」人生最珍贵的状态，不是成功，而是第一次看见世界时的欢喜。给生命最初的纯真与生命力，一切尚未被定义。',
      heroText: '愿你永远保有，像第一次遇见世界那样的欢喜。',
      sortOrder: 1,
    },
    {
      slug: 'qichi',
      name: '栖迟',
      description: '归心之序。「衡门之下，可以栖迟。」在奔忙的世界中学会停下来，安顿身心。允许自己不那么着急，允许自己喘一口气。',
      heroText: '世界很快，你需要一个地方，让自己慢下来。',
      sortOrder: 2,
    },
    {
      slug: 'fusu',
      name: '扶苏',
      description: '生长之序。「山有扶苏，隰有荷华。」向阳而生，开始创造属于自己的世界。处于奋斗期，寻求行动力与事业上的支持。',
      heroText: '去生长，去创造，去成为你想成为的样子。',
      sortOrder: 3,
    },
    {
      slug: 'cangming',
      name: '沧溟',
      description: '格局之序。「北冥有鱼，其名为鲲。」从个人成长走向更大的格局，连接人与世界。当你准备好拥抱世界，世界也会拥抱你。',
      heroText: '北冥之鱼，化而为鹏。你的格局，决定你的未来。',
      sortOrder: 4,
    },
    {
      slug: 'jiming',
      name: '既明',
      description: '觉知之序。「不知东方之既白。」历经世事后的觉知，开始向内生长。真正的智慧，是知道何时该拿起，何时该放下。',
      heroText: '历经千帆，终见曙光。',
      sortOrder: 5,
    },
    {
      slug: 'guanfu',
      name: '观复',
      description: '收藏之序。「万物并作，吾以观复。」看遍繁华，终归本心。追求精神富足，开始进行艺术收藏与传承。收藏的不只是器物，更是时间的印记。',
      heroText: '看遍繁华，终归本心。',
      sortOrder: 6,
    },
    {
      slug: 'cangzhen',
      name: '藏真',
      description: '传承之序。「真者，所以受于天也，自然不可易也。」历经繁华后的收藏与传承。最终留下的，只有真实。这是时间与技艺的结晶，献给懂得欣赏的你。',
      heroText: '唯有最真挚的，才值得被永久珍藏。',
      sortOrder: 7,
    },
  ];

  for (const s of seriesData) {
    await prisma.series.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log('✅ 七序数据已写入');

  // ── 2. 材料库 ──
  const materialData = [
    {
      name: '白水晶',
      type: '水晶',
      origin: '巴西、马达加斯加',
      description: '水晶之王，晶莹剔透，象征纯净与清明。在东方文化中，白水晶被视为"晶王"，承载着净化心念、凝聚专注的意义。它不承诺改变命运，只安静地陪伴你度过每一段需要专注与清醒的时光。',
    },
    {
      name: '粉晶',
      type: '水晶',
      origin: '巴西、马达加斯加',
      description: '温润的粉色如初绽的花蕾，柔和而不张扬。粉晶被称为"爱情之石"，但在允物的理解中，它所承载的"爱"不止于浪漫之爱——更包括对自己的善意、对世界的温柔、对生命最初的欢喜。',
    },
    {
      name: '南红玛瑙',
      type: '玉石',
      origin: '中国云南、四川',
      description: '中国独有的红色玉石，色泽如火焰般温暖。南红承载着东方文化中对"红"的独特情感——喜庆、生命力、热情。每一颗南红都经历了亿万年的地质演化，是时间沉默的见证者。',
    },
    {
      name: '沉香',
      type: '香材',
      origin: '中国海南、越南、印尼',
      description: '沉香并非简单的木材，而是瑞香科树木在受伤后，经数十年乃至上百年分泌凝结而成的树脂与木质的结合体。它是时间的作品，是创伤的转化，是自然界最深刻的东方隐喻之一。',
    },
    {
      name: '老山檀',
      type: '香材',
      origin: '印度迈索尔',
      description: '老山檀，取自树龄五十年以上的檀香木核心，木质紧实、油脂饱满，散发醇厚温润的木质香调。在东方传统中，檀香是修行的伴侣、静心的媒介。一缕檀香，一念清净。',
    },
    {
      name: '绿松石',
      type: '玉石',
      origin: '中国湖北、伊朗',
      description: '如松针般的青绿色，是世界上最古老的宝石之一，在中国有超过七千年的使用历史。绿松石的颜色来自铜铝磷酸盐与水的结合——本质上，它是大地化学的诗篇。',
    },
    {
      name: '青金石',
      type: '玉石',
      origin: '阿富汗',
      description: '深蓝如苍穹，金色黄铁矿斑点如星辰洒落。青金石在古埃及和古代中国都被视为神圣之石——古埃及人用它制作法老的面具，而中国古人以"青金"称之，视其为沟通天地的灵物。',
    },
  ];

  for (const m of materialData) {
    await prisma.material.upsert({
      where: { name: m.name },
      update: m,
      create: m,
    });
  }
  console.log('✅ 材料库数据已写入');

  // ── 3. 作品 ──
  const seriesMap: Record<string, number> = {};
  for (const s of seriesData) {
    const record = await prisma.series.findUnique({ where: { slug: s.slug } });
    if (record) seriesMap[s.slug] = record.id;
  }

  const productData = [
    // ── 芙初｜日常系列 399-1599 ──
    {
      sku: 'YW-FC-001',
      name: '初见',
      slug: 'fuchu-chujian',
      seriesSlug: 'fuchu',
      theme: '本真与欢喜',
      story: '「初见」是允物为每一个对美好心怀向往的人准备的第一份礼物。以粉晶为主材，温润的粉色如朝霞初升，不浓烈，不张扬，只安静地陪伴。戴上它的那一刻，愿你记起生命中第一次被美好打动的瞬间——那种纯粹的、不带任何目的的欢喜。',
      materials: '粉晶 8mm、月光石 6mm、银配件',
      costPrice: 180,
      salePrice: 599,
      stock: 100,
      status: 'published',
    },
    {
      sku: 'YW-FC-002',
      name: '欢颜',
      slug: 'fuchu-huanyan',
      seriesSlug: 'fuchu',
      theme: '喜悦与生命力',
      story: '「欢颜」以草莓晶为主材，淡红至粉红的渐变如少女的笑靥。草莓晶中内含的赤铁矿针状晶体，在光线下闪耀微光——不是刻意展示，而是自然而然的流露。就像真正的喜悦，从来不需要声张。',
      materials: '草莓晶 10mm、粉晶 6mm、银隔珠',
      costPrice: 260,
      salePrice: 899,
      stock: 60,
      status: 'published',
    },
    {
      sku: 'YW-FC-003',
      name: '月白',
      slug: 'fuchu-yuebai',
      seriesSlug: 'fuchu',
      theme: '纯净与温柔',
      story: '「月白」取意月光的颜色——非纯白，而是一种略带清冷的柔白。以月光石为主材，其特有的"月光效应"——蓝白色的浮光随角度流转——如同深夜月光洒落水面。不夺目，但看久了，便再难忘记。',
      materials: '月光石 8mm、白水晶 6mm、银配件',
      costPrice: 220,
      salePrice: 799,
      stock: 80,
      status: 'published',
    },

    // ── 栖迟｜日常系列 399-1599 ──
    {
      sku: 'YW-QC-001',
      name: '小隐',
      slug: 'qichi-xiaoyin',
      seriesSlug: 'qichi',
      theme: '归隐与安顿',
      story: '「小隐」不以形制取胜，而以气质动人。白幽灵水晶中若隐若现的白色包裹体如远山薄雾——它不让你"看"到什么，而是让你"感受"到什么。在这个追求"更多""更快"的时代，小隐提醒你：真正的力量，来自懂得停下来。',
      materials: '白幽灵 10mm、月光石 8mm',
      costPrice: 280,
      salePrice: 999,
      stock: 50,
      status: 'published',
    },
    {
      sku: 'YW-QC-002',
      name: '归心',
      slug: 'qichi-guixin',
      seriesSlug: 'qichi',
      theme: '安住与疗愈',
      story: '「归心」是一枚白檀香牌——不是手串，不是装饰，而是一个可以随身携带的"安静之地"。印度老山白檀的香气醇厚而克制，不浓烈逼人，只是若有若无地提醒你：无论走到哪里，你的心都可以安定下来。搭配素雅的编织绳，可以挂在包上、车内，或者只是放在枕边。',
      materials: '老山白檀、编织绳',
      costPrice: 150,
      salePrice: 499,
      stock: 120,
      status: 'published',
    },
    {
      sku: 'YW-QC-003',
      name: '松风',
      slug: 'qichi-songfeng',
      seriesSlug: 'qichi',
      theme: '松弛与自然',
      story: '「松风」的名字来自中国文人千年的美学意象——松间清风，不疾不徐。以白水晶搭配绿檀隔片，清透的白与温润的绿交织，如松林间洒落的斑驳光影。它想说的只有一句：慢下来，听听风的声音。',
      materials: '白水晶 8mm、绿檀隔片、银扣',
      costPrice: 160,
      salePrice: 559,
      stock: 70,
      status: 'published',
    },

    // ── 扶苏｜日常系列 399-1599 ──
    {
      sku: 'YW-FS-001',
      name: '启程',
      slug: 'fusu-qicheng',
      seriesSlug: 'fusu',
      theme: '生长与行动',
      story: '「启程」是允物为每一个准备出发的人准备的陪伴。黄水晶的柠檬黄色澄澈明亮，如清晨的阳光——不刺眼，但足以驱散犹豫。它不是幸运符，不承诺成功。它只是一句沉默的祝福：去吧，你已经准备好了。',
      materials: '黄水晶 10mm、金发晶 8mm',
      costPrice: 280,
      salePrice: 999,
      stock: 55,
      status: 'published',
    },
    {
      sku: 'YW-FS-002',
      name: '向阳',
      slug: 'fusu-xiangyang',
      seriesSlug: 'fusu',
      theme: '丰盛与创造',
      story: '「向阳」以金发晶为主材，内部如同封存了一束阳光——细密的金红石针状晶体在光线中闪烁，每一颗都独一无二。就像每一个人的成长之路，没有人能替你走，但你可以选择朝向光的方向。',
      materials: '金发晶 12mm、黄水晶 8mm、银配件',
      costPrice: 420,
      salePrice: 1399,
      stock: 40,
      status: 'published',
    },
    {
      sku: 'YW-FS-003',
      name: '丰年',
      slug: 'fusu-fengnian',
      seriesSlug: 'fusu',
      theme: '收获与丰盛',
      story: '「丰年」取意丰收之年，以黄水晶与金钛晶搭配——金钛晶中平行排列的金红石如麦浪般整齐而丰美。这不是对财富的祈求，而是对创造的致敬：你付出的每一分努力，时间都看得到。',
      materials: '黄水晶 10mm、金钛晶 10mm、银扣',
      costPrice: 480,
      salePrice: 1599,
      stock: 35,
      status: 'published',
    },

    // ── 沧溟｜进阶系列 1599-4999 ──
    {
      sku: 'YW-CM-001',
      name: '汇川',
      slug: 'cangming-huichuan',
      seriesSlug: 'cangming',
      theme: '格局与汇聚',
      story: '「汇川」以绿幽灵聚宝盆手串为魂。绿幽灵水晶中的绿色内含物如山峦层叠、如溪流汇聚——它不制造幻觉，而是静默地提醒：你的格局有多大，你能汇聚的力量就有多大。每一颗珠子中的"千层山"都在诉说一个朴素的道理：细微的累积，终成气象。',
      materials: '绿幽灵聚宝盆 14mm、青金石 8mm',
      costPrice: 680,
      salePrice: 2299,
      stock: 25,
      status: 'published',
    },
    {
      sku: 'YW-CM-002',
      name: '和鸣',
      slug: 'cangming-heming',
      seriesSlug: 'cangming',
      theme: '人脉与共鸣',
      story: '「和鸣」之名取自"琴瑟和鸣"，寓意人与人之间最美好的连接方式——不是征服，而是共振。108颗青金石念珠，深蓝如夜空，金色星斑如银河。108，在中国文化中代表"圆满"，也代表"放下"。连接他人的前提，是连接自己。',
      materials: '青金石 8mm、南红隔珠、银三通',
      costPrice: 880,
      salePrice: 2999,
      stock: 20,
      status: 'published',
    },
    {
      sku: 'YW-CM-003',
      name: '观海',
      slug: 'cangming-guanhai',
      seriesSlug: 'cangming',
      theme: '格局与远见',
      story: '「观海」以海蓝宝为主材——如热带浅海的湛蓝，澄澈而深远。海蓝宝的名字本身就充满东方式的辽阔想象：面朝大海，春暖花开。戴上它，不是期盼幸运降临，而是提醒自己保持打开的姿态——当你准备好拥抱世界，世界也会拥抱你。',
      materials: '海蓝宝 10mm、白水晶 8mm、银配件',
      costPrice: 560,
      salePrice: 1899,
      stock: 30,
      status: 'published',
    },

    // ── 既明｜进阶系列 1599-4999 ──
    {
      sku: 'YW-JM-001',
      name: '守拙',
      slug: 'jiming-shouzhuo',
      seriesSlug: 'jiming',
      theme: '智慧与沉淀',
      story: '「守拙」二字来自东方最深刻的智慧：大巧若拙，大智若愚。以老山檀木为材，不事雕琢，保留木材天然纹理和岁月包浆感。老山檀的香气沉静而深邃，越久越醇——如同真正的智慧，不急于表达，不轻易显露。桶珠形制简朴，手感温润，是一串值得佩戴十年的手串。',
      materials: '老山檀 12mm 桶珠',
      costPrice: 560,
      salePrice: 1899,
      stock: 30,
      status: 'published',
    },
    {
      sku: 'YW-JM-002',
      name: '定境',
      slug: 'jiming-dingjing',
      seriesSlug: 'jiming',
      theme: '定力与觉知',
      story: '「定境」是一盒沉香线香礼盒——21支手工沉香线香，搭配素雅的陶瓷香插。每一支香燃起，都是与自己独处的21分钟。在燃烧的过程中，香气从浓到淡，烟从聚到散——没有什么是永恒的，但不永恒本身，就是一种深刻的美。',
      materials: '海南沉香线香 21支、陶瓷香插、桐木礼盒',
      costPrice: 680,
      salePrice: 2299,
      stock: 40,
      status: 'published',
    },
    {
      sku: 'YW-JM-003',
      name: '听雨',
      slug: 'jiming-tingyu',
      seriesSlug: 'jiming',
      theme: '沉淀与内省',
      story: '「听雨」以黑金骨干水晶为主材，深茶色的晶体中透着金色的光晕——如同雨夜窗外的灯火。听雨是中国人独特的精神仪式：在雨声中放下杂念，与自己独处。这串手串不追求夺目，它希望你更多的目光投向自己。',
      materials: '黑金骨干 10mm、老山檀 6mm',
      costPrice: 520,
      salePrice: 1799,
      stock: 35,
      status: 'published',
    },

    // ── 观复｜收藏系列 4999-30000+ ──
    {
      sku: 'YW-GF-001',
      name: '山居',
      slug: 'guanfu-shanju',
      seriesSlug: 'guanfu',
      theme: '收藏与审美',
      story: '「山居」是一件老矿绿松雕刻件——取材自湖北云盖寺老矿的高瓷高蓝绿松，由苏州玉雕师傅手雕而成。老矿绿松的蓝色温润如雨后远山，铁线纹路天然形成山石肌理，每一处细节都是亿万年地质运动与匠人双手的对话。它不仅是一件饰品，更是一件可以传承的东方美学收藏。',
      materials: '老矿绿松石 雕刻件、沉香珠链、锦盒',
      costPrice: 2800,
      salePrice: 8999,
      stock: 5,
      status: 'published',
    },
    {
      sku: 'YW-GF-002',
      name: '云隐',
      slug: 'guanfu-yunyin',
      seriesSlug: 'guanfu',
      theme: '精神与回归',
      story: '「云隐」以超七水晶（Super Seven）为主材——这种内含七种矿物的稀有水晶，每颗珠子在光线下都呈现出不同的"内在风景"：有的如云海翻涌，有的如极光流转。收藏超七的人，收藏的不是水晶，而是一段凝固的时光。',
      materials: '超七水晶 12mm、银配件、收藏证书',
      costPrice: 1800,
      salePrice: 5999,
      stock: 8,
      status: 'published',
    },
    {
      sku: 'YW-GF-003',
      name: '天工',
      slug: 'guanfu-tiangong',
      seriesSlug: 'guanfu',
      theme: '艺术与收藏',
      story: '「天工」是一件奇楠沉香随形摆件，取意"巧夺天工"。奇楠是沉香中的极品，油脂含量极高，香气层次丰富——初闻清雅，再品甘醇，回味悠长。这是自然的鬼斧神工，也是时间最慷慨的馈赠。搭配紫檀底座，置于案头，每一次抬头都是一次与时间的对话。',
      materials: '奇楠沉香、紫檀底座、收藏证书',
      costPrice: 9600,
      salePrice: 29999,
      stock: 2,
      status: 'published',
    },

    // ── 藏真｜传承系列 4999-30000+ ──
    {
      sku: 'YW-CZ-001',
      name: '甲辰壹号',
      slug: 'cangzhen-jiachen',
      seriesSlug: 'cangzhen',
      theme: '孤品与传承',
      story: '「甲辰壹号」是主理人为甲辰年创作的第一件篆刻孤品。取上等寿山芙蓉石，以汉印白文之法刻"见素抱朴"四字——这四个字是允物的品牌哲学，也是这件作品的精神内核。每一刀都是不可逆的选择，如同人生的每一个决定。仅此一件，献给真正理解"少私寡欲"的人。',
      materials: '寿山芙蓉石、定制锦盒、主理人签名证书',
      costPrice: 4800,
      salePrice: 16800,
      stock: 1,
      status: 'published',
    },
    {
      sku: 'YW-CZ-002',
      name: '岁月留香',
      slug: 'cangzhen-suiyue',
      seriesSlug: 'cangzhen',
      theme: '永恒与匠心',
      story: '「岁月留香」是一件顶级奇楠沉香摆件，油脂醇化超过二十年，香韵醇厚圆融——初闻清凉入鼻，中段甘甜满口，尾调乳香悠长。这样的沉化程度极为稀有，非十数年功夫不可得。它不说话，但在你凝视它的每一刻，它都在诉说：时间的意义，是让值得的东西更值得。',
      materials: '顶级奇楠沉香 20年醇化、紫檀木座、鉴定证书',
      costPrice: 18000,
      salePrice: 58000,
      stock: 1,
      status: 'published',
    },
  ];

  for (const p of productData) {
    const { seriesSlug, ...productFields } = p;
    const seriesId = seriesMap[seriesSlug];
    if (!seriesId) {
      console.log(`⚠️  跳过 ${p.name}：找不到序 ${seriesSlug}`);
      continue;
    }
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: { ...productFields, seriesId },
      create: { ...productFields, seriesId },
    });
  }
  console.log(`✅ ${productData.length} 件作品数据已写入`);

  // ── 4. 关联作品与材料 ──
  const materialMap: Record<string, number> = {};
  const allMaterials = await prisma.material.findMany();
  for (const m of allMaterials) {
    // 模糊匹配
    materialMap[m.name] = m.id;
  }

  const bindings = [
    { productSku: 'YW-FC-001', materialNames: ['粉晶'] },
    { productSku: 'YW-FC-002', materialNames: ['粉晶'] },
    { productSku: 'YW-FC-003', materialNames: ['白水晶'] },
    { productSku: 'YW-QC-001', materialNames: ['白水晶'] },
    { productSku: 'YW-QC-002', materialNames: ['老山檀'] },
    { productSku: 'YW-QC-003', materialNames: ['白水晶'] },
    { productSku: 'YW-FS-001', materialNames: ['白水晶'] },
    { productSku: 'YW-FS-002', materialNames: ['白水晶'] },
    { productSku: 'YW-FS-003', materialNames: ['白水晶'] },
    { productSku: 'YW-CM-001', materialNames: ['青金石'] },
    { productSku: 'YW-CM-002', materialNames: ['青金石', '南红玛瑙'] },
    { productSku: 'YW-CM-003', materialNames: ['白水晶'] },
    { productSku: 'YW-JM-001', materialNames: ['老山檀'] },
    { productSku: 'YW-JM-002', materialNames: ['沉香'] },
    { productSku: 'YW-JM-003', materialNames: ['老山檀'] },
    { productSku: 'YW-GF-001', materialNames: ['绿松石', '沉香'] },
    { productSku: 'YW-GF-002', materialNames: ['白水晶'] },
    { productSku: 'YW-GF-003', materialNames: ['沉香'] },
    { productSku: 'YW-CZ-001', materialNames: [] },
    { productSku: 'YW-CZ-002', materialNames: ['沉香'] },
  ];

  let bindingsCount = 0;
  for (const b of bindings) {
    const product = await prisma.product.findUnique({ where: { sku: b.productSku } });
    if (!product) continue;
    for (const matName of b.materialNames) {
      const matId = materialMap[matName];
      if (!matId) continue;
      await prisma.productMaterial.upsert({
        where: { productId_materialId: { productId: product.id, materialId: matId } },
        update: {},
        create: { productId: product.id, materialId: matId },
      });
      bindingsCount++;
    }
  }
  console.log(`✅ ${bindingsCount} 条作品-材料关联已写入`);

  console.log('\n🎉 允物数据播种完成！');
  console.log('   7 个序 · 20 件作品 · 7 种材料\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
