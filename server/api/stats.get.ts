/**
 * @file 统计数据 API 端点
 * @description 提供网站核心统计数据：单词总数和单词书数量
 */

import { createError, defineEventHandler } from 'h3'
import { getBookCount } from '~~/server/service/book.service'
import { getWordsCount } from '../service/word.service'

export default defineEventHandler(async () => {
  try {
    const [wordCount, bookCount] = await Promise.all([
      getWordsCount(),
      getBookCount(),
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
