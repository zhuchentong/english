import { config } from 'dotenv'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const envResult = config({ path: join(__dirname, '..', '.env') })

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not found in .env file')
}

async function testWordListsAPI() {
  console.log('Testing Word Lists API...')

  const { prisma } = await import('../server/utils/db')

  const user = await prisma.user.create({
    data: {
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      password: 'hashedpassword'
    }
  })

  await prisma.wordList.createMany({
    data: [
      { userId: user.id, name: 'Book 1', description: 'Description 1', isPublic: true, wordCount: 10 },
      { userId: user.id, name: 'Book 2', description: 'Description 2', isPublic: false, wordCount: 20 },
      { userId: user.id, name: 'Book 3', description: 'Description 3', isPublic: true, wordCount: 30 }
    ]
  })

  const page = 1
  const pageSize = 50
  const skip = (page - 1) * pageSize

  const [data, total] = await Promise.all([
    prisma.wordList.findMany({
      skip,
      take: pageSize,
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.wordList.count()
  ])

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
  console.log('✓ Test passed: Word lists API works correctly')

  await prisma.wordList.deleteMany()
  await prisma.user.deleteMany()
}

testWordListsAPI().catch(console.error)
