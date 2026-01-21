import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '../../../prisma/client'

/**
 * TTS 单词 API (GET /api/tts/words/:id)
 * 使用 E2E 测试方式，通过 $fetch 直接调用真实 API
 */
describe('tTS 单词 API (GET /api/tts/words/:id)', async () => {
  await setup({
    build: true,
    server: true,
    setupTimeout: 120000,
  })

  let wordIds: number[] = []

  beforeAll(async () => {
    await prisma.word.deleteMany()

    const createdWords = []
    for (let i = 1; i <= 5; i++) {
      const word = await prisma.word.create({
        data: {
          word: `ttsword${i}`,
          phoneticUK: `/tts-wɜːrd${i}/`,
          phoneticUS: `/tts-wɜrd${i}/`,
          definitions: {
            create: { partOfSpeech: 'n.', translation: `TTS单词${i}` },
          },
        },
      })
      createdWords.push(word)
    }
    wordIds = createdWords.map(w => w.id)
  })

  afterAll(async () => {
    await prisma.word.deleteMany({ where: { id: { in: wordIds } } })
  })

  it('应该返回指定单词的 TTS 数据', async () => {
    // Arrange
    const targetId = wordIds[0]
    const url = `/api/tts/words/${targetId}`

    // Act
    const result = await $fetch(url)

    // Assert
    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('word')
    expect(result).toHaveProperty('audioUrl')
  })

  it('当单词不存在时应该返回 404 错误', async () => {
    // Arrange
    const url = '/api/tts/words/99999'

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
