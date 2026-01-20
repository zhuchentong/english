import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '../app/generated/prisma/client'

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

// 定义 CSV 数据行类型
interface CSVRow {
  word: string
  translation: string
  phonetic: string
  sentence: string
  type_word?: string
}

// 解析 CSV 文件
function parseCSV(filePath: string): CSVRow[] {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  if (lines.length < 2) {
    throw new Error('CSV 文件为空或格式不正确')
  }

  // 解析表头
  const headers = parseCSVLine(lines[0])
  const rows: CSVRow[] = []

  // 解析数据行
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '')
      continue

    const values = parseCSVLine(lines[i])
    const row: any = {}

    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })

    rows.push(row as CSVRow)
  }

  return rows
}

// 解析 CSV 行（处理引号和逗号）
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      }
      else {
        inQuotes = !inQuotes
      }
    }
    else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    }
    else {
      current += char
    }
  }

  result.push(current)
  return result
}

// 解析音标 JSON
function parsePhonetic(phoneticStr: string): { uk?: string, us?: string } {
  try {
    const phonetic = JSON.parse(phoneticStr) as { uk?: string, us?: string }
    return {
      uk: phonetic.uk || undefined,
      us: phonetic.us || undefined,
    }
  }
  catch {
    return {}
  }
}

// 解析翻译，拆分词性和释义
function parseTranslation(translation: string): Array<{ partOfSpeech?: string, translation: string }> {
  const results: Array<{ partOfSpeech?: string, translation: string }> = []

  // 分割多个释义（使用分号）
  const parts = translation.split(';').map(p => p.trim()).filter(p => p)

  parts.forEach((part) => {
    // 检查是否包含词性标记（如 "v.", "n.", "adj." 等）
    const posMatch = part.match(/^(n\.|v\.|adj\.|adv\.|pron\.|prep\.|conj\.|int\.|num\.|vt\.|vi\.|phr\.)/i)

    if (posMatch) {
      const pos = posMatch[1]
      const trans = part.substring(posMatch[1].length).trim()
      if (trans) {
        results.push({ partOfSpeech: pos, translation: trans })
      }
    }
    else {
      // 没有词性标记，直接作为释义
      results.push({ translation: part })
    }
  })

  return results
}

// 解析例句 JSON
function parseSentences(sentenceStr: string): Array<{ cnSentence: string, originSentence: string }> {
  try {
    const sentences = JSON.parse(sentenceStr) as Array<{ cn_sentence: string, origin_sentence: string }>
    return sentences.map(s => ({
      cnSentence: s.cn_sentence,
      originSentence: s.origin_sentence,
    }))
  }
  catch {
    return []
  }
}

// 创建或获取默认用户
async function createDefaultUser() {
  let user = await prisma.user.findUnique({
    where: { email: 'system@example.com' },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'system@example.com',
        name: 'System User',
      },
    })
    console.log(`✓ 创建默认用户: ${user.name} (ID: ${user.id})`)
  }
  else {
    console.log(`✓ 使用已存在的用户: ${user.name} (ID: ${user.id})`)
  }

  return user
}

// 创建单词书
async function createBook(userId: number, name: string, description?: string) {
  const book = await prisma.book.create({
    data: {
      userId,
      name,
      description,
      isPublic: true, // 设为公开，方便查看
      wordCount: 0, // 初始为 0，导入后更新
    },
  })
  console.log(`✓ 创建单词书: ${book.name} (ID: ${book.id})`)
  return book
}

// 主导入函数
async function importWords() {
  const csvPath = path.join(process.cwd(), 'words', '新概念英语第一册.csv')

  console.log('开始导入单词数据...')

  // 创建默认用户
  const user = await createDefaultUser()

  // 创建单词书 "新概念英语第一册"
  const book = await createBook(user.id, '新概念英语第一册', '新概念英语第一册词汇表')

  // 解析 CSV
  const rows = parseCSV(csvPath)
  console.log(`找到 ${rows.length} 个单词`)

  let successCount = 0
  let errorCount = 0
  const errors: Array<{ word: string, error: string }> = []

  for (const row of rows) {
    try {
      // 解析音标
      const phonetic = parsePhonetic(row.phonetic)

      // 创建单词
      const word = await prisma.word.create({
        data: {
          word: row.word,
          phoneticUK: phonetic.uk,
          phoneticUS: phonetic.us,
          difficulty: 1, // 默认难度为 1
          viewCount: 0,
        },
      })

      // 创建释义
      const definitions = parseTranslation(row.translation)
      for (const def of definitions) {
        await prisma.definition.create({
          data: {
            wordId: word.id,
            partOfSpeech: def.partOfSpeech,
            translation: def.translation,
          },
        })
      }

      // 创建例句
      const sentences = parseSentences(row.sentence)
      for (const sent of sentences) {
        await prisma.exampleSentence.create({
          data: {
            wordId: word.id,
            cnSentence: sent.cnSentence,
            originSentence: sent.originSentence,
          },
        })
      }

      // 将单词添加到单词书
      await prisma.bookItem.create({
        data: {
          bookId: book.id,
          wordId: word.id,
        },
      })

      successCount++
      console.log(`✓ 导入成功: ${row.word}`)
    }
    catch (error) {
      errorCount++
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      errors.push({ word: row.word, error: errorMsg })
      console.error(`✗ 导入失败: ${row.word} - ${errorMsg}`)
    }
  }

  // 更新单词书的单词数量
  await prisma.book.update({
    where: { id: book.id },
    data: { wordCount: successCount },
  })
  console.log(`✓ 更新单词书单词数量: ${successCount}`)

  console.log('\n导入完成！')
  console.log(`成功: ${successCount}`)
  console.log(`失败: ${errorCount}`)

  if (errors.length > 0) {
    console.log('\n错误详情:')
    errors.forEach((err) => {
      console.log(`  ${err.word}: ${err.error}`)
    })
  }
}

// 清空所有表的函数
async function clearDatabase(prisma: any) {
  console.log('开始清空数据库...')
  console.log('警告：这将删除所有数据！')

  // 清空所有表（按依赖顺序）
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

  console.log('\n数据库清空完成！')
}

// 执行导入
async function main() {
  try {
    // 先清空数据库
    await clearDatabase(prisma)
    // 等待一秒，确保连接释放
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 导入数据
    await importWords()
  }
  catch (error) {
    console.error('导入过程中发生错误:', error)
    process.exit(1)
  }
  finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main()
