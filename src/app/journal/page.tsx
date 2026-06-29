import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import { ContentCard } from '@/components/ui';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { getSeoConfig, toMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return toMetadata(await getSeoConfig('journal'));
}

const categoryLabels: Record<string, string> = {
  OBJECT:     '器物',
  MATERIAL:   '材料',
  CRAFT:      '工艺',
  DONGHAI:    '东海',
  CREATION:   '创作',
  PHILOSOPHY: '哲思',
}

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const category = params.category

  const where: Record<string, unknown> = {
    status: 'PUBLISHED',
    ...(category && category !== 'all'
      ? { category }
      : {}),
  }

  const posts = await prisma.journalPost.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
  })

  const allPosts = await prisma.journalPost.findMany({
    where: { status: 'PUBLISHED' },
    select: { category: true },
  })

  const categories = ['all', ...new Set(allPosts.map((p) => p.category))]

  return (
    <main className="bg-[var(--yun-paper)] min-h-screen">
      {/* Hero */}
      <SectionWrapper>
        <div className="text-center">
          <p className="font-display text-6xl md:text-8xl text-[var(--yun-gray)]/5 tracking-widest leading-none mb-8">
            JOURNAL
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-[var(--yun-ink)] tracking-wide mb-6">
            允物品牌志
          </h1>
          <div className="divider mb-6" />
          <p className="text-lg md:text-xl text-[var(--yun-gray)] leading-relaxed max-w-2xl mx-auto">
            器物之道，不在拥有，而在观照。
          </p>
        </div>
      </SectionWrapper>

      {/* Filters */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <a
              key={cat}
              href={cat === 'all' ? '/journal' : `/journal?category=${cat}`}
              className={`px-5 py-2 text-sm tracking-wider border rounded-full transition-all duration-300 ${
                (!category && cat === 'all') || category === cat
                  ? 'bg-[var(--yun-ink)] text-[var(--yun-paper)] border-[var(--yun-ink)]'
                  : 'bg-transparent text-[var(--yun-gray)] border-[var(--yun-border)] hover:bg-[var(--yun-ink)] hover:text-[var(--yun-paper)] hover:border-[var(--yun-ink)]'
              }`}
            >
              {cat === 'all' ? '全部' : categoryLabels[cat] || cat}
            </a>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        {posts.length === 0 ? (
          <p className="text-center text-[var(--yun-gray)] py-24">暂无文章</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <ContentCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                coverImage={post.coverImage}
                category={post.category}
                categoryLabel={categoryLabels[post.category]}
                publishedAt={post.publishedAt}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
