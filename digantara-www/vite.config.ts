import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  plugins: [vue(), tailwindcss(), vuetify({ autoImport: true })],
  server: {
    proxy: {
      '/api': {
        target: 'https://backend.digantara.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
})
