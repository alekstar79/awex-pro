const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  publicPath: '/awex-pro/',

  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Awex PRO'
    }
  },
  devServer: {
    allowedHosts: 'all',
    liveReload: true,
    compress: true,
    client: {
      reconnect: true
    },
    proxy: {
      '^/b2api': {
        changeOrigin: true,
        target: 'https://awex.pro/b2api',
        secure: false
      }
    }
  }
})
