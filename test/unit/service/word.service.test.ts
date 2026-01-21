import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '../../../prisma/client'
import { getWordsByBookId, getWordsCountByBookId, getWordsCount } from '../../../server/service/word.service'
import type { PageBuilderOptions } from '../../../server/utils/define-page-builder'
import { PageBuilder } from '../../../server/utils/define-page-builder'

describe('单词 Service 测试', () => {
  let testUserId: number
  let bookWithWordsId: number
  let bookWithoutWordsId: number
  let wordIds: number[] = []

  function createPageBuilder(options: Partial<PageBuilderOptions> = {}): PageBuilder {
    return new PageBuilder({
      pageIndex: options.pageIndex ?? 0,
      pageSize: options.pageSize ?? 10,
    })
  }

  beforeAll(async () => {
    await prisma.userWord.deleteMany()
    await prisma.favorite.deleteMany()
    await prisma.bookItem.deleteMany()
    await prisma.book.deleteMany()
    await prisma.word.deleteMany()

    const user = await prisma.user.upsert({
      where: { email: 'service-test@example.com' },
      update: {},
      create: { email: 'service-test@example.com', name: 'Service 测试用户' },
    })
    testUserId = user.id

    const book1 = await prisma.book.create({
      data: { userId: testUserId, name: '有单词的书籍', description: '关联了单词' },
    })
    bookWithWordsId = book1.id

    const book2 = await prisma.book.create({
      data: { userId: testUserId, name: '无单词的书籍', description: '没有关联单词' },
    })
    bookWithoutWordsId = book2.id

    const createdWords = []
    for (let i = 1; i <= 10; i++) {
      const word = await prisma.word.create({
        data: {
          word: `testword${i}`,
          phoneticUK: `/θestwɜːrd${i}/`,
          phoneticUS: `/θestwɜrd${i}/`,
          definitions: {
            create: {
              partOfSpeech: 'n.',
              translation: `testword${i}的中文含义`,
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
    await prisma.userWord.deleteMany()
    await prisma.favorite.deleteMany()
    await prisma.bookItem.deleteMany({ where: { bookId: { in: [bookWithWordsId, bookWithoutWordsId] } } })
    await prisma.book.deleteMany({ where: { id: { in: [bookWithWordsId, bookWithoutWordsId] } } })
    await prisma.word.deleteMany({ where: { id: { in: wordIds } } })
    await prisma.user.deleteMany()
  })

  describe('getWordsByBookId 函数', () => {
    it('应该返回空数组当书籍没有单词时', async () => {
      const pageBuilder = createPageBuilder()
      const result = await getWordsByBookId(bookWithoutWordsId, pageBuilder)

      expect(result).toEqual([])
    })

    it('应该正确返回指定书籍的单词列表', async () => {
      const pageBuilder = createPageBuilder()
      const result = await getWordsByBookId(bookWithWordsId, pageBuilder)

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(5)
      result.forEach(item => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('bookId', bookWithWordsId)
        expect(item).toHaveProperty('word')
        expect(item.word).toHaveProperty('id')
        expect(item.word).toHaveProperty('word')
        expect(item.word).toHaveProperty('phoneticUK')
        expect(item.word).toHaveProperty('phoneticUS')
      })
    })

    it('应该支持自定义分页参数', async () => {
      const pageBuilder = createPageBuilder({ pageIndex: 0, pageSize: 2 })
      const result = await getWordsByBookId(bookWithWordsId, pageBuilder)

      expect(result.length).toBe(2)
    })

    it('应该正确关联单词的音标和释义信息', async () => {
      const pageBuilder = createPageBuilder({ pageSize: 10 })
      const result = await getWordsByBookId(bookWithWordsId, pageBuilder)

      result.forEach(item => {
        expect(item.word).toHaveProperty('phoneticUK')
        expect(item.word).toHaveProperty('phoneticUS')
        expect(item.word).toHaveProperty('definitions')
        expect(Array.isArray(item.word.definitions)).toBe(true)
        if (item.word.definitions.length > 0) {
          expect(item.word.definitions[0]).toHaveProperty('translation')
        }
      })
    })

    it('应该按添加时间倒序排列', async () => {
      const pageBuilder = createPageBuilder({ pageSize: 10 })
      const result = await getWordsByBookId(bookWithWordsId, pageBuilder)

      const timestamps = result.map(item => new Date(item.addedAt).getTime())
      expect(timestamps).toEqual(timestamps.slice().sort((a, b) => b - a))
    })
  })

  describe('getWordsCountByBookId 函数', () => {
    it('应该返回指定书籍的正确单词数', async () => {
      const count = await getWordsCountByBookId(bookWithWordsId)
      expect(count).toBe(5)
    })

    it('应该返回 0 当书籍没有单词时', async () => {
      const count = await getWordsCountByBookId(bookWithoutWordsId)
      expect(count).toBe(0)
    })
  })

  describe('getWordsCount 函数', () => {
    it('应该返回全局单词总数', async () => {
      const count = await getWordsCount()
      expect(count).toBe(10)
    })

    it('应该返回 0 当没有单词时', async () => {
      await prisma.userWord.deleteMany()
      await prisma.favorite.deleteMany()
      await prisma.bookItem.deleteMany()
      await prisma.word.deleteMany()

      const count = await getWordsCount()
      expect(count).toBe(0)
    })
  })
})
