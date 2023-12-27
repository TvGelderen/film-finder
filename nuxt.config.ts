// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      MOVIE_DB_ACCESS_TOKEN: process.env.NUXT_MOVIE_DB_ACCESS_TOKEN,
      MOVIE_DB_BASE_URL: process.env.NUXT_MOVIE_DB_BASE_URL,
      MOVIE_DB_IMG_URL_THUMBNAIL: process.env.NUXT_MOVIE_DB_IMG_URL_THUMBNAIL,
      MOVIE_DB_IMG_URL_BACKDROP: process.env.NUXT_MOVIE_DB_IMG_URL_BACKDROP,
      FILM_FINDER_API_HOST: process.env.NUXT_FILM_FINDER_API_HOST
    }
  },
  modules: ['nuxt-icon'],
  css: [
    '@/assets/css/variables.css',
    '@/assets/css/media.css',
  ],
  devtools: { enabled: true }
})
