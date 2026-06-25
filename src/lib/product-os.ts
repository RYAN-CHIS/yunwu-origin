/**
 * Product OS — storefront public product read service.
 *
 * Public URLs use Product.slug. Internal product identity stays in Product.sku
 * and is exposed as code in the view model.
 */
import prisma from '@/lib/prisma';

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

export async function getPublishedProducts(): Promise<ProductSku[]> {
  const products = await prisma.product.findMany({
    where: { status: PUBLISHED_STATUS },
    include: { series: true },
    orderBy: [{ series: { sortOrder: 'asc' } }, { salePrice: 'asc' }],
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
