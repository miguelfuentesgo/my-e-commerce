// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/image', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  ui: {
    fonts: false,
  },
  colorMode: {
    classSuffix: '',
  },
  image: {
    domains: ['picsum.photos'],
  },
})
