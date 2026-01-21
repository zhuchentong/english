import { createError, defineEventHandler } from 'h3'
import { getBookById } from '~~/server/service/book.service'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)

    if (Number.isNaN(id)) {
      throw createError({
        status: 400,
        statusText: 'Invalid book ID',
      })
    }

    const book = await getBookById(id)

    if (!book) {
      throw createError({
        status: 404,
        statusText: 'Book not found',
      })
    }

    return book
  }
  catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      status: 500,
      statusText: 'Failed to fetch book',
    })
  }
})
