import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'
import { createError, defineEventHandler, getQuery } from 'h3'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env
config({ path: join(__dirname, '.env') })

// Set up globals for Nuxt server API tests
globalThis.defineEventHandler = defineEventHandler
globalThis.getQuery = getQuery
globalThis.createError = createError
