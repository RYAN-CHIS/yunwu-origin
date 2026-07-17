import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { getPublishedProducts } from '@/lib/product-os';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.yunwuorigin.com';

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/series`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/journal`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/materials`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  // Dynamic product pages — via Product OS
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getPublishedProducts();
    productPages = products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.warn('[Sitemap][BuildFallback] Skipping product pages because Product OS is unavailable during build.', error instanceof Error ? error.message : error);
  }

  // Dynamic series pages
  let seriesPages: MetadataRoute.Sitemap = [];
  try {
    const series = await prisma.series.findMany({
      select: { slug: true, updatedAt: true },
    });
    seriesPages = series.map((s) => ({
      url: `${baseUrl}/series/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.warn('[Sitemap][BuildFallback] Skipping series pages because the database is unavailable during build.', error instanceof Error ? error.message : error);
  }

  // Dynamic journal pages
  let postPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.journalPost.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    });
    postPages = posts.map((p) => ({
      url: `${baseUrl}/journal/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));
  } catch (error) {
    console.warn('[Sitemap][BuildFallback] Skipping journal pages because the database is unavailable during build.', error instanceof Error ? error.message : error);
  }

  return [...staticPages, ...productPages, ...seriesPages, ...postPages];
}
