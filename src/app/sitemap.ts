import { MetadataRoute } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const baseUrl = "https://www.yunwuorigin.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,        lastModified: new Date() },
    { url: `${baseUrl}/series`, lastModified: new Date() },
    { url: `${baseUrl}/materials`, lastModified: new Date() },
    { url: `${baseUrl}/journal`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
  ];

  // 产品页
  let products: { slug: string; updatedAt: Date }[] = [];
  try {
    products = await prisma.product.findMany({
      where: { status: "active" },
      select: { slug: true, updatedAt: true },
    });
  } catch {}

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/objects/${p.slug}` as string,
    lastModified: p.updatedAt,
  }));

  // 品牌志
  let posts: { slug: string; publishedAt: Date | null }[] = [];
  try {
    posts = await prisma.journalPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, publishedAt: true },
    });
  } catch {}

  const journalPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${baseUrl}/journal/${p.slug}` as string,
    lastModified: p.publishedAt ?? new Date(),
  }));

  return [...staticPages, ...productPages, ...journalPages];
}
