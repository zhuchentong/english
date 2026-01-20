import process from 'node:process'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '../app/generated/prisma/client'

const connectionString = process.env.DATABASE_URL!

// 清空所有表的函数
async function resetDatabase(prisma: PrismaClient) {
  console.log('开始重置数据库...')
  console.log('警告：这将删除所有数据！')

  // 使用 deleteMany 清空表（按依赖顺序）
  await prisma.bookItem.deleteMany({})
  await prisma.userWord.deleteMany({})
  await prisma.favorite.deleteMany({})
  await prisma.wordTag.deleteMany({})
  await prisma.exampleSentence.deleteMany({})
  await prisma.definition.deleteMany({})
  await prisma.word.deleteMany({})
  await prisma.tag.deleteMany({})
  await prisma.book.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('\n数据库重置完成！')
}

// 执行重置
async function main() {
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    await resetDatabase(prisma)
  }
  catch (error) {
    console.error('重置过程中发生错误:', error)
    process.exit(1)
  }
  finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main()
