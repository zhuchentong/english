import { UniversalEdgeTTS } from 'edge-tts-universal'
import { createError, defineEventHandler } from 'h3'
import { prisma } from '~~/server/utils/db'
import { useSafeParams, useSafeQuery } from '~~/server/utils/use-safe-validate'
import { AccentSchema, WordIdSchema } from '~~/server/utils/validate-tts'

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
