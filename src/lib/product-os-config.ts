import { PublishStatus } from '@prisma/client';

const DEFAULT_USE_PUBLISH_STATUS = true;
const INVALID_FLAG_WARNING = '[ProductOS][Config] Invalid PRODUCT_OS_USE_PUBLISH_STATUS value; defaulting to publishStatus filter.';

let warnedInvalidFlag = false;

export function shouldUsePublishStatusFilter(): boolean {
  const raw = process.env.PRODUCT_OS_USE_PUBLISH_STATUS;

  if (raw === undefined) return DEFAULT_USE_PUBLISH_STATUS;
  if (raw === 'true') return true;
  if (raw === 'false') return false;

  if (!warnedInvalidFlag) {
    warnedInvalidFlag = true;
    console.warn(INVALID_FLAG_WARNING);
  }

  return DEFAULT_USE_PUBLISH_STATUS;
}

export function getPublicProductWhere() {
  return shouldUsePublishStatusFilter()
    ? { publishStatus: PublishStatus.PUBLISHED }
    : { status: 'PUBLISHED' };
}
