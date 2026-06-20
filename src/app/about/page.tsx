import { Metadata } from 'next';
import SectionWrapper from '@/components/ui/SectionWrapper';

export const metadata: Metadata = {
  title: '品牌故事｜允物 Yunwu Origin',
  description:
    '允物不是关于产品的品牌，而是关于人与器物关系的品牌。让物归物，让心归心。允许万物成为万物。',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--yun-paper)]">
      {/* Hero */}
      <SectionWrapper className="min-h-[45vh] flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto fade-in">
          <p className="font-display text-6xl md:text-8xl text-[var(--yun-gray)]/5 tracking-widest leading-none mb-8">
            ABOUT
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-[var(--yun-ink)] tracking-wide mb-6">
            允物为何存在
          </h1>
          <p className="text-lg md:text-xl text-[var(--yun-gray)] leading-relaxed max-w-2xl mx-auto">
            让物归物，让心归心。
          </p>
        </div>
      </SectionWrapper>

      {/* 正文 */}
      <div className="max-w-2xl mx-auto px-6 pb-24 space-y-20">
        {/* 品牌起源 */}
        <section className="fade-in">
          <h2 className="text-lg font-light tracking-[0.12em] mb-6 pb-3 border-b border-[var(--yun-border)] text-[var(--yun-ink)]">
            品牌起源
          </h2>
          <div className="text-sm text-[var(--yun-gray)] leading-loose space-y-4">
            <p>
              允物不是关于产品的品牌，而是关于人与器物关系的品牌。
            </p>
            <p>
              我们生活在一个被过度包装的时代。越来越多的产品被赋予超出其本身的意义：一串珠子被承诺改变命运，一块木头被包装成身份象征，一件器物被讲述成遥不可及的传奇。人们拥有越来越多的东西，却未必更加了解自己。
            </p>
            <p>
              我们不试图让器物承担本不属于它的责任，不让一串珠子背负改变命运的神话，不让一块木头成为身份焦虑的证明，不让消费变成对自我价值的确认。
            </p>
            <p>
              我们只是希望：在这个一切都被过度包装的时代，重新建立一种真实、克制且有温度的人与物的关系。这便是允物存在的意义。
            </p>
          </div>
        </section>

        {/* 品牌名释义 */}
        <section className="fade-in">
          <h2 className="text-lg font-light tracking-[0.12em] mb-6 pb-3 border-b border-[var(--yun-border)] text-[var(--yun-ink)]">
            品牌名
          </h2>
          <div className="text-sm text-[var(--yun-gray)] leading-loose space-y-4">
            <p>
              允物二字，本身便是一种答案。允者，允执厥中，允恭克让。物者，万物有灵，器以载道。
            </p>
            <p className="text-[var(--yun-jade)]">
              允物，不是拥有万物。而是：允许万物成为它本来的样子，也允许自己成为自己。
            </p>
          </div>
        </section>

        {/* 东方器物观 */}
        <section className="fade-in">
          <h2 className="text-lg font-light tracking-[0.12em] mb-6 pb-3 border-b border-[var(--yun-border)] text-[var(--yun-ink)]">
            东方器物观
          </h2>
          <div className="text-sm text-[var(--yun-gray)] leading-loose space-y-4">
            <p>
              允物认为：现代人的很多焦虑，来自于关系失衡。人与物失衡，人与自己失衡，人与世界失衡。
            </p>
            <p>因此允物提出：「人 · 物 · 心」三位一体的器物观。</p>
            <ul className="space-y-3 mt-4">
              <li>
                <span className="text-[var(--yun-jade)]">人</span>：不断成长的主体。真正重要的，始终是使用器物的人。
              </li>
              <li>
                <span className="text-[var(--yun-jade)]">物</span>：承载时间与情感的媒介。器物无需承担改变命运的责任，它的意义是陪伴、记录与见证。
              </li>
              <li>
                <span className="text-[var(--yun-jade)]">心</span>：一切价值的最终归处。允物所做的一切，都是帮助人通过器物重新看见自己的内心。
              </li>
            </ul>
          </div>
        </section>

        {/* 工艺体系 */}
        <section className="fade-in">
          <h2 className="text-lg font-light tracking-[0.12em] mb-6 pb-3 border-b border-[var(--yun-border)] text-[var(--yun-ink)]">
            工艺体系
          </h2>
          <p className="text-sm text-[var(--yun-gray)] leading-loose mb-8">
            允物承袭东方传统工艺精神，融合当代审美，以手工打磨的每件作品，只为一件值得长久陪伴的器物。
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {[
              { name: '篆刻', img: '/images/crafts/seal-carving.png', desc: '刀与石的对话，每一刀都是不可逆的承诺' },
              { name: '瓷器', img: '/images/crafts/porcelain.png', desc: '泥与火的共生，在高温中淬炼温润' },
              { name: '大漆', img: '/images/crafts/lacquerware.png', desc: '时间的艺术，一层一层地沉淀出深邃的光泽' },
              { name: '掐丝珐琅', img: '/images/crafts/cloisonne.png', desc: '铜丝为骨，釉彩为魂，方寸之间流光溢彩' },
              { name: '皮具', img: '/images/crafts/leather.png', desc: '以最质朴的方式，呈现时间独有的纹理' },
            ].map((craft) => (
              <div key={craft.name} className="group text-center">
                <div className="aspect-square rounded-[var(--yun-radius)] overflow-hidden bg-[var(--yun-hover)] mb-3 border border-[var(--yun-border)]/50">
                  <img
                    src={craft.img}
                    alt={craft.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <p className="text-sm tracking-wider font-medium mb-1 text-[var(--yun-ink)]">{craft.name}</p>
                <p className="text-xs text-[var(--yun-gray)]/60 leading-relaxed">{craft.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 七序世界观 */}
        <section className="fade-in">
          <h2 className="text-lg font-light tracking-[0.12em] mb-6 pb-3 border-b border-[var(--yun-border)] text-[var(--yun-ink)]">
            七序世界观
          </h2>
          <div className="text-sm text-[var(--yun-gray)] leading-loose space-y-4">
            <p>
              七序不是等级，不是价格体系，不是会员制度。
            </p>
            <p>
              七序本质上是七种人生状态——不是向上的阶梯，而是向内的旅程。你在七序中看到的，其实是不同阶段的自己。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {[
              { name: '芙初', subtitle: '本真之序', poem: '清水出芙蓉，天然去雕饰', desc: '人生最珍贵的状态，不是成功，而是第一次看见世界时的欢喜。', keys: '本真 · 喜悦 · 爱 · 美好 · 纯粹 · 生命力' },
              { name: '栖迟', subtitle: '归心之序', poem: '衡门之下，可以栖迟', desc: '允许自己停下来，允许自己不那么着急。', keys: '松弛 · 治愈 · 安住 · 归心 · 安顿' },
              { name: '扶苏', subtitle: '生长之序', poem: '山有扶苏，隰有荷华', desc: '向阳而生，成为更好的自己。', keys: '成长 · 行动 · 创造 · 丰盛' },
              { name: '沧溟', subtitle: '格局之序', poem: '北冥有鱼，其名为鲲', desc: '从关注自己，到连接更大的世界。', keys: '机遇 · 人脉 · 连接 · 格局 · 资源' },
              { name: '既明', subtitle: '觉知之序', poem: '不知东方之既白', desc: '看见世界之后，开始看见自己。', keys: '智慧 · 沉淀 · 定力 · 觉知' },
              { name: '观复', subtitle: '收藏之序', poem: '万物并作，吾以观复', desc: '看遍繁华，终归本心。', keys: '收藏 · 美学 · 回归 · 时间' },
              { name: '藏真', subtitle: '传承之序', poem: '真者，受于天也，自然不可易也', desc: '最终留下的，只有真实。', keys: '孤品 · 匠心 · 传承 · 永恒' },
            ].map((seq, i) => (
              <div key={seq.name} className="border border-[var(--yun-border)] rounded-[var(--yun-radius)] p-5 bg-[var(--yun-paper)]">
                <p className="text-xs text-[var(--yun-jade)]/60 tracking-widest mb-1">
                  第{['一','二','三','四','五','六','七'][i]}序 · {seq.subtitle}
                </p>
                <p className="text-base tracking-wider mb-2 font-medium text-[var(--yun-ink)]">{seq.name}</p>
                <p className="text-sm text-[var(--yun-jade)]/70 font-light italic mb-2">「{seq.poem}」</p>
                <p className="text-xs text-[var(--yun-gray)] leading-relaxed mb-2">{seq.desc}</p>
                <p className="text-[11px] text-[var(--yun-jade)]/40 tracking-wider">{seq.keys}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 对材料的理解 */}
        <section className="fade-in">
          <h2 className="text-lg font-light tracking-[0.12em] mb-6 pb-3 border-b border-[var(--yun-border)] text-[var(--yun-ink)]">
            对材料的理解
          </h2>
          <div className="text-sm text-[var(--yun-gray)] leading-loose space-y-4">
            <p>
              每一种材料都有它的来历、性格和故事。水晶是大地亿万年的结晶，沉香是树木受伤后的自我修复，檀木是数十年缓慢生长的年轮。它们不说话，但本身就是时间最诚实的作品。
            </p>
            <p>
              允物选择与天然材质同行，而非制造。我们尊重材料的天然纹理、颜色差异和不完美——因为正是这些差异，让每一件作品成为唯一的陪伴。
            </p>
          </div>
        </section>

        {/* 对时间的理解 */}
        <section className="fade-in">
          <h2 className="text-lg font-light tracking-[0.12em] mb-6 pb-3 border-b border-[var(--yun-border)] text-[var(--yun-ink)]">
            对时间的理解
          </h2>
          <div className="text-sm text-[var(--yun-gray)] leading-loose space-y-4">
            <p>允物信奉长期主义。我们不追求短期爆款，追求十年后依然值得拥有的东西。</p>
            <p>产品会老去，市场会变化，流量会消失。唯有信任会不断累积——这才是允物真正的护城河。</p>
          </div>
        </section>

        {/* 商业伦理 */}
        <section className="fade-in">
          <h2 className="text-lg font-light tracking-[0.12em] mb-6 pb-3 border-b border-[var(--yun-border)] text-[var(--yun-ink)]">
            商业伦理
          </h2>
          <div className="text-sm text-[var(--yun-gray)] leading-loose space-y-4">
            <p className="text-[var(--yun-jade)] font-medium">
              最好的商业，不是让人不断购买，而是让人不断成长。
              最好的品牌，不是让人依赖品牌，而是帮助人建立自己的判断力。
              最好的器物，不是改变命运，而是在人生的重要时刻，安静地陪伴你。
            </p>
            <p>因此我们承诺：不神化器物。不消费焦虑。不欺骗信任。不背离真实。</p>
            <p>在漫长的时间里，持续创造值得被拥有的东西。这就是允物的商业伦理，也是允物存在的底线。</p>
          </div>
        </section>

        {/* 品牌终章 */}
        <section className="text-center pt-10 fade-in">
          <p className="text-[var(--yun-jade)] text-lg font-light tracking-wider leading-loose">
            愿你拥有器物，但不被器物拥有。
            <br />
            愿你欣赏万物，但不执着于万物。
            <br />
            愿你见天地，见众生，最终见自己。
          </p>
          <div className="divider mt-10" />
          <p className="text-sm text-[var(--yun-gray)] mt-6 tracking-wider">
            让物归物，让心归心。允许万物，成为万物。
          </p>
        </section>
      </div>
    </main>
  );
}
