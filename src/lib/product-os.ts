/**
 * Product OS — storefront public product read service.
 *
 * Public URLs use Product.slug. Internal product identity stays in Product.sku
 * and is exposed as code in the view model.
 *
 * P0-6B: When Product.erp_product_id is set, effective price/stock
 * are read from ERP (source of truth for commerce fields).
 */
import prisma from '@/lib/prisma';
import { erpPrisma, fetchErpCommerceFields } from '@/lib/erp-prisma';
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
  // P0-6B: ERP link field
  erpProductId: number | null;
  // P0-6B: Effective commerce fields (read from ERP when linked)
  effectivePrice: number;
  effectiveStock: number;
  effectiveInStock: boolean;
  commerceSource: 'erp' | 'web';
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
  // P0-6B: ERP link field
  erp_product_id: true,
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

  const productSkus = products.map(toProductSku);
  return enrichProductsWithErpCommerce(productSkus);
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

  if (!product) return null;

  const productSku = toProductSku(product);
  return enrichWithErpCommerce(productSku);
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
  const basePrice = product.salePrice || 0;
  const baseStock = product.stock || 0;
  const erpProductId = product.erp_product_id || null;

  // P0-6B: Default to web values; will be overwritten if ERP link exists
  const effectivePrice = basePrice;
  const effectiveStock = baseStock;
  const effectiveInStock = baseStock > 0;
  const commerceSource: 'erp' | 'web' = 'web';

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
    salePrice: basePrice,
    stock: baseStock,
    publishStatus: product.status,
    updatedAt: product.updatedAt,
    materialsRelation: product.materialsRelation || [],
    // P0-6B: ERP link & effective commerce fields
    erpProductId,
    effectivePrice,
    effectiveStock,
    effectiveInStock,
    commerceSource,
  };
}

/**
 * P0-6B: Enrich a product with ERP commerce truth.
 *
 * When Product.erp_product_id is set, reads price & finishedStock
 * from ERP ProductSku (source of truth for commerce).
 *
 * Returns the same product with effective fields updated.
 * If ERP is unavailable or product not linked, returns product unchanged.
 */
export async function enrichWithErpCommerce(product: ProductSku): Promise<ProductSku> {
  if (!product.erpProductId) {
    return product; // No ERP link — use web values
  }

  const erpData = await fetchErpCommerceFields(product.erpProductId);

  if (!erpData) {
    return product; // ERP read failed — fallback to web values
  }

  return {
    ...product,
    effectivePrice: erpData.price,
    effectiveStock: erpData.finishedStock,
    effectiveInStock: erpData.finishedStock > 0,
    commerceSource: 'erp',
  };
}

/**
 * P0-6B: Batch enrich products with ERP commerce truth.
 * Fetches ERP data for all linked products in parallel.
 */
export async function enrichProductsWithErpCommerce(products: ProductSku[]): Promise<ProductSku[]> {
  const linked = products.filter(p => p.erpProductId);
  if (linked.length === 0) {
    return products; // No ERP links — return as-is
  }

  // Fetch ERP data for all linked products in parallel
  const erpResults = await Promise.all(
    linked.map(p => fetchErpCommerceFields(p.erpProductId!).then(data => ({ id: p.id, data })))
  );

  // Apply ERP data to products
  const erpMap = new Map(erpResults.filter(r => r.data).map(r => [r.id, r.data]));
  return products.map(p => {
    const erpData = erpMap.get(p.id);
    if (!erpData) return p;

    return {
      ...p,
      effectivePrice: erpData.price,
      effectiveStock: erpData.finishedStock,
      effectiveInStock: erpData.finishedStock > 0,
      commerceSource: 'erp' as const,
    };
  });
}
