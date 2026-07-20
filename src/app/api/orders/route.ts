import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPublicProductWhere } from '@/lib/product-os-config';

const MAX_ITEM_ENTRIES = 100;
const MAX_QUANTITY_PER_PRODUCT = 99;
const MAX_CUSTOMER_NAME_LENGTH = 100;
const MAX_PHONE_LENGTH = 50;
const MAX_ADDRESS_LENGTH = 500;
const MAX_REMARK_LENGTH = 1000;

type ErrorStatus = 400 | 405 | 500;

function errorResponse(message: string, status: ErrorStatus, headers?: HeadersInit) {
  return NextResponse.json(
    { success: false, error: message },
    { status, headers },
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredString(
  value: unknown,
  maxLength: number,
): string | null {
  if (typeof value !== 'string') return null;

  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) return null;

  return normalized;
}

function optionalString(value: unknown, maxLength: number): string | null {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value !== 'string' || value.length > maxLength) return null;

  return value.trim();
}

function getSafeErrorInfo(error: unknown) {
  return {
    name: error instanceof Error ? error.name : 'UnknownError',
  };
}

function createOrderNo(index: number): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `YW${timestamp}${index.toString(36).toUpperCase()}${suffix}`;
}

// POST /api/orders — create one Order row per product in a single transaction.
export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse('请求体必须是有效 JSON', 400);
  }

  if (!isRecord(body)) {
    return errorResponse('请求格式无效', 400);
  }

  const { items } = body;
  if (!Array.isArray(items) || items.length === 0) {
    return errorResponse('商品列表不能为空', 400);
  }
  if (items.length > MAX_ITEM_ENTRIES) {
    return errorResponse('商品条目过多', 400);
  }

  const customerName = requiredString(body.customerName, MAX_CUSTOMER_NAME_LENGTH);
  const phone = requiredString(body.phone, MAX_PHONE_LENGTH);
  const address = requiredString(body.address, MAX_ADDRESS_LENGTH);
  const remark = optionalString(body.remark, MAX_REMARK_LENGTH);

  if (!customerName || !phone || !address || remark === null) {
    return errorResponse('客户信息无效', 400);
  }

  // Duplicate slugs are merged so each product creates exactly one Order row.
  const quantityBySlug = new Map<string, number>();
  for (const item of items) {
    if (!isRecord(item)) {
      return errorResponse('商品条目格式无效', 400);
    }

    const slug = typeof item.slug === 'string' ? item.slug.trim() : '';
    const quantity = item.quantity;
    if (!slug) {
      return errorResponse('商品标识无效', 400);
    }
    if (
      typeof quantity !== 'number'
      || !Number.isInteger(quantity)
      || quantity <= 0
      || quantity > MAX_QUANTITY_PER_PRODUCT
    ) {
      return errorResponse(`商品 ${slug} 的数量无效`, 400);
    }

    const mergedQuantity = (quantityBySlug.get(slug) ?? 0) + quantity;
    if (mergedQuantity > MAX_QUANTITY_PER_PRODUCT) {
      return errorResponse(`商品 ${slug} 的合计数量超过上限`, 400);
    }
    quantityBySlug.set(slug, mergedQuantity);
  }

  try {
    const slugs = [...quantityBySlug.keys()];
    const products = await prisma.product.findMany({
      where: {
        slug: { in: slugs },
        ...getPublicProductWhere(),
      },
      select: {
        id: true,
        slug: true,
        name: true,
        salePrice: true,
      },
    });

    if (products.length !== slugs.length) {
      return errorResponse('一个或多个商品不可购买', 400);
    }
    if (products.some((product) => !Number.isFinite(product.salePrice) || product.salePrice < 0)) {
      return errorResponse('一个或多个商品暂不可购买', 400);
    }

    const productBySlug = new Map(products.map((product) => [product.slug, product]));
    const orderWrites = slugs.map((slug, index) => {
      const product = productBySlug.get(slug);
      if (!product) {
        // The length check above makes this unreachable unless the query result is malformed.
        throw new Error('Validated product result is incomplete');
      }

      const quantity = quantityBySlug.get(slug);
      if (quantity === undefined) {
        throw new Error('Validated quantity result is incomplete');
      }

      return prisma.order.create({
        data: {
          orderNo: createOrderNo(index),
          productId: product.id,
          productName: product.name,
          quantity,
          amount: product.salePrice * quantity,
          customerName,
          phone,
          address,
          remark,
          status: 'pending',
        },
        select: {
          orderNo: true,
          productName: true,
          quantity: true,
          amount: true,
          status: true,
        },
      });
    });

    const orders = await prisma.$transaction(orderWrites);
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('orders.create_failed', getSafeErrorInfo(error));
    return errorResponse('订单创建失败', 500);
  }
}

// Public order lookup is disabled until the repository has verified authentication.
export async function GET() {
  return errorResponse('订单查询接口未开放', 405, { Allow: 'POST' });
}
