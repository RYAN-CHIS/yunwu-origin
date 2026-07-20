import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import type { Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GET, POST } from './route';

const originalProductFindMany = prisma.product.findMany;
const originalOrderCreate = prisma.order.create;
const originalOrderFindMany = prisma.order.findMany;
const originalTransaction = prisma.$transaction;
const originalPublishStatusFlag = process.env.PRODUCT_OS_USE_PUBLISH_STATUS;

const customer = {
  customerName: '张三',
  phone: '13800000000',
  address: '测试地址',
  remark: '测试备注',
};

const publishedAlpha = {
  id: 1,
  slug: 'alpha',
  name: 'Alpha',
  salePrice: 125,
};

const publishedBeta = {
  id: 2,
  slug: 'beta',
  name: 'Beta',
  salePrice: 80,
};

afterEach(() => {
  prisma.product.findMany = originalProductFindMany;
  prisma.order.create = originalOrderCreate;
  prisma.order.findMany = originalOrderFindMany;
  prisma.$transaction = originalTransaction;
  if (originalPublishStatusFlag === undefined) {
    delete process.env.PRODUCT_OS_USE_PUBLISH_STATUS;
  } else {
    process.env.PRODUCT_OS_USE_PUBLISH_STATUS = originalPublishStatusFlag;
  }
});

function postRequest(body: unknown) {
  return new NextRequest('http://localhost/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function invalidJsonRequest() {
  return new NextRequest('http://localhost/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{',
  });
}

function mockOrderTransaction() {
  const writes: Prisma.OrderCreateArgs[] = [];
  let transactionCalls = 0;

  prisma.order.create = ((args: Prisma.OrderCreateArgs) => {
    writes.push(args);
    return Promise.resolve({
      orderNo: args.data.orderNo,
      productName: args.data.productName,
      quantity: args.data.quantity,
      amount: args.data.amount,
      status: args.data.status,
    });
  }) as unknown as typeof prisma.order.create;

  prisma.$transaction = (async (operations: Array<Promise<unknown>>) => {
    transactionCalls += 1;
    return Promise.all(operations);
  }) as unknown as typeof prisma.$transaction;

  return {
    writes,
    get transactionCalls() {
      return transactionCalls;
    },
  };
}

test('GET returns 405 without querying or disclosing orders', async () => {
  let findManyCalls = 0;
  prisma.order.findMany = (async () => {
    findManyCalls += 1;
    throw new Error('GET must not query orders');
  }) as unknown as typeof prisma.order.findMany;

  const response = await GET();
  const text = await response.text();

  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'POST');
  assert.equal(findManyCalls, 0);
  assert.doesNotMatch(text, /姓名|电话|地址|备注|customerName|phone|address|remark/i);
});

test('published product creates an order with server-side price inside a transaction', async () => {
  delete process.env.PRODUCT_OS_USE_PUBLISH_STATUS;
  let capturedQuery: Prisma.ProductFindManyArgs | undefined;
  prisma.product.findMany = (async (args: Prisma.ProductFindManyArgs) => {
    capturedQuery = args;
    return [publishedAlpha];
  }) as unknown as typeof prisma.product.findMany;
  const transaction = mockOrderTransaction();

  const response = await POST(postRequest({
    ...customer,
    items: [{ slug: 'alpha', quantity: 2, price: 0.01, name: 'forged' }],
    total: 0.02,
  }));
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.deepEqual(capturedQuery?.where, {
    slug: { in: ['alpha'] },
    publishStatus: 'PUBLISHED',
  });
  assert.equal(transaction.transactionCalls, 1);
  assert.equal(transaction.writes.length, 1);
  assert.equal(transaction.writes[0]?.data.productName, 'Alpha');
  assert.equal(transaction.writes[0]?.data.quantity, 2);
  assert.equal(transaction.writes[0]?.data.amount, 250);
  assert.deepEqual(transaction.writes[0]?.select, {
    orderNo: true,
    productName: true,
    quantity: true,
    amount: true,
    status: true,
  });
  assert.doesNotMatch(JSON.stringify(body), /13800000000|测试地址|测试备注/);
});

test('multiple products are created through one atomic transaction', async () => {
  delete process.env.PRODUCT_OS_USE_PUBLISH_STATUS;
  prisma.product.findMany = (async () => [publishedAlpha, publishedBeta]) as unknown as typeof prisma.product.findMany;
  const transaction = mockOrderTransaction();

  const response = await POST(postRequest({
    ...customer,
    items: [
      { slug: 'alpha', quantity: 1 },
      { slug: 'beta', quantity: 3 },
    ],
  }));

  assert.equal(response.status, 200);
  assert.equal(transaction.transactionCalls, 1);
  assert.equal(transaction.writes.length, 2);
  assert.deepEqual(transaction.writes.map((write) => write.data.amount), [125, 240]);
});

test('duplicate slugs are merged before validation and create one order', async () => {
  delete process.env.PRODUCT_OS_USE_PUBLISH_STATUS;
  prisma.product.findMany = (async () => [publishedAlpha]) as unknown as typeof prisma.product.findMany;
  const transaction = mockOrderTransaction();

  const response = await POST(postRequest({
    ...customer,
    items: [
      { slug: 'alpha', quantity: 2 },
      { slug: 'alpha', quantity: 3 },
    ],
  }));

  assert.equal(response.status, 200);
  assert.equal(transaction.transactionCalls, 1);
  assert.equal(transaction.writes.length, 1);
  assert.equal(transaction.writes[0]?.data.quantity, 5);
  assert.equal(transaction.writes[0]?.data.amount, 625);
});

test('rejects duplicate slugs whose merged quantity exceeds the limit before database access', async () => {
  let productQueries = 0;
  let createCalls = 0;
  let transactionCalls = 0;
  prisma.product.findMany = (async () => {
    productQueries += 1;
    return [publishedAlpha];
  }) as unknown as typeof prisma.product.findMany;
  prisma.order.create = (() => {
    createCalls += 1;
    return Promise.resolve({});
  }) as unknown as typeof prisma.order.create;
  prisma.$transaction = (async () => {
    transactionCalls += 1;
    return [];
  }) as unknown as typeof prisma.$transaction;

  const response = await POST(postRequest({
    ...customer,
    items: [
      { slug: 'alpha', quantity: 60 },
      { slug: 'alpha', quantity: 40 },
    ],
  }));
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.equal(productQueries, 0);
  assert.equal(createCalls, 0);
  assert.equal(transactionCalls, 0);
});

for (const [label, quantity] of [
  ['zero', 0],
  ['negative', -1],
  ['decimal', 1.5],
  ['string', '2'],
  ['above the limit', 100],
] as const) {
  test(`rejects ${label} quantity before querying products`, async () => {
    let productQueries = 0;
    let transactionCalls = 0;
    prisma.product.findMany = (async () => {
      productQueries += 1;
      return [publishedAlpha];
    }) as unknown as typeof prisma.product.findMany;
    prisma.$transaction = (async () => {
      transactionCalls += 1;
      return [];
    }) as unknown as typeof prisma.$transaction;

    const response = await POST(postRequest({
      ...customer,
      items: [{ slug: 'alpha', quantity }],
    }));

    assert.equal(response.status, 400);
    assert.equal(productQueries, 0);
    assert.equal(transactionCalls, 0);
  });
}

test('rejects empty items before querying products', async () => {
  let productQueries = 0;
  prisma.product.findMany = (async () => {
    productQueries += 1;
    return [];
  }) as unknown as typeof prisma.product.findMany;

  const response = await POST(postRequest({ ...customer, items: [] }));

  assert.equal(response.status, 400);
  assert.equal(productQueries, 0);
});

test('rejects missing items before querying products', async () => {
  let productQueries = 0;
  prisma.product.findMany = (async () => {
    productQueries += 1;
    return [];
  }) as unknown as typeof prisma.product.findMany;

  const response = await POST(postRequest(customer));

  assert.equal(response.status, 400);
  assert.equal(productQueries, 0);
});

test('rejects malformed JSON with a consistent error envelope', async () => {
  const response = await POST(invalidJsonRequest());
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.equal(typeof body.error, 'string');
});

test('rejects missing customer fields before querying products', async () => {
  let productQueries = 0;
  prisma.product.findMany = (async () => {
    productQueries += 1;
    return [publishedAlpha];
  }) as unknown as typeof prisma.product.findMany;

  const response = await POST(postRequest({
    items: [{ slug: 'alpha', quantity: 1 }],
    customerName: ' ',
    phone: customer.phone,
    address: customer.address,
  }));

  assert.equal(response.status, 400);
  assert.equal(productQueries, 0);
});

for (const state of ['unpublished', 'DRAFT', 'ARCHIVED', 'missing'] as const) {
  test(`rejects ${state} product without creating any order`, async () => {
    delete process.env.PRODUCT_OS_USE_PUBLISH_STATUS;
    let createCalls = 0;
    let transactionCalls = 0;
    prisma.product.findMany = (async (args: Prisma.ProductFindManyArgs) => {
      assert.deepEqual(args.where, {
        slug: { in: ['alpha'] },
        publishStatus: 'PUBLISHED',
      });
      return [];
    }) as unknown as typeof prisma.product.findMany;
    prisma.order.create = (() => {
      createCalls += 1;
      return Promise.resolve({});
    }) as unknown as typeof prisma.order.create;
    prisma.$transaction = (async () => {
      transactionCalls += 1;
      return [];
    }) as unknown as typeof prisma.$transaction;

    const response = await POST(postRequest({
      ...customer,
      items: [{ slug: 'alpha', quantity: 1 }],
    }));

    assert.equal(response.status, 400);
    assert.equal(createCalls, 0);
    assert.equal(transactionCalls, 0);
  });
}

test('one invalid product rejects the entire multi-product request without partial success', async () => {
  delete process.env.PRODUCT_OS_USE_PUBLISH_STATUS;
  let createCalls = 0;
  let transactionCalls = 0;
  prisma.product.findMany = (async () => [publishedAlpha]) as unknown as typeof prisma.product.findMany;
  prisma.order.create = (() => {
    createCalls += 1;
    return Promise.resolve({});
  }) as unknown as typeof prisma.order.create;
  prisma.$transaction = (async () => {
    transactionCalls += 1;
    return [];
  }) as unknown as typeof prisma.$transaction;

  const response = await POST(postRequest({
    ...customer,
    items: [
      { slug: 'alpha', quantity: 1 },
      { slug: 'missing', quantity: 1 },
    ],
  }));
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.equal(createCalls, 0);
  assert.equal(transactionCalls, 0);
});

for (const [label, salePrice] of [
  ['NaN', Number.NaN],
  ['Infinity', Number.POSITIVE_INFINITY],
  ['negative Infinity', Number.NEGATIVE_INFINITY],
  ['negative', -0.01],
] as const) {
  test(`rejects ${label} database price before creating orders`, async () => {
    let createCalls = 0;
    let transactionCalls = 0;
    prisma.product.findMany = (async () => [{ ...publishedAlpha, salePrice }]) as unknown as typeof prisma.product.findMany;
    prisma.order.create = (() => {
      createCalls += 1;
      return Promise.resolve({});
    }) as unknown as typeof prisma.order.create;
    prisma.$transaction = (async () => {
      transactionCalls += 1;
      return [];
    }) as unknown as typeof prisma.$transaction;

    const response = await POST(postRequest({
      ...customer,
      items: [{ slug: 'alpha', quantity: 1 }],
    }));
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(createCalls, 0);
    assert.equal(transactionCalls, 0);
  });
}

test('allows a zero-priced database product for free-item compatibility', async () => {
  prisma.product.findMany = (async () => [{ ...publishedAlpha, salePrice: 0 }]) as unknown as typeof prisma.product.findMany;
  const transaction = mockOrderTransaction();

  const response = await POST(postRequest({
    ...customer,
    items: [{ slug: 'alpha', quantity: 2 }],
  }));

  assert.equal(response.status, 200);
  assert.equal(transaction.transactionCalls, 1);
  assert.equal(transaction.writes[0]?.data.amount, 0);
});

test('Prisma query errors return a generic 500 without internal details', async () => {
  const internalMessage = 'Prisma database host and credential details';
  prisma.product.findMany = (async () => {
    throw new Error(internalMessage);
  }) as unknown as typeof prisma.product.findMany;
  const originalConsoleError = console.error;
  const loggedCalls: unknown[][] = [];
  console.error = (...data: unknown[]) => {
    loggedCalls.push(data);
  };

  try {
    const response = await POST(postRequest({
      ...customer,
      items: [{ slug: 'alpha', quantity: 1 }],
    }));
    const text = await response.text();

    assert.equal(response.status, 500);
    assert.doesNotMatch(text, new RegExp(internalMessage, 'i'));
    assert.match(text, /订单创建失败/);
    assert.deepEqual(loggedCalls, [['orders.create_failed', { name: 'Error' }]]);
    assert.doesNotMatch(JSON.stringify(loggedCalls), new RegExp(internalMessage, 'i'));
  } finally {
    console.error = originalConsoleError;
  }
});

test('a create failure rejected by the transaction never returns partial success', async () => {
  prisma.product.findMany = (async () => [publishedAlpha, publishedBeta]) as unknown as typeof prisma.product.findMany;
  const queuedWrites: Prisma.OrderCreateArgs[] = [];
  const executedWrites: Prisma.OrderCreateArgs[] = [];
  let transactionCalls = 0;
  let transactionOperationCount = 0;
  let successfulCreates = 0;
  prisma.order.create = ((args: Prisma.OrderCreateArgs) => {
    const writeIndex = queuedWrites.push(args) - 1;
    return {
      execute: async () => {
        executedWrites.push(args);
        if (writeIndex === 1) {
          throw new Error('second create failed with sensitive detail');
        }
        successfulCreates += 1;
        return { orderNo: args.data.orderNo };
      },
    };
  }) as unknown as typeof prisma.order.create;
  prisma.$transaction = (async (operations: Array<{ execute: () => Promise<unknown> }>) => {
    transactionCalls += 1;
    transactionOperationCount = operations.length;
    const results: unknown[] = [];
    for (const operation of operations) {
      results.push(await operation.execute());
    }
    return results;
  }) as unknown as typeof prisma.$transaction;
  const originalConsoleError = console.error;
  const loggedCalls: unknown[][] = [];
  console.error = (...data: unknown[]) => {
    loggedCalls.push(data);
  };

  try {
    const response = await POST(postRequest({
      ...customer,
      items: [
        { slug: 'alpha', quantity: 1 },
        { slug: 'beta', quantity: 1 },
      ],
    }));
    const body = await response.json();
    const serializedResponse = JSON.stringify(body);

    assert.equal(response.status, 500);
    assert.equal(body.success, false);
    assert.equal(body.error, '订单创建失败');
    assert.equal(transactionCalls, 1);
    assert.equal(transactionOperationCount, 2);
    assert.equal(queuedWrites.length, 2);
    assert.equal(executedWrites.length, 2);
    assert.equal(successfulCreates, 1);
    assert.equal('orders' in body, false);
    assert.doesNotMatch(serializedResponse, /Alpha|Beta|13800000000|测试地址|测试备注|second create failed/i);
    assert.deepEqual(loggedCalls, [['orders.create_failed', { name: 'Error' }]]);
  } finally {
    console.error = originalConsoleError;
  }
});
