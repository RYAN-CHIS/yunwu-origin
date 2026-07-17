import { db } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminJournalPage() {
  const posts = await db.journalPost.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const categoryLabels: Record<string, string> = {
    BRAND: '品牌',
    MATERIAL: '材料',
    JOURNEY: '旅途',
    CRAFT: '创作',
    PHILOSOPHY: '哲思',
  }

  const statusLabels: Record<string, string> = {
    DRAFT: '草稿',
    PUBLISHED: '已发布',
  }

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24">
      <div className="flex items-center justify-between mb-12">
        <h1 className="font-display text-2xl md:text-3xl text-yun-text tracking-wide">
          品牌志管理
        </h1>
        <Link
          href="/admin/journal/new"
          className="px-6 py-3 bg-yun-accent text-yun-white text-sm tracking-wider hover:bg-yun-accent/90 transition-colors"
        >
          + 新建文章
        </Link>
      </div>

      <div className="border border-yun-line overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-yun-line">
              <th>标题</th>
              <th>分类</th>
              <th>状态</th>
              <th>发布时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post: any) => (
              <tr key={post.id} className="border-b border-yun-line last:border-b-0 hover:bg-yun-bg-secondary/50">
                <td className="py-4">{post.title}</td>
                <td className="py-4 text-sm text-yun-subtext">
                  {categoryLabels[post.category] || post.category}
                </td>
                <td className="py-4">
                  <span className={`text-xs tracking-wider ${post.status === 'PUBLISHED' ? 'text-green-600' : 'text-yun-subtext'}`}>
                    {statusLabels[post.status] || post.status}
                  </span>
                </td>
                <td className="py-4 text-sm text-yun-subtext">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('zh-CN')
                    : '-'}
                </td>
                <td className="py-4">
                  <Link
                    href={`/admin/journal/${post.id}`}
                    className="text-sm text-yun-accent hover:underline"
                  >
                    编辑
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
