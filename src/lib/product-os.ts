/**
 * Product OS — storefront public product read service.
 *
 * Public URLs use Product.slug. Internal product identity stays in Product.sku
 * and is exposed as code in the view model.
 */
import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export type ProductOrderBy = Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[];

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
  updatedAt: Date;
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
  /** Filter by series slug */
  seriesSlug?: string;
  /**
   * Sort order.
   * - `'default'`: series.sortOrder asc, salePrice asc
   * - `'newest'`: createdAt desc
   * @default 'default'
   */
  orderBy?: 'default' | 'newest';
}

// Fields that exist in the current production database.
// V2.2-only fields (publishStatus, productType, valueBullets, etc.) are excluded
// until the database migration is completed.
const PRODUCT_SELECT = {
  id: true,
  sku: true,
  name: true,
  slug: true,
  seriesId: true,
  objectCategory: true,
  theme: true,
  story: true,
  materials: true,
  costPrice: true,
  salePrice: true,
  coverImage: true,
  gallery: true,
  stock: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function getPublishedProducts(options?: ProductQueryOptions): Promise<ProductSku[]> {
  const where: Prisma.ProductWhereInput = { status: PUBLISHED_STATUS };

  if (options?.category) {
    where.objectCategory = options.category as any;
  }

  if (options?.seriesSlug) {
    where.series = { slug: options.seriesSlug };
  }

  const orderBy: ProductOrderBy =
    options?.orderBy === 'newest'
      ? { createdAt: 'desc' }
      : [{ series: { sortOrder: 'asc' } }, { salePrice: 'asc' }];

  const products = await prisma.product.findMany({
    where,
    select: {
      ...PRODUCT_SELECT,
      series: { select: { id: true, name: true, slug: true, sortOrder: true } },
    },
    orderBy,
    ...(options?.take ? { take: options.take } : {}),
  });

  return products.map(toProductSku);
}

export async function getPublishedProduct(slug: string): Promise<ProductSku | null> {
  const product = await prisma.product.findFirst({
    where: { slug, status: PUBLISHED_STATUS },
    select: {
      ...PRODUCT_SELECT,
      series: { select: { id: true, name: true, slug: true, sortOrder: true } },
      materialsRelation: {
        select: {
          id: true,
          material: { select: { id: true, name: true, type: true, origin: true } },
        },
      },
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
    updatedAt: product.updatedAt,
    materialsRelation: product.materialsRelation || [],
  };
}
