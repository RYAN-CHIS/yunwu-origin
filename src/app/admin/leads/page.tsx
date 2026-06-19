import { db } from '@/lib/db'

export const metadata = {
  title: '联系线索｜允物后台',
}

export default async function AdminLeadsPage() {
  const leads = await db.contactLead.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24">
      <h1 className="font-display text-2xl md:text-3xl text-yun-text tracking-wide mb-12">
        联系线索
      </h1>

      {leads.length === 0 ? (
        <p className="text-yun-subtext py-24 text-center">暂无线索</p>
      ) : (
        <div className="border border-yun-line overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-yun-line">
                <th>姓名</th>
                <th>微信</th>
                <th>邮箱</th>
                <th>留言</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: any) => (
                <tr key={lead.id} className="border-b border-yun-line last:border-b-0 hover:bg-yun-bg-secondary/50">
                  <td className="py-4 font-medium">{lead.name}</td>
                  <td className="py-4 text-sm text-yun-subtext">{lead.weChat || '-'}</td>
                  <td className="py-4 text-sm text-yun-subtext">{lead.email || '-'}</td>
                  <td className="py-4 text-sm text-yun-subtext max-w-xs truncate">
                    {lead.message || '-'}
                  </td>
                  <td className="py-4 text-xs text-yun-subtext">
                    {new Date(lead.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
