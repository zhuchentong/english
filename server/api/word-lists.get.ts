export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 50

    const skip = (page - 1) * pageSize

    const [data, total] = await Promise.all([
      prisma.wordList.findMany({
        skip,
        take: pageSize,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.wordList.count()
    ])

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
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch word lists'
    })
  }
})
