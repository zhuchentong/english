/**
 * @file 统计数据 API 端点
 * @description 提供网站核心统计数据：单词总数和单词书数量
 */

import { createError, defineEventHandler } from 'h3'
import { prisma } from '../../prisma/client'

/**
 * @description 获取网站统计数据
 * @returns {Promise<{wordCount: number, bookCount: number}>} 统计数据对象
 */
export default defineEventHandler(async () => {
  try {
    const [wordCount, bookCount] = await Promise.all([
      prisma.word.count(),
      prisma.book.count(),
    ])

    return { wordCount, bookCount }
  }
  catch (error) {
    console.error('Failed to fetch stats:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch stats',
    })
  }
})
