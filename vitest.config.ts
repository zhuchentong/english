import { fileURLToPath } from 'node:url'
import { defineVitestProject } from '@nuxt/test-utils/config'
import dotenv from 'dotenv'
import { defineConfig } from 'vitest/config'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const serverDir = fileURLToPath(new URL('./server', import.meta.url))
const testUtilsDir = fileURLToPath(new URL('./test/unit/utils', import.meta.url))

// Load environment variables from .env
dotenv.config({ path: `${rootDir}/.env` })

export default defineConfig({
  test: {
    setupFiles: ['./test/vitest.setup.ts'],
    fileParallelism: false,
    deps: {
      moduleDirectories: ['node_modules', 'app'],
      interopDefault: true,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.nuxt/',
        'dist/',
        '**/*.test.{ts,js}',
        '**/*.spec.{ts,js}',
        '**/tests/**',
        '**/__tests__/**',
        'coverage/',
      ],
    },
    reporters: ['verbose'],
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/unit/**/*.{test,spec}.{ts,js}'],
          environment: 'node',
        },
        resolve: {
          alias: {
            '@/server/utils/db': `${serverDir}/utils/db.ts`,
            '@/server/utils/define-page-builder': `${serverDir}/utils/define-page-builder.ts`,
            '@/server/utils/use-safe-validate': `${serverDir}/utils/use-safe-validate.ts`,
            '@/server/utils/validate-tts': `${serverDir}/utils/validate-tts.ts`,
            '@/server/api/books.get': `${serverDir}/api/books.get.ts`,
            '@/server/api/books/[id]/words.get': `${serverDir}/api/books/[id]/words.get.ts`,
            '~/utils/createMockEvent': `${testUtilsDir}/createMockEvent.ts`,
            '~/utils/reset-db': `${testUtilsDir}/reset-db.ts`,
          },
        },
      },
      {
        test: {
          name: 'e2e',
          include: ['test/e2e/**/*.{test,spec}.{ts,js}'],
          environment: 'node',
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/**/*.{test,spec}.{ts,js}'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: {
              rootDir,
              domEnvironment: 'happy-dom',
            },
          },
        },
      }),
      {
        test: {
          name: 'integration',
          include: ['test/integration/**/*.{test,spec}.{ts,js}'],
          environment: 'node',
        },
        resolve: {
          alias: {
            '@/server/utils/db': `${serverDir}/utils/db.ts`,
            '@/server/utils/define-page-builder': `${serverDir}/utils/define-page-builder.ts`,
            '@/server/utils/use-safe-validate': `${serverDir}/utils/use-safe-validate.ts`,
            '@/server/utils/validate-tts': `${serverDir}/utils/validate-tts.ts`,
            '@/server/api/books.get': `${serverDir}/api/books.get.ts`,
            '@/server/api/books/[id]/words.get': `${serverDir}/api/books/[id]/words.get.ts`,
            '~/utils/createMockEvent': `${testUtilsDir}/createMockEvent.ts`,
            '~/utils/reset-db': `${testUtilsDir}/reset-db.ts`,
          },
        },
      },
    ],
  },
})
