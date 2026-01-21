import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '../../../prisma/client'

/**
 * 书籍详情 API (GET /api/books/:id)
 * 使用 E2E 测试方式，通过 $fetch 直接调用真实 API
 */
describe('书籍详情 API (GET /api/books/:id)', async () => {
  await setup({
    build: true,
    server: true,
    setupTimeout: 120000,
  })

  let bookIds: number[] = []
  let bookNames: string[] = []

  beforeAll(async () => {
    await prisma.bookItem.deleteMany()
    await prisma.book.deleteMany()

    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: { email: 'test@example.com', name: '测试用户' },
    })

    bookNames = ['详情书籍1', '详情书籍2', '详情书籍3']

    await prisma.book.createMany({
      data: [
        { userId: user.id, name: '详情书籍1', description: '书籍1描述' },
        { userId: user.id, name: '详情书籍2', description: '书籍2描述' },
        { userId: user.id, name: '详情书籍3', description: '书籍3描述' },
      ],
    })

    bookIds = await prisma.book.findMany({
      where: { name: { in: bookNames } },
      select: { id: true },
    }).then(books => books.map(b => b.id))
  })

  afterAll(async () => {
    await prisma.bookItem.deleteMany({ where: { bookId: { in: bookIds } } })
    await prisma.book.deleteMany({ where: { id: { in: bookIds } } })
  })

  it('应该返回指定 ID 的书籍完整信息', async () => {
    // Arrange
    const targetId = bookIds[0]
    const url = `/api/books/${targetId}`

    // Act
    const result = await $fetch(url)

    // Assert
    expect(result).toHaveProperty('id', targetId)
    expect(result).toHaveProperty('name', '详情书籍1')
    expect(result).toHaveProperty('description', '书籍1描述')
    expect(result).toHaveProperty('wordCount')
    expect(result).toHaveProperty('createdAt')
    expect(result).toHaveProperty('updatedAt')
  })

  it('当书籍不存在时应该返回 404 错误', async () => {
    // Arrange
    const url = '/api/books/99999'

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

  it('当 ID 无效（非数字）时应该返回 400 错误', async () => {
    // Arrange
    const url = '/api/books/abc'

    // Act & Assert
    try {
      await $fetch(url)
      expect(false).toBe(true)
    }
    catch (error: any) {
      expect(error.statusCode).toBe(400)
      expect(error.statusMessage).toBe('Invalid book ID')
    }
  })

  it('当 ID 为负数时应该返回 404 错误', async () => {
    // Arrange
    const url = '/api/books/-1'

    // Act & Assert
    try {
      await $fetch(url)
      expect(false).toBe(true)
    }
    catch (error: any) {
      expect(error.statusCode).toBe(404)
    }
  })
})
