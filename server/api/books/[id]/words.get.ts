import { createError, defineEventHandler, getQuery } from 'h3'
import { prisma } from '../../../utils/db'
import { definePageBuilder } from '../../../utils/define-page-builder'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)

    if (Number.isNaN(id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid book ID',
      })
    }

    const bookExists = await prisma.book.findUnique({
      where: { id },
    })

    if (!bookExists) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Book not found',
      })
    }

    const query = getQuery(event)
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 50

    const pageBuilder = await definePageBuilder({ pageIndex: page - 1, pageSize })
    const pageArgs = pageBuilder.toPageArgs()

    const [items, total] = await Promise.all([
      prisma.bookItem.findMany({
        ...pageArgs,
        where: {
          bookId: id,
        },
        include: {
          word: {
            select: {
              id: true,
              word: true,
              phoneticUK: true,
              phoneticUS: true,
              difficulty: true,
              viewCount: true,
              definitions: {
                select: {
                  translation: true,
                  englishDef: true,
                },
                take: 1,
              },
            },
          },
        },
        orderBy: {
          addedAt: 'desc',
        },
      }),
      prisma.bookItem.count({
        where: {
          bookId: id,
        },
      }),
    ])

    const data = items.map(item => ({
      ...item.word,
      itemId: item.id,
      addedAt: item.addedAt.toISOString(),
      definition: item.word.definitions[0]?.translation || '',
    }))

    const totalPages = Math.ceil(total / pageSize)

    return {
      data,
      pagination: {
        total,
        page,
        pageSize,
        totalPages,
      },
    }
  }
  catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch words from book',
    })
  }
})
