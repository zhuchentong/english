// https://nuxt.com/docs/api/configuration/nuxt-config

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
  typescript: {
    strict: true,
    typeCheck: false,
    tsConfig: {
      include: [
        './test/**/*',
      ],
    },
  },
})
