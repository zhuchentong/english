import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from '../../../utils/db'

describe('Word Lists API (GET /api/word-lists)', () => {
  it('should return paginated word lists with default parameters', async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        password: 'hashedpassword'
      }
    })

    await prisma.wordList.createMany({
      data: [
        { userId: user.id, name: 'Book 1', description: 'Description 1', isPublic: true, wordCount: 10 },
        { userId: user.id, name: 'Book 2', description: 'Description 2', isPublic: false, wordCount: 20 },
        { userId: user.id, name: 'Book 3', description: 'Description 3', isPublic: true, wordCount: 30 }
      ]
    })

    const event = new Request('http://localhost:3000/api/word-lists?page=1&pageSize=50')
    const handler = (await import('../../word-lists.get.ts')).default
    const response = await handler(event)
    const result = await response.json()

    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('pagination')
    expect(result.data).toHaveLength(3)
    expect(result.data[0]).toMatchObject({
      name: 'Book 3',
      wordCount: 30
    })
    expect(result.pagination).toMatchObject({
      total: 3,
      page: 1,
      pageSize: 50,
      totalPages: 1
    })
  })

  it('should handle custom pagination parameters', async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        password: 'hashedpassword'
      }
    })

    for (let i = 1; i <= 10; i++) {
      await prisma.wordList.create({
        data: {
          userId: user.id,
          name: `Book ${i}`,
          wordCount: i * 10
        }
      })
    }

    const event = new Request('http://localhost:3000/api/word-lists?page=2&pageSize=3')
    const handler = (await import('../../word-lists.get.ts')).default
    const response = await handler(event)
    const result = await response.json()

    expect(result.data).toHaveLength(3)
    expect(result.pagination).toMatchObject({
      total: 10,
      page: 2,
      pageSize: 3,
      totalPages: 4
    })
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

  it('should sort word lists by createdAt DESC', async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        password: 'hashedpassword'
      }
    })

    const book1 = await prisma.wordList.create({
      data: { userId: user.id, name: 'Book 1', wordCount: 10 }
    })

    await new Promise(resolve => setTimeout(resolve, 10))

    const book2 = await prisma.wordList.create({
      data: { userId: user.id, name: 'Book 2', wordCount: 20 }
    })

    const event = new Request('http://localhost:3000/api/word-lists')
    const handler = (await import('../../word-lists.get.ts')).default
    const response = await handler(event)
    const result = await response.json()

    expect(result.data[0].name).toBe('Book 2')
    expect(result.data[1].name).toBe('Book 1')
  })
})
