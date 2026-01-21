import { beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../../server/utils/db'
import { createMockEvent } from '../utils/create-mock-event'
import { resetDB } from '../utils/reset-db'

describe('stats API (GET /api/stats)', () => {
  beforeEach(async () => {
    await resetDB()
  })

  it('should return wordCount and bookCount statistics', async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        password: 'hashedpassword',
      },
    })

    for (let i = 1; i <= 5; i++) {
      await prisma.word.create({
        data: { word: `testword${i}`, difficulty: 1 },
      })
    }

    for (let i = 1; i <= 3; i++) {
      await prisma.book.create({
        data: { userId: user.id, name: `Book ${i}`, wordCount: 10 },
      })
    }

    const event = createMockEvent('http://localhost:3000/api/stats')
    const handler = (await import('../../../server/api/stats.get')).default
    const result = await handler(event)

    expect(result).toHaveProperty('wordCount')
    expect(result).toHaveProperty('bookCount')
    expect(result.wordCount).toBe(5)
    expect(result.bookCount).toBe(3)
  })

  it('should return zero counts when no data exists', async () => {
    const event = createMockEvent('http://localhost:3000/api/stats')
    const handler = (await import('../../../server/api/stats.get')).default
    const result = await handler(event)

    expect(result.wordCount).toBe(0)
    expect(result.bookCount).toBe(0)
  })

  it('should return correct counts with partial data', async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        password: 'hashedpassword',
      },
    })

    await prisma.word.create({ data: { word: 'onlyword', difficulty: 1 } })
    await prisma.book.create({ data: { userId: user.id, name: 'Empty Book' } })

    const event = createMockEvent('http://localhost:3000/api/stats')
    const handler = (await import('../../../server/api/stats.get')).default
    const result = await handler(event)

    expect(result.wordCount).toBe(1)
    expect(result.bookCount).toBe(1)
  })
})
