import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url)),
      '@@': fileURLToPath(new URL('.', import.meta.url)),
      '@/prisma': fileURLToPath(new URL('./app/generated/prisma/index.js', import.meta.url)),
      '@/prisma/*': fileURLToPath(new URL('./app/generated/prisma/*.js', import.meta.url)),
      '@/server': fileURLToPath(new URL('./server', import.meta.url)),
    },
    dedupe: ['@prisma/client'],
  },

  test: {
    setupFiles: ['./vitest.setup.ts'],
    environment: 'node',
    deps: {
      moduleDirectories: ['node_modules', 'app/generated/prisma'],
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
      '**/*.{test,spec}.{ts,js}',
      'test/**/*.{test,spec}.{ts,js}',
      'server/__tests__/**/*.{test,spec}.{ts,js}',
      'server/api/**/__tests__/**/*.{test,spec}.{ts,js}',
      'app/__tests__/**/*.{test,spec}.{ts,js}',
    ],
    exclude: ['node_modules', '.nuxt', 'dist', 'test/e2e/**', '**/*.e2e.{ts,js}'],
    reporters: ['verbose'],
  },
})
