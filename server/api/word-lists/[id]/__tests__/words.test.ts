import { describe, it, expect, beforeEach } from 'vitest'
import { prisma } from '../../../../utils/db'

describe('Word List Words API (GET /api/word-lists/:id/words)', () => {
  beforeEach(async () => {
    await prisma.wordListItem.deleteMany()
    await prisma.wordList.deleteMany()
    await prisma.word.deleteMany()
    await prisma.user.deleteMany()
  })

  it('should return paginated words from a word list with phonetics', async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        password: 'hashedpassword'
      }
    })

    const wordList = await prisma.wordList.create({
      data: {
        userId: user.id,
        name: 'Test Book',
        wordCount: 3
      }
    })

    const words = await prisma.word.createMany({
      data: [
        { word: 'hello', phoneticUK: '/həˈləʊ/', phoneticUS: '/həˈloʊ/', difficulty: 1 },
        { word: 'world', phoneticUK: '/wɜːld/', phoneticUS: '/wɜːrld/', difficulty: 2 },
        { word: 'test', phoneticUK: '/test/', phoneticUS: '/test/', difficulty: 1 }
      ]
    })

    const createdWords = await prisma.word.findMany()
    await prisma.wordListItem.createMany({
      data: createdWords.map(word => ({
        wordListId: wordList.id,
        wordId: word.id
      }))
    })

    const event = new Request(`http://localhost:3000/api/word-lists/${wordList.id}/words?page=1&pageSize=50`)
    const handler = (await import('../../[id]/words.get')).default
    const response = await handler(event)
    const result = await response.json()

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
      addedAt: expect.any(String)
    })
    expect(result.pagination).toMatchObject({
      total: 3,
      page: 1,
      pageSize: 50,
      totalPages: 1
    })
  })

  it('should return 404 when word list does not exist', async () => {
    const event = new Request('http://localhost:3000/api/word-lists/99999/words')
    const handler = (await import('../../[id]/words.get.ts')).default

    await expect(handler(event)).rejects.toMatchObject({
      statusCode: 404,
      statusMessage: 'Word list not found'
    })
  })

  it('should return empty array for word list with no words', async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        password: 'hashedpassword'
      }
    })

    const wordList = await prisma.wordList.create({
      data: {
        userId: user.id,
        name: 'Empty Book',
        wordCount: 0
      }
    })

    const event = new Request(`http://localhost:3000/api/word-lists/${wordList.id}/words`)
    const handler = (await import('../../[id]/words.get.ts')).default
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

  it('should handle custom pagination parameters', async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        password: 'hashedpassword'
      }
    })

    const wordList = await prisma.wordList.create({
      data: {
        userId: user.id,
        name: 'Test Book',
        wordCount: 10
      }
    })

    for (let i = 1; i <= 10; i++) {
      const word = await prisma.word.create({
        data: {
          word: `word${i}`,
          phoneticUK: `/wɜːd${i}/`,
          phoneticUS: `/wɜːrd${i}/`,
          difficulty: 1
        }
      })
      await prisma.wordListItem.create({
        data: {
          wordListId: wordList.id,
          wordId: word.id
        }
      })
    }

    const event = new Request(`http://localhost:3000/api/word-lists/${wordList.id}/words?page=2&pageSize=3`)
    const handler = (await import('../../[id]/words.get.ts')).default
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

  it('should sort words by addedAt DESC', async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        password: 'hashedpassword'
      }
    })

    const wordList = await prisma.wordList.create({
      data: {
        userId: user.id,
        name: 'Test Book',
        wordCount: 3
      }
    })

    const word1 = await prisma.word.create({
      data: { word: 'first', phoneticUK: '/fɜːst/', phoneticUS: '/fɜːrst/', difficulty: 1 }
    })
    await prisma.wordListItem.create({
      data: { wordListId: wordList.id, wordId: word1.id }
    })

    await new Promise(resolve => setTimeout(resolve, 10))

    const word2 = await prisma.word.create({
      data: { word: 'second', phoneticUK: '/ˈsekənd/', phoneticUS: '/ˈsekənd/', difficulty: 1 }
    })
    await prisma.wordListItem.create({
      data: { wordListId: wordList.id, wordId: word2.id }
    })

    const event = new Request(`http://localhost:3000/api/word-lists/${wordList.id}/words`)
    const handler = (await import('../../[id]/words.get.ts')).default
    const response = await handler(event)
    const result = await response.json()

    expect(result.data[0].word).toBe('second')
    expect(result.data[1].word).toBe('first')
  })
})
