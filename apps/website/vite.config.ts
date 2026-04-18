import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import tailwindcss from '@tailwindcss/vite'

import { cloudflare } from "@cloudflare/vite-plugin";

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';

import { PrimeVueResolver } from '@primevue/auto-import-resolver'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    cloudflare(),
    vue(),
    // vueDevTools(),
    tailwindcss(),
    // Auto Imports:
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core', 'pinia'],
      dts: 'src/types/auto-vue-imports.d.ts'
    }),
    Components({
      resolvers: [
        (n) => {
          if (n == "Icon") {
            return {
              name: 'Icon',
              from: '@iconify/vue'
            }
          }
        },
        PrimeVueResolver()
      ],
      dts: 'src/types/auto-component-imports.d.ts'
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
