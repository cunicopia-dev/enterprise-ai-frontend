export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  css: ['~/assets/css/main.css']
})
