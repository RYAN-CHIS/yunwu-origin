import Link from 'next/link';
import '@/styles/globals.css';

// ── SEO Metadata ──
export const metadata = {
  title: '允物 Yunwu Origin｜东方器物与天然材质设计品牌',
  description:
    '允物是一家以东方文化为根基的器物品牌，通过七序世界观与天然材质作品，回应当代人的精神生活。让物归物，让心归心。',
  openGraph: {
    title: '允物 Yunwu Origin｜东方器物与天然材质设计品牌',
    description: '以东方文化为根，以天然材质为骨，以器物回应当代人的精神生活。',
    type: 'website' as const,
    locale: 'zh_CN',
  },
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
    { href: '/series/fuchu', label: '七序' },
    { href: '/products', label: '作品' },
    { href: '/materials', label: '材料' },
    { href: '/about', label: '品牌故事' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-yun-white/95 backdrop-blur-sm border-b border-yun">
      <div className="container-brand flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-2xl tracking-wider text-yun-text">Yunwu</span>
          <span className="text-sm text-yun-accent tracking-widest mt-1">允物</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-yun-text/70 hover:text-yun-text tracking-wider transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/checkout" className="relative text-yun-text/70 hover:text-yun-text transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ── 页脚 ──
function Footer() {
  return (
    <footer className="bg-yun-dark text-yun-grey">
      <div className="container-brand py-16">
        <div className="grid md:grid-cols-3 gap-10">
          {/* 品牌信息 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-display text-2xl tracking-wider text-yun-white">Yunwu</span>
              <span className="text-sm text-yun-accent tracking-widest">允物</span>
            </div>
            <p className="text-sm leading-relaxed opacity-70">
              让物归物，让心归心。
              <br />
              允许万物成为万物。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-yun-white text-sm tracking-widest mb-4">探索</h4>
            <div className="grid grid-cols-2 gap-2 text-sm opacity-70">
              <Link href="/series/fuchu" className="hover:text-yun-white transition-colors">七序体系</Link>
              <Link href="/products" className="hover:text-yun-white transition-colors">全部作品</Link>
              <Link href="/materials" className="hover:text-yun-white transition-colors">东方材料</Link>
              <Link href="/about" className="hover:text-yun-white transition-colors">品牌故事</Link>
            </div>
          </div>

          {/* 联系方式 */}
          <div>
            <h4 className="text-yun-white text-sm tracking-widest mb-4">联系</h4>
            <div className="text-sm opacity-70 space-y-1">
              <p>微信公众号：允物 Yunwu</p>
              <p>小红书：允物</p>
              <p>邮箱：hello@yunwuorigin.com</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-yun-grey/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50">
          <p>© 2026 允物 Yunwu Origin. All rights reserved.</p>
          <p>备案号：办理中</p>
        </div>
      </div>
    </footer>
  );
}
