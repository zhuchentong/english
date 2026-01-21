import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '../../../prisma/client'

/**
 * 书籍单词列表 API (GET /api/books/:id/words)
 * 使用 E2E 测试方式，通过 $fetch 直接调用真实 API
 */
describe('书籍单词列表 API (GET /api/books/:id/words)', async () => {
  await setup({
    build: true,
    server: true,
    setupTimeout: 120000,
  })

  let bookWithWordsId: number
  let bookWithoutWordsId: number
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

    const book1 = await prisma.book.create({
      data: { userId: user.id, name: '有单词的书籍', description: '关联了单词' },
    })
    bookWithWordsId = book1.id

    const book2 = await prisma.book.create({
      data: { userId: user.id, name: '无单词的书籍', description: '没有关联单词' },
    })
    bookWithoutWordsId = book2.id

    const createdWords = []
    for (let i = 1; i <= 10; i++) {
      const word = await prisma.word.create({
        data: {
          word: `word${i}`,
          phoneticUK: `/wɜːrd${i}/`,
          phoneticUS: `/wɜrd${i}/`,
          definitions: {
            create: {
              partOfSpeech: 'n.',
              translation: `单词${i}的含义`,
            },
          },
        },
      })
      createdWords.push(word)
    }
    wordIds = createdWords.map(w => w.id)

    await prisma.bookItem.createMany({
      data: wordIds.slice(0, 5).map(wordId => ({
        bookId: bookWithWordsId,
        wordId,
      })),
    })
  })

  afterAll(async () => {
    await prisma.bookItem.deleteMany({
      where: { bookId: { in: [bookWithWordsId, bookWithoutWordsId] } },
    })
    await prisma.book.deleteMany({
      where: { id: { in: [bookWithWordsId, bookWithoutWordsId] } },
    })
    await prisma.word.deleteMany({ where: { id: { in: wordIds } } })
  })

  it('应该返回指定书籍关联的单词列表', async () => {
    // Arrange
    const url = `/api/books/${bookWithWordsId}/words`

    // Act
    const result = await $fetch(url)

    // Assert
    expect(result).toHaveProperty('content')
    expect(result).toHaveProperty('total', 5)
    expect(result.content).toHaveLength(5)
    expect(result.content[0]).toHaveProperty('id')
    expect(result.content[0]).toHaveProperty('word')
    expect(result.content[0]).toHaveProperty('definition')
  })

  it('应该支持分页参数限制返回数量', async () => {
    // Arrange
    const url = `/api/books/${bookWithWordsId}/words`
    const params = { pageIndex: 0, pageSize: 2 }

    // Act
    const result = await $fetch(url, { params })

    // Assert
    expect(result.pageSize).toBe(2)
    expect(result.content).toHaveLength(2)
  })

  it('应该正确返回分页的第二页数据', async () => {
    // Arrange
    const url = `/api/books/${bookWithWordsId}/words`
    const params = { pageIndex: 1, pageSize: 2 }

    // Act
    const result = await $fetch(url, { params })

    // Assert
    expect(result.pageIndex).toBe(1)
    expect(result.content).toHaveLength(2)
  })

  it('当书籍没有关联单词时应该返回空列表', async () => {
    // Arrange
    const url = `/api/books/${bookWithoutWordsId}/words`

    // Act
    const result = await $fetch(url)

    // Assert
    expect(result.content).toEqual([])
    expect(result.total).toBe(0)
  })

  it('当书籍不存在时应该返回 404 错误', async () => {
    // Arrange
    const url = '/api/books/99999/words'

    // Act & Assert
    try {
      await $fetch(url)
      expect(false).toBe(true)
    }
    catch (error: any) {
      expect(error.statusCode).toBe(404)
      expect(error.statusMessage).toBe('Book not found')
    }
  })
})
