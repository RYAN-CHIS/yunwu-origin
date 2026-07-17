import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { GET } from './route';

afterEach(() => {
});

test('products route ignores status query params and returns publishStatus=PUBLISHED only', async () => {
  const originalFindMany = prisma.product.findMany;
  let called = 0;
  prisma.product.findMany = (async (args: any) => {
    called += 1;
    assert.deepEqual(args.where, {
      seriesId: 7,
      publishStatus: 'PUBLISHED',
    });
    return [];
  }) as any;

  try {
    const response = await GET(new NextRequest('http://localhost/api/products?seriesId=7&status=DRAFT'));

    assert.equal(called, 1);
    assert.equal(response.status, 200);
  } finally {
    prisma.product.findMany = originalFindMany;
  }
});
