import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { getPublicProductWhere, shouldUsePublishStatusFilter } from '@/lib/product-os-config';
import { PublishStatus } from '@prisma/client';

const originalEnv = process.env.PRODUCT_OS_USE_PUBLISH_STATUS;

afterEach(() => {
  process.env.PRODUCT_OS_USE_PUBLISH_STATUS = originalEnv;
});

test('defaults to publishStatus filter when env is unset', () => {
  delete process.env.PRODUCT_OS_USE_PUBLISH_STATUS;

  assert.equal(shouldUsePublishStatusFilter(), true);
  assert.deepEqual(getPublicProductWhere(), { publishStatus: PublishStatus.PUBLISHED });
});

test('honors explicit false flag', () => {
  process.env.PRODUCT_OS_USE_PUBLISH_STATUS = 'false';

  assert.equal(shouldUsePublishStatusFilter(), false);
  assert.deepEqual(getPublicProductWhere(), { status: 'PUBLISHED' });
});

test('invalid env defaults to publishStatus and warns once', () => {
  process.env.PRODUCT_OS_USE_PUBLISH_STATUS = 'maybe';
  const originalWarn = console.warn;
  let callCount = 0;
  console.warn = () => {
    callCount += 1;
  };

  try {
    assert.equal(shouldUsePublishStatusFilter(), true);
    assert.deepEqual(getPublicProductWhere(), { publishStatus: PublishStatus.PUBLISHED });
    assert.equal(callCount, 1);
  } finally {
    console.warn = originalWarn;
  }
});
