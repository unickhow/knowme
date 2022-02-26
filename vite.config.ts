import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import presetWind from '@unocss/preset-wind'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import transformerDirective from '@unocss/transformer-directives'
import ViteFonts from 'vite-plugin-fonts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Unocss({
      presets: [
        presetWind()
      ],
      transformers: [
        transformerDirective()
      ],
      shortcuts: {
        'is-input': 'border-t-0 border-l-0 border-r-0 border-b border-gray-300 focus:outline-none focus:border-gray-500 p-1 text-base transition-border-color'
      }
    }),
    AutoImport({
      imports: ['vue']
    }),
    Icons({
      autoInstall: true
    }),
    ViteFonts({
      google: {
        families: ['Ubuntu']
      }
    })
  ]
})
