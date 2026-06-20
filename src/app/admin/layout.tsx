"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { label: "仪表盘", href: "/admin" },
  { label: "品牌资产", items: [
    { label: "七序体系", href: "/admin/series" },
    { label: "器物体系", href: "/admin/objects" },
    { label: "材料研究", href: "/admin/materials" },
  ]},
  { label: "内容中心", items: [
    { label: "品牌志", href: "/admin/journal" },
  ]},
  { label: "作品中心", href: "/admin/products" },
  { label: "图片资产库", href: "/admin/media" },
  { label: "潜在线索", href: "/admin/leads" },
  { label: "SEO 中心", href: "/admin/seo" },
  { label: "系统设置", href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen" style={{ background: "var(--yun-bg, #FAFAF9)" }}>
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r overflow-y-auto" style={{ borderColor: "var(--yun-line, #E8E5DF)", background: "#fff" }}>
        <div className="px-5 py-5 border-b" style={{ borderColor: "var(--yun-line, #E8E5DF)" }}>
          <Link href="/admin" className="block">
            <p className="text-base font-medium tracking-[0.15em]" style={{ color: "var(--yun-text, #2C2C2A)" }}>允物 Brand OS</p>
            <p className="text-[10px] mt-0.5 tracking-wider" style={{ color: "var(--yun-subtext, #888780)" }}>品牌操作系统</p>
          </Link>
        </div>
        <nav className="p-3 space-y-0.5">
          {navItems.map((item, i) => {
            if ("items" in item && item.items) {
              return (
                <div key={i} className="mb-1">
                  <p className="px-3 py-1.5 text-[10px] tracking-[0.1em] font-medium uppercase"
                    style={{ color: "var(--yun-subtext, #888780)" }}>
                    {item.label}
                  </p>
                  {item.items.map((sub) => {
                    const active = pathname === sub.href || pathname.startsWith(sub.href + "/");
                    return (
                      <Link key={sub.href} href={sub.href}
                        className="block px-3 py-1.5 text-sm rounded transition-colors"
                        style={{
                          color: active ? "var(--yun-accent, #A16207)" : "var(--yun-text, #2C2C2A)",
                          background: active ? "rgba(161,98,7,0.06)" : "transparent",
                        }}>
                        {sub.label}
                      </Link>
                    );
                  })}
                </div>
              );
            }
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}
                className="block px-3 py-1.5 text-sm rounded transition-colors"
                style={{
                  color: active ? "var(--yun-accent, #A16207)" : "var(--yun-text, #2C2C2A)",
                  background: active ? "rgba(161,98,7,0.06)" : "transparent",
                }}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 mt-4 border-t pt-3" style={{ borderColor: "var(--yun-line, #E8E5DF)" }}>
          <Link href="/" className="block px-3 py-1.5 text-xs rounded" style={{ color: "var(--yun-subtext, #888780)" }}>
            前往官网
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="block w-full text-left px-3 py-1.5 text-xs rounded" style={{ color: "var(--yun-subtext, #888780)" }}>
            退出登录
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
