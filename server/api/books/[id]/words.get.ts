import type { Prisma } from '@prisma/client'
import { createError, defineEventHandler } from 'h3'
import { prisma } from '~~/server/utils/db'
import { definePageBuilder } from '~~/server/utils/define-page-builder'

type BookItemWithWord = Prisma.BookItemGetPayload<{
  include: {
    word: {
      select: {
        id: true
        word: true
        phoneticUK: true
        phoneticUS: true
        difficulty: true
        viewCount: true
        definitions: {
          select: {
            translation: true
            englishDef: true
          }
          take: 1
        }
      }
    }
  }
}>

interface WordItem {
  id: number
  word: string
  phoneticUK: string | null
  phoneticUS: string | null
  difficulty: number
  viewCount: number
  definition: string
  itemId: number
  addedAt: string
}

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)

    if (Number.isNaN(id)) {
      throw createError({
        status: 400,
        statusText: 'Invalid book ID',
      })
    }

    const bookExists = await prisma.book.findUnique({
      where: { id },
    })

    if (!bookExists) {
      throw createError({
        status: 404,
        statusText: 'Book not found',
      })
    }

    const pageBuilder = await definePageBuilder(event)
    const pageArgs = pageBuilder.toPageArgs()

    const queryResult = await prisma.bookItem.findMany({
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
    })

    const total = await prisma.bookItem.count({
      where: {
        bookId: id,
      },
    })

    const data: WordItem[] = queryResult.map((item: BookItemWithWord) => ({
      id: item.word.id,
      word: item.word.word,
      phoneticUK: item.word.phoneticUK,
      phoneticUS: item.word.phoneticUS,
      difficulty: item.word.difficulty,
      viewCount: item.word.viewCount,
      definition: item.word.definitions[0]?.translation || '',
      itemId: item.id,
      addedAt: item.addedAt.toISOString(),
    }))

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
