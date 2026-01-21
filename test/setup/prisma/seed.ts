import { prisma } from '../../../prisma/client'

/**
 * 测试数据填充工具
 * 提供可复用的测试数据创建函数，支持 API 测试场景
 */

/**
 * 创建测试用户（如果不存在）
 * @returns 创建或获取的用户
 */
async function getOrCreateTestUser() {
  const existing = await prisma.user.findFirst({
    where: { email: 'test@example.com' },
  })
  if (existing) {
    return existing
  }
  return prisma.user.create({
    data: {
      email: 'test@example.com',
      name: '测试用户',
    },
  })
}

/**
 * 填充测试书籍数据
 * @param count - 书籍数量，默认 5 本
 * @returns 创建的书籍数组
 */
export async function seedTestBooks(count: number = 5) {
  const user = await getOrCreateTestUser()
  const books = []
  for (let i = 1; i <= count; i++) {
    books.push({
      userId: user.id,
      name: `测试书籍 ${i}`,
      description: `测试书籍 ${i} 的描述信息`,
      wordCount: Math.floor(Math.random() * 100) + 10,
    })
  }
  await prisma.book.createMany({ data: books })
  return prisma.book.findMany({
    where: { userId: user.id },
    orderBy: { id: 'asc' },
  })
}

/**
 * 填充测试单词数据
 * @param count - 单词数量，默认 10 个
 * @returns 创建的单词数组
 */
export async function seedTestWords(count: number = 10) {
  for (let i = 1; i <= count; i++) {
    await prisma.word.create({
      data: {
        word: `word${i}`,
        phoneticUK: `/wɜːrd${i}/`,
        phoneticUS: `/wɜrd${i}/`,
        definitions: {
          create: {
            partOfSpeech: 'n.',
            translation: `单词 ${i} 的含义`,
          },
        },
      },
    })
  }
  return prisma.word.findMany({ orderBy: { id: 'asc' } })
}

/**
 * 创建书籍与单词的关联关系
 * @param bookId - 书籍 ID
 * @param wordIds - 单词 ID 数组
 */
export async function seedBookItems(bookId: number, wordIds: number[]) {
  await prisma.bookItem.createMany({
    data: wordIds.map(wordId => ({ bookId, wordId })),
  })
}
