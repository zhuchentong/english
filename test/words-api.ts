import { config } from 'dotenv'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const envResult = config({ path: join(__dirname, '..', '.env') })

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not found in .env file')
}

async function testWordsAPI() {
  console.log('Testing Words API...')

  const { prisma } = await import('../server/utils/db')

  const user = await prisma.user.create({
    data: {
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      password: 'hashedpassword'
    }
  })

  const wordList = await prisma.wordList.create({
    data: {
      userId: user.id,
      name: 'Test Book',
      wordCount: 3
    }
  })

  const words = await prisma.word.createMany({
    data: [
      { word: 'hello', phoneticUK: '/həˈləʊ/', phoneticUS: '/həˈloʊ/', difficulty: 1 },
      { word: 'world', phoneticUK: '/wɜːld/', phoneticUS: '/wɜːrld/', difficulty: 2 },
      { word: 'test', phoneticUK: '/test/', phoneticUS: '/test/', difficulty: 1 }
    ]
  })

  const createdWords = await prisma.word.findMany()
  await prisma.wordListItem.createMany({
    data: createdWords.map(word => ({
      wordListId: wordList.id,
      wordId: word.id
    }))
  })

  const page = 1
  const pageSize = 50
  const skip = (page - 1) * pageSize

  const [items, total] = await Promise.all([
    prisma.wordListItem.findMany({
      skip,
      take: pageSize,
      where: {
        wordListId: wordList.id
      },
      include: {
        word: {
          select: {
            id: true,
            word: true,
            phoneticUK: true,
            phoneticUS: true,
            difficulty: true,
            viewCount: true
          }
        }
      },
      orderBy: {
        addedAt: 'desc'
      }
    }),
    prisma.wordListItem.count({
      where: {
        wordListId: wordList.id
      }
    })
  ])

  const data = items.map(item => ({
    ...item.word,
    itemId: item.id,
    addedAt: item.addedAt.toISOString()
  }))

  const totalPages = Math.ceil(total / pageSize)

  const result = {
    data,
    pagination: {
      total,
      page,
      pageSize,
      totalPages
    }
  }

  console.log('Result:', JSON.stringify(result, null, 2))
  console.log('✓ Test passed: Words API works correctly')

  await prisma.wordListItem.deleteMany()
  await prisma.wordList.deleteMany()
  await prisma.word.deleteMany()
  await prisma.user.deleteMany()
}

testWordsAPI().catch(console.error)
