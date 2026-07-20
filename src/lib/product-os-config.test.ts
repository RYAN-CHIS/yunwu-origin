import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { PublishStatus } from '@prisma/client';
import { getPublicProductWhere, shouldUsePublishStatusFilter } from '@/lib/product-os-config';

const originalFlag = process.env.PRODUCT_OS_USE_PUBLISH_STATUS;

afterEach(() => {
  if (originalFlag === undefined) {
    delete process.env.PRODUCT_OS_USE_PUBLISH_STATUS;
  } else {
    process.env.PRODUCT_OS_USE_PUBLISH_STATUS = originalFlag;
  }
});

test('defaults to the publishStatus filter when the flag is unset', () => {
  delete process.env.PRODUCT_OS_USE_PUBLISH_STATUS;

  assert.equal(shouldUsePublishStatusFilter(), true);
  assert.deepEqual(getPublicProductWhere(), { publishStatus: PublishStatus.PUBLISHED });
});

test('uses the publishStatus filter when the flag is true', () => {
  process.env.PRODUCT_OS_USE_PUBLISH_STATUS = 'true';

  assert.equal(shouldUsePublishStatusFilter(), true);
  assert.deepEqual(getPublicProductWhere(), { publishStatus: PublishStatus.PUBLISHED });
});

test('uses the legacy status filter when the flag is false', () => {
  process.env.PRODUCT_OS_USE_PUBLISH_STATUS = 'false';

  assert.equal(shouldUsePublishStatusFilter(), false);
  assert.deepEqual(getPublicProductWhere(), { status: 'PUBLISHED' });
});

test('invalid flag values warn once and default to the publishStatus filter', () => {
  process.env.PRODUCT_OS_USE_PUBLISH_STATUS = 'invalid';
  const originalWarn = console.warn;
  const warnings: unknown[][] = [];
  console.warn = (...data: unknown[]) => {
    warnings.push(data);
  };

  try {
    assert.equal(shouldUsePublishStatusFilter(), true);
    assert.deepEqual(getPublicProductWhere(), { publishStatus: PublishStatus.PUBLISHED });
    assert.equal(shouldUsePublishStatusFilter(), true);
    assert.equal(warnings.length, 1);
    assert.equal(warnings[0]?.length, 1);
    assert.match(String(warnings[0]?.[0]), /Invalid PRODUCT_OS_USE_PUBLISH_STATUS/);
    assert.doesNotMatch(JSON.stringify(warnings), /invalid/);
  } finally {
    console.warn = originalWarn;
  }
});
