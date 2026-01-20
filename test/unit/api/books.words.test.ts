import { beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../../server/utils/db'
import { createMockEvent } from '../utils/create-mock-event'
import { resetDB } from '../utils/reset-db'

describe('book Words API (GET /api/books/:id/words)', () => {
  beforeEach(async () => {
    await resetDB()
  })

  it('should return paginated words from a book with phonetics and definitions', async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        password: 'hashedpassword',
      },
    })

    const book = await prisma.book.create({
      data: {
        userId: user.id,
        name: 'Test Book',
        wordCount: 3,
      },
    })

    const wordsData = [
      { word: 'hello', phoneticUK: '/həˈləʊ/', phoneticUS: '/həˈloʊ/', difficulty: 1 },
      { word: 'world', phoneticUK: '/wɜːld/', phoneticUS: '/wɜːrld/', difficulty: 2 },
      { word: 'test', phoneticUK: '/test/', phoneticUS: '/test/', difficulty: 1 },
    ]

    await prisma.word.createMany({
      data: wordsData,
    })

    const createdWords = await prisma.word.findMany()

    for (const word of createdWords) {
      await prisma.definition.create({
        data: {
          wordId: word.id,
          translation: `${word.word} 的中文释义`,
          englishDef: `${word.word} english definition`,
        },
      })
    }

    await prisma.bookItem.createMany({
      data: createdWords.map(word => ({
        bookId: book.id,
        wordId: word.id,
      })),
    })

    const event = createMockEvent(`http://localhost:3000/api/books/${book.id}/words?page=1&pageSize=50`, { id: book.id.toString() })
    const handler = (await import('../../../server/api/books/[id]/words.get')).default
    const result = await handler(event)

    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('pagination')
    expect(result.data).toHaveLength(3)
    expect(result.data[0]).toMatchObject({
      id: expect.any(Number),
      word: expect.any(String),
      phoneticUK: expect.any(String),
      phoneticUS: expect.any(String),
      difficulty: expect.any(Number),
      viewCount: expect.any(Number),
      itemId: expect.any(Number),
      addedAt: expect.any(String),
      definition: expect.any(String),
    })
    expect(result.pagination).toMatchObject({
      total: 3,
      page: 1,
      pageSize: 50,
      totalPages: 1,
    })
  })

  it('should return 404 when book does not exist', async () => {
    const event = createMockEvent('http://localhost:3000/api/books/99999/words', { id: '99999' })
    const handler = (await import('../../../server/api/books/[id]/words.get')).default

    await expect(handler(event)).rejects.toMatchObject({
      statusCode: 404,
      statusMessage: 'Book not found',
    })
  })

  it('should return empty array for book with no words', async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        password: 'hashedpassword',
      },
    })

    const book = await prisma.book.create({
      data: {
        userId: user.id,
        name: 'Empty Book',
        wordCount: 0,
      },
    })

    const event = createMockEvent(`http://localhost:3000/api/books/${book.id}/words`, { id: book.id.toString() })
    const handler = (await import('../../../server/api/books/[id]/words.get')).default
    const result = await handler(event)

    expect(result.data).toEqual([])
    expect(result.pagination).toMatchObject({
      total: 0,
      page: 1,
      pageSize: 50,
      totalPages: 0,
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

    const book = await prisma.book.create({
      data: {
        userId: user.id,
        name: 'Test Book',
        wordCount: 10,
      },
    })

    for (let i = 1; i <= 10; i++) {
      const word = await prisma.word.create({
        data: {
          word: `word${i}`,
          phoneticUK: `/wɜːd${i}/`,
          phoneticUS: `/wɜːrd${i}/`,
          difficulty: 1,
        },
      })
      await prisma.bookItem.create({
        data: {
          bookId: book.id,
          wordId: word.id,
        },
      })
    }

    const event = createMockEvent(`http://localhost:3000/api/books/${book.id}/words?page=2&pageSize=3`, { id: book.id.toString() })
    const handler = (await import('../../../server/api/books/[id]/words.get')).default
    const result = await handler(event)

    expect(result.data).toHaveLength(3)
    expect(result.pagination).toMatchObject({
      total: 10,
      page: 2,
      pageSize: 3,
      totalPages: 4,
    })
  })

  it('should sort words by addedAt DESC', async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        password: 'hashedpassword',
      },
    })

    const book = await prisma.book.create({
      data: {
        userId: user.id,
        name: 'Test Book',
        wordCount: 3,
      },
    })

    const word1 = await prisma.word.create({
      data: { word: 'first', phoneticUK: '/fɜːst/', phoneticUS: '/fɜːrst/', difficulty: 1 },
    })
    await prisma.bookItem.create({
      data: { bookId: book.id, wordId: word1.id },
    })

    await new Promise(resolve => setTimeout(resolve, 10))

    const word2 = await prisma.word.create({
      data: { word: 'second', phoneticUK: '/ˈsekənd/', phoneticUS: '/ˈsekənd/', difficulty: 1 },
    })
    await prisma.bookItem.create({
      data: { bookId: book.id, wordId: word2.id },
    })

    const event = createMockEvent(`http://localhost:3000/api/books/${book.id}/words`, { id: book.id.toString() })
    const handler = (await import('../../../server/api/books/[id]/words.get')).default
    const result = await handler(event)

    expect(result.data[0].word).toBe('second')
    expect(result.data[1].word).toBe('first')
  })
})
