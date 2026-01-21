import { createError, defineEventHandler } from 'h3'
import { bookExists } from '~~/server/service/book.service'
import { getWordsByBookId, getWordsCountByBookId } from '~~/server/service/word.service'
import { definePageBuilder } from '~~/server/utils/define-page-builder'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)

    if (Number.isNaN(id)) {
      throw createError({
        status: 400,
        statusText: 'Invalid book ID',
      })
    }

    const exists = await bookExists(id)

    if (!exists) {
      throw createError({
        status: 404,
        statusText: 'Book not found',
      })
    }

    const pageBuilder = await definePageBuilder(event)
    const [data, total] = await Promise.all([
      getWordsByBookId(id, pageBuilder),
      getWordsCountByBookId(id),
    ])

    return pageBuilder.toPageResponse(data, total)
  }
  catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      status: 500,
      statusText: 'Failed to fetch words from book',
    })
  }
})
