import type { PageBuilder } from '~~/server/utils/define-page-builder'
import { prisma } from '~~/prisma/client'

/**
 * @description 获取指定书籍下的单词列表（不含计数）
 * @param {number} bookId - 书籍ID
 * @param {PageBuilder} pageBuilder - 分页构建器
 * @returns {Promise<import('@prisma/client').BookItem[]>} 单词项数组
 * @example
 * ```typescript
 * const pageBuilder = new PageBuilder({ pageIndex: 0, pageSize: 10 })
 * const items = await getWordsByBookId(1, pageBuilder)
 * ```
 */
export function getWordsByBookId(bookId: number, pageBuilder: PageBuilder) {
  return prisma.bookItem.findMany({
    ...pageBuilder.toPageArgs(),
    where: { bookId },
    include: {
      word: {
        select: {
          id: true,
          word: true,
          phoneticUK: true,
          phoneticUS: true,
          difficulty: true,
          viewCount: true,
          definitions: { select: { translation: true }, take: 1 },
        },
      },
    },
    orderBy: { addedAt: 'desc' },
  })
}

/**
 * @description 获取指定书籍下的单词总数
 * @param {number} bookId - 书籍ID
 * @returns {Promise<number>} 单词总数
 */
export function getWordsCountByBookId(bookId: number) {
  return prisma.bookItem.count({ where: { bookId } })
}

/**
 * @description 获取单词总数
 * @returns {Promise<number>} 单词总数
 */
export function getWordsCount() {
  return prisma.word.count()
}
