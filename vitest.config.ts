import { fileURLToPath } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url)),
      '@@': fileURLToPath(new URL('.', import.meta.url)),
    },
    dedupe: ['@prisma/client'],
    extensions: ['.ts', '.js', '.mjs', '.mts', '.cjs', '.json'],
  },

  test: {
    setupFiles: ['./vitest.setup.ts'],
    environment: 'node',
    fileParallelism: false,
    deps: {
      moduleDirectories: ['node_modules', 'app/generated/prisma', 'app'],
      interopDefault: true,
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.nuxt/',
        'app/generated/',
        'dist/',
        '**/*.test.{ts,js}',
        '**/*.spec.{ts,js}',
        '**/tests/**',
        '**/__tests__/**',
        'coverage/',
      ],
    },
    include: [
      'test/**/*.{test,spec}.{ts,js}',
    ],
    exclude: ['node_modules', '.nuxt', 'dist', 'test/e2e/**', '**/*.e2e.{ts,js}'],
    reporters: ['verbose'],
  },
})
