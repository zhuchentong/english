import { z } from 'h3-zod'

export const WordIdSchema = z.object({
  id: z.coerce.number().int().positive('Word ID must be a positive integer'),
})

export const AccentSchema = z.object({
  accent: z.enum(['uk', 'us'], {
    errorMap: () => ({ message: 'Accent must be \'uk\' or \'us\'' }),
  }).default('us'),
})
