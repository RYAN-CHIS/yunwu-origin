import Link from 'next/link';
import '@/styles/tokens.css';

// ── SEO Metadata ──
export const metadata = {
  title: '允物｜东方器物品牌',
  description:
    '允物是一家东方器物品牌。以珠串、香器、印章、瓷器与诸般器物为媒介，重新建立人与物之间真实、克制且有温度的关系。',
  openGraph: {
    title: '允物｜东方器物品牌',
    description: '以东方文化为根，以器物回应当代人的精神生活。让物归物，让心归心。',
    type: 'website' as const,
    locale: 'zh_CN',
  },
  keywords: ['允物', '东方器物', '手串', '篆刻', '沉香', '水晶', '东方美学'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// ── 导航栏 ──
function Navbar() {
  const links = [
    { href: '/', label: '首页' },
    { href: '/series', label: '七序' },
    { href: '/products', label: '作品' },
    { href: '/journal', label: '品牌志' },
    { href: '/about', label: '关于允物' },
    { href: '/contact', label: '同行者' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--yun-paper)]/95 backdrop-blur-sm border-b border-[var(--yun-border)]/30">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo-icon.png"
            alt="允物"
            className="h-8 w-auto opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-2xl font-light tracking-[0.25em] text-[var(--yun-ink)]">
            允物
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-[var(--yun-ink)]/60 hover:text-[var(--yun-ink)] tracking-wider transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* 移动端汉堡菜单 */}
        <button className="md:hidden text-[var(--yun-ink)]/60 hover:text-[var(--yun-ink)] transition-colors" aria-label="菜单">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

// ── 页脚 ──
function Footer() {
  return (
    <footer className="bg-[var(--yun-ink)] text-[var(--yun-gray)]">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-10">
          {/* 品牌信息 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo-icon.png" alt="允物" className="h-8 w-auto opacity-70" />
              <span className="text-2xl font-light tracking-[0.25em] text-[var(--yun-paper)]/80">
                允物
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-70 mt-4">
              以东方文化为根，
              <br />
              以器物回应当代人的精神生活。
              <br />
              让物归物，让心归心。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-[var(--yun-paper)] text-sm tracking-widest mb-4">探索</h4>
            <div className="grid grid-cols-2 gap-2 text-sm opacity-70">
              <Link href="/series" className="hover:text-[var(--yun-paper)] transition-colors">
                七序体系
              </Link>
              <Link href="/products" className="hover:text-[var(--yun-paper)] transition-colors">
                东方器物
              </Link>
              <Link href="/journal" className="hover:text-[var(--yun-paper)] transition-colors">
                品牌志
              </Link>
              <Link href="/materials" className="hover:text-[var(--yun-paper)] transition-colors">
                材料研究
              </Link>
              <Link href="/about" className="hover:text-[var(--yun-paper)] transition-colors">
                关于允物
              </Link>
              <Link href="/contact" className="hover:text-[var(--yun-paper)] transition-colors">
                同行者社群
              </Link>
            </div>
          </div>

          {/* 联系方式 */}
          <div>
            <h4 className="text-[var(--yun-paper)] text-sm tracking-widest mb-4">联系</h4>
            <div className="text-sm opacity-70 space-y-1">
              <p>微信公众号：允物 Yunwu</p>
              <p>小红书：允物</p>
              <p>邮箱：hello@yunwuorigin.com</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--yun-gray)]/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50">
          <p>© 2026 允物 Yunwu Origin. All rights reserved.</p>
          <p>备案号：办理中</p>
        </div>
      </div>
    </footer>
  );
}
