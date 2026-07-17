import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { prisma } from '@/lib/prisma';
import { getPublishedProduct, getPublishedProducts } from '@/lib/product-os';

const originalEnv = process.env.PRODUCT_OS_USE_PUBLISH_STATUS;

afterEach(() => {
  process.env.PRODUCT_OS_USE_PUBLISH_STATUS = originalEnv;
});

test('getPublishedProducts uses publishStatus filter by default and preserves status fields', async () => {
  delete process.env.PRODUCT_OS_USE_PUBLISH_STATUS;
  const originalFindMany = prisma.product.findMany;
  let called = 0;
  prisma.product.findMany = (async (args: any) => {
    called += 1;
    assert.deepEqual(args.where, { publishStatus: 'PUBLISHED' });
    return [
      {
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
        status: 'PUBLISHED',
        publishStatus: 'PUBLISHED',
        createdAt: new Date('2026-07-17T00:00:00.000Z'),
        updatedAt: new Date('2026-07-17T00:00:00.000Z'),
        erp_product_id: null,
        series: { id: 10, name: 'Series A', slug: 'series-a', sortOrder: 1 },
      },
    ];
  }) as any;

  try {
    const products = await getPublishedProducts();
    assert.equal(called, 1);
    assert.equal(products[0]?.status, 'PUBLISHED');
    assert.equal(products[0]?.publishStatus, 'PUBLISHED');
  } finally {
    prisma.product.findMany = originalFindMany;
  }
});

test('getPublishedProduct uses publishStatus filter and warns on mismatch', async () => {
  delete process.env.PRODUCT_OS_USE_PUBLISH_STATUS;
  const originalWarn = console.warn;
  const originalFindFirst = prisma.product.findFirst;
  let warnCount = 0;
  console.warn = () => {
    warnCount += 1;
  };
  prisma.product.findFirst = (async (args: any) => {
    assert.deepEqual(args.where, { slug: 'alpha', publishStatus: 'PUBLISHED' });
    return {
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
      status: 'draft',
      publishStatus: 'PUBLISHED',
      createdAt: new Date('2026-07-17T00:00:00.000Z'),
      updatedAt: new Date('2026-07-17T00:00:00.000Z'),
      erp_product_id: null,
      series: { id: 10, name: 'Series A', slug: 'series-a', sortOrder: 1 },
      materialsRelation: [],
    };
  }) as any;

  try {
    const product = await getPublishedProduct('alpha');
    assert.equal(product?.slug, 'alpha');
    assert.equal(product?.status, 'draft');
    assert.equal(product?.publishStatus, 'PUBLISHED');
    assert.equal(warnCount, 1);
  } finally {
    console.warn = originalWarn;
    prisma.product.findFirst = originalFindFirst;
  }
});
