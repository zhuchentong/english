import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  unocss: true,
  vue: true,
  typescript: true,
  markdown: false,
}, {
  files: ['*.ts', '*.tsx'],
  languageOptions: {
    globals: {
      defineNuxtConfig: 'readonly',
      defineConfig: 'readonly',
    },
  },
  rules: {
    'no-undef': 'off',
  },
}, {
  files: ['*.vue'],
  languageOptions: {
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  rules: {
    'vue/multi-word-component-names': 'off',
  },
}, {
  files: ['prisma/**/*.ts', 'test/**/*.ts'],
  rules: {
    'no-console': 'off',
  },
})
