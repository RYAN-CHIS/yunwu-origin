/**
 * ERP Database Client — read-only access to ERP SKU commerce fields.
 *
 * P0-6B: Storefront reads commerce truth from ERP when erp_product_id is set.
 *
 * Env required: ERP_DATABASE_URL
 * Fallback: if not set, commerce fields default to Web DB values.
 *
 * Uses raw SQL to avoid schema conflicts between Web and ERP databases.
 */

import { PrismaClient } from '@prisma/client';

type ErpPrismaClient = PrismaClient | null;

const globalForErpPrisma = globalThis as unknown as { erpPrisma: ErpPrismaClient };

function createErpPrismaClient(): ErpPrismaClient {
  const url = process.env.ERP_DATABASE_URL || '';
  if (!url) {
    if (typeof window === 'undefined') {
      console.warn(
        '[ERP DB] ERP_DATABASE_URL not set — commerce fields will default to Web DB values.\n' +
        '  Set ERP_DATABASE_URL in .env.local to enable read-through from ERP.'
      );
    }
    return null;
  }

  // Neon PgBouncer compat
  const needsPgbouncer = url.includes('pooler') && !url.includes('pgbouncer=true');
  const datasourceUrl = needsPgbouncer
    ? url + (url.includes('?') ? '&' : '?') + 'pgbouncer=true'
    : url;

  return new PrismaClient({
    datasourceUrl,
    log: ['error', 'warn'],
  });
}

export const erpPrisma: ErpPrismaClient = globalForErpPrisma.erpPrisma || createErpPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForErpPrisma.erpPrisma = erpPrisma;
}

export default erpPrisma;

/**
 * Fetch commerce fields from ERP for a given erp_product_id.
 * Uses raw SQL to avoid schema conflicts.
 * Returns null if ERP DB is not available or product not found.
 */
export async function fetchErpCommerceFields(erpProductId: number): Promise<{
  price: number;
  finishedStock: number;
} | null> {
  if (!erpPrisma) {
    return null;
  }

  try {
    // erp_product_id is the ERP product id.
    // Read the newest SKU for that product so price/stock reflect the live commerce row.
    const result = await erpPrisma.$queryRaw<Array<{ price: number; finishedStock: number }>>`
      SELECT price, finished_stock as "finishedStock"
      FROM product_skus
      WHERE product_id = ${erpProductId}
      ORDER BY updated_at DESC, id DESC
      LIMIT 1
    `;

    return result[0] || null;
  } catch (error) {
    console.error('[ERP DB] Failed to fetch commerce fields:', error);
    return null;
  }
}
