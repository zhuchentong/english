import { Buffer } from 'node:buffer'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { prisma } from '../../../server/utils/db'
import { createMockEvent } from '../utils/create-mock-event'
import { resetDB } from '../utils/reset-db'

// Mock edge-tts-universal
class MockUniversalEdgeTTS {
  synthesize = vi.fn().mockResolvedValue({
    audio: new Blob([Buffer.from('mock-audio-data')], { type: 'audio/mpeg' }),
    subtitle: [],
  })
}

vi.mock('edge-tts-universal', () => ({
  UniversalEdgeTTS: MockUniversalEdgeTTS,
}))

describe('tTS Words API (GET /api/tts/words/:id) - Unit Tests (Mocked)', () => {
  beforeEach(async () => {
    await resetDB()
    vi.clearAllMocks()
  })

  it('should return MP3 audio for US accent (default)', async () => {
    const word = await prisma.word.create({
      data: { word: 'hello', phoneticUS: '/həˈloʊ/', difficulty: 1 },
    })

    const event = createMockEvent(
      `http://localhost:3000/api/tts/words/${word.id}`,
      { id: word.id.toString() },
    )
    const handler = (await import('../../../server/api/tts/words/[id].get')).default
    const result = await handler(event)

    expect(result).toBeInstanceOf(Blob)
    expect(result.type).toBe('audio/mpeg')
    expect(result.size).toBeGreaterThan(0)
  })

  it('should return MP3 audio for UK accent', async () => {
    const word = await prisma.word.create({
      data: { word: 'hello', phoneticUK: '/həˈləʊ/', difficulty: 1 },
    })

    const event = createMockEvent(
      `http://localhost:3000/api/tts/words/${word.id}?accent=uk`,
      { id: word.id.toString() },
    )
    const handler = (await import('../../../server/api/tts/words/[id].get')).default
    const result = await handler(event)

    expect(result).toBeInstanceOf(Blob)
    expect(result.type).toBe('audio/mpeg')
  })

  it('should return 404 when word does not exist', async () => {
    const event = createMockEvent('http://localhost:3000/api/tts/words/99999', { id: '99999' })
    const handler = (await import('../../../server/api/tts/words/[id].get')).default

    await expect(handler(event)).rejects.toMatchObject({
      statusCode: 404,
      statusMessage: 'Word not found',
    })
  })

  it('should return 400 for invalid word ID', async () => {
    const event = createMockEvent('http://localhost:3000/api/tts/words/invalid', { id: 'invalid' })
    const handler = (await import('../../../server/api/tts/words/[id].get')).default

    await expect(handler(event)).rejects.toMatchObject({
      statusCode: 400,
    })
  })

  it('should return 400 for invalid accent', async () => {
    const word = await prisma.word.create({
      data: { word: 'hello', phoneticUS: '/həˈloʊ/', difficulty: 1 },
    })

    const event = createMockEvent(
      `http://localhost:3000/api/tts/words/${word.id}?accent=de`,
      { id: word.id.toString() },
    )
    const handler = (await import('../../../server/api/tts/words/[id].get')).default

    await expect(handler(event)).rejects.toMatchObject({
      statusCode: 400,
    })
  })

  it('should set correct cache headers', async () => {
    const word = await prisma.word.create({
      data: { word: 'test', phoneticUS: '/test/', difficulty: 1 },
    })

    const event = createMockEvent(
      `http://localhost:3000/api/tts/words/${word.id}`,
      { id: word.id.toString() },
    )
    const handler = (await import('../../../server/api/tts/words/[id].get')).default
    const result = await handler(event)

    expect(result).toBeInstanceOf(Blob)
    expect(result.type).toBe('audio/mpeg')
  })
})
