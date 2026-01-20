import { createError, defineEventHandler } from 'h3'
import { prisma } from '../utils/db'
import { definePageBuilder } from '../utils/define-page-builder'

export default defineEventHandler(async (event) => {
  try {
    const pageBuilder = await definePageBuilder(event)
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
