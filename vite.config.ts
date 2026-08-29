import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// The app ships no data vintage of its own -- src/data/*.json is prepared by hand
// and carries no timestamp -- so the footer's "last updated" is the build date.
// Pages redeploys on every push, which makes it the date the site last changed.
const BUILD_DATE = new Date().toISOString().slice(0, 10)

export default defineConfig({
  base: '/austria-power-sim/',
  plugins: [vue(), vuetify()],
  define: {
    __BUILD_DATE__: JSON.stringify(BUILD_DATE),
  },
  build: {
    cssMinify: false,
  },
})
