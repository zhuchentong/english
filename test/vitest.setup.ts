import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'
import { createError, defineEventHandler, getQuery, H3Event } from 'h3'
import { vi } from 'vitest'
import { ref } from 'vue'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env
const envResult = config({ path: join(__dirname, '.env') })
if (envResult.error) {
  console.warn('Failed to load .env file:', envResult.error)
}

// Set up globals for Nuxt server API tests
globalThis.defineEventHandler = defineEventHandler
globalThis.getQuery = getQuery
globalThis.createError = createError
globalThis.H3Event = H3Event

// Mock Nuxt useFetch for composables testing
globalThis.useFetch = vi.fn(() => ({
  data: ref(null),
  pending: ref(false),
  error: ref(null),
  refresh: vi.fn(),
}))
