import { prisma } from '../../../prisma/client'

/**
 * 重置测试数据库
 * 按照外键依赖顺序删除所有数据，确保测试隔离性
 */
export async function resetDB(): Promise<void> {
  await prisma.userWord.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.bookItem.deleteMany()
  await prisma.book.deleteMany()
  await prisma.user.deleteMany()
  await prisma.wordTag.deleteMany()
  await prisma.exampleSentence.deleteMany()
  await prisma.definition.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.word.deleteMany()
}
