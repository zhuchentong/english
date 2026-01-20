import { prisma } from '../../../server/utils/db'

export async function resetDB() {
  // 先删除所有关联的记录
  await prisma.bookItem.deleteMany()
  await prisma.userWord.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.definition.deleteMany()
  await prisma.exampleSentence.deleteMany()
  await prisma.wordTag.deleteMany()
  await prisma.book.deleteMany()
  await prisma.word.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.user.deleteMany()
}
