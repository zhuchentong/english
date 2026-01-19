import { prisma } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id)

    if (isNaN(id)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid word list ID'
      })
    }

    const wordListExists = await prisma.wordList.findUnique({
      where: { id }
    })

    if (!wordListExists) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Word list not found'
      })
    }

    const query = getQuery(event)
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 50

    const skip = (page - 1) * pageSize

    const [items, total] = await Promise.all([
      prisma.wordListItem.findMany({
        skip,
        take: pageSize,
        where: {
          wordListId: id
        },
        include: {
          word: {
            select: {
              id: true,
              word: true,
              phoneticUK: true,
              phoneticUS: true,
              difficulty: true,
              viewCount: true
            }
          }
        },
        orderBy: {
          addedAt: 'desc'
        }
      }),
      prisma.wordListItem.count({
        where: {
          wordListId: id
        }
      })
    ])

    const data = items.map(item => ({
      ...item.word,
      itemId: item.id,
      addedAt: item.addedAt.toISOString()
    }))

    const totalPages = Math.ceil(total / pageSize)

    return {
      data,
      pagination: {
        total,
        page,
        pageSize,
        totalPages
      }
    }
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch words from word list'
    })
  }
})
