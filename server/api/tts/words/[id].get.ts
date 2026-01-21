import { UniversalEdgeTTS } from 'edge-tts-universal'
import { createError, defineEventHandler } from 'h3'
import z from 'zod'
import { prisma } from '~~/prisma/client'
import { useSafeParams, useSafeQuery } from '~~/server/utils/use-safe-validate'

export const WordIdSchema = z.object({
  id: z.coerce.number().int().positive('Word ID must be a positive integer'),
})

export const AccentSchema = z.object({
  accent: z.enum(['uk', 'us'], {
    error: () => ({ message: 'Accent must be \'uk\' or \'us\'' }),
  }).default('us'),
})

const VOICE_MAP = {
  uk: 'en-GB-SoniaNeural',
  us: 'en-US-EmmaMultilingualNeural',
} as const

type Accent = keyof typeof VOICE_MAP

export default defineEventHandler(async (event) => {
  try {
    const { id } = await useSafeParams(event, WordIdSchema)
    const { accent } = await useSafeQuery(event, AccentSchema)

    const word = await prisma.word.findUnique({
      where: { id },
    })

    if (!word) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Word not found',
      })
    }

    const voice = VOICE_MAP[accent as Accent]

    const tts = new UniversalEdgeTTS(word.word, voice)
    const result = await tts.synthesize()

    event.node.res.setHeader('Content-Type', 'audio/mpeg')
    event.node.res.setHeader('Cache-Control', 'public, max-age=86400')

    return result.audio
  }
  catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to synthesize audio',
    })
  }
})
