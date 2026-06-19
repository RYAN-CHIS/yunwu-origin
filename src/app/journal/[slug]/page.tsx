import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await db.journalPost.findUnique({
    where: { slug, status: 'PUBLISHED' },
  })

  if (!post) return {}

  return {
    title: post.seoTitle || `${post.title}｜允物品牌志`,
    description: post.seoDescription || post.excerpt || '',
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || '',
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params
  const post = await db.journalPost.findUnique({
    where: { slug, status: 'PUBLISHED' },
  })

  if (!post) notFound()

  // Get prev/next posts
  const [prevPost, nextPost] = await Promise.all([
    db.journalPost.findFirst({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lt: post.publishedAt || new Date() },
      },
      orderBy: { publishedAt: 'desc' },
      select: { id: true, title: true, slug: true },
    }),
    db.journalPost.findFirst({
      where: {
        status: 'PUBLISHED',
        publishedAt: { gt: post.publishedAt || new Date() },
      },
      orderBy: { publishedAt: 'asc' },
      select: { id: true, title: true, slug: true },
    }),
  ])

  const categoryLabels: Record<string, string> = {
    BRAND: '品牌',
    MATERIAL: '材料',
    JOURNEY: '旅途',
    CRAFT: '创作',
    PHILOSOPHY: '哲思',
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || '',
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: '允物',
    },
    ...(post.coverImage && { image: post.coverImage }),
  }

  return (
    <main className="min-h-screen bg-yun-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Cover Image */}
      {post.coverImage && (
        <div className="w-full h-[40vh] md:h-[50vh] overflow-hidden bg-yun-bg-secondary">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Meta */}
        <div className="mb-12 md:mb-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-xs tracking-wider text-yun-accent/60 border border-yun-accent/20 px-3 py-1">
              {categoryLabels[post.category] || post.category}
            </span>
            {post.publishedAt && (
              <span className="text-xs text-yun-subtext">
                {new Date(post.publishedAt).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl md:text-5xl text-yun-text leading-tight tracking-wide">
            {post.title}
          </h1>
        </div>

        {/* Content */}
        <div className="prose prose-stone max-w-none prose-p:leading-relaxed prose-p:text-yun-text prose-headings:font-display prose-headings:text-yun-text prose-img:my-12 prose-a:text-yun-accent prose-blockquote:border-yun-accent prose-blockquote:text-yun-subtext">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Navigation */}
        <nav className="mt-16 md:mt-24 pt-12 border-t border-yun-line flex justify-between items-center">
          {prevPost ? (
            <Link
              href={`/journal/${prevPost.slug}`}
              className="text-sm text-yun-subtext hover:text-yun-accent transition-colors inline-flex items-center gap-2"
            >
              ← {prevPost.title}
            </Link>
          ) : (
            <span />
          )}
          {nextPost ? (
            <Link
              href={`/journal/${nextPost.slug}`}
              className="text-sm text-yun-subtext hover:text-yun-accent transition-colors inline-flex items-center gap-2"
            >
              {nextPost.title} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>

      {/* Back to Journal */}
      <div className="text-center pb-24">
        <Link
          href="/journal"
          className="text-sm tracking-wider text-yun-accent border-b border-yun-accent/30 hover:border-yun-accent transition-colors"
        >
          返回品牌志
        </Link>
      </div>
    </main>
  )
}

export async function generateStaticParams() {
  const posts = await db.journalPost.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  })

  return posts.map((post: any) => ({ slug: post.slug }))
}
