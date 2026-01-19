import { defineConfig, presetAttributify, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify(),
    presetUno(),
  ],
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'btn-base': 'px-4 py-2 rounded cursor-pointer transition-all duration-200',
  },
  theme: {
    colors: {
      primary: {
        DEFAULT: '#0052d9',
        hover: '#266fe8',
        active: '#003cab',
      },
    },
  },
})
