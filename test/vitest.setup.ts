import { vi } from 'vitest'

vi.mock('node:process', () => ({
  default: {
    env: {
      NUXT_DATABASE_URL: 'postgres://test:test@localhost:5432/english_test',
    },
  },
  env: {
    NUXT_DATABASE_URL: 'postgres://test:test@localhost:5432/english_test',
  },
}))
