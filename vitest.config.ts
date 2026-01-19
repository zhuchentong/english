import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url)),
      '@@': fileURLToPath(new URL('.', import.meta.url)),
      '@/prisma': fileURLToPath(new URL('./app/generated/prisma', import.meta.url)),
      '@/server': fileURLToPath(new URL('./server', import.meta.url)),
    },
  },

  test: {
    globals: true,
    environment: 'node',
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
      '**/*.{test,spec}.{ts,js}',
      'test/**/*.{test,spec}.{ts,js}',
      'server/__tests__/**/*.{test,spec}.{ts,js}',
      'app/__tests__/**/*.{test,spec}.{ts,js}',
    ],
    exclude: ['node_modules', '.nuxt', 'dist', 'test/e2e/**', '**/*.e2e.{ts,js}'],
    reporters: ['verbose'],
  },
})
