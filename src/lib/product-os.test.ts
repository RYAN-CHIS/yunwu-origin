import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { PublishStatus, type Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getPublishedProduct, getPublishedProducts } from '@/lib/product-os';

const originalFindMany = prisma.product.findMany;
const originalFindFirst = prisma.product.findFirst;
const originalFlag = process.env.PRODUCT_OS_USE_PUBLISH_STATUS;

const productRow = {
  id: 1,
  sku: 'SKU-1',
  name: 'Alpha',
  slug: 'alpha',
  seriesId: 10,
  objectCategory: 'BRACELET',
  theme: '',
  story: '',
  materials: '',
  costPrice: 0,
  salePrice: 100,
  coverImage: '',
  gallery: '[]',
  stock: 3,
  status: 'UNPUBLISHED',
  publishStatus: PublishStatus.PUBLISHED,
  createdAt: new Date('2026-07-17T00:00:00.000Z'),
  updatedAt: new Date('2026-07-17T00:00:00.000Z'),
  erp_product_id: null,
  series: { id: 10, name: 'Series A', slug: 'series-a', sortOrder: 1 },
};

afterEach(() => {
  prisma.product.findMany = originalFindMany;
  prisma.product.findFirst = originalFindFirst;
  if (originalFlag === undefined) {
    delete process.env.PRODUCT_OS_USE_PUBLISH_STATUS;
  } else {
    process.env.PRODUCT_OS_USE_PUBLISH_STATUS = originalFlag;
  }
});

test('getPublishedProducts uses publishStatus by default and preserves existing filters and status mapping', async () => {
  delete process.env.PRODUCT_OS_USE_PUBLISH_STATUS;
  let capturedArgs: Prisma.ProductFindManyArgs | undefined;
  prisma.product.findMany = (async (args: Prisma.ProductFindManyArgs) => {
    capturedArgs = args;
    return [productRow];
  }) as unknown as typeof prisma.product.findMany;

  const products = await getPublishedProducts({
    category: 'BRACELET',
    seriesSlug: 'series-a',
    take: 1,
    orderBy: 'newest',
  });

  assert.deepEqual(capturedArgs?.where, {
    publishStatus: PublishStatus.PUBLISHED,
    objectCategory: 'BRACELET',
    series: { slug: 'series-a' },
  });
  assert.equal('status' in (capturedArgs?.where ?? {}), false);
  assert.equal(capturedArgs?.take, 1);
  assert.deepEqual(capturedArgs?.orderBy, { createdAt: 'desc' });
  assert.equal(capturedArgs?.select?.status, true);
  assert.equal(capturedArgs?.select?.publishStatus, true);
  assert.equal(products.length, 1);
  assert.equal(products[0]?.status, 'UNPUBLISHED');
  assert.equal(products[0]?.publishStatus, PublishStatus.PUBLISHED);
  assert.notEqual(products[0]?.publishStatus, products[0]?.status);
});

test('getPublishedProduct combines slug with the publishStatus filter', async () => {
  delete process.env.PRODUCT_OS_USE_PUBLISH_STATUS;
  let capturedArgs: Prisma.ProductFindFirstArgs | undefined;
  prisma.product.findFirst = (async (args: Prisma.ProductFindFirstArgs) => {
    capturedArgs = args;
    return { ...productRow, materialsRelation: [] };
  }) as unknown as typeof prisma.product.findFirst;

  const product = await getPublishedProduct('alpha');

  assert.deepEqual(capturedArgs?.where, {
    slug: 'alpha',
    publishStatus: PublishStatus.PUBLISHED,
  });
  assert.equal('status' in (capturedArgs?.where ?? {}), false);
  assert.equal(capturedArgs?.select?.status, true);
  assert.equal(capturedArgs?.select?.publishStatus, true);
  assert.equal(product?.slug, 'alpha');
  assert.equal(product?.status, 'UNPUBLISHED');
  assert.equal(product?.publishStatus, PublishStatus.PUBLISHED);
});

test('PRODUCT_OS_USE_PUBLISH_STATUS=false uses only the legacy status filter', async () => {
  process.env.PRODUCT_OS_USE_PUBLISH_STATUS = 'false';
  let capturedArgs: Prisma.ProductFindManyArgs | undefined;
  prisma.product.findMany = (async (args: Prisma.ProductFindManyArgs) => {
    capturedArgs = args;
    return [];
  }) as unknown as typeof prisma.product.findMany;

  await getPublishedProducts({ seriesSlug: 'series-a' });

  assert.deepEqual(capturedArgs?.where, {
    status: 'PUBLISHED',
    series: { slug: 'series-a' },
  });
  assert.equal('publishStatus' in (capturedArgs?.where ?? {}), false);
});

test('getPublishedProducts returns an empty array when Prisma returns no products', async () => {
  delete process.env.PRODUCT_OS_USE_PUBLISH_STATUS;
  prisma.product.findMany = (async () => []) as unknown as typeof prisma.product.findMany;

  const products = await getPublishedProducts();

  assert.deepEqual(products, []);
});

test('getPublishedProduct returns null when Prisma finds no product', async () => {
  delete process.env.PRODUCT_OS_USE_PUBLISH_STATUS;
  prisma.product.findFirst = (async () => null) as unknown as typeof prisma.product.findFirst;

  const product = await getPublishedProduct('missing');

  assert.equal(product, null);
});
