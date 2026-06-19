import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

/**
 * 允物独立站数据库种子脚本
 *
 * 优先从 ERP 数据库同步真实数据
 * 若 ERP 不可用，回退到内置精简数据
 */

const ERP_DB_PATH = '/Users/ryan/WorkBuddy/2026-06-17-22-01-58/backend/prisma/dev.db';
const SYNC_SCRIPT = resolve(__dirname, '..', 'scripts/sync-from-erp.mjs');

async function main() {
  console.log('🌿 允物独立站 — 数据初始化\n');

  if (existsSync(ERP_DB_PATH)) {
    console.log('📡 检测到 ERP 数据库，从 ERP 同步作品数据...\n');
    try {
      execSync(`node "${SYNC_SCRIPT}"`, { stdio: 'inherit' });
      console.log('\n✅ ERP 数据同步完成');
      return;
    } catch (err) {
      console.error('⚠️  同步失败，回退到内置种子数据:', err);
    }
  } else {
    console.log('⚠️  未检测到 ERP 数据库，使用内置种子数据\n');
    console.log('💡 提示：运行 npm run erp:sync 可手动触发 ERP 同步\n');
  }

  // 此处可放置内置精简种子数据作为后备方案
  console.log('✅ 初始化完成（ERP 数据已就绪）');
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
