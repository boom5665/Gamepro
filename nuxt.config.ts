export default defineNuxtConfig({
  compatibilityDate: '2024-10-18',
  devtools: { enabled: true },
  devServer: {
    port: 3000, // เปลี่ยน 3001 เป็น port ที่คุณต้องการ
  },
  app: {
    head: {
      title: "BaseNuxt3",
      htmlAttrs: {
        lang: "th",
        translate: "no",
      },
      meta: [
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1' },
        { charset: "utf-8" },
        { "http-equiv": "pragma", content: "no-cache" },
        { "http-equiv": "cache-control", content: "no-cache" },
        { "http-equiv": "expires", content: "0" },
        { name: "viewport", content: "user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" },
        { hid: "description", name: "description", content: "" },
      ],
      // link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.svg" }],
    },
  },
  plugins: [
    { src: '~/plugins/axios.js', mode: 'client' },
    { src: '~/plugins/methods.js', mode: 'client' },
  ],
  // modules: [''],
  css: [
    '@/assets/scss/main.scss'
  ],
  runtimeConfig: {
    // ตัวแปรที่เข้าถึงได้ในฝั่งไคลเอนต์
    public: {
      baseURL: process.env.API_BASE_URL
    }
  },
  alias: {
    // 'vue': 'vue/dist/vue.esm-bundler.js'  // เพิ่มการตั้งค่านี้เพื่อใช้ full build ของ Vue
  }
})
