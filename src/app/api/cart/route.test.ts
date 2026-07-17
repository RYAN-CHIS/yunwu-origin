import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { POST } from './route';

const originalEnv = process.env.PRODUCT_OS_USE_PUBLISH_STATUS;

afterEach(() => {
  process.env.PRODUCT_OS_USE_PUBLISH_STATUS = originalEnv;
});

test('cart route uses the shared publishStatus filter', async () => {
  delete process.env.PRODUCT_OS_USE_PUBLISH_STATUS;
  const originalFindMany = prisma.product.findMany;
  let called = 0;
  prisma.product.findMany = (async (args: any) => {
    called += 1;
    assert.deepEqual(args.where, {
      slug: { in: ['alpha', 'beta'] },
      publishStatus: 'PUBLISHED',
    });
    return [];
  }) as any;

  try {
    const response = await POST(new NextRequest('http://localhost/api/cart', {
      method: 'POST',
      body: JSON.stringify({ slugs: ['alpha', 'beta'] }),
    }));

    assert.equal(called, 1);
    assert.equal(response.status, 200);
  } finally {
    prisma.product.findMany = originalFindMany;
  }
});
