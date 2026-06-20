import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const url = process.env.DATABASE_URL || '';
  // Neon PgBouncer 兼容：禁用 prepared statements 防止 "cached plan must not change result type"
  const needsPgbouncer = url.includes('pooler') && !url.includes('pgbouncer=true');
  const datasourceUrl = needsPgbouncer ? url + (url.includes('?') ? '&' : '?') + 'pgbouncer=true' : url;

  return new PrismaClient({
    datasourceUrl: datasourceUrl || undefined,
  });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
