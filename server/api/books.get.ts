import { createError, defineEventHandler } from 'h3'
import { getBookCount, getBookList } from '~~/server/service/book.service'
import { definePageBuilder } from '~~/server/utils/define-page-builder'

export default defineEventHandler(async (event) => {
  try {
    const pageBuilder = await definePageBuilder(event)
    const [data, total] = await Promise.all([
      getBookList(pageBuilder),
      getBookCount(),
    ])
    return pageBuilder.toPageResponse(data, total)
  }
  catch (error) {
    console.error('Failed to fetch books:', error)
    throw createError({
      status: 500,
      statusText: 'Failed to fetch books',
    })
  }
})
