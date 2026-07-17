import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPublicProductWhere } from '@/lib/product-os-config';

// POST /api/cart — 获取购物车中的作品信息
export async function POST(request: NextRequest) {
  try {
    const { slugs } = await request.json();
    if (!slugs?.length) return NextResponse.json([]);

    const products = await prisma.product.findMany({
      where: { slug: { in: slugs }, ...getPublicProductWhere() },
      select: { slug: true, name: true, salePrice: true, coverImage: true },
    });

    return NextResponse.json(products);
  } catch {
    return NextResponse.json([]);
  }
}
