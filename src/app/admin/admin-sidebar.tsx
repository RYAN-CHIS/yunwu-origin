"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

// ── 角色 → 可见菜单路径（严格按施工单） ──
const PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: [
    "/admin",
    "/admin/products",
    "/admin/series",
    "/admin/objects",
    "/admin/materials",
    "/admin/journal",
    "/admin/media",
    "/admin/seo",
    "/admin/leads",
    "/admin/settings",
  ],
  ADMIN: [
    "/admin",
    "/admin/products",
    "/admin/series",
    "/admin/objects",
    "/admin/materials",
    "/admin/journal",
    "/admin/media",
    "/admin/seo",
    "/admin/leads",
  ],
  EDITOR: [
    "/admin",
    "/admin/journal",
    "/admin/media",
    "/admin/products",
  ],
  OPERATOR: [
    "/admin",
    "/admin/products",
    "/admin/journal",
    "/admin/leads",
  ],
};

const allNavItems = [
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

/** 根据角色过滤侧边栏菜单 */
function filterNavItems(role: string) {
  const allowed = PERMISSIONS[role] || ["/admin"];
  return allNavItems
    .map((item) => {
      if ("items" in item && item.items) {
        const filtered = item.items.filter((sub) => allowed.includes(sub.href));
        if (filtered.length === 0) return null;
        return { ...item, items: filtered };
      }
      return allowed.includes(item.href) ? item : null;
    })
    .filter(Boolean);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "ADMIN";
  const navItems = filterNavItems(role);

  // 登录页不渲染管理后台框架（侧边栏）
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--yun-bg, #FAFAF9)" }}>
      {/* Sidebar — 与 ERP 品牌色系保持一致 */}
      <aside className="w-56 shrink-0 border-r overflow-y-auto" style={{ borderColor: "var(--yun-line, #E8D9B5)", background: "var(--yun-bg, #F6F2ED)" }}>
        <div className="px-5 py-5 border-b" style={{ borderColor: "var(--yun-line, #E8D9B5)", background: "rgba(255,251,235,0.6)" }}>
          <Link href="/admin" className="block">
            <p className="text-base font-medium tracking-[0.15em]" style={{ color: "var(--yun-text, #3A2A1A)" }}>允物 Brand OS</p>
            <p className="text-[10px] mt-0.5 tracking-wider" style={{ color: "var(--yun-subtext, #8C7660)" }}>品牌操作系统</p>
          </Link>
        </div>
        <nav className="p-3 space-y-0.5">
          {navItems.map((item, i) => {
            if (!item) return null;
            if ("items" in item && item.items) {
              return (
                <div key={i} className="mb-1">
                  <p className="px-3 py-1.5 text-[10px] tracking-[0.1em] font-medium uppercase"
                    style={{ color: "var(--yun-muted, #B8A898)" }}>
                    {item.label}
                  </p>
                  {item.items.map((sub) => {
                    const active = pathname === sub.href || pathname.startsWith(sub.href + "/");
                    return (
                      <Link key={sub.href} href={sub.href}
                        className="block px-3 py-1.5 text-sm rounded transition-colors"
                        style={{
                          color: active ? "var(--yun-dark, #3A2A1A)" : "var(--yun-text, #3A2A1A)",
                          background: active ? "rgba(200,169,114,0.18)" : "transparent",
                          fontWeight: active ? 500 : 400,
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
                  color: active ? "var(--yun-dark, #3A2A1A)" : "var(--yun-text, #3A2A1A)",
                  background: active ? "rgba(200,169,114,0.18)" : "transparent",
                  fontWeight: active ? 500 : 400,
                }}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 mt-4 border-t pt-3" style={{ borderColor: "var(--yun-line, #E8D9B5)" }}>
          <Link href="/" className="block px-3 py-1.5 text-xs rounded" style={{ color: "var(--yun-subtext, #8C7660)" }}>
            前往官网
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="block w-full text-left px-3 py-1.5 text-xs rounded" style={{ color: "var(--yun-subtext, #8C7660)" }}>
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
