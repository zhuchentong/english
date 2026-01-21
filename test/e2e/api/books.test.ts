import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '../../../prisma/client'

/**
 * 书籍列表 API (GET /api/books)
 * 使用 E2E 测试方式，通过 $fetch 直接调用真实 API
 */
describe('书籍列表 API (GET /api/books)', async () => {
  await setup({
    build: true,
    server: true,
    setupTimeout: 120000,
  })

  let bookIds: number[] = []

  beforeAll(async () => {
    await prisma.bookItem.deleteMany()
    await prisma.book.deleteMany()

    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: { email: 'test@example.com', name: '测试用户' },
    })

    await prisma.book.createMany({
      data: [
        { userId: user.id, name: '测试书籍1', description: '测试书籍1的描述' },
        { userId: user.id, name: '测试书籍2', description: '测试书籍2的描述' },
        { userId: user.id, name: '测试书籍3', description: '测试书籍3的描述' },
        { userId: user.id, name: '测试书籍4', description: '测试书籍4的描述' },
        { userId: user.id, name: '测试书籍5', description: '测试书籍5的描述' },
      ],
    })

    bookIds = await prisma.book.findMany({
      where: { name: { in: ['测试书籍1', '测试书籍2', '测试书籍3', '测试书籍4', '测试书籍5'] } },
      select: { id: true },
    }).then(books => books.map(b => b.id))
  })

  afterAll(async () => {
    await prisma.bookItem.deleteMany({ where: { bookId: { in: bookIds } } })
    await prisma.book.deleteMany({ where: { id: { in: bookIds } } })
  })

  it('应该返回默认分页参数的书籍列表', async () => {
    // Arrange
    const url = '/api/books'

    // Act
    const result = await $fetch(url)

    // Assert
    expect(result).toHaveProperty('content')
    expect(result).toHaveProperty('pageIndex', 0)
    expect(result).toHaveProperty('pageSize', 10)
    expect(result).toHaveProperty('total', 5)
    expect(result).toHaveProperty('pageTotal')
    expect(result.content).toHaveLength(5)
  })

  it('应该正确处理自定义分页参数', async () => {
    // Arrange
    const url = '/api/books'
    const params = { pageIndex: 0, pageSize: 2 }

    // Act
    const result = await $fetch(url, { params })

    // Assert
    expect(result.pageSize).toBe(2)
    expect(result.content).toHaveLength(2)
  })

  it('当页码越界时应该返回空列表', async () => {
    // Arrange
    const url = '/api/books'
    const params = { pageIndex: 10, pageSize: 10 }

    // Act
    const result = await $fetch(url, { params })

    // Assert
    expect(result.content).toEqual([])
    expect(result.pageIndex).toBe(10)
    expect(result.total).toBe(5)
  })

  it('应该按创建时间倒序返回书籍', async () => {
    // Arrange
    const url = '/api/books'

    // Act
    const result = await $fetch(url)

    // Assert
    const timestamps = result.content.map((book: any) => new Date(book.createdAt).getTime())
    expect(timestamps).toEqual(timestamps.slice().sort((a: number, b: number) => b - a))
  })
})
