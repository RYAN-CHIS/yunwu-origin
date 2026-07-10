import prisma from "@/lib/prisma";

export interface BannerRecord {
  id: number;
  title: string | null;
  subtitle: string | null;
  btn_text: string | null;
  image_url: string | null;
  mobile_image_url: string | null;
  link_url: string | null;
  position: string | null;
  sort_order: number | null;
  status: string | null;
  start_at: Date | null;
  end_at: Date | null;
  published_at: Date | null;
}

/**
 * 读取指定 placement 下、当前时间有效、且已发布（PUBLISHED）的 Banner。
 *
 * 单一数据源：Brand DB 的 banners 表（与后台「Banner 管理」共用同一数据库）。
 * 后台负责创建/编辑/排序/发布/下架/删除；前台只消费发布数据。
 *
 * 过滤规则：
 *   - status = 'PUBLISHED'
 *   - start_at 为空 或 start_at <= 当前时间
 *   - end_at 为空 或 end_at >= 当前时间
 * 排序：sort_order 升序（null 视为 0），其次 created_at 倒序。
 *
 * 数据请求失败时返回空数组，绝不抛出，避免首页白屏。
 */
export async function getPublishedBannersByPlacement(
  placement: string
): Promise<BannerRecord[]> {
  try {
    const now = new Date();
    const rows = await prisma.$queryRawUnsafe<BannerRecord[]>(
      `SELECT * FROM banners
       WHERE position = $1
         AND status = 'PUBLISHED'
         AND (start_at IS NULL OR start_at <= $2)
         AND (end_at IS NULL OR end_at >= $2)
       ORDER BY COALESCE(sort_order, 0) ASC, created_at DESC`,
      placement,
      now
    );
    return rows || [];
  } catch (e) {
    console.error("[banners] getPublishedBannersByPlacement failed:", e);
    return [];
  }
}
