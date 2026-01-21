import type { PageBuilder } from '~~/server/utils/define-page-builder'
import { prisma } from '~~/prisma/client'

/**
 * @description 获取书籍列表（不含计数）
 * @param {PageBuilder} pageBuilder - 分页构建器
 * @returns {Promise<import('@prisma/client').Book[]>} 书籍数组
 * @example
 * ```typescript
 * const pageBuilder = new PageBuilder({ pageIndex: 0, pageSize: 10 })
 * const books = await getBookList(pageBuilder)
 * ```
 */
export function getBookList(pageBuilder: PageBuilder) {
  return prisma.book.findMany({
    ...pageBuilder.toPageArgs(),
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * @description 获取书籍总数
 * @returns {Promise<number>} 书籍总数
 */
export function getBookCount() {
  return prisma.book.count()
}

/**
 * @description 根据ID获取书籍详情
 * @param {number} id - 书籍ID
 * @returns {Promise<import('@prisma/client').Book | null>} 书籍详情，不存在返回 null
 */
export function getBookById(id: number) {
  return prisma.book.findUnique({ where: { id } })
}

/**
 * @description 检查书籍是否存在
 * @param {number} id - 书籍ID
 * @returns {Promise<boolean>} 存在返回 true，否则返回 false
 */
export function bookExists(id: number) {
  return prisma.book.findUnique({ where: { id } }).then(Boolean)
}
