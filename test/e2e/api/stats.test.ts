import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '../../../prisma/client'

/**
 * 统计 API (GET /api/stats)
 * 使用 E2E 测试方式，通过 $fetch 直接调用真实 API
 */
describe('统计 API (GET /api/stats)', async () => {
  await setup({
    build: true,
    server: true,
    setupTimeout: 120000,
  })

  let bookIds: number[] = []
  let wordIds: number[] = []

  beforeAll(async () => {
    await prisma.userWord.deleteMany()
    await prisma.favorite.deleteMany()
    await prisma.bookItem.deleteMany()
    await prisma.book.deleteMany()
    await prisma.word.deleteMany()

    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: { email: 'test@example.com', name: '测试用户' },
    })

    const createdBooks = await prisma.book.createMany({
      data: [
        { userId: user.id, name: '统计书籍1', wordCount: 10 },
        { userId: user.id, name: '统计书籍2', wordCount: 20 },
        { userId: user.id, name: '统计书籍3', wordCount: 30 },
      ],
    })
    bookIds = await prisma.book.findMany({
      where: { name: { in: ['统计书籍1', '统计书籍2', '统计书籍3'] } },
      select: { id: true },
    }).then(books => books.map(b => b.id))

    const createdWords = []
    for (let i = 1; i <= 15; i++) {
      const word = await prisma.word.create({
        data: {
          word: `statword${i}`,
          definitions: {
            create: { partOfSpeech: 'n.', translation: `统计单词${i}` },
          },
        },
      })
      createdWords.push(word)
    }
    wordIds = createdWords.map(w => w.id)

    await prisma.userWord.createMany({
      data: [
        { userId: user.id, wordId: wordIds[0], status: 'learning' },
        { userId: user.id, wordId: wordIds[1], status: 'learning' },
        { userId: user.id, wordId: wordIds[2], status: 'mastered' },
      ],
    })
  })

  afterAll(async () => {
    await prisma.userWord.deleteMany({ where: { wordId: { in: wordIds } } })
    await prisma.favorite.deleteMany({ where: { wordId: { in: wordIds } } })
    await prisma.bookItem.deleteMany({ where: { bookId: { in: bookIds } } })
    await prisma.book.deleteMany({ where: { id: { in: bookIds } } })
    await prisma.word.deleteMany({ where: { id: { in: wordIds } } })
  })

  it('应该返回统计数据对象', async () => {
    // Arrange
    const url = '/api/stats'

    // Act
    const result = await $fetch(url)

    // Assert
    expect(result).toHaveProperty('totalBooks')
    expect(result).toHaveProperty('totalWords')
    expect(result).toHaveProperty('learningWords')
    expect(result).toHaveProperty('masteredWords')
  })

  it('应该返回正确的书籍数量', async () => {
    // Arrange
    const url = '/api/stats'

    // Act
    const result = await $fetch(url)

    // Assert
    expect(result.totalBooks).toBe(3)
  })
})
