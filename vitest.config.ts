import type { UserWorkspaceConfig } from 'vitest/config'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
// import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig(async () => {
  const rootDir = resolve(__dirname)
  const env = loadEnv('test', rootDir, '')

  return {
    test: {
      env,
      globals: true,
      setupFiles: ['./test/vitest.setup.ts'],
      fileParallelism: false,
      testTimeout: 30000,
      hookTimeout: 30000,
      resolve: {
        alias: {
          '~~/': `${rootDir}/`,
        },
      },
      deps: {
        moduleDirectories: ['node_modules', 'app'],
        interopDefault: true,
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
        perFile: true,
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
          name: 'unit',
          include: ['test/unit/**/*.{test,spec}.{ts,js}'],
          environment: 'node',
          resolve: {
            alias: {
              '~~/': `${rootDir}/`,
              '~': `${rootDir}/`,
              '@': `${rootDir}/`,
            },
          },
        },
        // await defineVitestProject({
        //   test: {
        //     name: 'nuxt',
        //     include: ['test/nuxt/**/*.{test,spec}.{ts,js}'],
        //     environment: 'nuxt',
        //     environmentOptions: {
        //       nuxt: {
        //         domEnvironment: 'happy-dom',
        //         mock: {
        //           intersectionObserver: true,
        //           indexedDb: false,
        //         },
        //       },
        //     },
        //   },
        // }),
        {
          test: {
            name: 'integration',
            include: ['test/integration/**/*.{test,spec}.{ts,js}'],
            environment: 'node',
          },
        },
      ],
    },
  } as UserWorkspaceConfig
})
