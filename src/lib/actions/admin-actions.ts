"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { del } from "@vercel/blob";

// ═══════════════════════════════════════════════════════
// Auth helpers
// ═══════════════════════════════════════════════════════

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login");
  return session;
}

// ═══════════════════════════════════════════════════════
// Series CRUD
// ═══════════════════════════════════════════════════════

export async function getSeries() {
  await requireAdmin();
  return prisma.series.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function createSeries(data: {
  name: string; slug: string; shortDesc: string; longDesc: string;
  coverImage?: string; sortOrder: number; isActive: boolean;
}) {
  await requireAdmin();
  const s = await prisma.series.create({ data });
  revalidatePath("/admin/series");
  return s;
}

export async function updateSeries(id: string, data: {
  name?: string; slug?: string; shortDesc?: string; longDesc?: string;
  coverImage?: string; sortOrder?: number; isActive?: boolean;
}) {
  await requireAdmin();
  const s = await prisma.series.update({ where: { id }, data });
  revalidatePath("/admin/series");
  revalidatePath("/");
  return s;
}

export async function deleteSeries(id: string) {
  await requireAdmin();
  await prisma.series.delete({ where: { id } });
  revalidatePath("/admin/series");
}

// ═══════════════════════════════════════════════════════
// ObjectCategory CRUD
// ═══════════════════════════════════════════════════════

export async function getObjectCategories() {
  await requireAdmin();
  return prisma.objectCategory.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function createObjectCategory(data: {
  name: string; slug: string; description?: string;
  coverImage?: string; sortOrder: number;
}) {
  await requireAdmin();
  const c = await prisma.objectCategory.create({ data });
  revalidatePath("/admin/objects");
  return c;
}

export async function updateObjectCategory(id: string, data: {
  name?: string; slug?: string; description?: string;
  coverImage?: string; sortOrder?: number;
}) {
  await requireAdmin();
  const c = await prisma.objectCategory.update({ where: { id }, data });
  revalidatePath("/admin/objects");
  return c;
}

export async function deleteObjectCategory(id: string) {
  await requireAdmin();
  await prisma.objectCategory.delete({ where: { id } });
  revalidatePath("/admin/objects");
}

// ═══════════════════════════════════════════════════════
// Material CRUD
// ═══════════════════════════════════════════════════════

export async function getMaterials() {
  await requireAdmin();
  return prisma.material.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createMaterial(data: {
  name: string; alias?: string; type?: string; origin?: string;
  history?: string; features?: string; description?: string; image?: string;
}) {
  await requireAdmin();
  const m = await prisma.material.create({ data: { ...data, relatedArticles: "[]" } });
  revalidatePath("/admin/materials");
  return m;
}

export async function updateMaterial(id: string, data: {
  name?: string; alias?: string; type?: string; origin?: string;
  history?: string; features?: string; description?: string; image?: string;
}) {
  await requireAdmin();
  const m = await prisma.material.update({ where: { id }, data });
  revalidatePath("/admin/materials");
  return m;
}

export async function deleteMaterial(id: string) {
  await requireAdmin();
  await prisma.material.delete({ where: { id } });
  revalidatePath("/admin/materials");
}

// ═══════════════════════════════════════════════════════
// Product CRUD
// ═══════════════════════════════════════════════════════

export async function getProducts() {
  await requireAdmin();
  return prisma.product.findMany({
    include: { series: true, objectCategory: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getSeriesForSelect() {
  await requireAdmin();
  return prisma.series.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCategoriesForSelect() {
  await requireAdmin();
  return prisma.objectCategory.findMany({
    select: { id: true, name: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createProduct(data: {
  sku: string; name: string; slug: string; seriesId: string;
  objectCategoryId: string; theme?: string; story?: string; materials?: string;
  coverImage?: string; gallery?: string; costPrice?: number; salePrice?: number;
  status?: string;
}) {
  await requireAdmin();
  const p = await prisma.product.create({ data: { ...data, gallery: data.gallery || "[]", status: data.status || "draft" } });
  revalidatePath("/admin/products");
  return p;
}

export async function updateProduct(id: number, data: {
  sku?: string; name?: string; slug?: string; seriesId?: string;
  objectCategoryId?: string; theme?: string; story?: string; materials?: string;
  coverImage?: string; gallery?: string; costPrice?: number; salePrice?: number;
  status?: string;
}) {
  await requireAdmin();
  const p = await prisma.product.update({ where: { id }, data });
  revalidatePath("/admin/products");
  return p;
}

export async function deleteProduct(id: number) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

// ═══════════════════════════════════════════════════════
// Journal CRUD
// ═══════════════════════════════════════════════════════

export async function getJournalPosts() {
  await requireAdmin();
  return prisma.journalPost.findMany({ orderBy: { updatedAt: "desc" } });
}

export async function createJournalPost(data: {
  title: string; slug: string; content: string; excerpt?: string;
  coverImage?: string; category: any; status: any;
  seoTitle?: string; seoDescription?: string;
}) {
  await requireAdmin();
  const post = await prisma.journalPost.create({ data });
  revalidatePath("/admin/journal");
  return post;
}

export async function updateJournalPost(id: string, data: {
  title?: string; slug?: string; content?: string; excerpt?: string;
  coverImage?: string; category?: any; status?: any;
  seoTitle?: string; seoDescription?: string;
}) {
  await requireAdmin();
  const post = await prisma.journalPost.update({ where: { id }, data });
  revalidatePath("/admin/journal");
  revalidatePath("/journal");
  return post;
}

export async function deleteJournalPost(id: string) {
  await requireAdmin();
  await prisma.journalPost.delete({ where: { id } });
  revalidatePath("/admin/journal");
}

// ═══════════════════════════════════════════════════════
// Media CRUD
// ═══════════════════════════════════════════════════════

export async function getMedia() {
  await requireAdmin();
  return prisma.media.findMany({ orderBy: { createdAt: "desc" } });
}

export async function saveMedia(data: {
  filename: string; url: string; category: any;
  altText?: string; size: number; mimeType: string;
}) {
  await requireAdmin();
  const m = await prisma.media.create({ data });
  revalidatePath("/admin/media");
  return m;
}

export async function deleteMedia(id: string) {
  await requireAdmin();
  const record = await prisma.media.findUnique({ where: { id } });
  if (record && record.url) {
    try { await del(record.url); } catch {}
  }
  await prisma.media.delete({ where: { id } });
  revalidatePath("/admin/media");
}

// ═══════════════════════════════════════════════════════
// SEO CRUD
// ═══════════════════════════════════════════════════════

export async function getSeoConfigs() {
  await requireAdmin();
  return prisma.seoConfig.findMany({ orderBy: { pageKey: "asc" } });
}

export async function upsertSeoConfig(data: {
  pageKey: string; title: string; description: string;
  ogImage?: string; canonical?: string;
}) {
  await requireAdmin();
  const c = await prisma.seoConfig.upsert({
    where: { pageKey: data.pageKey },
    create: data,
    update: data,
  });
  revalidatePath("/admin/seo");
  return c;
}

// ═══════════════════════════════════════════════════════
// Site Settings
// ═══════════════════════════════════════════════════════

export async function getSiteSettings() {
  await requireAdmin();
  return prisma.siteSettings.findMany();
}

export async function upsertSiteSetting(key: string, value: string) {
  await requireAdmin();
  const s = await prisma.siteSettings.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
  revalidatePath("/admin/settings");
  return s;
}

export async function getSiteSettingValue(key: string): Promise<string | null> {
  try {
    const setting = await prisma.siteSettings.findUnique({ where: { key } });
    return setting?.value || null;
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════
// Leads
// ═══════════════════════════════════════════════════════

export async function getLeads() {
  await requireAdmin();
  return prisma.contactLead.findMany({ orderBy: { createdAt: "desc" } });
}

// ═══════════════════════════════════════════════════════
// Admin users management
// ═══════════════════════════════════════════════════════

export async function getAdminUsers() {
  await requireAdmin();
  return prisma.adminUser.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createAdminUser(data: {
  email: string; name: string; password: string; role: string;
}) {
  await requireAdmin();
  const hash = await bcrypt.hash(data.password, 10);
  const u = await prisma.adminUser.create({
    data: { email: data.email, name: data.name, passwordHash: hash, role: data.role as any },
  });
  revalidatePath("/admin/settings");
  return u;
}

export async function deleteAdminUser(id: string) {
  await requireAdmin();
  await prisma.adminUser.delete({ where: { id } });
  revalidatePath("/admin/settings");
}
