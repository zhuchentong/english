import { beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../server/utils/db'
import { createMockEvent } from '../unit/utils/create-mock-event'
import { resetDB } from '../unit/utils/reset-db'

describe('tTS Words API (GET /api/tts/words/:id) - Integration Tests (Real)', () => {
  beforeEach(async () => {
    await resetDB()
  })

  it('should synthesize real audio for US accent', async () => {
    const word = await prisma.word.create({
      data: { word: 'hello', phoneticUS: '/həˈloʊ/', difficulty: 1 },
    })

    const event = createMockEvent(
      `http://localhost:3000/api/tts/words/${word.id}?accent=us`,
      { id: word.id.toString() },
    )
    const handler = (await import('../../server/api/tts/words/[id].get')).default
    const result = await handler(event)

    expect(result).toBeInstanceOf(Blob)
    expect(result.type).toBe('audio/mpeg')
    expect(result.size).toBeGreaterThan(1000)
  })

  it('should synthesize real audio for UK accent', async () => {
    const word = await prisma.word.create({
      data: { word: 'hello', phoneticUK: '/həˈləʊ/', difficulty: 1 },
    })

    const event = createMockEvent(
      `http://localhost:3000/api/tts/words/${word.id}?accent=uk`,
      { id: word.id.toString() },
    )
    const handler = (await import('../../server/api/tts/words/[id].get')).default
    const result = await handler(event)

    expect(result).toBeInstanceOf(Blob)
    expect(result.type).toBe('audio/mpeg')
    expect(result.size).toBeGreaterThan(1000)
  })

  it('should generate different audio for US and UK accents', async () => {
    const word = await prisma.word.create({
      data: { word: 'hello', phoneticUS: '/həˈloʊ/', phoneticUK: '/həˈləʊ/', difficulty: 1 },
    })

    const eventUS = createMockEvent(
      `http://localhost:3000/api/tts/words/${word.id}?accent=us`,
      { id: word.id.toString() },
    )
    const eventUK = createMockEvent(
      `http://localhost:3000/api/tts/words/${word.id}?accent=uk`,
      { id: word.id.toString() },
    )

    const handler = (await import('../../server/api/tts/words/[id].get')).default
    const audioUS = await handler(eventUS)
    const audioUK = await handler(eventUK)

    expect(audioUS.size).not.toBe(audioUK.size)
  }, 15000)

  it('should handle longer words', async () => {
    const word = await prisma.word.create({
      data: { word: 'international', phoneticUS: '/ˌɪntərˈnæʃənl/', difficulty: 3 },
    })

    const event = createMockEvent(
      `http://localhost:3000/api/tts/words/${word.id}?accent=us`,
      { id: word.id.toString() },
    )
    const handler = (await import('../../server/api/tts/words/[id].get')).default
    const result = await handler(event)

    expect(result).toBeInstanceOf(Blob)
    expect(result.size).toBeGreaterThan(2000)
  })

  it('should return valid MP3 binary data', async () => {
    const word = await prisma.word.create({
      data: { word: 'test', phoneticUS: '/test/', difficulty: 1 },
    })

    const event = createMockEvent(
      `http://localhost:3000/api/tts/words/${word.id}?accent=us`,
      { id: word.id.toString() },
    )
    const handler = (await import('../../server/api/tts/words/[id].get')).default
    const result = await handler(event)
    const arrayBuffer = await result.arrayBuffer()
    const data = new Uint8Array(arrayBuffer)

    expect(data.length).toBeGreaterThan(0)
  })
})
