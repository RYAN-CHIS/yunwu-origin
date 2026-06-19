import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const categories = [
  { value: 'BRAND', label: '品牌' },
  { value: 'MATERIAL', label: '材料' },
  { value: 'JOURNEY', label: '旅途' },
  { value: 'CRAFT', label: '创作' },
  { value: 'PHILOSOPHY', label: '哲思' },
]

export const metadata = {
  title: '新建文章｜允物后台',
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[\s]+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
}

export default function NewJournalPostPage() {
  async function createPost(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const slug = (formData.get('slug') as string) || slugify(title)
    const excerpt = formData.get('excerpt') as string
    const content = formData.get('content') as string
    const coverImage = formData.get('coverImage') as string
    const category = formData.get('category') as any
    const seoTitle = formData.get('seoTitle') as string
    const seoDescription = formData.get('seoDescription') as string
    const status = formData.get('status') as any
    const publishNow = formData.get('publishNow') === 'on'

    const post = await db.journalPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        category,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        status: publishNow ? 'PUBLISHED' : 'DRAFT',
        publishedAt: publishNow ? new Date() : null,
      },
    })

    revalidatePath('/journal')
    revalidatePath(`/journal/${post.slug}`)
    redirect('/admin/journal')
  }

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24">
      <h1 className="font-display text-2xl md:text-3xl text-yun-text tracking-wide mb-12">
        新建文章
      </h1>

      <form action={createPost} className="space-y-8">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-xs text-yun-subtext tracking-wider mb-2">
            标题 <span className="text-yun-accent">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full border border-yun-line bg-transparent px-4 py-3 text-yun-text text-sm focus:border-yun-accent outline-none transition-colors"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-xs text-yun-subtext tracking-wider mb-2">
            Slug（留空自动生成）
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            placeholder="dong-hai-xun-zhu"
            className="w-full border border-yun-line bg-transparent px-4 py-3 text-yun-text text-sm focus:border-yun-accent outline-none transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-xs text-yun-subtext tracking-wider mb-2">
            分类 <span className="text-yun-accent">*</span>
          </label>
          <select
            id="category"
            name="category"
            required
            className="w-full border border-yun-line bg-yun-bg px-4 py-3 text-yun-text text-sm focus:border-yun-accent outline-none transition-colors"
          >
            <option value="">请选择</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-xs text-yun-subtext tracking-wider mb-2">
            摘要
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            className="w-full border border-yun-line bg-transparent px-4 py-3 text-yun-text text-sm focus:border-yun-accent outline-none transition-colors resize-none"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label htmlFor="coverImage" className="block text-xs text-yun-subtext tracking-wider mb-2">
            封面图 URL
          </label>
          <input
            id="coverImage"
            name="coverImage"
            type="text"
            placeholder="https://..."
            className="w-full border border-yun-line bg-transparent px-4 py-3 text-yun-text text-sm focus:border-yun-accent outline-none transition-colors"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-xs text-yun-subtext tracking-wider mb-2">
            正文（Markdown） <span className="text-yun-accent">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            rows={20}
            required
            className="w-full border border-yun-line bg-transparent px-4 py-3 text-yun-text text-sm focus:border-yun-accent outline-none transition-colors resize-none font-mono"
          />
        </div>

        {/* SEO */}
        <div className="border-t border-yun-line pt-8">
          <h3 className="font-display text-lg text-yun-text mb-6">SEO 设置</h3>
          <div className="space-y-6">
            <div>
              <label htmlFor="seoTitle" className="block text-xs text-yun-subtext tracking-wider mb-2">
                SEO 标题
              </label>
              <input
                id="seoTitle"
                name="seoTitle"
                type="text"
                className="w-full border border-yun-line bg-transparent px-4 py-3 text-yun-text text-sm focus:border-yun-accent outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="seoDescription" className="block text-xs text-yun-subtext tracking-wider mb-2">
                SEO 描述
              </label>
              <textarea
                id="seoDescription"
                name="seoDescription"
                rows={2}
                className="w-full border border-yun-line bg-transparent px-4 py-3 text-yun-text text-sm focus:border-yun-accent outline-none transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          <input
            id="publishNow"
            name="publishNow"
            type="checkbox"
            className="w-4 h-4 border-yun-line rounded"
          />
          <label htmlFor="publishNow" className="text-sm text-yun-text">
            立即发布
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6 border-t border-yun-line">
          <button
            type="submit"
            className="px-8 py-3 bg-yun-accent text-yun-white text-sm tracking-wider hover:bg-yun-accent/90 transition-colors"
          >
            保存
          </button>
          <a
            href="/admin/journal"
            className="px-8 py-3 border border-yun-line text-yun-text text-sm tracking-wider hover:border-yun-accent/30 transition-colors inline-flex items-center"
          >
            取消
          </a>
        </div>
      </form>
    </div>
  )
}
