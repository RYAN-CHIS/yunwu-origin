/**
 * Product OS — storefront public product read service.
 *
 * Public URLs use Product.slug. Internal product identity stays in Product.sku
 * and is exposed as code in the view model.
 */
import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

const PUBLISHED_STATUS = 'PUBLISHED';

export interface ProductSku {
  id: number;
  code: string;
  slug: string;
  name: string;
  seriesId: number;
  seriesName: string;
  seriesSlug: string;
  objectCategory: string;
  theme: string;
  story: string;
  materials: string;
  coverImage: string | null;
  gallery: string[];
  salePrice: number;
  stock: number;
  publishStatus: string;
  materialsRelation: Array<{
    id: number;
    material: {
      id: number;
      name: string;
      type: string;
      origin: string;
    };
  }>;
}

export interface ProductQueryOptions {
  /** Limit the number of results */
  take?: number;
  /** Filter by object category */
  category?: string;
  /**
   * Sort order.
   * - `'default'`: series.sortOrder asc, salePrice asc
   * - `'newest'`: createdAt desc
   * @default 'default'
   */
  orderBy?: 'default' | 'newest';
}

export async function getPublishedProducts(options?: ProductQueryOptions): Promise<ProductSku[]> {
  const where: Record<string, unknown> = { status: PUBLISHED_STATUS };

  if (options?.category) {
    where.objectCategory = options.category;
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] =
    options?.orderBy === 'newest'
      ? { createdAt: 'desc' }
      : [{ series: { sortOrder: 'asc' } }, { salePrice: 'asc' }];

  const products = await prisma.product.findMany({
    where,
    include: { series: true },
    orderBy,
    ...(options?.take ? { take: options.take } : {}),
  });

  return products.map(toProductSku);
}

export async function getPublishedProduct(slug: string): Promise<ProductSku | null> {
  const product = await prisma.product.findFirst({
    where: { slug, status: PUBLISHED_STATUS },
    include: {
      series: true,
      materialsRelation: { include: { material: true } },
    },
  });

  return product ? toProductSku(product) : null;
}

function parseGallery(value: string | null | undefined): string[] {
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toProductSku(product: any): ProductSku {
  return {
    id: product.id,
    code: product.code ?? product.sku ?? '',
    slug: product.slug,
    name: product.name,
    seriesId: product.seriesId,
    seriesName: product.series?.name || '',
    seriesSlug: product.series?.slug || '',
    objectCategory: product.objectCategory || '',
    theme: product.theme || '',
    story: product.story || '',
    materials: product.materials || '',
    coverImage: product.coverImage || null,
    gallery: parseGallery(product.gallery),
    salePrice: product.salePrice,
    stock: product.stock,
    publishStatus: product.status,
    materialsRelation: product.materialsRelation || [],
  };
}
