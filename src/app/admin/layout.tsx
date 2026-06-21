import { Metadata } from "next";
import AdminLayout from "./admin-sidebar";

export const metadata: Metadata = {
  title: "允物后台 · Brand OS",
  description: "允物品牌操作系统后台管理",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
