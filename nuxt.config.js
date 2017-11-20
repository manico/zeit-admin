module.exports = {
  head: {
    title: 'Zeit Admin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Zeit Admin Application' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: '#3B8070' },
  css: [
    '~assets/css/app.styl'
  ],
  plugins: [
    '~plugins/vuetify.js'
  ],
  router: {
  },
  build: {
    vendor: [
      'vuetify',
      'axios',
      'lodash'
    ],
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        // Run ESLint on save
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
