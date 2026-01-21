import type { PageBuilderOptions } from '../../../server/utils/define-page-builder'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '../../../prisma/client'
import { bookExists, getBookById, getBookCount, getBookList } from '../../../server/service/book.service'
import { PageBuilder } from '../../../server/utils/define-page-builder'

describe('测试 book.service', () => {
  let testUserId: number
  let bookIds: number[] = []

  async function createTestBooks(count: number, startIndex: number = 0) {
    const books = []
    for (let i = 0; i < count; i++) {
      const book = await prisma.book.create({
        data: {
          userId: testUserId,
          name: `测试书籍${startIndex + i}`,
          description: `测试书籍${startIndex + i}的描述`,
        },
      })
      books.push(book)
    }
    return books
  }

  beforeAll(async () => {
    await prisma.bookItem.deleteMany()
    await prisma.book.deleteMany()
    await prisma.user.deleteMany()

    const user = await prisma.user.upsert({
      where: { email: 'service-test@example.com' },
      update: {},
      create: { email: 'service-test@example.com', name: 'Service 测试用户' },
    })
    testUserId = user.id

    const books = await createTestBooks(5, 1)
    bookIds = books.map(b => b.id)
  })

  afterAll(async () => {
    await prisma.bookItem.deleteMany()
    await prisma.book.deleteMany()
    await prisma.user.deleteMany()
  })

  function createPageBuilder(options: Partial<PageBuilderOptions> = {}): PageBuilder {
    return new PageBuilder({
      pageIndex: options.pageIndex ?? 0,
      pageSize: options.pageSize ?? 10,
    })
  }

  describe('getBookList 函数', () => {
    it('应该返回空数组当没有书籍时', async () => {
      await prisma.book.deleteMany({ where: { userId: testUserId } })

      const pageBuilder = createPageBuilder()
      const result = await getBookList(pageBuilder)

      expect(result).toEqual([])
    })

    it('应该正确返回第一页书籍数据', async () => {
      await createTestBooks(5, 1)

      const pageBuilder = createPageBuilder({ pageIndex: 0, pageSize: 10 })
      const result = await getBookList(pageBuilder)

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeLessThanOrEqual(10)
      result.forEach((book) => {
        expect(book).toHaveProperty('id')
        expect(book).toHaveProperty('name')
        expect(book).toHaveProperty('description')
        expect(book).toHaveProperty('createdAt')
      })
    })

    it('应该支持自定义分页参数', async () => {
      const pageBuilder = createPageBuilder({ pageIndex: 0, pageSize: 2 })
      const result = await getBookList(pageBuilder)

      expect(result.length).toBe(2)
    })

    it('应该按创建时间倒序排列', async () => {
      const pageBuilder = createPageBuilder({ pageIndex: 0, pageSize: 10 })
      const result = await getBookList(pageBuilder)

      const timestamps = result.map(book => new Date(book.createdAt).getTime())
      expect(timestamps).toEqual(timestamps.slice().sort((a, b) => b - a))
    })

    it('应该正确处理分页边界条件', async () => {
      const pageBuilder = createPageBuilder({ pageIndex: 10, pageSize: 10 })
      const result = await getBookList(pageBuilder)

      expect(result).toEqual([])
    })
  })

  describe('getBookCount 函数', () => {
    it('应该返回正确的书籍总数', async () => {
      const count = await getBookCount()
      expect(count).toBeGreaterThanOrEqual(5)
    })

    it('应该返回 0 当没有书籍时', async () => {
      const bookIdsToDelete = await prisma.book.findMany({
        where: { userId: testUserId },
        select: { id: true },
      }).then(books => books.map(b => b.id))

      await prisma.bookItem.deleteMany({ where: { bookId: { in: bookIdsToDelete } } })
      await prisma.book.deleteMany({ where: { id: { in: bookIdsToDelete } } })

      const count = await getBookCount()
      expect(count).toBe(0)
    })
  })

  describe('getBookById 函数', () => {
    it('应该返回指定 ID 的书籍详情', async () => {
      const [testBook] = await createTestBooks(1, 100)

      const result = await getBookById(testBook.id)

      expect(result).not.toBeNull()
      expect(result!.id).toBe(testBook.id)
      expect(result!.name).toBe('测试书籍100')
      expect(result!.description).toBe('测试书籍100的描述')

      await prisma.bookItem.deleteMany({ where: { bookId: testBook.id } })
      await prisma.book.deleteMany({ where: { id: testBook.id } })
    })

    it('应该返回 null 当书籍不存在时', async () => {
      const result = await getBookById(99999)
      expect(result).toBeNull()
    })
  })

  describe('bookExists 函数', () => {
    it('应该返回 true 当书籍存在时', async () => {
      const [testBook] = await createTestBooks(1, 200)

      const result = await bookExists(testBook.id)

      expect(result).toBe(true)

      await prisma.bookItem.deleteMany({ where: { bookId: testBook.id } })
      await prisma.book.deleteMany({ where: { id: testBook.id } })
    })

    it('应该返回 false 当书籍不存在时', async () => {
      const result = await bookExists(99999)
      expect(result).toBe(false)
    })
  })
})
