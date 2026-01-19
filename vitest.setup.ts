import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'
import { defineEventHandler, getQuery, createError } from 'h3'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env
config({ path: join(__dirname, '.env') })

// Set up globals for Nuxt server API tests
global.defineEventHandler = defineEventHandler
global.getQuery = getQuery
global.createError = createError
