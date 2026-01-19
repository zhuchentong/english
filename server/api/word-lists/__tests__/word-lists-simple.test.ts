import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from '../../../utils/db'

describe('Word Lists API (GET /api/word-lists)', () => {
  beforeEach(async () => {
    await prisma.wordList.deleteMany()
    await prisma.user.deleteMany()
  })

  it('should return empty array when no word lists exist', async () => {
    const event = new Request('http://localhost:3000/api/word-lists')
    const handler = (await import('../../word-lists.get.ts')).default
    const response = await handler(event)
    const result = await response.json()

    expect(result.data).toEqual([])
    expect(result.pagination).toMatchObject({
      total: 0,
      page: 1,
      pageSize: 50,
      totalPages: 0
    })
  })
})
