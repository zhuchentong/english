// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
    '@tdesign-vue-next/nuxt',
    '@unocss/nuxt',
  ],
  tdesign: {
    resolveIcons: false,
    importVariables: true,
  },
  alias: {
    '@': fileURLToPath(new URL('./app', import.meta.url)),
    '@@': fileURLToPath(new URL('.', import.meta.url)),
    '@/prisma': fileURLToPath(new URL('./app/generated/prisma', import.meta.url)),
    '@/server': fileURLToPath(new URL('./server', import.meta.url)),
  },
  typescript: {
    strict: true,
    typeCheck: false,
  },
})
