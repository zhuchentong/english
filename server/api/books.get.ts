import { defineEventHandler, getQuery, HTTPError } from 'h3'
import { prisma } from '../utils/db'
import { definePageBuilder } from '../utils/define-page-builder'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const pageSize = Number(query.pageSize) || 50

    const pageBuilder = await definePageBuilder({ pageIndex: page - 1, pageSize })
    const pageArgs = pageBuilder.toPageArgs()

    const [data, total] = await Promise.all([
      prisma.book.findMany({
        ...pageArgs,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.book.count(),
    ])

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
    console.error('Failed to fetch books:', error)
    throw new HTTPError({
      status: 500,
      statusText: 'Failed to fetch books',
    })
  }
})
