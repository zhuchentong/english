import { beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../../server/utils/db'
import { createMockEvent } from '../utils/create-mock-event'
import { resetDB } from '../utils/reset-db'

describe('books API (GET /api/books)', () => {
  beforeEach(async () => {
    await resetDB()
  })
  it('should return paginated books with default parameters', async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        password: 'hashedpassword',
      },
    })

    await prisma.book.create({
      data: { userId: user.id, name: 'Book 1', description: 'Description 1', isPublic: true, wordCount: 10 },
    })
    await prisma.book.create({
      data: { userId: user.id, name: 'Book 2', description: 'Description 2', isPublic: false, wordCount: 20 },
    })
    await prisma.book.create({
      data: { userId: user.id, name: 'Book 3', description: 'Description 3', isPublic: true, wordCount: 30 },
    })

    const event = createMockEvent('http://localhost:3000/api/books?pageIndex=0&pageSize=50')
    const handler = (await import('../../../server/api/books.get')).default
    const result = await handler(event)

    expect(result).toHaveProperty('content')
    expect(result).toHaveProperty('pageIndex')
    expect(result).toHaveProperty('pageSize')
    expect(result).toHaveProperty('pageTotal')
    expect(result).toHaveProperty('total')
    expect(result.content).toHaveLength(3)
    expect(result.content[0]).toMatchObject({
      name: 'Book 3',
      wordCount: 30,
    })
    expect(result).toMatchObject({
      total: 3,
      pageIndex: 0,
      pageSize: 50,
      pageTotal: 1,
    })
  })

  it('should handle custom pagination parameters', async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        password: 'hashedpassword',
      },
    })

    for (let i = 1; i <= 10; i++) {
      await prisma.book.create({
        data: {
          userId: user.id,
          name: `Book ${i}`,
          wordCount: i * 10,
        },
      })
    }

    const event = createMockEvent('http://localhost:3000/api/books?pageIndex=1&pageSize=3')
    const handler = (await import('../../../server/api/books.get')).default
    const result = await handler(event)

    expect(result.content).toHaveLength(3)
    expect(result).toMatchObject({
      total: 10,
      pageIndex: 1,
      pageSize: 3,
      pageTotal: 4,
    })
  })

  it('should return empty array when no books exist', async () => {
    const event = createMockEvent('http://localhost:3000/api/books?pageIndex=0&pageSize=10')
    const handler = (await import('../../../server/api/books.get')).default
    const result = await handler(event)

    expect(result.content).toEqual([])
    expect(result).toMatchObject({
      total: 0,
      pageIndex: 0,
      pageSize: 10,
      pageTotal: 0,
    })
  })

  it('should sort books by createdAt DESC', async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        password: 'hashedpassword',
      },
    })

    await prisma.book.create({
      data: { userId: user.id, name: 'Book 1', wordCount: 10 },
    })

    await new Promise(resolve => setTimeout(resolve, 10))

    await prisma.book.create({
      data: { userId: user.id, name: 'Book 2', wordCount: 20 },
    })

    const event = createMockEvent('http://localhost:3000/api/books?pageIndex=0&pageSize=10')
    const handler = (await import('../../../server/api/books.get')).default
    const result = await handler(event)

    expect(result.content[0].name).toBe('Book 2')
    expect(result.content[1].name).toBe('Book 1')
  })
})
